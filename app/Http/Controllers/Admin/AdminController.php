<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Get current statistics
        $stats = [
            'total_users' => \App\Models\User::count(),
            'active_users' => \App\Models\User::where('is_active', true)->count(),
            'total_transactions' => \App\Models\Transaction::count(),
            'pending_transactions' => \App\Models\Transaction::where('status', 'pending')->count(),
            'total_orders' => \App\Models\Order::count(),
            'active_orders' => \App\Models\Order::whereIn('status', ['pending', 'partial'])->count(),
            'total_volume_24h' => \App\Models\Transaction::where('created_at', '>=', now()->subDay())
                ->whereIn('type', ['buy', 'sell'])
                ->where('status', 'completed')
                ->sum(DB::raw('amount * COALESCE(price, 0)')),
            'pending_kyc' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),
            'total_revenue' => \App\Models\Transaction::where('status', 'completed')
                ->sum('fee'),
            'new_users_24h' => \App\Models\User::where('created_at', '>=', now()->subDay())->count(),
            'completed_trades_24h' => \App\Models\Transaction::where('created_at', '>=', now()->subDay())
                ->whereIn('type', ['buy', 'sell'])
                ->where('status', 'completed')
                ->count(),
            'total_wallets' => \App\Models\Wallet::count(),
            'avg_order_value' => \App\Models\Order::where('status', 'filled')
                ->avg(DB::raw('quantity * COALESCE(price, 0)')),
        ];

        // Get previous period statistics for trend calculation
        $stats['previous_total_users'] = \App\Models\User::where('created_at', '<', now()->subDay())->count();
        $stats['previous_volume_24h'] = \App\Models\Transaction::where('created_at', '>=', now()->subDays(2))
            ->where('created_at', '<', now()->subDay())
            ->whereIn('type', ['buy', 'sell'])
            ->where('status', 'completed')
            ->sum(DB::raw('amount * COALESCE(price, 0)'));
        $stats['previous_transactions'] = \App\Models\Transaction::where('created_at', '<', now()->subDay())->count();
        $stats['previous_revenue'] = \App\Models\Transaction::where('created_at', '<', now()->subDay())
            ->where('status', 'completed')
            ->sum('fee');

        // Get recent transactions
        $recentTransactions = \App\Models\Transaction::with(['user', 'cryptocurrency'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Get recent users
        $recentUsers = \App\Models\User::orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Get recent orders
        $recentOrders = \App\Models\Order::with(['user', 'baseCurrency', 'quoteCurrency'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get pending KYC
        $pendingKyc = \App\Models\UserKyc::with('user')
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        // System health
        $systemHealth = [
            'status' => 'healthy',
            'message' => 'All systems operational'
        ];

        if ($stats['pending_transactions'] > 10) {
            $systemHealth = [
                'status' => 'warning',
                'message' => 'High number of pending transactions requiring review'
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
            'recentOrders' => $recentOrders,
            'pendingKyc' => $pendingKyc,
            'systemHealth' => $systemHealth,
        ]);
    }

    public function transactions(Request $request)
    {
        $query = \App\Models\Transaction::with(['user', 'cryptocurrency']);

        // Apply filters
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total' => \App\Models\Transaction::count(),
            'pending' => \App\Models\Transaction::where('status', 'pending')->count(),
            'completed' => \App\Models\Transaction::where('status', 'completed')->count(),
            'failed' => \App\Models\Transaction::whereIn('status', ['failed', 'cancelled'])->count(),
        ];

        // Get common stats for header
        $commonStats = $this->getCommonStats();

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'stats' => array_merge($commonStats, $stats),
            'filters' => [
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
            ],
        ]);
    }

    public function showTransaction($id)
    {
        $transaction = \App\Models\Transaction::with(['user', 'cryptocurrency'])
            ->findOrFail($id);

        // Get user's wallet for this cryptocurrency
        $wallet = $transaction->user->wallets()
            ->where('cryptocurrency_id', $transaction->cryptocurrency_id)
            ->with('cryptocurrency')
            ->first();

        // Get user's recent transactions
        $userTransactions = \App\Models\Transaction::where('user_id', $transaction->user_id)
            ->with('cryptocurrency')
            ->where('id', '!=', $transaction->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get all transactions for this cryptocurrency (for context)
        $relatedTransactions = \App\Models\Transaction::where('cryptocurrency_id', $transaction->cryptocurrency_id)
            ->with(['user', 'cryptocurrency'])
            ->where('id', '!=', $transaction->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get user's KYC status
        $kycStatus = \App\Models\UserKyc::where('user_id', $transaction->user_id)
            ->latest()
            ->first();

        // Get user statistics
        $userStats = [
            'total_transactions' => \App\Models\Transaction::where('user_id', $transaction->user_id)->count(),
            'completed_transactions' => \App\Models\Transaction::where('user_id', $transaction->user_id)
                ->where('status', 'completed')->count(),
            'pending_transactions' => \App\Models\Transaction::where('user_id', $transaction->user_id)
                ->where('status', 'pending')->count(),
            'total_volume' => \App\Models\Transaction::where('user_id', $transaction->user_id)
                ->where('status', 'completed')
                ->sum(DB::raw('amount * COALESCE(price, 0)')),
            'account_age_days' => now()->diffInDays($transaction->user->created_at),
        ];

        // Get common stats for header
        $commonStats = $this->getCommonStats();

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction,
            'wallet' => $wallet,
            'userTransactions' => $userTransactions,
            'relatedTransactions' => $relatedTransactions,
            'kycStatus' => $kycStatus,
            'userStats' => $userStats,
            'stats' => $commonStats,
        ]);
    }

    public function kyc(Request $request)
    {
        $query = \App\Models\UserKyc::with('user');

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('verification_status', $request->status);
        }

        $kycApplications = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/KYC', [
            'applications' => $kycApplications,
            'filters' => $request->only(['status']),
        ]);
    }

    public function approveTransaction(Request $request, $id)
    {
        $transaction = \App\Models\Transaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending transactions can be approved']);
        }

        $transaction->status = 'completed';
        $transaction->processed_at = now();
        $transaction->save();

        // Update wallet balances based on transaction type
        $user = $transaction->user;
        $wallet = $user->wallets()->where('cryptocurrency_id', $transaction->cryptocurrency_id)->first();

        if ($wallet) {
            if ($transaction->type === 'deposit') {
                $wallet->addBalance($transaction->amount);
            } elseif ($transaction->type === 'withdrawal') {
                // Already deducted when withdrawal was requested
                // No additional action needed
            }
        }

        // Create notification for user
        \App\Models\Notification::createForUser(
            $user->id,
            'transaction',
            'Transaction Approved',
            "Your {$transaction->type} of {$transaction->amount} {$transaction->cryptocurrency->symbol} has been approved and processed.",
            '/transactions',
            ['transaction_id' => $transaction->id],
            '✅'
        );

        return back()->with('success', 'Transaction approved successfully');
    }

    public function rejectTransaction(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $transaction = \App\Models\Transaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending transactions can be rejected']);
        }

        $transaction->status = 'failed';
        $transaction->notes = $request->reason;
        $transaction->processed_at = now();
        $transaction->save();

        // Refund wallet if it was a withdrawal (funds were locked)
        $user = $transaction->user;
        $wallet = $user->wallets()->where('cryptocurrency_id', $transaction->cryptocurrency_id)->first();

        if ($wallet && $transaction->type === 'withdrawal') {
            // Refund the amount (it was deducted when withdrawal was requested)
            $totalAmount = $transaction->amount + $transaction->fee;
            $wallet->addBalance($totalAmount);
        }

        // Create notification for user
        \App\Models\Notification::createForUser(
            $user->id,
            'transaction',
            'Transaction Rejected',
            "Your {$transaction->type} has been rejected. Reason: {$request->reason}",
            '/transactions',
            ['transaction_id' => $transaction->id],
            '❌'
        );

        return back()->with('success', 'Transaction rejected successfully');
    }

    public function approveKyc(Request $request, $id)
    {
        $kyc = \App\Models\UserKyc::findOrFail($id);

        if ($kyc->verification_status !== 'pending') {
            return response()->json(['error' => 'KYC is not pending'], 400);
        }

        $kyc->verification_status = 'approved';
        $kyc->verified_at = now();
        $kyc->save();

        // You might want to send a notification to the user here

        return response()->json([
            'message' => 'KYC approved successfully',
            'kyc' => $kyc
        ]);
    }

    public function rejectKyc(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $kyc = \App\Models\UserKyc::findOrFail($id);

        if ($kyc->verification_status !== 'pending') {
            return response()->json(['error' => 'KYC is not pending'], 400);
        }

        $kyc->verification_status = 'rejected';
        $kyc->rejection_reason = $request->reason;
        $kyc->save();

        // You might want to send a notification to the user here

        return response()->json([
            'message' => 'KYC rejected successfully',
            'kyc' => $kyc
        ]);
    }

    public function cryptocurrencies()
    {
        $cryptocurrencies = \App\Models\Cryptocurrency::orderBy('name')->get();

        return Inertia::render('Admin/Cryptocurrencies', [
            'cryptocurrencies' => $cryptocurrencies,
        ]);
    }

    public function reports()
    {
        // Trading volume report data
        $tradingVolume = \App\Models\Transaction::whereIn('type', ['buy', 'sell'])
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount * price) as volume')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // Revenue report data
        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(fee) as revenue'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // User activity report
        $userActivity = [
            'new_registrations' => \App\Models\User::where('created_at', '>=', now()->subDays(30))
                ->count(),
            'active_traders' => \App\Models\Order::where('created_at', '>=', now()->subDays(30))
                ->distinct('user_id')
                ->count('user_id'),
            'kyc_completed' => \App\Models\UserKyc::where('verification_status', 'approved')
                ->where('verified_at', '>=', now()->subDays(30))
                ->count(),
        ];

        return Inertia::render('Admin/Reports', [
            'tradingVolume' => $tradingVolume,
            'revenueData' => $revenueData,
            'userActivity' => $userActivity,
        ]);
    }

    private function getCommonStats()
    {
        return [
            'total_users' => \App\Models\User::count(),
            'active_users' => \App\Models\User::where('is_active', true)->count(),
            'total_transactions' => \App\Models\Transaction::count(),
            'pending_transactions' => \App\Models\Transaction::where('status', 'pending')->count(),
            'total_orders' => \App\Models\Order::count(),
            'active_orders' => \App\Models\Order::whereIn('status', ['pending', 'partial'])->count(),
            'total_volume_24h' => \App\Models\Transaction::where('created_at', '>=', now()->subDay())
                ->whereIn('type', ['buy', 'sell'])
                ->where('status', 'completed')
                ->sum(DB::raw('amount * COALESCE(price, 0)')),
            'pending_kyc' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),
        ];
    }
}
