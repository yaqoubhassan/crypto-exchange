<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

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

        return back();
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back()->with('success', 'All notifications marked as read');
    }

    /**
     * Delete all notifications for the authenticated user
     */
    public function clearAll()
    {
        $count = auth()->user()->notifications()->count();

        auth()->user()->notifications()->delete();

        return back()->with('success', $count > 0
            ? "All {$count} notification" . ($count !== 1 ? 's' : '') . " cleared successfully!"
            : "No notifications to clear");
    }

    public function handleClick($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);

        // Mark as read
        $notification->markAsRead();

        // Redirect to the notification's link if it exists
        if ($notification->link) {
            return redirect($notification->link);
        }

        // If no link, just go back
        return back();
    }

    /**
     * Delete a single notification
     */
    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();

        return back()->with('success', 'Notification deleted successfully');
    }
}
