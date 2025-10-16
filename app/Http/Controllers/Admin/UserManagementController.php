<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

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

    public function create()
    {
        $cryptocurrencies = \App\Models\Cryptocurrency::where('is_active', true)->get();

        return Inertia::render('Admin/Users/Create', [
            'cryptocurrencies' => $cryptocurrencies,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:active,suspended,pending',
            'is_admin' => 'boolean',

            // Initial wallet credit (optional)
            'credit_wallet' => 'boolean',
            'cryptocurrency_id' => 'required_if:credit_wallet,true|exists:cryptocurrencies,id',
            'credit_amount' => 'required_if:credit_wallet,true|numeric|min:0',
            'credit_notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'location' => $request->location,
                'status' => $request->status,
                'is_admin' => $request->is_admin ?? false,
                'email_verified_at' => now(), // Auto-verify admin-created accounts
            ]);

            // If admin wants to credit wallet during creation
            if ($request->credit_wallet && $request->credit_amount > 0) {
                $cryptocurrency = \App\Models\Cryptocurrency::findOrFail($request->cryptocurrency_id);

                // Create wallet for the user
                $wallet = $user->createWalletIfNotExists($cryptocurrency->id);

                // Create a transaction record
                $transaction = Transaction::create([
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'user_id' => $user->id,
                    'cryptocurrency_id' => $cryptocurrency->id,
                    'type' => 'deposit',
                    'amount' => $request->credit_amount,
                    'fee' => 0,
                    'status' => 'completed',
                    'processed_at' => now(),
                    'notes' => $request->credit_notes ?? 'Initial wallet credit by admin during account creation',
                ]);

                // Credit the wallet
                $wallet->addBalance($request->credit_amount);

                // Notify user
                NotificationService::send(
                    user: $user,
                    type: 'wallet_credited',
                    title: 'Welcome! Wallet Credited',
                    message: "Your account has been created and credited with {$request->credit_amount} {$cryptocurrency->symbol}.",
                    icon: '💰',
                    link: '/wallet',
                    data: [
                        'transaction_id' => $transaction->transaction_id,
                        'amount' => $request->credit_amount,
                        'cryptocurrency' => $cryptocurrency->symbol,
                    ]
                );
            }

            // Send welcome email (optional)
            // Mail::to($user->email)->send(new WelcomeEmail($user, $request->password));

            DB::commit();

            return redirect()->route('admin.users.show', $user)
                ->with('success', 'User account created successfully!' .
                    ($request->credit_wallet ? ' Wallet has been credited.' : ''));
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }

    public function creditWallet(Request $request, User $user)
    {
        $request->validate([
            'cryptocurrency_id' => 'required|exists:cryptocurrencies,id',
            'amount' => 'required|numeric|min:0.00000001',
            'notes' => 'nullable|string|max:500',
            'notify_user' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $cryptocurrency = \App\Models\Cryptocurrency::findOrFail($request->cryptocurrency_id);

            // Get or create wallet
            $wallet = $user->createWalletIfNotExists($cryptocurrency->id);

            // Create transaction record
            $transaction = Transaction::create([
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'user_id' => $user->id,
                'cryptocurrency_id' => $cryptocurrency->id,
                'type' => 'deposit',
                'amount' => $request->amount,
                'fee' => 0,
                'status' => 'completed',
                'processed_at' => now(),
                'notes' => $request->notes ?? 'Manual wallet credit by admin: ' . auth()->user()->name,
            ]);

            // Credit the wallet
            $wallet->addBalance($request->amount);

            // Notify user if requested
            if ($request->notify_user) {
                \App\Services\NotificationService::send(
                    user: $user,
                    type: 'wallet_credited',
                    title: 'Wallet Credited',
                    message: "Your wallet has been credited with {$request->amount} {$cryptocurrency->symbol}.",
                    icon: '💰',
                    link: '/wallet',
                    data: [
                        'transaction_id' => $transaction->transaction_id,
                        'amount' => $request->amount,
                        'cryptocurrency' => $cryptocurrency->symbol,
                    ]
                );
            }


            DB::commit();

            return back()->with('success', "Successfully credited {$request->amount} {$cryptocurrency->symbol} to {$user->name}'s wallet!");
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to credit wallet: ' . $e->getMessage()]);
        }
    }

    /**
     * View user's wallets
     */
    public function wallets(User $user)
    {
        $wallets = $user->wallets()
            ->with('cryptocurrency')
            ->get()
            ->map(function ($wallet) {
                return [
                    'id' => $wallet->id,
                    'cryptocurrency' => $wallet->cryptocurrency,
                    'balance' => $wallet->balance,
                    'locked_balance' => $wallet->locked_balance,
                    'total_balance' => $wallet->balance + $wallet->locked_balance,
                    'value_usd' => ($wallet->balance + $wallet->locked_balance) * ($wallet->cryptocurrency->current_price ?? 0),
                    'updated_at' => $wallet->updated_at,
                ];
            });

        $totalValue = $wallets->sum('value_usd');

        return Inertia::render('Admin/Users/Wallets', [
            'user' => $user,
            'wallets' => $wallets,
            'totalValue' => $totalValue,
            'cryptocurrencies' => \App\Models\Cryptocurrency::where('is_active', true)->get(),
        ]);
    }

    /**
     * Display detailed user information
     */
    public function show(User $user)
    {
        // Load relationships
        $user->load([
            'wallets.cryptocurrency',
            'transactions' => function ($query) {
                $query->latest()->limit(10);
            }
        ]);

        // Calculate user statistics
        $stats = [
            'account_age_days' => (int) floor($user->created_at->diffInDays(now())),
            'email_verified' => !is_null($user->email_verified_at),
            'total_transactions' => $user->transactions()->count(),
            'total_deposits' => $user->transactions()->where('type', 'deposit')->sum('amount'),
            'total_withdrawals' => $user->transactions()->where('type', 'withdrawal')->sum('amount'),
            'total_wallets' => $user->wallets()->count(),
            'total_balance' => $user->getTotalBalance(),
        ];

        // Get active cryptocurrencies for wallet credit modal
        $cryptocurrencies = \App\Models\Cryptocurrency::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'stats' => $stats,
            'cryptocurrencies' => $cryptocurrencies,
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
