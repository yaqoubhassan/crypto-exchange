<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Login event listener
        Event::listen(Login::class, function (Login $event) {
            if ($event->user) {
                $event->user->logActivity('login', 'Logged in successfully');
                $event->user->update(['last_login_at' => now()]);
            }
        });

        // Logout event listener
        Event::listen(Logout::class, function (Logout $event) {
            if ($event->user) {
                $event->user->logActivity('logout', 'Logged out');
            }
        });
    }
}
