<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
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
            'failed_login_attempts' => DB::table('failed_login_attempts')
                ->where('created_at', '>=', now()->subHour())
                ->count(),
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

        // Get revenue data for chart (last 30 days)
        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(fee) as revenue, COUNT(*) as transaction_count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'revenue' => (float) $item->revenue,
                    'transactions' => $item->transaction_count,
                ];
            });

        // Get real-time alerts
        $alerts = $this->generateSystemAlerts($stats);

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
            'revenueData' => $revenueData,
            'alerts' => $alerts,
        ]);
    }

    private function generateSystemAlerts($stats)
    {
        $alerts = [];
        $alertId = 1;

        // Failed login attempts alert
        if ($stats['failed_login_attempts'] > 0) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'security',
                'message' => "{$stats['failed_login_attempts']} failed login attempts detected in the last hour",
                'severity' => $stats['failed_login_attempts'] > 10 ? 'high' : ($stats['failed_login_attempts'] > 5 ? 'medium' : 'low'),
                'time' => 'Last hour',
                'created_at' => now()->toIso8601String(),
            ];
        }

        // Pending KYC alert
        if ($stats['pending_kyc'] > 0) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'compliance',
                'message' => "{$stats['pending_kyc']} KYC applications waiting for review",
                'severity' => $stats['pending_kyc'] > 20 ? 'high' : ($stats['pending_kyc'] > 10 ? 'medium' : 'low'),
                'time' => 'Pending',
                'created_at' => now()->toIso8601String(),
            ];
        }

        // Pending transactions alert
        if ($stats['pending_transactions'] > 0) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'transaction',
                'message' => "{$stats['pending_transactions']} pending transactions require approval",
                'severity' => $stats['pending_transactions'] > 10 ? 'high' : ($stats['pending_transactions'] > 5 ? 'medium' : 'low'),
                'time' => 'Pending',
                'created_at' => now()->toIso8601String(),
            ];
        }

        // Active orders alert
        if ($stats['active_orders'] > 50) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'system',
                'message' => "High volume of active orders ({$stats['active_orders']}) - monitor system performance",
                'severity' => $stats['active_orders'] > 100 ? 'high' : 'medium',
                'time' => 'Current',
                'created_at' => now()->toIso8601String(),
            ];
        }

        // Low revenue alert (comparing to average)
        $avgDailyRevenue = $stats['total_revenue'] / max(\App\Models\Transaction::whereDate('created_at', '>=', now()->subDays(30))->distinct('created_at')->count('created_at'), 1);
        $todayRevenue = \App\Models\Transaction::where('status', 'completed')
            ->whereDate('created_at', now())
            ->sum('fee');

        if ($todayRevenue < ($avgDailyRevenue * 0.5) && $avgDailyRevenue > 0) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'system',
                'message' => "Today's revenue is below average - monitor platform activity",
                'severity' => 'medium',
                'time' => 'Today',
                'created_at' => now()->toIso8601String(),
            ];
        }

        return $alerts;
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

        // For withdrawals, send a "processing" notification first
        if ($transaction->type === 'withdrawal') {
            // Set status to processing
            $transaction->status = 'processing';
            $transaction->save();

            // Notify user that withdrawal is now being processed
            NotificationService::send(
                user: $transaction->user,
                type: 'withdrawal_processing',
                title: 'Withdrawal Processing',
                message: "Your withdrawal of {$transaction->amount} {$transaction->cryptocurrency->symbol} is now being processed on the blockchain.",
                icon: '⏳',
                link: '/transactions',
                data: [
                    'transaction_id' => $transaction->transaction_id,
                    'amount' => $transaction->amount,
                    'cryptocurrency' => $transaction->cryptocurrency->symbol,
                    'to_address' => $transaction->to_address,
                ]
            );

            // In a real application, you would queue a job here to:
            // 1. Send the blockchain transaction
            // 2. Wait for confirmations
            // 3. Update status to 'completed' when confirmed
            // 4. Send the final "withdrawal completed" notification

            // For now, simulate completion (in production, this would be in a queued job)
            // You should create a Job like ProcessWithdrawal that handles the blockchain tx

            // Simulating completion after processing (remove this in production)
            $transaction->status = 'completed';
            $transaction->processed_at = now();
            $transaction->external_tx_id = 'BLOCKCHAIN-TX-' . strtoupper(uniqid());
            $transaction->save();

            // Send final completion notification
            NotificationService::send(
                user: $transaction->user,
                type: 'withdrawal_completed',
                title: 'Withdrawal Completed',
                message: "Your withdrawal of {$transaction->amount} {$transaction->cryptocurrency->symbol} has been completed successfully.",
                icon: '✅',
                link: '/transactions',
                data: [
                    'transaction_id' => $transaction->transaction_id,
                    'external_tx_id' => $transaction->external_tx_id,
                    'amount' => $transaction->amount,
                    'cryptocurrency' => $transaction->cryptocurrency->symbol,
                ]
            );

            return back()->with('success', 'Withdrawal approved and processed successfully');
        }

        // For deposits
        if ($transaction->type === 'deposit') {
            $transaction->status = 'completed';
            $transaction->processed_at = now();
            $transaction->save();

            // Update wallet balance
            $user = $transaction->user;
            $wallet = $user->wallets()->where('cryptocurrency_id', $transaction->cryptocurrency_id)->first();

            if ($wallet) {
                $wallet->addBalance($transaction->amount);
            }

            // Send deposit confirmed notification
            NotificationService::send(
                user: $user,
                type: 'deposit_confirmed',
                title: 'Deposit Confirmed',
                message: "Your deposit of {$transaction->amount} {$transaction->cryptocurrency->symbol} has been confirmed and credited to your wallet.",
                icon: '💰',
                link: '/wallet',
                data: [
                    'transaction_id' => $transaction->transaction_id,
                    'amount' => $transaction->amount,
                    'cryptocurrency' => $transaction->cryptocurrency->symbol,
                ]
            );

            return back()->with('success', 'Deposit approved successfully');
        }

        // For other transaction types
        $transaction->status = 'completed';
        $transaction->processed_at = now();
        $transaction->save();

        NotificationService::send(
            user: $transaction->user,
            type: 'transaction_approved',
            title: 'Transaction Approved',
            message: "Your {$transaction->type} of {$transaction->amount} {$transaction->cryptocurrency->symbol} has been approved and processed.",
            icon: '✅',
            link: '/transactions',
            data: [
                'transaction_id' => $transaction->transaction_id,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'cryptocurrency' => $transaction->cryptocurrency->symbol,
            ]
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

        // Create real-time notification for user
        NotificationService::send(
            user: $user,
            type: 'transaction_rejected',
            title: 'Transaction Rejected',
            message: "Your {$transaction->type} has been rejected. Reason: {$request->reason}",
            icon: '❌',
            link: '/transactions',
            data: [
                'transaction_id' => $transaction->transaction_id,
                'reason' => $request->reason,
            ]
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

        // Send real-time notification to user
        NotificationService::send(
            user: $kyc->user,
            type: 'kyc_approved',
            title: 'KYC Verification Approved',
            message: 'Congratulations! Your identity verification has been approved. You now have full access to all platform features.',
            icon: '✅',
            link: '/profile/kyc',
            data: [
                'kyc_id' => $kyc->id,
                'approved_at' => now()->toIso8601String(),
            ]
        );

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

        // Send real-time notification to user
        NotificationService::send(
            user: $kyc->user,
            type: 'kyc_rejected',
            title: 'KYC Verification Rejected',
            message: "Your identity verification was rejected. Reason: {$request->reason}. Please submit new documents.",
            icon: '❌',
            link: '/profile/kyc',
            data: [
                'kyc_id' => $kyc->id,
                'reason' => $request->reason,
            ]
        );

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
