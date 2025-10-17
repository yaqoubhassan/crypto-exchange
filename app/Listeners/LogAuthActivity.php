<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

class LogAuthActivity
{
    /**
     * Handle the login event.
     */
    public function handleLogin(Login $event): void
    {
        if ($event->user) {
            $event->user->logActivity(
                'login',
                'Logged in successfully'
            );

            // Update last login timestamp
            $event->user->update([
                'last_login_at' => now(),
            ]);
        }
    }

    /**
     * Handle the logout event.
     */
    public function handleLogout(Logout $event): void
    {
        if ($event->user) {
            $event->user->logActivity(
                'logout',
                'Logged out'
            );
        }
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe($events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
        ];
    }
}
