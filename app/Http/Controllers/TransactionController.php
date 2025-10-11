<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get filter parameters
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $type = $request->input('type', 'all');

        // Build query for transactions
        $query = $user->transactions()->with('cryptocurrency');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhere('amount', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('cryptocurrency', function ($q) use ($search) {
                        $q->where('symbol', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Apply type filter
        if ($type !== 'all') {
            $query->where('type', $type);
        }

        // Get paginated transactions
        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Calculate statistics
        $stats = [
            'total' => $user->transactions()->count(),
            'completed' => $user->transactions()->where('status', 'completed')->count(),
            'pending' => $user->transactions()->where('status', 'pending')->count(),
            'failed' => $user->transactions()->where('status', 'failed')->count(),
            'this_month' => $user->transactions()
                ->whereYear('created_at', Carbon::now()->year)
                ->whereMonth('created_at', Carbon::now()->month)
                ->count(),
        ];

        // Get transaction volume by type
        $transactionsByType = $user->transactions()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->pluck('count', 'type');

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'stats' => $stats,
            'transactionsByType' => $transactionsByType,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();

        // Get transaction with all related data
        $transaction = $user->transactions()
            ->with('cryptocurrency')
            ->where('transaction_id', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        // Get related wallet for this cryptocurrency
        $wallet = $user->wallets()
            ->where('cryptocurrency_id', $transaction->cryptocurrency_id)
            ->with('cryptocurrency')
            ->first();

        // Get recent transactions for the same cryptocurrency
        $relatedTransactions = $user->transactions()
            ->where('cryptocurrency_id', $transaction->cryptocurrency_id)
            ->where('id', '!=', $transaction->id)
            ->with('cryptocurrency')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
            'wallet' => $wallet,
            'relatedTransactions' => $relatedTransactions,
        ]);
    }

    public function export(Request $request)
    {
        $user = auth()->user();

        // Get filter parameters
        $status = $request->input('status', 'all');
        $type = $request->input('type', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // Build query
        $query = $user->transactions()->with('cryptocurrency');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'transactions_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($file, [
                'Transaction ID',
                'Type',
                'Currency',
                'Amount',
                'Fee',
                'Status',
                'Description',
                'Date',
            ]);

            // Add transaction data
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->transaction_id,
                    $transaction->type,
                    $transaction->cryptocurrency->symbol ?? 'N/A',
                    $transaction->amount,
                    $transaction->fee,
                    $transaction->status,
                    $transaction->description ?? '',
                    $transaction->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
