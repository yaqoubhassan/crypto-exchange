<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionManagementController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
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

    /**
     * Display the specified transaction
     */
    public function show($id)
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

    /**
     * Approve a pending transaction
     */
    public function approve(Request $request, $id)
    {
        $transaction = \App\Models\Transaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending transactions can be approved']);
        }

        $transaction->status = 'completed';
        $transaction->processed_at = now();
        $transaction->save();

        // Process the transaction based on type
        $user = $transaction->user;
        $wallet = $user->wallets()->where('cryptocurrency_id', $transaction->cryptocurrency_id)->first();

        if ($wallet) {
            if ($transaction->type === 'deposit') {
                $wallet->addBalance($transaction->amount);
            } elseif ($transaction->type === 'withdrawal') {
                // Already deducted on withdrawal request
                // No additional action needed
            }
        }

        // Send real-time notification to user
        NotificationService::send(
            user: $user,
            type: 'transaction_approved',
            title: 'Transaction Approved',
            message: "Your {$transaction->type} of {$transaction->amount} {$transaction->cryptocurrency->symbol} has been approved and completed successfully.",
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

    /**
     * Reject a pending transaction
     */
    public function reject(Request $request, $id)
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
