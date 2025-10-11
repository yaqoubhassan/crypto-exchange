<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function orders(Request $request)
    {
        $query = \App\Models\Order::with(['user', 'baseCurrency', 'quoteCurrency']);

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('baseCurrency', function ($q) use ($search) {
                        $q->where('symbol', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('quoteCurrency', function ($q) use ($search) {
                        $q->where('symbol', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Apply side filter
        if ($request->has('side') && $request->side !== 'all') {
            $query->where('side', $request->side);
        }

        // Get paginated orders
        $orders = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        // Calculate statistics
        $stats = [
            'total' => \App\Models\Order::count(),
            'pending' => \App\Models\Order::whereIn('status', ['pending', 'partial'])->count(),
            'filled' => \App\Models\Order::where('status', 'filled')->count(),
            'cancelled' => \App\Models\Order::where('status', 'cancelled')->count(),
            'total_volume' => \App\Models\Order::where('status', 'filled')
                ->sum(DB::raw('quantity * COALESCE(price, 0)')),
        ];

        // Get common stats for header
        $commonStats = $this->getCommonStats();

        // ✅ NEW: If order_id is provided in query params, find the order for modal
        $selectedOrder = null;
        if ($request->has('order_id')) {
            $selectedOrder = Order::with(['user', 'baseCurrency', 'quoteCurrency'])
                ->where('order_id', $request->order_id)
                ->first();
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'type', 'side']),
            'stats' => array_merge($stats, $commonStats),
            'selectedOrder' => $selectedOrder, // ✅ Pass selected order to open modal
        ]);
    }

    /**
     * ✅ UPDATED: Redirect to orders page with order_id parameter to open modal
     */
    public function showOrder($id)
    {
        // Try to find by order_id first, then by database id
        $order = Order::where('order_id', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        // Redirect to orders page with order_id as query parameter
        return redirect()->route('admin.orders', ['order_id' => $order->order_id]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,partial,filled,cancelled,expired'
        ]);

        $order = Order::where('order_id', $id)->orWhere('id', $id)->firstOrFail();
        $oldStatus = $order->status;
        $order->status = $request->status;

        // If marking as filled, update filled_quantity
        if ($request->status === 'filled' && $order->filled_quantity < $order->quantity) {
            $order->filled_quantity = $order->quantity;
            $order->average_price = $order->price;
        }

        $order->save();

        // Create notification for user
        $baseCurrencySymbol = $order->baseCurrency ? $order->baseCurrency->symbol : 'Unknown';
        $quoteCurrencySymbol = $order->quoteCurrency ? $order->quoteCurrency->symbol : 'Unknown';

        NotificationService::send(
            user: $order->user,
            type: 'order_status_update',
            title: 'Order Status Updated',
            message: "Your {$order->side} order for {$order->quantity} {$baseCurrencySymbol}/{$quoteCurrencySymbol} status changed from {$oldStatus} to {$request->status}.",
            icon: '📋',
            link: "/orders/{$order->order_id}",
            data: [
                'order_id' => $order->order_id,
                'old_status' => $oldStatus,
                'new_status' => $request->status,
            ]
        );

        // Log admin action
        Log::info('Admin updated order status', [
            'admin_id' => auth()->id(),
            'admin_email' => auth()->user()->email,
            'order_id' => $order->order_id,
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ]);

        return back()->with('success', 'Order status updated successfully.');
    }

    public function approveOrder(Request $request, $id)
    {
        $order = Order::where('order_id', $id)->orWhere('id', $id)->firstOrFail();

        // Validate order can be approved
        if (!in_array($order->status, ['pending', 'partial'])) {
            return back()->withErrors(['message' => 'Only pending or partial orders can be approved.']);
        }

        try {
            DB::beginTransaction();

            $oldStatus = $order->status;

            // Update order to filled
            $order->status = 'filled';
            $order->filled_quantity = $order->quantity;
            $order->average_price = $order->price ?? 0;
            $order->save();

            // Update user's wallet balance based on the order
            if ($order->side === 'buy') {
                // For buy orders: add base currency to wallet
                $wallet = \App\Models\Wallet::firstOrCreate(
                    [
                        'user_id' => $order->user_id,
                        'cryptocurrency_id' => $order->base_currency_id,
                    ],
                    [
                        'balance' => 0,
                        'locked_balance' => 0,
                    ]
                );

                $wallet->balance += $order->quantity;
                $wallet->save();

                // Deduct quote currency (payment)
                $paymentWallet = \App\Models\Wallet::firstOrCreate(
                    [
                        'user_id' => $order->user_id,
                        'cryptocurrency_id' => $order->quote_currency_id,
                    ],
                    [
                        'balance' => 0,
                        'locked_balance' => 0,
                    ]
                );

                $totalCost = $order->quantity * ($order->price ?? 0);
                $paymentWallet->balance -= $totalCost;
                $paymentWallet->save();
            } else {
                // For sell orders: add quote currency to wallet
                $wallet = \App\Models\Wallet::firstOrCreate(
                    [
                        'user_id' => $order->user_id,
                        'cryptocurrency_id' => $order->quote_currency_id,
                    ],
                    [
                        'balance' => 0,
                        'locked_balance' => 0,
                    ]
                );

                $totalRevenue = $order->quantity * ($order->price ?? 0);
                $wallet->balance += $totalRevenue;
                $wallet->save();

                // Deduct base currency (selling)
                $sellingWallet = \App\Models\Wallet::firstOrCreate(
                    [
                        'user_id' => $order->user_id,
                        'cryptocurrency_id' => $order->base_currency_id,
                    ],
                    [
                        'balance' => 0,
                        'locked_balance' => 0,
                    ]
                );

                $sellingWallet->balance -= $order->quantity;
                $sellingWallet->save();
            }

            // Create transaction record
            \App\Models\Transaction::create([
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'user_id' => $order->user_id,
                'cryptocurrency_id' => $order->base_currency_id,
                'type' => $order->side === 'buy' ? 'buy' : 'sell',
                'amount' => $order->quantity,
                'price' => $order->price,
                'total' => $order->quantity * ($order->price ?? 0),
                'fee' => 0, // You can calculate fee here
                'status' => 'completed',
                'description' => "Order #{$order->order_id} approved by admin",
            ]);

            // Create notification
            $baseCurrencySymbol = $order->baseCurrency->symbol ?? 'Unknown';
            $quoteCurrencySymbol = $order->quoteCurrency->symbol ?? 'Unknown';

            NotificationService::send(
                user: $order->user,
                type: 'order_approved',
                title: 'Order Approved',
                message: "Your {$order->side} order for {$order->quantity} {$baseCurrencySymbol}/{$quoteCurrencySymbol} has been approved and is now active.",
                icon: '✅',
                link: "/orders/{$order->order_id}",
                data: [
                    'order_id' => $order->order_id,
                    'approved_by' => auth()->user()->name,
                    'price' => $order->price,
                ]
            );

            // Log admin action
            Log::info('Admin approved order', [
                'admin_id' => auth()->id(),
                'admin_email' => auth()->user()->email,
                'order_id' => $order->order_id,
                'user_id' => $order->user_id,
                'old_status' => $oldStatus,
            ]);

            DB::commit();

            return back()->with('success', 'Order approved and filled successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error approving order', [
                'order_id' => $order->order_id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['message' => 'Failed to approve order: ' . $e->getMessage()]);
        }
    }

    public function rejectOrder(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|min:10|max:500'
        ]);

        $order = Order::where('order_id', $id)->orWhere('id', $id)->firstOrFail();

        // Validate order can be rejected
        if (!in_array($order->status, ['pending', 'partial'])) {
            return back()->withErrors(['message' => 'Only pending or partial orders can be rejected.']);
        }

        try {
            DB::beginTransaction();

            $oldStatus = $order->status;

            // Update order to cancelled
            $order->status = 'cancelled';
            $order->save();

            // Release any locked funds if applicable
            // This depends on your implementation of order locking

            // Create notification with rejection reason
            $baseCurrencySymbol = $order->baseCurrency->symbol ?? 'Unknown';
            $quoteCurrencySymbol = $order->quoteCurrency->symbol ?? 'Unknown';

            NotificationService::send(
                user: $order->user,
                type: 'order_rejected',
                title: 'Order Rejected',
                message: "Your {$order->side} order for {$order->quantity} {$baseCurrencySymbol}/{$quoteCurrencySymbol} has been rejected. Reason: {$request->reason}",
                icon: '❌',
                link: "/orders/{$order->order_id}",
                data: [
                    'order_id' => $order->order_id,
                    'rejected_by' => auth()->user()->name,
                    'reason' => $request->reason,
                ]
            );

            // Log admin action
            Log::info('Admin rejected order', [
                'admin_id' => auth()->id(),
                'admin_email' => auth()->user()->email,
                'order_id' => $order->order_id,
                'user_id' => $order->user_id,
                'reason' => $request->reason,
                'old_status' => $oldStatus,
            ]);

            DB::commit();

            return back()->with('success', 'Order rejected successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error rejecting order', [
                'order_id' => $order->order_id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['message' => 'Failed to reject order: ' . $e->getMessage()]);
        }
    }

    public function exportOrders(Request $request)
    {
        $query = \App\Models\Order::with(['user', 'baseCurrency', 'quoteCurrency']);

        // Apply same filters as index
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('side') && $request->side !== 'all') {
            $query->where('side', $request->side);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'admin_orders_export_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($file, [
                'Order ID',
                'User Name',
                'User Email',
                'Trading Pair',
                'Type',
                'Side',
                'Quantity',
                'Price',
                'Filled Quantity',
                'Average Price',
                'Status',
                'Time In Force',
                'Total Value',
                'Created At',
                'Updated At',
            ]);

            // Add order data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_id,
                    $order->user->name ?? 'N/A',
                    $order->user->email ?? 'N/A',
                    ($order->baseCurrency->symbol ?? '') . '/' . ($order->quoteCurrency->symbol ?? ''),
                    $order->type,
                    $order->side,
                    $order->quantity,
                    $order->price ?? 0,
                    $order->filled_quantity ?? 0,
                    $order->average_price ?? 0,
                    $order->status,
                    $order->time_in_force,
                    ($order->quantity * ($order->price ?? 0)),
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
