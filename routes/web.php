<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// User Dashboard - Updated to use DashboardController
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Trading routes
    Route::get('/trading', [App\Http\Controllers\TradingController::class, 'index'])->name('trading.index');
    Route::get('/api/market/{symbol}', [App\Http\Controllers\TradingController::class, 'getMarketData'])->name('trading.market');
    Route::post('/api/orders', [App\Http\Controllers\TradingController::class, 'placeOrder'])->name('trading.order');
    
    // Wallet routes
    Route::get('/wallet', [App\Http\Controllers\WalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/deposit', [App\Http\Controllers\WalletController::class, 'deposit'])->name('wallet.deposit');
    Route::post('/wallet/withdraw', [App\Http\Controllers\WalletController::class, 'withdraw'])->name('wallet.withdraw');
    
    // Transaction routes
    Route::get('/transactions', [App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    
    // Security routes
    Route::get('/security', function () {
        return Inertia::render('Security/Index', [
            'twoFactorEnabled' => auth()->user()->two_factor_enabled ?? false,
        ]);
    })->name('security.index');
});

// Admin routes
Route::middleware(['auth', App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');
        
        // User management
        Route::get('/users', [App\Http\Controllers\Admin\AdminController::class, 'users'])->name('users');
        Route::post('/users/{id}/toggle-status', [App\Http\Controllers\Admin\AdminController::class, 'toggleUserStatus'])->name('users.toggle-status');
        
        // Transaction management
        Route::get('/transactions', [App\Http\Controllers\Admin\AdminController::class, 'transactions'])->name('transactions');
        Route::post('/transactions/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveTransaction'])->name('transactions.approve');
        Route::post('/transactions/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectTransaction'])->name('transactions.reject');
        
        // Order management
        Route::get('/orders', [App\Http\Controllers\Admin\AdminController::class, 'orders'])->name('orders');
        
        // KYC management
        Route::get('/kyc', [App\Http\Controllers\Admin\AdminController::class, 'kyc'])->name('kyc');
        Route::post('/kyc/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveKyc'])->name('kyc.approve');
        Route::post('/kyc/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectKyc'])->name('kyc.reject');
        
        // Cryptocurrency management (for future use)
        Route::get('/cryptocurrencies', [App\Http\Controllers\Admin\AdminController::class, 'cryptocurrencies'])->name('cryptocurrencies');
        
        // Reports (for future use)
        Route::get('/reports', [App\Http\Controllers\Admin\AdminController::class, 'reports'])->name('reports');
    });

require __DIR__.'/auth.php';