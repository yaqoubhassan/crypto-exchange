<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('notification:verify', function () {
    $this->call(\App\Console\Commands\VerifyNotificationSetup::class);
})->purpose('Verify notification setup');

Schedule::command('auth:cleanup-failed-logins --days=7')
    ->dailyAt('02:00')
    ->name('cleanup-failed-logins')
    ->withoutOverlapping();
