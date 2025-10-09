<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $baseCurrency = \App\Models\Cryptocurrency::findOrFail($request->base_currency_id);
        $quoteCurrency = \App\Models\Cryptocurrency::findOrFail($request->quote_currency_id);

        // Ensure wallets exist
        $user->createWalletIfNotExists($baseCurrency->id);
        $user->createWalletIfNotExists($quoteCurrency->id);

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
            $requiredAmount = $request->quantity * ($request->price ?? $baseCurrency->current_price);
            $wallet = $user->wallets()->where('cryptocurrency_id', $quoteCurrency->id)->first();
            
            if (!$wallet || $wallet->balance < $requiredAmount) {
                return response()->json([
                    'error' => 'Insufficient balance. Required: ' . $requiredAmount . ' ' . $quoteCurrency->symbol
                ], 400);
            }
            
            if (!$wallet->lockBalance($requiredAmount)) {
                return response()->json(['error' => 'Failed to lock balance'], 400);
            }
        } else {
            $wallet = $user->wallets()->where('cryptocurrency_id', $baseCurrency->id)->first();
            
            if (!$wallet || $wallet->balance < $request->quantity) {
                return response()->json([
                    'error' => 'Insufficient balance. Required: ' . $request->quantity . ' ' . $baseCurrency->symbol
                ], 400);
            }
            
            if (!$wallet->lockBalance($request->quantity)) {
                return response()->json(['error' => 'Failed to lock balance'], 400);
            }
        }

        $order->save();

        // Process market orders immediately
        if ($request->type === 'market') {
            $this->processMarketOrder($order);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'order' => $order->load(['baseCurrency', 'quoteCurrency'])
        ], 201);
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
        } else if ($order->filled_quantity > 0) {
            $order->status = 'partial';
        }

        if ($totalFilled > 0) {
            $order->average_price = $weightedPriceSum / $totalFilled;
        }

        $order->save();
    }

    private function createTradeTransaction($buyOrder, $sellOrder, $quantity, $price)
    {
        // Create transaction for buyer
        \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $buyOrder->user_id,
            'cryptocurrency_id' => $buyOrder->base_currency_id,
            'type' => 'buy',
            'amount' => $quantity,
            'price' => $price,
            'status' => 'completed',
            'processed_at' => now(),
        ]);

        // Create transaction for seller
        \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $sellOrder->user_id,
            'cryptocurrency_id' => $sellOrder->base_currency_id,
            'type' => 'sell',
            'amount' => $quantity,
            'price' => $price,
            'status' => 'completed',
            'processed_at' => now(),
        ]);

        // Update wallets
        $this->updateWalletsAfterTrade($buyOrder, $sellOrder, $quantity, $price);
    }

    private function updateWalletsAfterTrade($buyOrder, $sellOrder, $quantity, $price)
    {
        // Update buyer's wallets
        $buyerBaseWallet = \App\Models\Wallet::where('user_id', $buyOrder->user_id)
            ->where('cryptocurrency_id', $buyOrder->base_currency_id)
            ->first();
        $buyerQuoteWallet = \App\Models\Wallet::where('user_id', $buyOrder->user_id)
            ->where('cryptocurrency_id', $buyOrder->quote_currency_id)
            ->first();

        if ($buyerBaseWallet) {
            $buyerBaseWallet->addBalance($quantity);
        }
        if ($buyerQuoteWallet) {
            $buyerQuoteWallet->locked_balance -= ($quantity * $price);
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
            $sellerBaseWallet->locked_balance -= $quantity;
            $sellerBaseWallet->save();
        }
        if ($sellerQuoteWallet) {
            $sellerQuoteWallet->addBalance($quantity * $price);
        }
    }
}