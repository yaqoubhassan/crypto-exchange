<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = $request->user();

        // Check if user has 2FA enabled
        if ($user->two_factor_enabled) {
            // Store user ID in session but don't fully log them in yet
            $request->session()->put('2fa:user:id', $user->id);
            $request->session()->put('2fa:auth:remember', $request->filled('remember'));

            // Log them out temporarily
            Auth::guard('web')->logout();

            // Redirect to 2FA verification page
            return redirect()->route('two-factor.login');
        }

        // No 2FA - proceed with normal login
        $request->session()->regenerate();

        // Update last login info
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Log activity
        $user->logActivity('login', 'Logged in successfully');

        // Check if user is admin and redirect accordingly
        if ($user->is_admin) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Show the 2FA verification form
     */
    public function showTwoFactorChallenge(): RedirectResponse|Response
    {
        if (!session()->has('2fa:user:id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    /**
     * Verify the 2FA code
     */
    public function verifyTwoFactor(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $userId = $request->session()->get('2fa:user:id');

        if (!$userId) {
            return redirect()->route('login')->with('error', 'Session expired. Please login again.');
        }

        $user = \App\Models\User::find($userId);

        if (!$user || !$user->two_factor_enabled) {
            return redirect()->route('login')->with('error', 'Invalid session.');
        }

        // Try to decrypt the secret
        try {
            $secret = decrypt($user->two_factor_secret);
        } catch (\Exception $e) {
            // If decryption fails, the secret might be corrupted or APP_KEY changed
            \Log::error('Failed to decrypt 2FA secret for user ' . $user->id . ': ' . $e->getMessage());
            \Log::error('Exception class: ' . get_class($e));

            // Disable 2FA for this user and ask them to set it up again
            $user->update([
                'two_factor_enabled' => false,
                'two_factor_secret' => null,
            ]);

            // Clear session and redirect to login
            $request->session()->forget(['2fa:user:id', '2fa:auth:remember']);

            return redirect()->route('login')->with('error', 'Your 2FA setup is invalid. Please login and set up 2FA again.');
        }

        $google2fa = new Google2FA();

        // Check if it's a recovery code
        $code = str_replace(' ', '', $request->code);

        // Verify the code
        $valid = $google2fa->verifyKey($secret, $code, 2); // 2 = allow 2 time periods window

        if (!$valid) {
            // TODO: Check if it's a backup code
            // For now, just reject
            return back()->with('error', 'Invalid verification code. Please try again.');
        }

        // Code is valid - complete the login
        Auth::login($user, $request->session()->get('2fa:auth:remember', false));

        // Clear 2FA session data
        $request->session()->forget(['2fa:user:id', '2fa:auth:remember']);

        // Regenerate session
        $request->session()->regenerate();

        // Update last login info
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Log activity
        $user->logActivity('login', 'Logged in successfully with 2FA');

        // Redirect based on user type
        if ($user->is_admin) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
