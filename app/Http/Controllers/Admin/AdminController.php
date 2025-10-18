<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard
     */
    public function dashboard(Request $request)
    {
        // Get timeframe from request, default to 24h
        $timeframe = $request->get('timeframe', '24h');

        // Calculate date range based on timeframe
        $dateRange = $this->getDateRangeFromTimeframe($timeframe);
        $currentStart = $dateRange['current_start'];
        $previousStart = $dateRange['previous_start'];
        $previousEnd = $dateRange['previous_end'];

        // Get current statistics
        $stats = [
            'total_users' => \App\Models\User::count(),
            'active_users' => \App\Models\User::where('is_active', true)->count(),
            'total_transactions' => \App\Models\Transaction::count(),
            'pending_transactions' => \App\Models\Transaction::where('status', 'pending')->count(),
            'total_orders' => \App\Models\Order::count(),
            'active_orders' => \App\Models\Order::whereIn('status', ['pending', 'partial'])->count(),

            // Timeframe-specific volume
            'total_volume_24h' => \App\Models\Transaction::where('created_at', '>=', $currentStart)
                ->whereIn('type', ['buy', 'sell'])
                ->where('status', 'completed')
                ->sum(DB::raw('amount * COALESCE(price, 0)')),

            'pending_kyc' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),

            // Total revenue (all-time)
            'total_revenue' => \App\Models\Transaction::where('status', 'completed')
                ->sum('fee'),

            // Timeframe-specific metrics
            'new_users_24h' => \App\Models\User::where('created_at', '>=', $currentStart)->count(),
            'completed_trades_24h' => \App\Models\Transaction::where('created_at', '>=', $currentStart)
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
        $stats['previous_total_users'] = \App\Models\User::where('created_at', '<', $previousEnd)->count();
        $stats['previous_volume_24h'] = \App\Models\Transaction::where('created_at', '>=', $previousStart)
            ->where('created_at', '<', $previousEnd)
            ->whereIn('type', ['buy', 'sell'])
            ->where('status', 'completed')
            ->sum(DB::raw('amount * COALESCE(price, 0)'));
        $stats['previous_transactions'] = \App\Models\Transaction::where('created_at', '<', $previousEnd)->count();
        $stats['previous_revenue'] = \App\Models\Transaction::where('created_at', '<', $previousEnd)
            ->where('status', 'completed')
            ->sum('fee');

        // Get revenue data for chart based on timeframe
        $chartDays = $this->getChartDaysFromTimeframe($timeframe);
        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subDays($chartDays))
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

        // Get recent transactions (filtered by timeframe)
        $recentTransactions = \App\Models\Transaction::with(['user', 'cryptocurrency'])
            ->where('created_at', '>=', $currentStart)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Get recent users (filtered by timeframe)
        $recentUsers = \App\Models\User::where('created_at', '>=', $currentStart)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get recent orders (filtered by timeframe)
        $recentOrders = \App\Models\Order::with(['user', 'baseCurrency', 'quoteCurrency'])
            ->where('created_at', '>=', $currentStart)
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        // Get pending KYC applications
        $pendingKyc = \App\Models\UserKyc::with('user')
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get system health metrics
        $systemHealth = [
            'database' => $this->checkDatabaseHealth(),
            'cache' => $this->checkCacheHealth(),
            'queue' => $this->checkQueueHealth(),
        ];

        // Get support ticket stats
        $supportStats = [
            'open' => \App\Models\SupportTicket::where('status', 'open')->count(),
            'in_progress' => \App\Models\SupportTicket::where('status', 'in_progress')->count(),
            'closed' => \App\Models\SupportTicket::where('status', 'closed')->count(),
        ];

        // Get recent support tickets (filtered by timeframe)
        $recentTickets = \App\Models\SupportTicket::with('user')
            ->where('created_at', '>=', $currentStart)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
            'recentOrders' => $recentOrders,
            'pendingKyc' => $pendingKyc,
            'systemHealth' => $systemHealth,
            'revenueData' => $revenueData,
            'alerts' => $alerts,
            'supportStats' => $supportStats,
            'recentTickets' => $recentTickets,
            'currentTimeframe' => $timeframe, // Pass back to frontend
        ]);
    }

    /**
     * Get date range based on timeframe
     */
    private function getDateRangeFromTimeframe($timeframe)
    {
        $now = now();

        switch ($timeframe) {
            case '1h':
                return [
                    'current_start' => $now->copy()->subHour(),
                    'previous_start' => $now->copy()->subHours(2),
                    'previous_end' => $now->copy()->subHour(),
                ];
            case '24h':
                return [
                    'current_start' => $now->copy()->subDay(),
                    'previous_start' => $now->copy()->subDays(2),
                    'previous_end' => $now->copy()->subDay(),
                ];
            case '7d':
                return [
                    'current_start' => $now->copy()->subDays(7),
                    'previous_start' => $now->copy()->subDays(14),
                    'previous_end' => $now->copy()->subDays(7),
                ];
            case '30d':
                return [
                    'current_start' => $now->copy()->subDays(30),
                    'previous_start' => $now->copy()->subDays(60),
                    'previous_end' => $now->copy()->subDays(30),
                ];
            case '90d':
                return [
                    'current_start' => $now->copy()->subDays(90),
                    'previous_start' => $now->copy()->subDays(180),
                    'previous_end' => $now->copy()->subDays(90),
                ];
            default:
                return [
                    'current_start' => $now->copy()->subDay(),
                    'previous_start' => $now->copy()->subDays(2),
                    'previous_end' => $now->copy()->subDay(),
                ];
        }
    }

    /**
     * Get number of days for chart based on timeframe
     */
    private function getChartDaysFromTimeframe($timeframe)
    {
        switch ($timeframe) {
            case '1h':
                return 1; // Show last 24 hours
            case '24h':
                return 7; // Show last 7 days
            case '7d':
                return 30; // Show last 30 days
            case '30d':
                return 90; // Show last 90 days
            case '90d':
                return 365; // Show last year
            default:
                return 30;
        }
    }

    /**
     * Generate system alerts based on statistics
     */
    private function generateSystemAlerts($stats)
    {
        $alerts = [];

        // High pending transactions alert
        if ($stats['pending_transactions'] > 50) {
            $alerts[] = [
                'id' => 'high_pending_tx',
                'type' => 'warning',
                'title' => 'High Pending Transactions',
                'message' => "You have {$stats['pending_transactions']} pending transactions that need review.",
                'action' => '/admin/transactions?status=pending',
                'dismissible' => true,
            ];
        }

        // Pending KYC alert
        if ($stats['pending_kyc'] > 0) {
            $alerts[] = [
                'id' => 'pending_kyc',
                'type' => 'info',
                'title' => 'Pending KYC Verifications',
                'message' => "{$stats['pending_kyc']} users are waiting for KYC verification.",
                'action' => '/admin/kyc',
                'dismissible' => true,
            ];
        }

        // Failed login attempts alert
        if ($stats['failed_login_attempts'] > 100) {
            $alerts[] = [
                'id' => 'high_failed_logins',
                'type' => 'error',
                'title' => 'High Failed Login Attempts',
                'message' => "Detected {$stats['failed_login_attempts']} failed login attempts in the last hour. Possible security threat.",
                'action' => '/admin/security',
                'dismissible' => false,
            ];
        }

        return $alerts;
    }

    /**
     * Check database health
     */
    private function checkDatabaseHealth()
    {
        try {
            DB::connection()->getPdo();
            return 'healthy';
        } catch (\Exception $e) {
            return 'unhealthy';
        }
    }

    /**
     * Check cache health
     */
    private function checkCacheHealth()
    {
        try {
            \Cache::put('health_check', true, 60);
            return \Cache::get('health_check') ? 'healthy' : 'unhealthy';
        } catch (\Exception $e) {
            return 'unhealthy';
        }
    }

    /**
     * Check queue health
     */
    private function checkQueueHealth()
    {
        try {
            $failedJobs = DB::table('failed_jobs')->count();
            return $failedJobs > 100 ? 'warning' : 'healthy';
        } catch (\Exception $e) {
            return 'unknown';
        }
    }
}
