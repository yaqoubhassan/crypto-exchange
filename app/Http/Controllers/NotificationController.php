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
        Log::info('🔔 [markAsRead] Request received', ['notification_id' => $id]);

        $notification = auth()->user()->notifications()->findOrFail($id);

        Log::info('📊 [markAsRead] Notification found', [
            'id' => $notification->id,
            'title' => $notification->title,
            'is_read_before' => $notification->is_read,
        ]);

        $notification->markAsRead();

        // ✅ Clear the relationship cache
        auth()->user()->unsetRelation('notifications');

        Log::info('✅ [markAsRead] Notification marked as read', [
            'id' => $notification->id,
            'is_read_after' => $notification->fresh()->is_read,
            'read_at' => $notification->fresh()->read_at,
        ]);

        return back();
    }

    public function markAllAsRead()
    {
        $unreadCount = auth()->user()->unreadNotifications()->count();

        Log::info('🔔 [markAllAsRead] Request received', [
            'user_id' => auth()->id(),
            'unread_count' => $unreadCount,
        ]);

        $updated = auth()->user()->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        // ✅ Clear the relationship cache
        auth()->user()->unsetRelation('notifications');

        Log::info('✅ [markAllAsRead] Notifications updated', [
            'updated_count' => $updated,
        ]);

        return back()->with('success', 'All notifications marked as read');
    }

    public function clearAll()
    {
        $count = auth()->user()->notifications()->count();

        Log::info('🗑️ [clearAll] Request received', [
            'user_id' => auth()->id(),
            'total_count' => $count,
        ]);

        auth()->user()->notifications()->delete();

        // ✅ Clear the relationship cache
        auth()->user()->unsetRelation('notifications');

        Log::info('✅ [clearAll] Notifications deleted', [
            'deleted_count' => $count,
        ]);

        return back()->with('success', $count > 0
            ? "All {$count} notification" . ($count !== 1 ? 's' : '') . " cleared successfully!"
            : "No notifications to clear");
    }

    public function handleClick($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);

        Log::info('🖱️ [handleClick] Notification clicked', [
            'id' => $notification->id,
            'link' => $notification->link,
        ]);

        // Mark as read
        $notification->markAsRead();

        // ✅ Clear the relationship cache
        auth()->user()->unsetRelation('notifications');

        // Redirect to the notification's link if it exists
        if ($notification->link) {
            return redirect($notification->link);
        }

        return back();
    }

    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);

        Log::info('🗑️ [destroy] Deleting notification', [
            'id' => $notification->id,
            'title' => $notification->title,
        ]);

        $notification->delete();

        // ✅ Clear the relationship cache
        auth()->user()->unsetRelation('notifications');

        return back()->with('success', 'Notification deleted successfully');
    }
}
