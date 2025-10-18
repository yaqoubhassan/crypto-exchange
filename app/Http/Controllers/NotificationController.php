<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total' => auth()->user()->notifications()->count(),
            'unread' => auth()->user()->unreadNotifications()->count(),
            'read' => auth()->user()->notifications()->where('is_read', true)->count(),
        ];

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'stats' => $stats,
        ]);
    }

    public function markAsRead($id)
    {

        $notification = auth()->user()->notifications()->findOrFail($id);

        $notification->markAsRead();

        // ✅ CRITICAL: Clear BOTH notification relationship caches
        auth()->user()->unsetRelation('notifications');
        auth()->user()->unsetRelation('unreadNotifications');

        return back();
    }

    public function markAllAsRead()
    {
        $unreadCount = auth()->user()->unreadNotifications()->count();

        $updated = auth()->user()->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        auth()->user()->unsetRelation('notifications');
        auth()->user()->unsetRelation('unreadNotifications');

        return back()->with('success', 'All notifications marked as read');
    }

    public function clearAll()
    {
        $count = auth()->user()->notifications()->count();

        auth()->user()->notifications()->delete();

        auth()->user()->unsetRelation('notifications');
        auth()->user()->unsetRelation('unreadNotifications');

        return back()->with('success', $count > 0
            ? "All {$count} notification" . ($count !== 1 ? 's' : '') . " cleared successfully!"
            : "No notifications to clear");
    }

    public function handleClick($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);

        // Mark as read
        $notification->markAsRead();

        // ✅ CRITICAL: Clear BOTH notification relationship caches
        auth()->user()->unsetRelation('notifications');
        auth()->user()->unsetRelation('unreadNotifications');

        // Redirect to the notification's link if it exists
        if ($notification->link) {
            return redirect($notification->link);
        }

        return back();
    }

    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);

        $notification->delete();

        // ✅ CRITICAL: Clear BOTH notification relationship caches
        auth()->user()->unsetRelation('notifications');
        auth()->user()->unsetRelation('unreadNotifications');

        return back()->with('success', 'Notification deleted successfully');
    }
}
