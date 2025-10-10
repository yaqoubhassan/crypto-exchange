<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get filter parameters
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $side = $request->input('side', 'all');
        $type = $request->input('type', 'all');
        
        // Build query for orders
        $query = $user->orders()
            ->with(['baseCurrency', 'quoteCurrency']);
        
        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('baseCurrency', function($q) use ($search) {
                      $q->where('symbol', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('quoteCurrency', function($q) use ($search) {
                      $q->where('symbol', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        // Apply side filter
        if ($side !== 'all') {
            $query->where('side', $side);
        }
        
        // Apply type filter
        if ($type !== 'all') {
            $query->where('type', $type);
        }
        
        // Get paginated orders
        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();
        
        // Calculate statistics
        $stats = [
            'total' => $user->orders()->count(),
            'active' => $user->orders()->whereIn('status', ['pending', 'partial'])->count(),
            'completed' => $user->orders()->where('status', 'filled')->count(),
            'cancelled' => $user->orders()->where('status', 'cancelled')->count(),
            'this_week' => $user->orders()
                ->where('created_at', '>=', Carbon::now()->startOfWeek())
                ->count(),
            'this_month' => $user->orders()
                ->whereYear('created_at', Carbon::now()->year)
                ->whereMonth('created_at', Carbon::now()->month)
                ->count(),
        ];
        
        // Get order distribution by side
        $ordersBySide = [
            'buy' => $user->orders()->where('side', 'buy')->count(),
            'sell' => $user->orders()->where('side', 'sell')->count(),
        ];
        
        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'ordersBySide' => $ordersBySide,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'side' => $side,
                'type' => $type,
            ],
        ]);
    }
    
    public function show($id)
    {
        $user = auth()->user();
        
        // Get order with all related data
        $order = $user->orders()
            ->with(['baseCurrency', 'quoteCurrency'])
            ->findOrFail($id);
        
        // Get related transactions for this order
        $transactions = \App\Models\Transaction::where('user_id', $user->id)
            ->where('cryptocurrency_id', $order->base_currency_id)
            ->whereIn('type', ['buy', 'sell'])
            ->where('created_at', '>=', $order->created_at)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        return Inertia::render('Orders/Show', [
            'order' => $order,
            'transactions' => $transactions,
        ]);
    }
    
    public function cancel($id)
    {
        $user = auth()->user();
        
        // Find the order
        $order = $user->orders()->findOrFail($id);
        
        // Check if order can be cancelled
        if (!in_array($order->status, ['pending', 'partial'])) {
            return back()->with('error', 'This order cannot be cancelled.');
        }
        
        // Release locked funds
        if ($order->side === 'buy') {
            // Release locked quote currency (e.g., USD)
            $wallet = $user->wallets()
                ->where('cryptocurrency_id', $order->quote_currency_id)
                ->first();
            
            if ($wallet) {
                $lockedAmount = ($order->quantity - $order->filled_quantity) * 
                              ($order->price ?? $order->base_currency->current_price);
                $wallet->unlockBalance($lockedAmount);
            }
        } else {
            // Release locked base currency (e.g., BTC)
            $wallet = $user->wallets()
                ->where('cryptocurrency_id', $order->base_currency_id)
                ->first();
            
            if ($wallet) {
                $remainingQuantity = $order->quantity - $order->filled_quantity;
                $wallet->unlockBalance($remainingQuantity);
            }
        }
        
        // Update order status
        $order->status = 'cancelled';
        $order->save();
        
        // Create notification
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'order_cancelled',
            'title' => 'Order Cancelled',
            'message' => "Your {$order->side} order for {$order->quantity} {$order->base_currency->symbol} has been cancelled.",
            'data' => json_encode([
                'order_id' => $order->order_id,
                'order_type' => $order->type,
                'side' => $order->side,
            ]),
        ]);
        
        return back()->with('success', 'Order cancelled successfully.');
    }
    
    public function export(Request $request)
    {
        $user = auth()->user();
        
        // Get filter parameters
        $status = $request->input('status', 'all');
        $side = $request->input('side', 'all');
        $type = $request->input('type', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        
        // Build query
        $query = $user->orders()->with(['baseCurrency', 'quoteCurrency']);
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        if ($side !== 'all') {
            $query->where('side', $side);
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
        
        $orders = $query->orderBy('created_at', 'desc')->get();
        
        // Generate CSV
        $filename = 'orders_' . now()->format('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];
        
        $callback = function() use ($orders) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($file, [
                'Order ID',
                'Pair',
                'Type',
                'Side',
                'Quantity',
                'Price',
                'Filled Quantity',
                'Average Price',
                'Status',
                'Time In Force',
                'Created At',
            ]);
            
            // Add order data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_id,
                    ($order->baseCurrency->symbol ?? '') . '/' . ($order->quoteCurrency->symbol ?? ''),
                    $order->type,
                    $order->side,
                    $order->quantity,
                    $order->price ?? 'Market',
                    $order->filled_quantity,
                    $order->average_price ?? 'N/A',
                    $order->status,
                    $order->time_in_force ?? 'GTC',
                    $order->created_at->format('Y-m-d H:i:s'),
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}