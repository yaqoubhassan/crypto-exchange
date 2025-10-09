<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get all user wallets with cryptocurrency details
        $wallets = $user->wallets()->with('cryptocurrency')->get();
        
        // Get all available cryptocurrencies
        $cryptocurrencies = \App\Models\Cryptocurrency::where('is_active', true)
            ->orderBy('symbol', 'asc')
            ->get();
        
        // Calculate total portfolio value in USD
        $totalPortfolioValue = $wallets->sum(function ($wallet) {
            return $wallet->balance * $wallet->cryptocurrency->current_price;
        });
        
        // Get recent wallet transactions
        $recentTransactions = $user->transactions()
            ->with('cryptocurrency')
            ->whereIn('type', ['deposit', 'withdrawal'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Calculate wallet statistics
        $stats = [
            'total_portfolio_value' => $totalPortfolioValue,
            'total_wallets' => $wallets->count(),
            'active_wallets' => $wallets->where('balance', '>', 0)->count(),
            'total_deposits' => $user->transactions()->where('type', 'deposit')->where('status', 'completed')->sum('amount'),
            'total_withdrawals' => $user->transactions()->where('type', 'withdrawal')->where('status', 'completed')->sum('amount'),
            'pending_transactions' => $user->transactions()->whereIn('type', ['deposit', 'withdrawal'])->where('status', 'pending')->count(),
        ];
        
        // Portfolio distribution
        $portfolioDistribution = $wallets->map(function ($wallet) use ($totalPortfolioValue) {
            $value = $wallet->balance * $wallet->cryptocurrency->current_price;
            return [
                'name' => $wallet->cryptocurrency->name,
                'symbol' => $wallet->cryptocurrency->symbol,
                'balance' => $wallet->balance,
                'locked_balance' => $wallet->locked_balance,
                'total_balance' => $wallet->balance + $wallet->locked_balance,
                'value' => $value,
                'percentage' => $totalPortfolioValue > 0 ? ($value / $totalPortfolioValue) * 100 : 0,
                'current_price' => $wallet->cryptocurrency->current_price,
                'change_24h' => $wallet->cryptocurrency->change_24h,
            ];
        })->filter(function ($item) {
            return $item['total_balance'] > 0;
        })->sortByDesc('value')->values();
        
        return Inertia::render('Wallet/Index', [
            'wallets' => $wallets,
            'cryptocurrencies' => $cryptocurrencies,
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'portfolioDistribution' => $portfolioDistribution,
        ]);
    }
    
    public function deposit(Request $request)
    {
        $request->validate([
            'cryptocurrency_id' => 'required|exists:cryptocurrencies,id',
            'amount' => 'required|numeric|min:0.00000001',
        ]);
        
        $user = auth()->user();
        $cryptocurrency = \App\Models\Cryptocurrency::findOrFail($request->cryptocurrency_id);
        
        // Ensure wallet exists
        $wallet = $user->createWalletIfNotExists($cryptocurrency->id);
        
        // Create deposit transaction
        $transaction = \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $user->id,
            'cryptocurrency_id' => $cryptocurrency->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'fee' => 0, // You can add fee calculation here
            'status' => 'pending', // In production, this would be pending until confirmed
            'notes' => 'Deposit via platform',
        ]);
        
        // In a real application, you would:
        // 1. Generate a unique deposit address
        // 2. Wait for blockchain confirmation
        // 3. Update transaction status to 'completed'
        // 4. Credit the wallet
        
        // For demo purposes, we'll auto-approve small amounts
        if ($request->amount <= 1000 && $cryptocurrency->is_fiat) {
            $transaction->status = 'completed';
            $transaction->processed_at = now();
            $transaction->save();
            
            $wallet->addBalance($request->amount);
            
            // Notify user
            \App\Models\Notification::createForUser(
                $user->id,
                'transaction',
                'Deposit Successful',
                "Your deposit of {$request->amount} {$cryptocurrency->symbol} has been credited to your wallet.",
                '/wallet',
                ['transaction_id' => $transaction->id],
                '💰'
            );
            
            return back()->with('success', 'Deposit successful! Funds added to your wallet.');
        }
        
        // Notify all admins about new pending transaction
        \App\Models\Notification::createForAllAdmins(
            'transaction',
            'New Deposit Request',
            "{$user->name} requested a deposit of {$request->amount} {$cryptocurrency->symbol}",
            '/admin/transactions',
            ['transaction_id' => $transaction->id],
            '💵'
        );
        
        return back()->with('success', 'Deposit request submitted. Awaiting confirmation.');
    }
    
    public function withdraw(Request $request)
    {
        $request->validate([
            'cryptocurrency_id' => 'required|exists:cryptocurrencies,id',
            'amount' => 'required|numeric|min:0.00000001',
            'address' => 'nullable|string|max:255', // Withdrawal address
        ]);
        
        $user = auth()->user();
        $cryptocurrency = \App\Models\Cryptocurrency::findOrFail($request->cryptocurrency_id);
        
        $wallet = $user->wallets()->where('cryptocurrency_id', $cryptocurrency->id)->first();
        
        if (!$wallet) {
            return back()->withErrors(['error' => 'Wallet not found']);
        }
        
        if ($wallet->balance < $request->amount) {
            return back()->withErrors(['error' => 'Insufficient balance. Available: ' . $wallet->balance . ' ' . $cryptocurrency->symbol]);
        }
        
        // Calculate withdrawal fee (example: 0.5%)
        $fee = $request->amount * 0.005;
        $totalAmount = $request->amount + $fee;
        
        if ($wallet->balance < $totalAmount) {
            return back()->withErrors(['error' => 'Insufficient balance including fees. Required: ' . $totalAmount . ' ' . $cryptocurrency->symbol]);
        }
        
        // Deduct balance immediately
        if (!$wallet->deductBalance($totalAmount)) {
            return back()->withErrors(['error' => 'Failed to process withdrawal']);
        }
        
        // Create withdrawal transaction
        $transaction = \App\Models\Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => $user->id,
            'cryptocurrency_id' => $cryptocurrency->id,
            'type' => 'withdrawal',
            'amount' => $request->amount,
            'fee' => $fee,
            'status' => 'pending', // Requires admin approval or blockchain confirmation
            'to_address' => $request->address,
            'notes' => 'Withdrawal request',
        ]);
        
        // In a real application, you would:
        // 1. Queue the withdrawal for admin approval
        // 2. Process blockchain transaction
        // 3. Update status when confirmed
        
        // Notify all admins about new withdrawal request
        \App\Models\Notification::createForAllAdmins(
            'transaction',
            'New Withdrawal Request',
            "{$user->name} requested a withdrawal of {$request->amount} {$cryptocurrency->symbol}",
            '/admin/transactions',
            ['transaction_id' => $transaction->id],
            '💸'
        );
        
        // Notify user
        \App\Models\Notification::createForUser(
            $user->id,
            'transaction',
            'Withdrawal Request Submitted',
            "Your withdrawal request of {$request->amount} {$cryptocurrency->symbol} has been submitted and is awaiting approval.",
            '/transactions',
            ['transaction_id' => $transaction->id],
            '⏳'
        );
        
        return back()->with('success', 'Withdrawal request submitted successfully. Awaiting approval.');
        // 2. Process blockchain transaction
        // 3. Update status when confirmed
        
        return back()->with('success', 'Withdrawal request submitted successfully. Awaiting approval.');
    }

    public function generateAddress(Request $request)
    {
        $request->validate([
            'cryptocurrency_id' => 'required|exists:cryptocurrencies,id',
        ]);
        
        $user = auth()->user();
        $cryptocurrency = \App\Models\Cryptocurrency::findOrFail($request->cryptocurrency_id);
        
        // Ensure wallet exists
        $wallet = $user->createWalletIfNotExists($cryptocurrency->id);
        
        // In a real application, you would generate a unique blockchain address
        // For demo purposes, generate a random address
        if (!$wallet->address) {
            $wallet->address = $cryptocurrency->symbol . '-' . strtoupper(substr(md5(uniqid()), 0, 32));
            $wallet->save();
        }
        
        return response()->json([
            'success' => true,
            'address' => $wallet->address,
            'cryptocurrency' => $cryptocurrency->symbol,
        ]);
    }
}