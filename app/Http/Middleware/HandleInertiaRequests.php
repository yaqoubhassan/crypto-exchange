<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'is_admin' => $request->user()->is_admin ?? false,
                    'is_active' => $request->user()->is_active ?? true,
                    'email_verified_at' => $request->user()->email_verified_at,
                    'profile_picture' => $request->user()->profile_picture ?? null,
                    'created_at' => $request->user()->created_at,
                    'theme' => $request->user()->theme ?? 'light',
                ] : null,
            ],
            // Lazy load notifications - only fetched when accessed
            'notifications' => fn() => $request->user()
                ? $request->user()->notifications()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($notification) => [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'icon' => $notification->icon,
                    'link' => $notification->link,
                    'data' => $notification->data,
                    'is_read' => $notification->is_read,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->toIso8601String(),
                ])
                : [],
            'unreadCount' => fn() => $request->user()
                ? $request->user()->notifications()->where('is_read', false)->count()
                : 0,
            // Flash messages
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
        ];
    }
}
