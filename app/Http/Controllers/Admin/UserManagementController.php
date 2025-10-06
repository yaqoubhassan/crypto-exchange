<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users with advanced filtering and search
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // KYC status filter
        if ($request->filled('kyc_status')) {
            $query->where('kyc_status', $request->kyc_status);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'kyc_status', 'date_from', 'date_to']),
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('is_admin', false)->count(),
                'admin_users' => User::where('is_admin', true)->count(),
            ]
        ]);
    }

    /**
     * Display detailed user information
     */
    public function show(User $user)
    {
        // Calculate user statistics
        $stats = [
            'account_age_days' => $user->created_at->diffInDays(now()),
            'email_verified' => !is_null($user->email_verified_at),
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * Update user status (activate/suspend/ban)
     */
    public function updateStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:active,suspended,banned',
            'reason' => 'nullable|string|max:500',
        ]);

        $user->update([
            'status' => $request->status,
        ]);

        return back()->with('success', "User status updated to {$request->status}");
    }

    /**
     * Toggle admin status
     */
    public function toggleAdmin(User $user)
    {
        $user->update([
            'is_admin' => !$user->is_admin,
        ]);

        $status = $user->is_admin ? 'granted' : 'revoked';
        return back()->with('success', "Admin privileges {$status} for user");
    }

    /**
     * Reset user password (admin action)
     */
    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'User password has been reset');
    }
}