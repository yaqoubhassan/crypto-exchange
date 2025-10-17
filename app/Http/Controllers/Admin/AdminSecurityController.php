<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AdminSecurityController extends Controller
{
    /**
     * Display the admin security page
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get active sessions
        $activeSessions = $this->getActiveSessions($user->id, $request->session()->getId());

        // Get recent activity logs
        $recentActivity = $user->activityLogs()
            ->whereIn('action', ['login', 'logout', 'password_changed', 'two_factor_enabled', 'two_factor_disabled', 'session_revoked'])
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        // Get failed login attempts if table exists
        $failedAttempts = $this->getFailedLoginAttempts($user->email);

        // Get 2FA setup data from session if available
        $twoFactorSetup = $request->session()->get('2fa_setup', []);

        return Inertia::render('Admin/Security/Index', [
            'twoFactorEnabled' => $user->two_factor_enabled ?? false,
            'lastLoginAt' => $user->last_login_at,
            'lastLoginIp' => $user->last_login_ip,
            'activeSessions' => $activeSessions,
            'recentActivity' => $recentActivity,
            'failedAttempts' => $failedAttempts,
            'qrCode' => $twoFactorSetup['qrCode'] ?? null,
            'secret' => $twoFactorSetup['secret'] ?? null,
            'backupCodes' => $twoFactorSetup['backupCodes'] ?? null,
        ]);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Log activity
        $user->logActivity('password_changed', 'Changed account password');

        return Redirect::route('admin.security.index')->with('success', 'Password updated successfully!');
    }

    /**
     * Enable two-factor authentication
     */
    public function enableTwoFactor(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_enabled) {
            return back()->with('error', 'Two-factor authentication is already enabled.');
        }

        // Generate secret
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Store temporarily in session (for verification later)
        $request->session()->put('2fa_temp_secret', $secret);

        // Generate QR code URL
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        // Generate QR code as SVG (doesn't require GD or Imagick)
        try {
            $qrCode = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')
                ->size(200)
                ->errorCorrection('H')
                ->generate($qrCodeUrl);

            // The library might return an object, convert it to string
            if (is_object($qrCode)) {
                // If it's a response object, get the content
                if (method_exists($qrCode, 'getContent')) {
                    $qrCodeSvg = $qrCode->getContent();
                } elseif (method_exists($qrCode, '__toString')) {
                    $qrCodeSvg = (string) $qrCode;
                } else {
                    throw new \Exception('Cannot convert QR code object to string');
                }
            } else {
                $qrCodeSvg = $qrCode;
            }

            // Ensure it's a string now
            if (!is_string($qrCodeSvg)) {
                throw new \Exception('QR Code is still not a string after conversion: ' . gettype($qrCodeSvg));
            }

            $qrCodeData = $qrCodeSvg;
        } catch (\Exception $e) {
            Log::error('QR Code generation failed: ' . $e->getMessage());
            $qrCodeData = null;
            return back()->with('error', 'Failed to generate QR code: ' . $e->getMessage());
        }

        // Generate backup codes
        $backupCodes = $this->generateBackupCodes();

        // Store everything in session with proper keys
        $request->session()->put('2fa_setup', [
            'qrCode' => $qrCodeData,
            'secret' => $secret,
            'backupCodes' => $backupCodes,
        ]);

        // Return to index with the data
        $activeSessions = $this->getActiveSessions($user->id, $request->session()->getId());
        $recentActivity = $user->activityLogs()
            ->whereIn('action', ['login', 'logout', 'password_changed', 'two_factor_enabled', 'two_factor_disabled', 'session_revoked'])
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();
        $failedAttempts = $this->getFailedLoginAttempts($user->email);

        return Inertia::render('Admin/Security/Index', [
            'twoFactorEnabled' => $user->two_factor_enabled ?? false,
            'lastLoginAt' => $user->last_login_at,
            'lastLoginIp' => $user->last_login_ip,
            'activeSessions' => $activeSessions,
            'recentActivity' => $recentActivity,
            'failedAttempts' => $failedAttempts,
            'qrCode' => $qrCodeData,
            'secret' => $secret,
            'backupCodes' => $backupCodes,
        ]);
    }

    /**
     * Verify and confirm two-factor authentication
     */
    public function verifyTwoFactor(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $twoFactorSetup = $request->session()->get('2fa_setup');
        $secret = $request->session()->get('2fa_temp_secret');

        if (!$secret || !$twoFactorSetup) {
            return back()->with('error', 'Two-factor setup session expired. Please try again.');
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return back()->with('error', 'Invalid verification code. Please try again.');
        }

        // Enable 2FA
        $user = $request->user();
        $user->update([
            'two_factor_enabled' => true,
            'two_factor_secret' => encrypt($secret),
        ]);

        // Store backup codes in user properties or separate table
        // You might want to store these in a separate table or encrypted in user properties

        // Clear session data
        $request->session()->forget(['2fa_temp_secret', '2fa_setup']);

        // Log activity
        $user->logActivity('two_factor_enabled', 'Enabled two-factor authentication');

        return Redirect::route('admin.security.index')->with('success', 'Two-factor authentication enabled successfully!');
    }

    /**
     * Disable two-factor authentication
     */
    public function disableTwoFactor(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $user->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
        ]);

        // Log activity
        $user->logActivity('two_factor_disabled', 'Disabled two-factor authentication');

        return Redirect::route('admin.security.index')->with('success', 'Two-factor authentication disabled successfully!');
    }

    /**
     * Revoke a specific session
     */
    public function revokeSession(Request $request, $sessionId): RedirectResponse
    {
        $user = $request->user();

        // Don't allow revoking current session
        if ($sessionId === $request->session()->getId()) {
            return back()->with('error', 'You cannot revoke your current session.');
        }

        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $user->id)
            ->delete();

        // Log activity
        $user->logActivity('session_revoked', 'Revoked a login session');

        return back()->with('success', 'Session revoked successfully.');
    }

    /**
     * Log out from all other sessions
     */
    public function logoutOtherSessions(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        // Log activity
        $user->logActivity('sessions_cleared', 'Logged out from all other sessions');

        return back()->with('success', 'All other sessions have been logged out.');
    }

    /**
     * Get all active sessions for the user
     */
    private function getActiveSessions($userId, $currentSessionId)
    {
        return DB::table('sessions')
            ->where('user_id', $userId)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($currentSessionId) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => $session->last_activity,
                    'is_current' => $session->id === $currentSessionId,
                    'device_type' => $this->getDeviceType($session->user_agent),
                    'browser' => $this->getBrowser($session->user_agent),
                    'platform' => $this->getPlatform($session->user_agent),
                ];
            });
    }

    /**
     * Get failed login attempts
     */
    private function getFailedLoginAttempts($email)
    {
        if (!DB::getSchemaBuilder()->hasTable('failed_login_attempts')) {
            return collect([]);
        }

        return DB::table('failed_login_attempts')
            ->where('email', $email)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($attempt) {
                return [
                    'ip_address' => $attempt->ip_address,
                    'user_agent' => $attempt->user_agent,
                    'timestamp' => strtotime($attempt->created_at),
                    'device_type' => $this->getDeviceType($attempt->user_agent),
                    'browser' => $this->getBrowser($attempt->user_agent),
                    'platform' => $this->getPlatform($attempt->user_agent),
                ];
            });
    }

    /**
     * Generate backup codes
     */
    private function generateBackupCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(substr(md5(random_bytes(10)), 0, 8));
        }
        return $codes;
    }

    /**
     * Get device type from user agent
     */
    private function getDeviceType(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/mobile|android|iphone|ipad|phone/i', $userAgent)) {
            if (preg_match('/ipad|tablet/i', $userAgent)) {
                return 'Tablet';
            }
            return 'Mobile';
        }

        return 'Desktop';
    }

    /**
     * Get browser from user agent
     */
    private function getBrowser(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/Edg/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $userAgent)) return 'Internet Explorer';
        if (preg_match('/Opera|OPR/i', $userAgent)) return 'Opera';

        return 'Unknown';
    }

    /**
     * Get platform from user agent
     */
    private function getPlatform(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Macintosh|Mac OS X/i', $userAgent)) return 'macOS';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS|iPhone|iPad/i', $userAgent)) return 'iOS';

        return 'Unknown';
    }
}
