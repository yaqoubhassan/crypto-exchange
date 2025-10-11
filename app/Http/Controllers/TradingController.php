<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TradingController extends Controller
{
    public function index()
    {
        $cryptocurrencies = \App\Models\Cryptocurrency::active()->get();
        $userWallets = auth()->user()->wallets()->with('cryptocurrency')->get();

        // Ensure user has USD wallet for trading
        $usdCurrency = \App\Models\Cryptocurrency::where('symbol', 'USD')->first();
        if ($usdCurrency) {
            auth()->user()->createWalletIfNotExists($usdCurrency->id);
            // Refresh wallets to include newly created one
            $userWallets = auth()->user()->wallets()->with('cryptocurrency')->get();
        }

        // Get active orders for the user
        $activeOrders = auth()->user()->orders()
            ->with(['baseCurrency', 'quoteCurrency'])
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Trading/Index', [
            'cryptocurrencies' => $cryptocurrencies,
            'wallets' => $userWallets,
            'activeOrders' => $activeOrders,
        ]);
    }

    public function getMarketData($symbol)
    {
        $crypto = \App\Models\Cryptocurrency::where('symbol', $symbol)->firstOrFail();

        // Get recent orders for order book
        $buyOrders = \App\Models\Order::where('base_currency_id', $crypto->id)
            ->where('side', 'buy')
            ->where('status', 'pending')
            ->orderBy('price', 'desc')
            ->limit(20)
            ->get();

        $sellOrders = \App\Models\Order::where('base_currency_id', $crypto->id)
            ->where('side', 'sell')
            ->where('status', 'pending')
            ->orderBy('price', 'asc')
            ->limit(20)
            ->get();

        // Get recent trades
        $recentTrades = \App\Models\Transaction::where('cryptocurrency_id', $crypto->id)
            ->whereIn('type', ['buy', 'sell'])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'cryptocurrency' => $crypto,
            'orderBook' => [
                'bids' => $buyOrders,
                'asks' => $sellOrders,
            ],
            'recentTrades' => $recentTrades,
        ]);
    }

    public function placeOrder(Request $request)
    {
        $request->validate([
            'base_currency_id' => 'required|exists:cryptocurrencies,id',
            'quote_currency_id' => 'required|exists:cryptocurrencies,id',
            'type' => 'required|in:market,limit',
            'side' => 'required|in:buy,sell',
            'quantity' => 'required|numeric|min:0.00000001',
            'price' => 'nullable|numeric|min:0',
        ]);

        $user = auth()->user();
        $baseCurrency = \App\Models\Cryptocurrency::findOrFail($request->base_currency_id);
        $quoteCurrency = \App\Models\Cryptocurrency::findOrFail($request->quote_currency_id);

        DB::beginTransaction();

        try {
            // Generate unique order ID
            $orderId = 'ORD-' . strtoupper(uniqid());

            // Determine price for the order
            $orderPrice = null;
            if ($request->type === 'limit') {
                $orderPrice = $request->price;
            } else {
                // For market orders, use current market price as reference
                $orderPrice = $baseCurrency->current_price;
            }

            // Create the order
            $order = new \App\Models\Order([
                'order_id' => $orderId,
                'user_id' => $user->id,
                'base_currency_id' => $request->base_currency_id,
                'quote_currency_id' => $request->quote_currency_id,
                'type' => $request->type,
                'side' => $request->side,
                'quantity' => $request->quantity,
                'price' => $orderPrice,
                'filled_quantity' => 0,
                'status' => 'pending',
            ]);

            // Lock the required balance
            if ($request->side === 'buy') {
                // For buy orders, lock quote currency (USD)
                $requiredAmount = $request->quantity * $orderPrice;
                $wallet = $user->wallets()->where('cryptocurrency_id', $quoteCurrency->id)->first();

                if (!$wallet || $wallet->balance < $requiredAmount) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Insufficient ' . $quoteCurrency->symbol . ' balance. Required: ' . number_format($requiredAmount, 2) . ' ' . $quoteCurrency->symbol
                    ], 400);
                }

                if (!$wallet->lockBalance($requiredAmount)) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to lock balance'], 400);
                }
            } else {
                // For sell orders, lock base currency (BTC, ETH, etc.)
                $wallet = $user->wallets()->where('cryptocurrency_id', $baseCurrency->id)->first();

                if (!$wallet || $wallet->balance < $request->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Insufficient ' . $baseCurrency->symbol . ' balance. Required: ' . $request->quantity . ' ' . $baseCurrency->symbol
                    ], 400);
                }

                if (!$wallet->lockBalance($request->quantity)) {
                    DB::rollBack();
                    return response()->json(['error' => 'Failed to lock balance'], 400);
                }
            }

            $order->save();

            // Process ALL orders through matching engine
            $this->matchOrder($order);

            // ✅ Create real-time notification for user with order_id
            NotificationService::send(
                user: $user,
                type: 'order_placed',
                title: 'Order Placed',
                message: "Your {$order->side} order for {$order->quantity} {$baseCurrency->symbol} has been placed successfully.",
                icon: '📋',
                link: "/orders/{$order->order_id}",
                data: [
                    'order_id' => $order->order_id,
                    'type' => $order->type,
                    'side' => $order->side,
                ]
            );

            // Notify ALL admins about the new order
            $this->notifyAdminsAboutNewOrder($order, $user);

            DB::commit();

            // Reload order to get updated filled_quantity and status
            $order->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order->load(['baseCurrency', 'quoteCurrency'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order placement failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    private function matchOrder($order)
    {
        // Find opposite orders that can match
        $oppositeOrders = \App\Models\Order::where('base_currency_id', $order->base_currency_id)
            ->where('quote_currency_id', $order->quote_currency_id)
            ->where('side', $order->side === 'buy' ? 'sell' : 'buy')
            ->whereIn('status', ['pending', 'partial'])
            ->where('id', '!=', $order->id) // Don't match with itself
            ->orderBy('price', $order->side === 'buy' ? 'asc' : 'desc') // Best price first
            ->orderBy('created_at', 'asc') // Then oldest first (FIFO)
            ->get();

        $remainingQuantity = $order->quantity - $order->filled_quantity;
        $totalFilled = 0;
        $weightedPriceSum = 0;

        foreach ($oppositeOrders as $matchOrder) {
            if ($remainingQuantity <= 0) break;

            // Check if prices can match
            if (!$this->canMatch($order, $matchOrder)) {
                continue; // Skip this order if prices don't match
            }

            $fillQuantity = min($remainingQuantity, $matchOrder->quantity - $matchOrder->filled_quantity);

            // Determine the execution price (taker pays maker's price)
            $fillPrice = $matchOrder->price;

            // Update orders
            $order->filled_quantity += $fillQuantity;
            $matchOrder->filled_quantity += $fillQuantity;

            $totalFilled += $fillQuantity;
            $weightedPriceSum += $fillQuantity * $fillPrice;

            // ✅ Send order_matched notification with order_id
            if ($fillQuantity > 0) {
                NotificationService::send(
                    user: $order->user,
                    type: 'order_matched',
                    title: 'Order Matched',
                    message: "{$fillQuantity} {$order->baseCurrency->symbol} of your {$order->side} order matched at \${$fillPrice}",
                    icon: '🎯',
                    link: "/orders/{$order->order_id}",
                    data: [
                        'order_id' => $order->order_id,
                        'matched_quantity' => $fillQuantity,
                        'match_price' => $fillPrice,
                        'total_filled' => $order->filled_quantity,
                        'total_quantity' => $order->quantity,
                    ]
                );
            }

            // Update matched order status
            if ($matchOrder->filled_quantity >= $matchOrder->quantity) {
                $matchOrder->status = 'filled';

                // ✅ Send order filled notification with order_id
                NotificationService::send(
                    user: $matchOrder->user,
                    type: 'order_filled',
                    title: 'Order Filled',
                    message: "Your {$matchOrder->side} order for {$matchOrder->quantity} {$matchOrder->baseCurrency->symbol} has been completely filled.",
                    icon: '✅',
                    link: "/orders/{$matchOrder->order_id}",
                    data: [
                        'order_id' => $matchOrder->order_id,
                        'average_price' => $fillPrice,
                    ]
                );
            } else {
                $matchOrder->status = 'partial';

                // ✅ Send order matched notification for partial fill with order_id
                NotificationService::send(
                    user: $matchOrder->user,
                    type: 'order_matched',
                    title: 'Order Partially Matched',
                    message: "{$fillQuantity} {$matchOrder->baseCurrency->symbol} of your {$matchOrder->side} order matched at \${$fillPrice}",
                    icon: '🎯',
                    link: "/orders/{$matchOrder->order_id}",
                    data: [
                        'order_id' => $matchOrder->order_id,
                        'matched_quantity' => $fillQuantity,
                        'match_price' => $fillPrice,
                        'total_filled' => $matchOrder->filled_quantity,
                        'total_quantity' => $matchOrder->quantity,
                    ]
                );
            }
            $matchOrder->save();

            $remainingQuantity -= $fillQuantity;

            // Create transaction records and update wallets
            $this->createTradeTransaction($order, $matchOrder, $fillQuantity, $fillPrice);
        }

        // Update main order status
        if ($order->filled_quantity >= $order->quantity) {
            $order->status = 'filled';

            // ✅ Send final filled notification with order_id
            NotificationService::send(
                user: $order->user,
                type: 'order_filled',
                title: 'Order Filled',
                message: "Your {$order->side} order for {$order->quantity} {$order->baseCurrency->symbol} has been completely filled.",
                icon: '✅',
                link: "/orders/{$order->order_id}",
                data: [
                    'order_id' => $order->order_id,
                    'average_price' => $order->average_price,
                ]
            );
        } else if ($order->filled_quantity > 0) {
            $order->status = 'partial';
        } else {
            // No matches found, order stays pending
            $order->status = 'pending';
        }

        if ($totalFilled > 0) {
            $order->average_price = $weightedPriceSum / $totalFilled;
        }

        $order->save();
    }

    private function canMatch($order1, $order2)
    {
        // Market orders can match at any price
        if ($order1->type === 'market' || $order2->type === 'market') {
            return true;
        }

        // For limit orders, check if prices cross
        if ($order1->side === 'buy' && $order2->side === 'sell') {
            // Buy order price must be >= sell order price
            return $order1->price >= $order2->price;
        } else if ($order1->side === 'sell' && $order2->side === 'buy') {
            // Sell order price must be <= buy order price  
            return $order1->price <= $order2->price;
        }

        return false;
    }

    private function createTradeTransaction($buyOrder, $sellOrder, $quantity, $price)
    {
        // Determine which order is the buyer and which is the seller
        $actualBuyOrder = $buyOrder->side === 'buy' ? $buyOrder : $sellOrder;
        $actualSellOrder = $buyOrder->side === 'sell' ? $buyOrder : $sellOrder;

        // Create transaction for buyer
        $buyerTransaction = \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $actualBuyOrder->user_id,
            'cryptocurrency_id' => $actualBuyOrder->base_currency_id,
            'type' => 'buy',
            'amount' => $quantity,
            'price' => $price,
            'fee' => $quantity * 0.001, // 0.1% fee
            'status' => 'completed',
            'notes' => 'Trade executed via order ' . $actualBuyOrder->order_id,
            'processed_at' => now(),
        ]);

        // Create transaction for seller
        $sellerTransaction = \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $actualSellOrder->user_id,
            'cryptocurrency_id' => $actualSellOrder->base_currency_id,
            'type' => 'sell',
            'amount' => $quantity,
            'price' => $price,
            'fee' => ($quantity * $price) * 0.001, // 0.1% fee on USD value
            'status' => 'completed',
            'notes' => 'Trade executed via order ' . $actualSellOrder->order_id,
            'processed_at' => now(),
        ]);

        // Update buyer's cryptocurrency wallet (add crypto)
        $buyerCryptoWallet = \App\Models\Wallet::where('user_id', $actualBuyOrder->user_id)
            ->where('cryptocurrency_id', $actualBuyOrder->base_currency_id)
            ->first();

        if ($buyerCryptoWallet) {
            $buyerCryptoWallet->balance += $quantity - $buyerTransaction->fee;
            $buyerCryptoWallet->save();
        }

        // Update buyer's USD wallet (deduct USD)
        $buyerUsdWallet = \App\Models\Wallet::where('user_id', $actualBuyOrder->user_id)
            ->where('cryptocurrency_id', $actualBuyOrder->quote_currency_id)
            ->first();

        if ($buyerUsdWallet) {
            $totalCost = $quantity * $price;
            $buyerUsdWallet->locked_balance -= $totalCost;
            $buyerUsdWallet->save();
        }

        // Update seller's cryptocurrency wallet (deduct crypto)
        $sellerCryptoWallet = \App\Models\Wallet::where('user_id', $actualSellOrder->user_id)
            ->where('cryptocurrency_id', $actualSellOrder->base_currency_id)
            ->first();

        if ($sellerCryptoWallet) {
            $sellerCryptoWallet->locked_balance -= $quantity;
            $sellerCryptoWallet->save();
        }

        // Update seller's USD wallet (add USD minus fee)
        $sellerUsdWallet = \App\Models\Wallet::where('user_id', $actualSellOrder->user_id)
            ->where('cryptocurrency_id', $actualSellOrder->quote_currency_id)
            ->first();

        if ($sellerUsdWallet) {
            $totalRevenue = ($quantity * $price) - $sellerTransaction->fee;
            $sellerUsdWallet->balance += $totalRevenue;
            $sellerUsdWallet->save();
        }

        // Notify admins about the completed trade
        $this->notifyAdminsAboutTrade($buyerTransaction, $sellerTransaction, $quantity, $price);
    }

    /**
     * ✅ UPDATED: Notify admins with query parameter for modal approach
     */
    private function notifyAdminsAboutNewOrder($order, $user)
    {
        NotificationService::sendToAdmins(
            type: 'admin_new_order',
            title: '📋 New Order Placed',
            message: "{$user->name} placed a {$order->side} order for {$order->quantity} {$order->baseCurrency->symbol} at " .
                ($order->type === 'market' ? 'market price' : '$' . number_format($order->price, 2)),
            icon: '📋',
            link: "/admin/orders?order_id={$order->order_id}", // ✅ Query parameter for modal
            data: [
                'order_id' => $order->order_id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'type' => $order->type,
                'side' => $order->side,
                'quantity' => $order->quantity,
                'price' => $order->price,
            ]
        );
    }

    /**
     * ✅ Notify admins about completed trade with transaction_id
     */
    private function notifyAdminsAboutTrade($buyerTransaction, $sellerTransaction, $quantity, $price)
    {
        $buyer = \App\Models\User::find($buyerTransaction->user_id);
        $seller = \App\Models\User::find($sellerTransaction->user_id);
        $crypto = \App\Models\Cryptocurrency::find($buyerTransaction->cryptocurrency_id);

        $totalValue = $quantity * $price;

        NotificationService::sendToAdmins(
            type: 'admin_trade_alert',
            title: '✅ Trade Executed',
            message: "Trade completed: {$buyer->name} bought {$quantity} {$crypto->symbol} from {$seller->name} at \${$price} (Total: \${$totalValue})",
            icon: '💰',
            link: "/admin/transactions/{$buyerTransaction->transaction_id}",
            data: [
                'buyer_transaction_id' => $buyerTransaction->transaction_id,
                'seller_transaction_id' => $sellerTransaction->transaction_id,
                'buyer_name' => $buyer->name,
                'seller_name' => $seller->name,
                'quantity' => $quantity,
                'price' => $price,
                'total_value' => $totalValue,
                'cryptocurrency' => $crypto->symbol,
            ]
        );
    }
}
