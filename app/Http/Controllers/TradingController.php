<?php

namespace App\Http\Controllers;

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
            'type' => 'required|in:market,limit,stop,stop_limit',
            'side' => 'required|in:buy,sell',
            'quantity' => 'required|numeric|min:0.00000001',
            'price' => 'nullable|numeric|min:0.00000001',
            'stop_price' => 'nullable|numeric|min:0.00000001',
        ]);

        $user = auth()->user();
        
        try {
            DB::beginTransaction();
            
            $baseCurrency = \App\Models\Cryptocurrency::findOrFail($request->base_currency_id);
            $quoteCurrency = \App\Models\Cryptocurrency::findOrFail($request->quote_currency_id);

            // Ensure wallets exist
            $user->createWalletIfNotExists($baseCurrency->id);
            $user->createWalletIfNotExists($quoteCurrency->id);

            // Validate price for limit orders
            if ($request->type === 'limit' && !$request->price) {
                return response()->json([
                    'error' => 'Price is required for limit orders'
                ], 400);
            }

            // Determine the price to use for calculations
            $orderPrice = $request->price ?? $baseCurrency->current_price;

            // Create order
            $order = new \App\Models\Order();
            $order->order_id = 'ORD-' . strtoupper(uniqid());
            $order->user_id = $user->id;
            $order->base_currency_id = $request->base_currency_id;
            $order->quote_currency_id = $request->quote_currency_id;
            $order->type = $request->type;
            $order->side = $request->side;
            $order->quantity = $request->quantity;
            $order->price = $request->price;
            $order->stop_price = $request->stop_price;

            // Lock funds for the order
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

            // Process market orders immediately
            if ($request->type === 'market') {
                $this->processMarketOrder($order);
            }

            // Create notification
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'type' => 'order_placed',
                'title' => 'Order Placed',
                'message' => "Your {$order->side} order for {$order->quantity} {$baseCurrency->symbol} has been placed successfully.",
                'data' => json_encode([
                    'order_id' => $order->order_id,
                    'type' => $order->type,
                    'side' => $order->side,
                ]),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order->load(['baseCurrency', 'quoteCurrency'])
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order placement failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to place order. Please try again.'
            ], 500);
        }
    }

    private function processMarketOrder($order)
    {
        // Simple market order processing - match with best available orders
        $oppositeOrders = \App\Models\Order::where('base_currency_id', $order->base_currency_id)
            ->where('quote_currency_id', $order->quote_currency_id)
            ->where('side', $order->side === 'buy' ? 'sell' : 'buy')
            ->where('status', 'pending')
            ->orderBy('price', $order->side === 'buy' ? 'asc' : 'desc')
            ->get();

        $remainingQuantity = $order->quantity;
        $totalFilled = 0;
        $weightedPriceSum = 0;

        foreach ($oppositeOrders as $matchOrder) {
            if ($remainingQuantity <= 0) break;

            $fillQuantity = min($remainingQuantity, $matchOrder->quantity - $matchOrder->filled_quantity);
            $fillPrice = $matchOrder->price;

            // Update orders
            $order->filled_quantity += $fillQuantity;
            $matchOrder->filled_quantity += $fillQuantity;

            $totalFilled += $fillQuantity;
            $weightedPriceSum += $fillQuantity * $fillPrice;

            // Update order statuses
            if ($matchOrder->filled_quantity >= $matchOrder->quantity) {
                $matchOrder->status = 'filled';
                
                // Create notification for matched order owner
                \App\Models\Notification::create([
                    'user_id' => $matchOrder->user_id,
                    'type' => 'order_filled',
                    'title' => 'Order Filled',
                    'message' => "Your {$matchOrder->side} order for {$matchOrder->quantity} {$matchOrder->baseCurrency->symbol} has been filled.",
                    'data' => json_encode([
                        'order_id' => $matchOrder->order_id,
                    ]),
                ]);
            } else {
                $matchOrder->status = 'partial';
            }
            $matchOrder->save();

            $remainingQuantity -= $fillQuantity;

            // Create transaction records
            $this->createTradeTransaction($order, $matchOrder, $fillQuantity, $fillPrice);
        }

        // Update order status
        if ($order->filled_quantity >= $order->quantity) {
            $order->status = 'filled';
            
            // Create notification
            \App\Models\Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order_filled',
                'title' => 'Order Filled',
                'message' => "Your {$order->side} order for {$order->quantity} {$order->baseCurrency->symbol} has been filled.",
                'data' => json_encode([
                    'order_id' => $order->order_id,
                ]),
            ]);
        } else if ($order->filled_quantity > 0) {
            $order->status = 'partial';
        } else {
            // No matches found, order stays pending
            // For market orders with no matches, we might want to cancel or convert to limit
            $order->status = 'pending';
        }

        if ($totalFilled > 0) {
            $order->average_price = $weightedPriceSum / $totalFilled;
        }

        $order->save();
    }

    private function createTradeTransaction($buyOrder, $sellOrder, $quantity, $price)
    {
        // Determine which order is the buyer and which is the seller
        $actualBuyOrder = $buyOrder->side === 'buy' ? $buyOrder : $sellOrder;
        $actualSellOrder = $buyOrder->side === 'sell' ? $buyOrder : $sellOrder;

        // Create transaction for buyer
        \App\Models\Transaction::create([
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
        \App\Models\Transaction::create([
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

        // Update wallets
        $this->updateWalletsAfterTrade($actualBuyOrder, $actualSellOrder, $quantity, $price);
    }

    private function updateWalletsAfterTrade($buyOrder, $sellOrder, $quantity, $price)
    {
        $fee = 0.001; // 0.1% trading fee
        
        // Update buyer's wallets
        $buyerBaseWallet = \App\Models\Wallet::where('user_id', $buyOrder->user_id)
            ->where('cryptocurrency_id', $buyOrder->base_currency_id)
            ->first();
        $buyerQuoteWallet = \App\Models\Wallet::where('user_id', $buyOrder->user_id)
            ->where('cryptocurrency_id', $buyOrder->quote_currency_id)
            ->first();

        if ($buyerBaseWallet) {
            // Add crypto to buyer (minus fee)
            $netQuantity = $quantity * (1 - $fee);
            $buyerBaseWallet->addBalance($netQuantity);
        }
        
        if ($buyerQuoteWallet) {
            // Release locked USD
            $totalCost = $quantity * $price;
            $buyerQuoteWallet->locked_balance -= $totalCost;
            $buyerQuoteWallet->save();
        }

        // Update seller's wallets
        $sellerBaseWallet = \App\Models\Wallet::where('user_id', $sellOrder->user_id)
            ->where('cryptocurrency_id', $sellOrder->base_currency_id)
            ->first();
        $sellerQuoteWallet = \App\Models\Wallet::where('user_id', $sellOrder->user_id)
            ->where('cryptocurrency_id', $sellOrder->quote_currency_id)
            ->first();

        if ($sellerBaseWallet) {
            // Release locked crypto
            $sellerBaseWallet->locked_balance -= $quantity;
            $sellerBaseWallet->save();
        }
        
        if ($sellerQuoteWallet) {
            // Add USD to seller (minus fee)
            $totalRevenue = $quantity * $price;
            $netRevenue = $totalRevenue * (1 - $fee);
            $sellerQuoteWallet->addBalance($netRevenue);
        }
    }
}