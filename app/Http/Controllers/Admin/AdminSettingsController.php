<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    /**
     * Display admin settings page
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                // Theme & Display
                'theme' => $user->theme ?? 'light',
                'language' => $user->language ?? 'en',
                'timezone' => $user->timezone ?? 'UTC',
                'currency_display' => $user->currency_display ?? 'USD',

                // Notification Preferences
                'email_notifications_enabled' => $user->email_notifications_enabled ?? true,
                'email_trading_alerts' => $user->email_trading_alerts ?? true,
                'email_wallet_transactions' => $user->email_wallet_transactions ?? true,
                'email_security_alerts' => $user->email_security_alerts ?? true,
                'email_marketing' => $user->email_marketing ?? false,
                'browser_notifications_enabled' => $user->browser_notifications_enabled ?? false,
                'browser_trading_alerts' => $user->browser_trading_alerts ?? false,
                'browser_wallet_transactions' => $user->browser_wallet_transactions ?? false,
            ],
        ]);
    }

    /**
     * Update notification preferences
     */
    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email_notifications_enabled' => 'boolean',
            'email_trading_alerts' => 'boolean',
            'email_wallet_transactions' => 'boolean',
            'email_security_alerts' => 'boolean',
            'email_marketing' => 'boolean',
            'browser_notifications_enabled' => 'boolean',
            'browser_trading_alerts' => 'boolean',
            'browser_wallet_transactions' => 'boolean',
        ]);

        $request->user()->update($validated);

        return Redirect::route('admin.settings.index')
            ->with('success', 'Notification preferences updated successfully!');
    }

    /**
     * Update display preferences
     */
    public function updateDisplay(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,system',
            'language' => 'required|string|max:10',
            'timezone' => 'required|string|max:50',
            'currency_display' => 'required|string|max:10',
        ]);

        $oldTheme = $request->user()->theme;
        $request->user()->update($validated);

        if ($oldTheme !== $validated['theme']) {
            return Redirect::route('admin.settings.index')
                ->with('success', 'Display preferences updated! Theme applied.')
                ->with('theme_changed', true);
        }

        return Redirect::route('admin.settings.index')
            ->with('success', 'Display preferences updated successfully!');
    }
}
