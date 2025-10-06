<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
Route::middleware(['auth', App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');
    
    // User management
    Route::get('/users', [App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/status', [App\Http\Controllers\Admin\UserManagementController::class, 'updateStatus'])->name('users.update-status');
    Route::post('/users/{user}/toggle-admin', [App\Http\Controllers\Admin\UserManagementController::class, 'toggleAdmin'])->name('users.toggle-admin');
    Route::post('/users/{user}/reset-password', [App\Http\Controllers\Admin\UserManagementController::class, 'resetPassword'])->name('users.reset-password');
    Route::get('/users/export', [App\Http\Controllers\Admin\UserManagementController::class, 'export'])->name('users.export');
    
    // Legacy user routes for compatibility
    Route::get('/users', [App\Http\Controllers\Admin\AdminController::class, 'users'])->name('users');
    Route::post('/users/{id}/toggle-status', [App\Http\Controllers\Admin\AdminController::class, 'toggleUserStatus'])->name('users.toggle-status');
    
    // Transaction management
    Route::get('/transactions', [App\Http\Controllers\Admin\AdminController::class, 'transactions'])->name('transactions');
    Route::post('/transactions/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveTransaction'])->name('transactions.approve');
    Route::post('/transactions/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectTransaction'])->name('transactions.reject');
    
    // KYC management
    Route::get('/kyc', [App\Http\Controllers\Admin\KycController::class, 'index'])->name('kyc.index');
    Route::get('/kyc/{application}', [App\Http\Controllers\Admin\KycController::class, 'show'])->name('kyc.show');
    Route::post('/kyc/{application}/approve', [App\Http\Controllers\Admin\KycController::class, 'approve'])->name('kyc.approve');
    Route::post('/kyc/{application}/reject', [App\Http\Controllers\Admin\KycController::class, 'reject'])->name('kyc.reject');
    
    // Legacy KYC routes for compatibility
    Route::get('/kyc', [App\Http\Controllers\Admin\AdminController::class, 'kyc'])->name('kyc');
    Route::post('/kyc/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveKyc'])->name('kyc.approve');
    Route::post('/kyc/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectKyc'])->name('kyc.reject');
    
    // Orders management
    Route::get('/orders', [App\Http\Controllers\Admin\AdminController::class, 'orders'])->name('orders');
    
    // Reports
    Route::get('/reports', [App\Http\Controllers\Admin\ReportsController::class, 'index'])->name('reports.index');
    Route::get('/reports/trading', [App\Http\Controllers\Admin\ReportsController::class, 'trading'])->name('reports.trading');
    Route::get('/reports/revenue', [App\Http\Controllers\Admin\ReportsController::class, 'revenue'])->name('reports.revenue');
    Route::get('/reports/users', [App\Http\Controllers\Admin\ReportsController::class, 'users'])->name('reports.users');
    Route::get('/reports/security', [App\Http\Controllers\Admin\ReportsController::class, 'security'])->name('reports.security');
});

require __DIR__.'/auth.php';
