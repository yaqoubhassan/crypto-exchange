<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard
     */
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
                'message' => 'High volume of pending transactions detected'
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'revenueData' => $revenueData,
            'alerts' => $alerts,
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
            'recentOrders' => $recentOrders,
            'pendingKyc' => $pendingKyc,
            'systemHealth' => $systemHealth,
        ]);
    }

    /**
     * Generate system alerts based on current statistics
     */
    private function generateSystemAlerts(array $stats): array
    {
        $alerts = [];
        $alertId = 1;

        // Pending KYC alert
        if ($stats['pending_kyc'] > 0) {
            $alerts[] = [
                'id' => $alertId++,
                'type' => 'kyc',
                'message' => "{$stats['pending_kyc']} KYC verifications require review",
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

        // Low revenue alert
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
}
