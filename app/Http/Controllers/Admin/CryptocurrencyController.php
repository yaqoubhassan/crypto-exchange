<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cryptocurrency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CryptocurrencyController extends Controller
{
    /**
     * Display a listing of cryptocurrencies
     */
    public function index(Request $request)
    {
        $query = Cryptocurrency::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('symbol', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Type filter
        if ($request->filled('type')) {
            if ($request->type === 'crypto') {
                $query->where('is_fiat', false);
            } elseif ($request->type === 'fiat') {
                $query->where('is_fiat', true);
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'market_cap');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $cryptocurrencies = $query->paginate(15)->withQueryString();

        // Stats
        $stats = [
            'total_cryptocurrencies' => Cryptocurrency::count(),
            'active_cryptocurrencies' => Cryptocurrency::where('is_active', true)->count(),
            'inactive_cryptocurrencies' => Cryptocurrency::where('is_active', false)->count(),
            'total_market_cap' => Cryptocurrency::where('is_active', true)->sum('market_cap'),
            'total_volume_24h' => Cryptocurrency::where('is_active', true)->sum('volume_24h'),
            'crypto_count' => Cryptocurrency::where('is_fiat', false)->count(),
            'fiat_count' => Cryptocurrency::where('is_fiat', true)->count(),
        ];

        return Inertia::render('Admin/Cryptocurrencies/Index', [
            'cryptocurrencies' => $cryptocurrencies,
            'filters' => $request->only(['search', 'status', 'type', 'sort', 'direction']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new cryptocurrency
     */
    public function create()
    {
        return Inertia::render('Admin/Cryptocurrencies/Create');
    }

    /**
     * Store a newly created cryptocurrency
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10|unique:cryptocurrencies,symbol',
            'icon' => 'nullable|image|max:2048',
            'current_price' => 'required|numeric|min:0',
            'market_cap' => 'nullable|numeric|min:0',
            'volume_24h' => 'nullable|numeric|min:0',
            'change_24h' => 'nullable|numeric',
            'is_active' => 'boolean',
            'is_fiat' => 'boolean',
            'decimal_places' => 'required|integer|min:0|max:18',
        ]);

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('cryptocurrencies', 'public');
            $validated['icon'] = $iconPath;
        }

        $cryptocurrency = Cryptocurrency::create($validated);

        return redirect()->route('admin.cryptocurrencies.index')
            ->with('success', "Cryptocurrency {$cryptocurrency->name} created successfully!");
    }

    /**
     * Display the specified cryptocurrency
     */
    public function show(Cryptocurrency $cryptocurrency)
    {
        // Load related data
        $stats = [
            'total_wallets' => $cryptocurrency->wallets()->count(),
            'total_balance' => $cryptocurrency->wallets()->sum('balance'),
            'total_locked' => $cryptocurrency->wallets()->sum('locked_balance'),
            'total_transactions' => $cryptocurrency->transactions()->count(),
            'total_orders' => DB::table('orders')
                ->where('base_currency_id', $cryptocurrency->id)
                ->orWhere('quote_currency_id', $cryptocurrency->id)
                ->count(),
            'volume_24h' => $cryptocurrency->transactions()
                ->where('created_at', '>=', now()->subDay())
                ->whereIn('type', ['buy', 'sell'])
                ->sum(DB::raw('amount * COALESCE(price, 0)')),
        ];

        // Recent transactions
        $recentTransactions = $cryptocurrency->transactions()
            ->with('user:id,name,email')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Cryptocurrencies/Show', [
            'cryptocurrency' => $cryptocurrency,
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * Show the form for editing the specified cryptocurrency
     */
    public function edit(Cryptocurrency $cryptocurrency)
    {
        return Inertia::render('Admin/Cryptocurrencies/Edit', [
            'cryptocurrency' => $cryptocurrency,
        ]);
    }

    /**
     * Update the specified cryptocurrency
     */
    public function update(Request $request, Cryptocurrency $cryptocurrency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10|unique:cryptocurrencies,symbol,' . $cryptocurrency->id,
            'icon' => 'nullable|image|max:2048',
            'current_price' => 'required|numeric|min:0',
            'market_cap' => 'nullable|numeric|min:0',
            'volume_24h' => 'nullable|numeric|min:0',
            'change_24h' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
            'is_fiat' => 'sometimes|boolean',
            'decimal_places' => 'required|integer|min:0|max:18',
        ]);

        // Handle boolean values
        $validated['is_active'] = $request->has('is_active') ? (bool)$request->is_active : $cryptocurrency->is_active;
        $validated['is_fiat'] = $request->has('is_fiat') ? (bool)$request->is_fiat : $cryptocurrency->is_fiat;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon
            if ($cryptocurrency->icon) {
                Storage::disk('public')->delete($cryptocurrency->icon);
            }
            $iconPath = $request->file('icon')->store('cryptocurrencies', 'public');
            $validated['icon'] = $iconPath;
        }

        $cryptocurrency->update($validated);

        return back()->with('success', "Cryptocurrency {$cryptocurrency->name} updated successfully!");
    }

    /**
     * Toggle cryptocurrency status
     */
    public function toggleStatus(Cryptocurrency $cryptocurrency)
    {
        $cryptocurrency->update([
            'is_active' => !$cryptocurrency->is_active,
        ]);

        $status = $cryptocurrency->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Cryptocurrency {$cryptocurrency->name} has been {$status}!");
    }

    /**
     * Update cryptocurrency prices (bulk update)
     */
    public function updatePrices(Request $request)
    {
        $validated = $request->validate([
            'prices' => 'required|array',
            'prices.*.id' => 'required|exists:cryptocurrencies,id',
            'prices.*.current_price' => 'required|numeric|min:0',
            'prices.*.change_24h' => 'nullable|numeric',
            'prices.*.volume_24h' => 'nullable|numeric|min:0',
            'prices.*.market_cap' => 'nullable|numeric|min:0',
        ]);

        foreach ($validated['prices'] as $priceData) {
            Cryptocurrency::where('id', $priceData['id'])->update([
                'current_price' => $priceData['current_price'],
                'change_24h' => $priceData['change_24h'] ?? null,
                'volume_24h' => $priceData['volume_24h'] ?? null,
                'market_cap' => $priceData['market_cap'] ?? null,
            ]);
        }

        return back()->with('success', 'Cryptocurrency prices updated successfully!');
    }

    /**
     * Bulk toggle status
     */
    public function bulkToggleStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:cryptocurrencies,id',
            'is_active' => 'required|boolean',
        ]);

        Cryptocurrency::whereIn('id', $validated['ids'])->update([
            'is_active' => $validated['is_active'],
        ]);

        $status = $validated['is_active'] ? 'activated' : 'deactivated';
        $count = count($validated['ids']);

        return back()->with('success', "{$count} cryptocurrencies have been {$status}!");
    }

    /**
     * Remove the specified cryptocurrency
     */
    public function destroy(Cryptocurrency $cryptocurrency)
    {
        // Check if cryptocurrency has any wallets or transactions
        $walletCount = $cryptocurrency->wallets()->count();
        $transactionCount = $cryptocurrency->transactions()->count();

        if ($walletCount > 0 || $transactionCount > 0) {
            return back()->with('error', 'Cannot delete cryptocurrency with existing wallets or transactions. Consider deactivating it instead.');
        }

        // Delete icon if exists
        if ($cryptocurrency->icon) {
            Storage::disk('public')->delete($cryptocurrency->icon);
        }

        $cryptocurrency->delete();

        return redirect()->route('admin.cryptocurrencies.index')
            ->with('success', 'Cryptocurrency deleted successfully!');
    }

    /**
     * Export cryptocurrencies data
     */
    public function export(Request $request)
    {
        $query = Cryptocurrency::query();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('symbol', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $cryptocurrencies = $query->orderBy('market_cap', 'desc')->get();

        $filename = 'cryptocurrencies_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($cryptocurrencies) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'ID',
                'Name',
                'Symbol',
                'Current Price',
                'Market Cap',
                'Volume 24h',
                'Change 24h',
                'Status',
                'Type',
                'Decimal Places'
            ]);

            // CSV rows
            foreach ($cryptocurrencies as $crypto) {
                fputcsv($file, [
                    $crypto->id,
                    $crypto->name,
                    $crypto->symbol,
                    $crypto->current_price,
                    $crypto->market_cap ?? 0,
                    $crypto->volume_24h ?? 0,
                    $crypto->change_24h ?? 0,
                    $crypto->is_active ? 'Active' : 'Inactive',
                    $crypto->is_fiat ? 'Fiat' : 'Crypto',
                    $crypto->decimal_places,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
