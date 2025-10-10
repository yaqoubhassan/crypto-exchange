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
                'active_users' => User::where('status', 'active')->count(),
                'admin_users' => User::where('is_admin', true)->count(),
            ]
        ]);
    }

    /**
     * Display detailed user information
     */
    public function show(User $user)
    {
        // Load relationships
        $user->load([
            'wallets', // Load all wallets
            'transactions' => function ($query) {
                $query->latest()->limit(10);
            }
        ]);

        // Calculate user statistics
        $stats = [
            'account_age_days' => $user->created_at->diffInDays(now()),
            'email_verified' => !is_null($user->email_verified_at),
            'total_transactions' => $user->transactions()->count(),
            'total_deposits' => $user->transactions()->where('type', 'deposit')->sum('amount'),
            'total_withdrawals' => $user->transactions()->where('type', 'withdrawal')->sum('amount'),
            'total_wallets' => $user->wallets()->count(),
            'total_balance' => $user->getTotalBalance(), // Total across all wallets
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
            'status' => 'required|in:active,suspended,banned,pending',
            'reason' => 'nullable|string|max:500',
        ]);

        $user->update([
            'status' => $request->status,
        ]);

        // Log the status change (you can create an activity log table for this)
        // ActivityLog::create([...]);

        return back()->with('success', "User status updated to {$request->status} successfully!");
    }

    /**
     * Toggle admin status
     */
    public function toggleAdmin(User $user)
    {
        // Prevent self-demotion
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot change your own admin status!');
        }

        $user->update([
            'is_admin' => !$user->is_admin,
        ]);

        $status = $user->is_admin ? 'granted' : 'revoked';
        return back()->with('success', "Admin privileges {$status} for {$user->name} successfully!");
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

        // Optionally notify the user via email
        // $user->notify(new PasswordResetByAdmin());

        return back()->with('success', 'User password has been reset successfully!');
    }

    /**
     * Bulk update user status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'status' => 'required|in:active,suspended,banned',
        ]);

        User::whereIn('id', $request->user_ids)->update([
            'status' => $request->status,
        ]);

        return back()->with('success', count($request->user_ids) . ' users updated successfully!');
    }

    /**
     * Export users data
     */
    public function export(Request $request)
    {
        $query = User::query();

        // Check if exporting specific users (bulk action)
        if ($request->filled('user_ids')) {
            $userIds = explode(',', $request->user_ids);
            $query->whereIn('id', $userIds);
        } else {
            // Apply filters for full export
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('kyc_status')) {
                $query->where('kyc_status', $request->kyc_status);
            }

            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
        }

        $users = $query->get();

        // Generate CSV
        $filename = 'users_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($users) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, ['ID', 'Name', 'Email', 'Phone', 'Status', 'KYC Status', 'Admin', 'Email Verified', 'Location', 'Created At', 'Last Login']);

            // CSV rows
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone ?? 'N/A',
                    $user->status,
                    $user->kyc_status,
                    $user->is_admin ? 'Yes' : 'No',
                    $user->email_verified_at ? 'Yes' : 'No',
                    $user->location ?? 'N/A',
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->last_login_at ? $user->last_login_at->format('Y-m-d H:i:s') : 'Never',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Delete user account (soft delete)
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot delete your own account!');
        }

        // Check if user has active transactions or balance
        $wallet = $user->wallet;
        if ($wallet && $wallet->balance > 0) {
            return back()->with('error', 'Cannot delete user with active wallet balance!');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User account deleted successfully!');
    }
}
