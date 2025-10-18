<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
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

        $supportStats = [
            'total' => SupportTicket::count(),
            'open' => SupportTicket::where('status', 'open')->count(),
            'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved' => SupportTicket::where('status', 'resolved')->count(),
        ];

        // Get recent support tickets
        $recentTickets = SupportTicket::with('user')
            ->latest()
            ->take(5)
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
            ->where('transaction_id', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

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
            'account_age_days' => max(1, (int) floor($transaction->user->created_at->diffInDays(now()))),
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

    public function reports(Request $request)
    {
        // Determine date range based on request
        $range = $request->get('range', '30days');
        $startDate = null;
        $endDate = now();

        switch ($range) {
            case '7days':
                $startDate = now()->subDays(7);
                break;
            case '30days':
                $startDate = now()->subDays(30);
                break;
            case '90days':
                $startDate = now()->subDays(90);
                break;
            case 'ytd':
                $startDate = now()->startOfYear();
                break;
            case 'custom':
                $startDate = $request->get('start_date') ? \Carbon\Carbon::parse($request->get('start_date')) : now()->subDays(30);
                $endDate = $request->get('end_date') ? \Carbon\Carbon::parse($request->get('end_date')) : now();
                break;
            default:
                $startDate = now()->subDays(30);
        }

        // Trading volume by cryptocurrency pairs
        $tradingVolume = \App\Models\Order::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', 'filled')
            ->with(['baseCurrency', 'quoteCurrency'])
            ->select(
                'base_currency_id',
                'quote_currency_id',
                DB::raw('SUM(quantity * COALESCE(price, 0)) as total_volume'),
                DB::raw('COUNT(*) as order_count')
            )
            ->groupBy('base_currency_id', 'quote_currency_id')
            ->orderBy('total_volume', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'base_symbol' => $item->baseCurrency->symbol ?? 'N/A',
                    'quote_symbol' => $item->quoteCurrency->symbol ?? 'N/A',
                    'total_volume' => $item->total_volume,
                    'order_count' => $item->order_count,
                ];
            });

        // Revenue data
        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
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
            'new_registrations' => \App\Models\User::where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->count(),
            'active_traders' => \App\Models\Order::where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->distinct('user_id')
                ->count('user_id'),
            'kyc_completed' => \App\Models\UserKyc::where('verification_status', 'approved')
                ->where('verified_at', '>=', $startDate)
                ->where('verified_at', '<=', $endDate)
                ->count(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'tradingVolume' => $tradingVolume,
            'revenueData' => $revenueData,
            'userActivity' => $userActivity,
            'filters' => [
                'range' => $range,
                'start_date' => $request->get('start_date'),
                'end_date' => $request->get('end_date'),
            ],
        ]);
    }

    public function exportReport(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|in:overview,revenue,trading,users,transactions',
                'format' => 'required|in:csv,pdf,excel',
                'range' => 'required|string',
            ]);

            $type = $request->type;
            $format = $request->format;
            $range = $request->range;

            // Determine date range
            $startDate = null;
            $endDate = now();

            switch ($range) {
                case '7days':
                    $startDate = now()->subDays(7);
                    break;
                case '30days':
                    $startDate = now()->subDays(30);
                    break;
                case '90days':
                    $startDate = now()->subDays(90);
                    break;
                case 'ytd':
                    $startDate = now()->startOfYear();
                    break;
                case 'custom':
                    $startDate = $request->start_date ? \Carbon\Carbon::parse($request->start_date) : now()->subDays(30);
                    $endDate = $request->end_date ? \Carbon\Carbon::parse($request->end_date) : now();
                    break;
                default:
                    $startDate = now()->subDays(30);
            }

            // Generate filename
            $timestamp = now()->format('Y-m-d_His');

            // Handle different export formats
            if ($format === 'csv') {
                $filename = "{$type}-report-{$timestamp}.csv";
                return $this->exportCSV($type, $startDate, $endDate, $filename);
            } elseif ($format === 'excel') {
                $filename = "{$type}-report-{$timestamp}.csv"; // Excel can open CSV
                return $this->exportCSV($type, $startDate, $endDate, $filename);
            } elseif ($format === 'pdf') {
                // PDF not fully implemented yet
                return redirect()->back()->with('info', 'PDF export is coming soon. Please use CSV or Excel format.');
            }

            return redirect()->back()->with('error', 'Invalid export format');
        } catch (\Exception $e) {
            \Log::error('Report export error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to export report: ' . $e->getMessage());
        }
    }

    private function exportCSV($type, $startDate, $endDate, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($type, $startDate, $endDate) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Add report header
            fputcsv($file, ['Report Type', ucfirst($type)]);
            fputcsv($file, ['Generated On', now()->format('Y-m-d H:i:s')]);
            fputcsv($file, ['Date Range', $startDate->format('Y-m-d') . ' to ' . $endDate->format('Y-m-d')]);
            fputcsv($file, []); // Empty row

            try {
                switch ($type) {
                    case 'revenue':
                        $this->exportRevenueCSV($file, $startDate, $endDate);
                        break;
                    case 'trading':
                        $this->exportTradingCSV($file, $startDate, $endDate);
                        break;
                    case 'users':
                        $this->exportUsersCSV($file, $startDate, $endDate);
                        break;
                    case 'transactions':
                        $this->exportTransactionsCSV($file, $startDate, $endDate);
                        break;
                    case 'overview':
                    default:
                        $this->exportOverviewCSV($file, $startDate, $endDate);
                        break;
                }
            } catch (\Exception $e) {
                fputcsv($file, ['Error', $e->getMessage()]);
                \Log::error('CSV Export Error: ' . $e->getMessage());
            }

            fclose($file);
        }, 200, $headers);
    }

    private function exportRevenueCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Date', 'Revenue', 'Transactions', 'Average Transaction Value']);

        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(fee) as revenue'),
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('AVG(fee) as avg_transaction_value')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        foreach ($revenueData as $row) {
            fputcsv($file, [
                $row->date,
                number_format($row->revenue, 2),
                $row->transaction_count,
                number_format($row->avg_transaction_value, 2),
            ]);
        }
    }

    private function exportTradingCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Trading Pair', 'Total Volume', 'Order Count', 'Average Order Size']);

        $tradingVolume = \App\Models\Order::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', 'filled')
            ->with(['baseCurrency', 'quoteCurrency'])
            ->select(
                'base_currency_id',
                'quote_currency_id',
                DB::raw('SUM(quantity * COALESCE(price, 0)) as total_volume'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('AVG(quantity * COALESCE(price, 0)) as avg_order_size')
            )
            ->groupBy('base_currency_id', 'quote_currency_id')
            ->orderBy('total_volume', 'desc')
            ->get();

        foreach ($tradingVolume as $row) {
            fputcsv($file, [
                ($row->baseCurrency->symbol ?? 'N/A') . '/' . ($row->quoteCurrency->symbol ?? 'N/A'),
                number_format($row->total_volume, 2),
                $row->order_count,
                number_format($row->avg_order_size, 2),
            ]);
        }
    }

    private function exportUsersCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Metric', 'Count']);

        $newRegistrations = \App\Models\User::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->count();

        $activeTraders = \App\Models\Order::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->distinct('user_id')
            ->count('user_id');

        $kycCompleted = \App\Models\UserKyc::where('verification_status', 'approved')
            ->where('verified_at', '>=', $startDate)
            ->where('verified_at', '<=', $endDate)
            ->count();

        fputcsv($file, ['New Registrations', $newRegistrations]);
        fputcsv($file, ['Active Traders', $activeTraders]);
        fputcsv($file, ['KYC Completed', $kycCompleted]);
        fputcsv($file, ['Trader Conversion Rate', $newRegistrations > 0 ? number_format(($activeTraders / $newRegistrations) * 100, 2) . '%' : '0%']);
        fputcsv($file, ['KYC Completion Rate', $newRegistrations > 0 ? number_format(($kycCompleted / $newRegistrations) * 100, 2) . '%' : '0%']);
    }

    private function exportTransactionsCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Date', 'Total Transactions', 'Completed', 'Failed', 'Pending']);

        $transactionData = \App\Models\Transaction::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed'),
                DB::raw('SUM(CASE WHEN status = "failed" THEN 1 ELSE 0 END) as failed'),
                DB::raw('SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        foreach ($transactionData as $row) {
            fputcsv($file, [
                $row->date,
                $row->total,
                $row->completed,
                $row->failed,
                $row->pending,
            ]);
        }
    }

    private function exportOverviewCSV($file, $startDate, $endDate)
    {
        // Summary statistics
        fputcsv($file, ['Summary Statistics']);
        fputcsv($file, []); // Empty row

        $totalRevenue = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->sum('fee');

        $totalTransactions = \App\Models\Transaction::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->count();

        $totalVolume = \App\Models\Order::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', 'filled')
            ->sum(DB::raw('quantity * COALESCE(price, 0)'));

        $newUsers = \App\Models\User::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->count();

        fputcsv($file, ['Total Revenue', number_format($totalRevenue, 2)]);
        fputcsv($file, ['Total Transactions', $totalTransactions]);
        fputcsv($file, ['Trading Volume', number_format($totalVolume, 2)]);
        fputcsv($file, ['New Users', $newUsers]);
        fputcsv($file, []); // Empty row

        // Revenue breakdown
        fputcsv($file, ['Revenue Details']);
        $this->exportRevenueCSV($file, $startDate, $endDate);
        fputcsv($file, []); // Empty row

        // Trading volume breakdown
        fputcsv($file, ['Trading Volume Details']);
        $this->exportTradingCSV($file, $startDate, $endDate);
    }

    private function exportExcel($type, $startDate, $endDate, $filename)
    {
        // For Excel export, we'll use the same CSV approach but with .xlsx extension
        // In production, you'd use a package like PhpSpreadsheet or Laravel Excel
        // For now, return CSV with excel extension (Excel can open CSV files)
        return $this->exportCSV($type, $startDate, $endDate, str_replace('.excel', '.csv', $filename));
    }

    private function exportPDF($type, $startDate, $endDate, $filename)
    {
        // For PDF export, you'd typically use a package like DomPDF or wkhtmltopdf
        // For now, we'll return an error message suggesting CSV export
        return back()->with('info', 'PDF export is coming soon. Please use CSV or Excel format for now.');
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
