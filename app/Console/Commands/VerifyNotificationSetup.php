<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class VerifyNotificationSetup extends Command
{
  /**
   * The name and signature of the console command.
   */
  protected $signature = 'notification:verify';

  /**
   * The console command description.
   */
  protected $description = 'Verify real-time notification system setup';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $this->info('🔍 Verifying Real-Time Notification Setup...');
    $this->newLine();

    $passed = 0;
    $failed = 0;

    // Check backend files
    $this->info('📁 Checking Backend Files:');
    $backendFiles = [
      'app/Events/NotificationSent.php',
      'app/Services/NotificationService.php',
      'app/Providers/BroadcastServiceProvider.php',
      'app/Http/Middleware/ShareNotifications.php',
      'routes/channels.php',
    ];

    foreach ($backendFiles as $file) {
      if (File::exists(base_path($file))) {
        $this->line("  ✅ {$file}");
        $passed++;
      } else {
        $this->error("  ❌ {$file} - MISSING");
        $failed++;
      }
    }

    $this->newLine();

    // Check frontend files
    $this->info('📁 Checking Frontend Files:');
    $frontendFiles = [
      'resources/js/echo.js',
      'resources/js/Hooks/useNotifications.js',
    ];

    foreach ($frontendFiles as $file) {
      if (File::exists(base_path($file))) {
        $this->line("  ✅ {$file}");
        $passed++;
      } else {
        $this->error("  ❌ {$file} - MISSING");
        $failed++;
      }
    }

    $this->newLine();

    // Check configuration
    $this->info('⚙️ Checking Configuration:');

    $broadcastDriver = config('broadcasting.default');
    if ($broadcastDriver && $broadcastDriver !== 'log') {
      $this->line("  ✅ BROADCAST_DRIVER: {$broadcastDriver}");
      $passed++;
    } else {
      $this->error("  ❌ BROADCAST_DRIVER not configured or set to 'log'");
      $failed++;
    }

    $queueDriver = config('queue.default');
    if ($queueDriver && $queueDriver !== 'sync') {
      $this->line("  ✅ QUEUE_CONNECTION: {$queueDriver}");
      $passed++;
    } else {
      $this->warn("  ⚠️  QUEUE_CONNECTION is 'sync' (should use database or redis for production)");
    }

    if ($broadcastDriver === 'pusher') {
      $pusherKey = config('broadcasting.connections.pusher.key');
      if ($pusherKey && $pusherKey !== 'your_app_key') {
        $this->line("  ✅ Pusher credentials configured");
        $passed++;
      } else {
        $this->error("  ❌ Pusher credentials not configured");
        $failed++;
      }
    }

    $this->newLine();

    // Check database
    $this->info('🗄️ Checking Database:');

    try {
      $notificationsTableExists = Schema::hasTable('notifications');
      if ($notificationsTableExists) {
        $this->line("  ✅ 'notifications' table exists");
        $passed++;
      } else {
        $this->error("  ❌ 'notifications' table not found");
        $this->warn("     Run: php artisan migrate");
        $failed++;
      }

      $jobsTableExists = Schema::hasTable('jobs');
      if ($jobsTableExists) {
        $this->line("  ✅ 'jobs' table exists");
        $passed++;
      } else {
        $this->error("  ❌ 'jobs' table not found");
        $this->warn("     Run: php artisan queue:table && php artisan migrate");
        $failed++;
      }
    } catch (\Exception $e) {
      $this->error("  ❌ Database connection error: {$e->getMessage()}");
      $failed++;
    }

    $this->newLine();

    // Check Node modules
    $this->info('📦 Checking NPM Packages:');

    $packageJson = json_decode(File::get(base_path('package.json')), true);

    if (isset($packageJson['dependencies']['laravel-echo'])) {
      $this->line("  ✅ laravel-echo installed");
      $passed++;
    } else {
      $this->error("  ❌ laravel-echo not found");
      $this->warn("     Run: npm install laravel-echo");
      $failed++;
    }

    if (isset($packageJson['dependencies']['pusher-js'])) {
      $this->line("  ✅ pusher-js installed");
      $passed++;
    } else {
      $this->error("  ❌ pusher-js not found");
      $this->warn("     Run: npm install pusher-js");
      $failed++;
    }

    $this->newLine();

    // Summary
    $total = $passed + $failed;
    $percentage = $total > 0 ? round(($passed / $total) * 100) : 0;

    $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    $this->newLine();

    if ($failed === 0) {
      $this->info("✅ All checks passed! ({$passed}/{$total})");
      $this->newLine();
      $this->info('🎉 Your notification system is ready to use!');
      $this->newLine();
      $this->info('Next steps:');
      $this->line('  1. Start queue worker: php artisan queue:work');
      $this->line('  2. Build assets: npm run dev');
      $this->line('  3. Test: Visit /test/notification');
    } else {
      $this->warn("⚠️  Setup incomplete: {$passed} passed, {$failed} failed ({$percentage}%)");
      $this->newLine();
      $this->info('Please fix the issues above and run this command again.');
    }

    $this->newLine();

    return $failed === 0 ? Command::SUCCESS : Command::FAILURE;
  }
}
