<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    /**
     * Display the security settings page
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get active sessions
        $activeSessions = $this->getActiveSessions($user->id, $request->session()->getId());

        // Get recent login history (successful logins from sessions)
        $loginHistory = $this->getLoginHistory($user->id);

        // Get failed login attempts
        $failedAttempts = $this->getFailedLoginAttempts($user->email);

        return Inertia::render('Security/Index', [
            'twoFactorEnabled' => $user->two_factor_enabled ?? false,
            'lastLoginAt' => $user->last_login_at,
            'lastLoginIp' => $user->last_login_ip,
            'activeSessions' => $activeSessions,
            'loginHistory' => $loginHistory,
            'failedAttempts' => $failedAttempts,
        ]);
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
     * Get login history from sessions
     */
    private function getLoginHistory($userId)
    {
        return DB::table('sessions')
            ->where('user_id', $userId)
            ->orderBy('last_activity', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($session) {
                return [
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'timestamp' => $session->last_activity,
                    'type' => 'success',
                    'device_type' => $this->getDeviceType($session->user_agent),
                    'browser' => $this->getBrowser($session->user_agent),
                    'location' => $this->getLocationFromIp($session->ip_address),
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
                    'type' => 'failed',
                    'device_type' => $this->getDeviceType($attempt->user_agent),
                    'browser' => $this->getBrowser($attempt->user_agent),
                ];
            });
    }

    /**
     * Revoke a specific session
     */
    public function revokeSession(Request $request, $sessionId)
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

        return back()->with('success', 'Session revoked successfully.');
    }

    /**
     * Log out from all other sessions
     */
    public function logoutOtherSessions(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return back()->with('success', 'All other sessions have been logged out.');
    }

    /**
     * Helper methods to parse user agent
     */
    private function getDeviceType($userAgent)
    {
        if (preg_match('/mobile|android|iphone|ipad|phone/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    private function getBrowser($userAgent)
    {
        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Opera/i', $userAgent)) return 'Opera';
        return 'Unknown';
    }

    private function getPlatform($userAgent)
    {
        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Mac/i', $userAgent)) return 'macOS';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS|iPhone|iPad/i', $userAgent)) return 'iOS';
        return 'Unknown';
    }

    private function getLocationFromIp($ip)
    {
        // Simple location detection - you can enhance this with GeoIP service
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return 'Local';
        }
        return null; // You can integrate with IP geolocation API here
    }
}
