<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    /**
     * Display the admin's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Get active sessions for security tab
        $activeSessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($request) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => $session->last_activity,
                    'is_current' => $session->id === $request->session()->getId(),
                    'device_type' => $this->getDeviceType($session->user_agent),
                    'browser' => $this->getBrowser($session->user_agent),
                    'platform' => $this->getPlatform($session->user_agent),
                ];
            });

        // Get recent activity logs (paginated)
        $activities = $user->activityLogs()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Profile/Edit', [
            'user' => $user,
            'activities' => $activities,
            'activeSessions' => $activeSessions,
            'twoFactorEnabled' => $user->two_factor_enabled ?? false,
        ]);
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

    /**
     * Update the admin's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('admin.profile.edit')->with('success', 'Profile updated successfully!');
    }

    /**
     * Upload or update admin profile picture.
     */
    public function uploadProfilePicture(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile-pictures', 'public');

        $user->update([
            'profile_picture' => $path,
        ]);

        return Redirect::route('admin.profile.edit')->with('success', 'Profile picture updated successfully!');
    }

    /**
     * Remove admin profile picture.
     */
    public function removeProfilePicture(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);

            $user->update([
                'profile_picture' => null,
            ]);
        }

        return Redirect::route('admin.profile.edit')->with('success', 'Profile picture removed successfully!');
    }

    /**
     * Update the admin's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return Redirect::route('admin.profile.edit')->with('success', 'Password updated successfully!');
    }

    /**
     * Show admin activity log
     */
    public function activityLog(Request $request): Response
    {
        // This is a placeholder - you'll need to implement activity logging
        $activities = [
            [
                'action' => 'Profile Updated',
                'description' => 'Updated profile information',
                'timestamp' => now()->subHours(2),
                'ip_address' => '192.168.1.1',
            ],
            [
                'action' => 'Password Changed',
                'description' => 'Changed account password',
                'timestamp' => now()->subDays(5),
                'ip_address' => '192.168.1.1',
            ],
            [
                'action' => 'Login',
                'description' => 'Logged in successfully',
                'timestamp' => now()->subDays(1),
                'ip_address' => '192.168.1.1',
            ],
        ];

        return Inertia::render('Admin/Profile/ActivityLog', [
            'activities' => $activities,
        ]);
    }
}
