<?php

use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\DashboardController;
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

// User Dashboard - Updated to use DashboardController
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'user.only'])
    ->name('dashboard');

Route::middleware(['auth', 'user.only'])->group(function () {
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
    Route::get('/notifications/{id}/click', [App\Http\Controllers\NotificationController::class, 'handleClick'])->name('notifications.click');
    Route::post('/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/clear-all', [App\Http\Controllers\NotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::delete('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Security page
    Route::get('/security', [App\Http\Controllers\SecurityController::class, 'index'])->name('security.index');
    Route::patch('/security/password', [App\Http\Controllers\SecurityController::class, 'updatePassword'])->name('security.password.update');

    // Two-Factor Authentication for normal users
    Route::post('/security/two-factor/enable', [App\Http\Controllers\SecurityController::class, 'enableTwoFactor'])->name('security.two-factor.enable');
    Route::post('/security/two-factor/verify', [App\Http\Controllers\SecurityController::class, 'verifyTwoFactor'])->name('security.two-factor.verify');
    Route::post('/security/two-factor/disable', [App\Http\Controllers\SecurityController::class, 'disableTwoFactor'])->name('security.two-factor.disable');

    // Session Management
    Route::post('/security/revoke-session/{sessionId}', [App\Http\Controllers\SecurityController::class, 'revokeSession'])->name('security.revoke-session');
    Route::post('/security/logout-others', [App\Http\Controllers\SecurityController::class, 'logoutOtherSessions'])->name('security.logout-others');

    // Settings routes
    Route::get('/settings', [App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/notifications', [App\Http\Controllers\SettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::post('/settings/display', [App\Http\Controllers\SettingsController::class, 'updateDisplay'])->name('settings.display');

    // Support routes
    Route::get('/help', [App\Http\Controllers\SupportController::class, 'help'])->name('help');
    Route::get('/support', [App\Http\Controllers\SupportController::class, 'contact'])->name('support');
    Route::post('/support', [App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
    Route::get('/support/{id}', [App\Http\Controllers\SupportController::class, 'show'])->name('support.show');
    Route::post('/support/{id}/close', [App\Http\Controllers\SupportController::class, 'close'])->name('support.close');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard - UNCHANGED
    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');

    // Admin Profile Routes - UNCHANGED
    Route::get('/profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/picture', [AdminProfileController::class, 'uploadProfilePicture'])->name('profile.picture.upload');
    Route::delete('/profile/picture', [AdminProfileController::class, 'removeProfilePicture'])->name('profile.picture.remove');
    Route::patch('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::get('/profile/activity', [AdminProfileController::class, 'activityLog'])->name('profile.activity');

    // Admin Security Routes - UNCHANGED
    Route::get('/security', [App\Http\Controllers\Admin\AdminSecurityController::class, 'index'])->name('security.index');
    Route::patch('/security/password', [App\Http\Controllers\Admin\AdminSecurityController::class, 'updatePassword'])->name('security.password.update');
    Route::post('/security/two-factor/enable', [App\Http\Controllers\Admin\AdminSecurityController::class, 'enableTwoFactor'])->name('security.two-factor.enable');
    Route::post('/security/two-factor/verify', [App\Http\Controllers\Admin\AdminSecurityController::class, 'verifyTwoFactor'])->name('security.two-factor.verify');
    Route::post('/security/two-factor/disable', [App\Http\Controllers\Admin\AdminSecurityController::class, 'disableTwoFactor'])->name('security.two-factor.disable');
    Route::post('/security/revoke-session/{sessionId}', [App\Http\Controllers\Admin\AdminSecurityController::class, 'revokeSession'])->name('security.revoke-session');
    Route::post('/security/logout-others', [App\Http\Controllers\Admin\AdminSecurityController::class, 'logoutOtherSessions'])->name('security.logout-others');

    // User management - UNCHANGED
    Route::get('/users', [App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('users.index');
    Route::post('/users', [App\Http\Controllers\Admin\UserManagementController::class, 'store'])->name('users.store');
    Route::get('/users/create', [App\Http\Controllers\Admin\UserManagementController::class, 'create'])->name('users.create');
    Route::get('/users/export', [App\Http\Controllers\Admin\UserManagementController::class, 'export'])->name('users.export');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/status', [App\Http\Controllers\Admin\UserManagementController::class, 'updateStatus'])->name('users.status');
    Route::post('/users/{user}/toggle-admin', [App\Http\Controllers\Admin\UserManagementController::class, 'toggleAdmin'])->name('users.toggle-admin');
    Route::post('/users/{user}/reset-password', [App\Http\Controllers\Admin\UserManagementController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('/users/bulk/status', [App\Http\Controllers\Admin\UserManagementController::class, 'bulkUpdateStatus'])->name('users.bulk-status');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/credit-wallet', [App\Http\Controllers\Admin\UserManagementController::class, 'creditWallet'])->name('users.credit-wallet');
    Route::get('/users/{user}/wallets', [App\Http\Controllers\Admin\UserManagementController::class, 'wallets'])->name('users.wallets');

    // Transaction management - REFACTORED ✅
    // CHANGED: Now uses TransactionManagementController instead of AdminController
    Route::get('/transactions', [App\Http\Controllers\Admin\TransactionManagementController::class, 'index'])->name('transactions');
    Route::get('/transactions/{id}', [App\Http\Controllers\Admin\TransactionManagementController::class, 'show'])->name('transactions.show');
    Route::post('/transactions/{id}/approve', [App\Http\Controllers\Admin\TransactionManagementController::class, 'approve'])->name('transactions.approve');
    Route::post('/transactions/{id}/reject', [App\Http\Controllers\Admin\TransactionManagementController::class, 'reject'])->name('transactions.reject');

    // Orders Management - UNCHANGED
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'orders'])->name('orders');
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'showOrder'])->name('orders.show');
    Route::post('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateOrderStatus'])->name('orders.status');
    Route::post('/orders/{id}/approve', [App\Http\Controllers\Admin\OrderController::class, 'approveOrder'])->name('orders.approve');
    Route::post('/orders/{id}/reject', [App\Http\Controllers\Admin\OrderController::class, 'rejectOrder'])->name('orders.reject');
    Route::get('/orders/export', [App\Http\Controllers\Admin\OrderController::class, 'exportOrders'])->name('orders.export');

    Route::get('/notifications/{id}/click', [App\Http\Controllers\NotificationController::class, 'handleClick'])->name('notifications.click');

    // KYC management - REFACTORED ✅
    // CHANGED: Now uses KycManagementController instead of AdminController
    Route::get('/kyc', [App\Http\Controllers\Admin\KycManagementController::class, 'index'])->name('kyc');
    Route::post('/kyc/{id}/approve', [App\Http\Controllers\Admin\KycManagementController::class, 'approve'])->name('kyc.approve');
    Route::post('/kyc/{id}/reject', [App\Http\Controllers\Admin\KycManagementController::class, 'reject'])->name('kyc.reject');

    // Cryptocurrency management - UNCHANGED
    Route::get('/cryptocurrencies', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'index'])->name('cryptocurrencies.index');
    Route::get('/cryptocurrencies/create', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'create'])->name('cryptocurrencies.create');
    Route::get('/cryptocurrencies/export', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'export'])->name('cryptocurrencies.export');
    Route::post('/cryptocurrencies', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'store'])->name('cryptocurrencies.store');
    Route::post('/cryptocurrencies/bulk-toggle', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'bulkToggleStatus'])->name('cryptocurrencies.bulk-toggle');
    Route::post('/cryptocurrencies/update-prices', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'updatePrices'])->name('cryptocurrencies.update-prices');
    Route::get('/cryptocurrencies/{cryptocurrency}', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'show'])->name('cryptocurrencies.show');
    Route::get('/cryptocurrencies/{cryptocurrency}/edit', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'edit'])->name('cryptocurrencies.edit');
    Route::post('/cryptocurrencies/{cryptocurrency}', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'update'])->name('cryptocurrencies.update');
    Route::post('/cryptocurrencies/{cryptocurrency}/toggle-status', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'toggleStatus'])->name('cryptocurrencies.toggle-status');
    Route::delete('/cryptocurrencies/{cryptocurrency}', [App\Http\Controllers\Admin\CryptocurrencyController::class, 'destroy'])->name('cryptocurrencies.destroy');

    // Reports - REFACTORED ✅
    // CHANGED: Now uses ReportController instead of AdminController
    Route::get('/reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');
    Route::post('/reports/export', [App\Http\Controllers\Admin\ReportController::class, 'export'])->name('reports.export');

    // Support management - UNCHANGED
    Route::get('/support', [App\Http\Controllers\Admin\SupportController::class, 'index'])->name('support.index');
    Route::get('/support/{id}', [App\Http\Controllers\Admin\SupportController::class, 'show'])->name('support.show');
    Route::post('/support/{id}/status', [App\Http\Controllers\Admin\SupportController::class, 'updateStatus'])->name('support.status');
    Route::post('/support/{id}/respond', [App\Http\Controllers\Admin\SupportController::class, 'respond'])->name('support.respond');
    Route::post('/support/{id}/priority', [App\Http\Controllers\Admin\SupportController::class, 'updatePriority'])->name('support.priority');
    Route::delete('/support/{id}', [App\Http\Controllers\Admin\SupportController::class, 'destroy'])->name('support.destroy');

    // Settings - UNCHANGED
    Route::get('/settings', [App\Http\Controllers\Admin\AdminSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/notifications', [App\Http\Controllers\Admin\AdminSettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::post('/settings/display', [App\Http\Controllers\Admin\AdminSettingsController::class, 'updateDisplay'])->name('settings.display');
});

require __DIR__ . '/auth.php';
