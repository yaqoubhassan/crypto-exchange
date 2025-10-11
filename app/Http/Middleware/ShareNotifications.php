<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareNotifications
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            Inertia::share([
                'notifications' => function () {
                    return auth()->user()
                        ->notifications()
                        ->latest()
                        ->take(10)
                        ->get()
                        ->map(function ($notification) {
                            return [
                                'id' => $notification->id,
                                'type' => $notification->type,
                                'title' => $notification->title,
                                'message' => $notification->message,
                                'icon' => $notification->icon,
                                'link' => $notification->link,
                                'data' => $notification->data,
                                'is_read' => $notification->is_read,
                                'created_at' => $notification->created_at->toIso8601String(),
                            ];
                        });
                },
                'unreadCount' => function () {
                    return auth()->user()->unreadNotifications()->count();
                },
            ]);
        }

        return $next($request);
    }
}
