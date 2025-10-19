<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get user's wallets with cryptocurrency details
        $wallets = $user->wallets()->with('cryptocurrency')->get();

        // Calculate total portfolio value in USD
        $totalPortfolioValue = $wallets->sum(function ($wallet) {
            return $wallet->balance * $wallet->cryptocurrency->current_price;
        });

        // Get recent transactions
        $recentTransactions = $user->transactions()
            ->with('cryptocurrency')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get active orders
        $activeOrders = $user->orders()
            ->with(['baseCurrency', 'quoteCurrency'])
            ->whereIn('status', ['pending', 'partial'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get order history
        $orderHistory = $user->orders()
            ->with(['baseCurrency', 'quoteCurrency'])
            ->whereIn('status', ['filled', 'cancelled'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Calculate statistics
        $stats = [
            'total_portfolio_value' => $totalPortfolioValue,
            'total_transactions' => $user->transactions()->count(),
            'completed_transactions' => $user->transactions()->where('status', 'completed')->count(),
            'pending_transactions' => $user->transactions()->where('status', 'pending')->count(),
            'total_orders' => $user->orders()->count(),
            'active_orders' => $user->orders()->whereIn('status', ['pending', 'partial'])->count(),
            'completed_orders' => $user->orders()->where('status', 'filled')->count(),
            'available_wallets' => $wallets->count(),
        ];

        // Get portfolio distribution
        $portfolioDistribution = $wallets->map(function ($wallet) use ($totalPortfolioValue) {
            $value = $wallet->balance * $wallet->cryptocurrency->current_price;
            return [
                'name' => $wallet->cryptocurrency->name,
                'symbol' => $wallet->cryptocurrency->symbol,
                'balance' => $wallet->balance,
                'total_balance' => $wallet->balance,
                'value' => $value,
                'percentage' => $totalPortfolioValue > 0 ? ($value / $totalPortfolioValue) * 100 : 0,
                'current_price' => $wallet->cryptocurrency->current_price,
                'change_24h' => $wallet->cryptocurrency->change_24h,
            ];
        })->filter(function ($item) {
            return $item['total_balance'] > 0;
        })->sortByDesc('value')->values();

        // Get top cryptocurrencies by market cap
        $topCryptos = \App\Models\Cryptocurrency::where('is_fiat', false)
            ->where('is_active', true)
            ->orderBy('market_cap', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'wallets' => $wallets,
            'recentTransactions' => $recentTransactions,
            'activeOrders' => $activeOrders,
            'orderHistory' => $orderHistory,
            'portfolioDistribution' => $portfolioDistribution,
            'topCryptos' => $topCryptos,
            'wallets' => $wallets,
        ]);
    }
}
