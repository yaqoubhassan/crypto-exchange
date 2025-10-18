<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the reports page
     */
    public function index(Request $request)
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

        // Get revenue data for chart (grouped by date)
        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(fee) as revenue'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'revenue' => (float) $item->revenue,
                    'transaction_count' => $item->transaction_count,
                ];
            });

        // Get trading volume by trading pair
        $tradingVolume = \App\Models\Order::with(['baseCurrency', 'quoteCurrency'])
            ->where('status', 'filled')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                'base_currency_id',
                'quote_currency_id',
                DB::raw('SUM(quantity * COALESCE(price, 0)) as total_volume'),
                DB::raw('COUNT(*) as order_count')
            )
            ->groupBy('base_currency_id', 'quote_currency_id')
            ->get()
            ->map(function ($item) {
                return [
                    'base_symbol' => $item->baseCurrency->symbol ?? 'N/A',
                    'quote_symbol' => $item->quoteCurrency->symbol ?? 'N/A',
                    'total_volume' => (float) $item->total_volume,
                    'order_count' => $item->order_count,
                ];
            });

        // Get user activity data (registrations by date)
        $userActivity = \App\Models\User::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            });

        // Get common stats for header
        $commonStats = $this->getCommonStats();

        return Inertia::render('Admin/Reports/Index', [
            'revenueData' => $revenueData,
            'tradingVolume' => $tradingVolume,
            'userActivity' => $userActivity,
            'stats' => $commonStats,
            'filters' => [
                'range' => $range,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Export report data
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:revenue,trading,users,transactions,overview',
            'format' => 'required|in:csv,excel,pdf',
            'range' => 'nullable|string',
        ]);

        $type = $request->type;
        $format = $request->format;
        $range = $request->range ?? '30days';

        // Determine date range
        if ($range === 'custom' && $request->start_date && $request->end_date) {
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate = \Carbon\Carbon::parse($request->end_date);
        } else {
            // Use predefined ranges
            $endDate = now();
            switch ($range) {
                case '7days':
                    $startDate = now()->subDays(7);
                    break;
                case '90days':
                    $startDate = now()->subDays(90);
                    break;
                case 'ytd':
                    $startDate = now()->startOfYear();
                    break;
                case '30days':
                default:
                    $startDate = now()->subDays(30);
                    break;
            }
        }

        $filename = "{$type}_report_{$startDate->format('Y-m-d')}_to_{$endDate->format('Y-m-d')}.{$format}";

        switch ($format) {
            case 'csv':
                return $this->exportCSV($type, $startDate, $endDate, $filename);
            case 'excel':
                return $this->exportExcel($type, $startDate, $endDate, $filename);
            case 'pdf':
                return $this->exportPDF($type, $startDate, $endDate, $filename);
            default:
                return back()->with('error', 'Invalid export format');
        }
    }

    /**
     * Export data as CSV
     */
    private function exportCSV($type, $startDate, $endDate, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($type, $startDate, $endDate) {
            $file = fopen('php://output', 'w');

            // Add BOM for UTF-8
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
                Log::error('CSV Export Error: ' . $e->getMessage());
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export revenue data to CSV
     */
    private function exportRevenueCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Date', 'Revenue', 'Transactions', 'Avg Per Transaction']);

        $revenueData = \App\Models\Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(fee) as revenue'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        foreach ($revenueData as $row) {
            fputcsv($file, [
                $row->date,
                number_format($row->revenue, 2),
                $row->transaction_count,
                $row->transaction_count > 0 ? number_format($row->revenue / $row->transaction_count, 2) : '0.00',
            ]);
        }
    }

    /**
     * Export trading data to CSV
     */
    private function exportTradingCSV($file, $startDate, $endDate)
    {
        fputcsv($file, ['Trading Pair', 'Total Volume', 'Orders', 'Avg Order Size']);

        $tradingData = \App\Models\Order::with(['baseCurrency', 'quoteCurrency'])
            ->where('status', 'filled')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->select(
                'base_currency_id',
                'quote_currency_id',
                DB::raw('SUM(quantity * COALESCE(price, 0)) as total_volume'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('AVG(quantity * COALESCE(price, 0)) as avg_order_size')
            )
            ->groupBy('base_currency_id', 'quote_currency_id')
            ->get();

        foreach ($tradingData as $row) {
            fputcsv($file, [
                ($row->baseCurrency->symbol ?? 'N/A') . '/' . ($row->quoteCurrency->symbol ?? 'N/A'),
                number_format($row->total_volume, 2),
                $row->order_count,
                number_format($row->avg_order_size, 2),
            ]);
        }
    }

    /**
     * Export users data to CSV
     */
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

    /**
     * Export transactions data to CSV
     */
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

    /**
     * Export overview data to CSV
     */
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

    /**
     * Export data as Excel
     */
    private function exportExcel($type, $startDate, $endDate, $filename)
    {
        // For Excel export, we'll use the same CSV approach but with .xlsx extension
        // In production, you'd use a package like PhpSpreadsheet or Laravel Excel
        // For now, return CSV with excel extension (Excel can open CSV files)
        return $this->exportCSV($type, $startDate, $endDate, str_replace('.excel', '.csv', $filename));
    }

    /**
     * Export data as PDF
     */
    private function exportPDF($type, $startDate, $endDate, $filename)
    {
        // For PDF export, you'd typically use a package like DomPDF or wkhtmltopdf
        // For now, we'll return an error message suggesting CSV export
        return back()->with('info', 'PDF export is coming soon. Please use CSV or Excel format for now.');
    }

    /**
     * Get common statistics for header
     */
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
