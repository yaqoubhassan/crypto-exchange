<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{

    public function dashboard()
    {
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
                ->sum('amount'),
            'pending_kyc' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),
        ];

        $recentTransactions = \App\Models\Transaction::with(['user', 'cryptocurrency'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $recentUsers = \App\Models\User::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'recentUsers' => $recentUsers,
        ]);
    }

    public function users()
    {
        $users = \App\Models\User::with(['kyc'])
            ->withCount(['transactions', 'orders', 'wallets'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function transactions()
    {
        $transactions = \App\Models\Transaction::with(['user', 'cryptocurrency'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
        ]);
    }

    public function orders()
    {
        $orders = \App\Models\Order::with(['user', 'baseCurrency', 'quoteCurrency'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
        ]);
    }

    public function kyc()
    {
        $kycApplications = \App\Models\UserKyc::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/KYC', [
            'applications' => $kycApplications,
        ]);
    }

    public function approveTransaction(Request $request, $id)
    {
        $transaction = \App\Models\Transaction::findOrFail($id);
        
        if ($transaction->status !== 'pending') {
            return response()->json(['error' => 'Transaction is not pending'], 400);
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
                $wallet->deductBalance($transaction->amount);
            }
        }

        return response()->json(['message' => 'Transaction approved successfully']);
    }

    public function rejectTransaction(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $transaction = \App\Models\Transaction::findOrFail($id);
        
        if ($transaction->status !== 'pending') {
            return response()->json(['error' => 'Transaction is not pending'], 400);
        }

        $transaction->status = 'failed';
        $transaction->notes = $request->reason;
        $transaction->processed_at = now();
        $transaction->save();

        return response()->json(['message' => 'Transaction rejected successfully']);
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

        return response()->json(['message' => 'KYC approved successfully']);
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

        return response()->json(['message' => 'KYC rejected successfully']);
    }

    public function toggleUserStatus(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => $user->is_active ? 'User activated successfully' : 'User deactivated successfully',
            'is_active' => $user->is_active,
        ]);
    }
}
