<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KycManagementController extends Controller
{
    /**
     * Display a listing of KYC submissions
     */
    public function index(Request $request)
    {
        $query = \App\Models\UserKyc::with('user');

        // Apply filters
        if ($request->status && $request->status !== 'all') {
            $query->where('verification_status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $kycs = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total' => \App\Models\UserKyc::count(),
            'pending' => \App\Models\UserKyc::where('verification_status', 'pending')->count(),
            'approved' => \App\Models\UserKyc::where('verification_status', 'approved')->count(),
            'rejected' => \App\Models\UserKyc::where('verification_status', 'rejected')->count(),
        ];

        // Get common stats for header
        $commonStats = $this->getCommonStats();

        return Inertia::render('Admin/Kyc/Index', [
            'kycs' => $kycs,
            'stats' => array_merge($commonStats, $stats),
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Approve a KYC submission
     */
    public function approve(Request $request, $id)
    {
        $kyc = \App\Models\UserKyc::findOrFail($id);

        if ($kyc->verification_status !== 'pending') {
            return back()->with('error', 'KYC is not pending');
        }

        $kyc->verification_status = 'approved';
        $kyc->verified_at = now();
        $kyc->save();

        // Update user's KYC status
        $kyc->user->update([
            'kyc_status' => 'verified'
        ]);

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

        return back()->with('success', 'KYC approved successfully');
    }

    /**
     * Reject a KYC submission
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $kyc = \App\Models\UserKyc::findOrFail($id);

        if ($kyc->verification_status !== 'pending') {
            return back()->with('error', 'KYC is not pending');
        }

        $kyc->verification_status = 'rejected';
        $kyc->rejection_reason = $request->reason;
        $kyc->save();

        // Update user's KYC status
        $kyc->user->update([
            'kyc_status' => 'rejected'
        ]);

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

        return back()->with('success', 'KYC rejected successfully');
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
