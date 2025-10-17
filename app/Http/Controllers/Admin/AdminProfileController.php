<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $activities = ActivityLog::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Profile/Edit', [
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'profile_picture' => $request->user()->profile_picture,
                'phone' => $request->user()->phone,
                'bio' => $request->user()->bio,
                'location' => $request->user()->location,
                'created_at' => $request->user()->created_at,
                'role' => $request->user()->role,
                'last_login_at' => $request->user()->last_login_at,
            ],
            'activities' => $activities,
        ]);
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
