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
    Route::get('/profile/view', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/picture', [ProfileController::class, 'uploadProfilePicture'])->name('profile.picture.upload');
    Route::delete('/profile/picture', [ProfileController::class, 'removeProfilePicture'])->name('profile.picture.remove');

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
    Route::get('/transactions/{id}', [App\Http\Controllers\TransactionController::class, 'show'])->name('transactions.show');

    // Order routes (Add these to the authenticated middleware group in web.php)
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{id}/cancel', [App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/orders/export', [App\Http\Controllers\OrderController::class, 'export'])->name('orders.export');

    //Notifications routes
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/clear-all', [App\Http\Controllers\NotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::delete('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

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
        Route::get('/transactions/{id}', [App\Http\Controllers\Admin\AdminController::class, 'showTransaction'])->name('transactions.show');
        Route::post('/transactions/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveTransaction'])->name('transactions.approve');
        Route::post('/transactions/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectTransaction'])->name('transactions.reject');

        // Orders Management
        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'orders'])->name('orders');
        Route::post('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateOrderStatus'])->name('orders.status');
        Route::post('/orders/{id}/approve', [App\Http\Controllers\Admin\OrderController::class, 'approveOrder'])->name('orders.approve');
        Route::post('/orders/{id}/reject', [App\Http\Controllers\Admin\OrderController::class, 'rejectOrder'])->name('orders.reject');
        Route::get('/orders/export', [App\Http\Controllers\Admin\OrderController::class, 'exportOrders'])->name('orders.export');

        // KYC management
        Route::get('/kyc', [App\Http\Controllers\Admin\AdminController::class, 'kyc'])->name('kyc');
        Route::post('/kyc/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveKyc'])->name('kyc.approve');
        Route::post('/kyc/{id}/reject', [App\Http\Controllers\Admin\AdminController::class, 'rejectKyc'])->name('kyc.reject');

        // Cryptocurrency management (for future use)
        Route::get('/cryptocurrencies', [App\Http\Controllers\Admin\AdminController::class, 'cryptocurrencies'])->name('cryptocurrencies');

        // Reports (for future use)
        Route::get('/reports', [App\Http\Controllers\Admin\AdminController::class, 'reports'])->name('reports');
    });

require __DIR__ . '/auth.php';
