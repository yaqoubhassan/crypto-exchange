<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CleanupFailedLogins extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'auth:cleanup-failed-logins 
                            {--days=7 : Number of days to keep}
                            {--stats : Show statistics before cleanup}';

    /**
     * The console command description.
     */
    protected $description = 'Clean up old failed login attempts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!Schema::hasTable('failed_login_attempts')) {
            $this->error('The failed_login_attempts table does not exist.');
            $this->info('Run: php artisan migrate');
            return 1;
        }

        $days = $this->option('days');

        if ($this->option('stats')) {
            $this->showStatistics();
        }

        $cutoffDate = now()->subDays($days);
        $count = DB::table('failed_login_attempts')
            ->where('created_at', '<', $cutoffDate)
            ->count();

        if ($count === 0) {
            $this->info('No old failed login attempts to clean up.');
            return 0;
        }

        if ($this->confirm("Delete {$count} failed login attempts older than {$days} days?", true)) {
            $deleted = DB::table('failed_login_attempts')
                ->where('created_at', '<', $cutoffDate)
                ->delete();

            $this->info("Successfully deleted {$deleted} failed login attempts.");
        } else {
            $this->info('Cleanup cancelled.');
        }

        return 0;
    }

    /**
     * Show statistics about failed login attempts
     */
    protected function showStatistics()
    {
        $this->info('=== Failed Login Statistics ===');
        $this->newLine();

        // Total attempts
        $total = DB::table('failed_login_attempts')->count();
        $this->line("Total attempts: {$total}");

        // Last hour
        $lastHour = DB::table('failed_login_attempts')
            ->where('created_at', '>=', now()->subHour())
            ->count();
        $this->line("Last hour: {$lastHour}");

        // Last 24 hours
        $last24h = DB::table('failed_login_attempts')
            ->where('created_at', '>=', now()->subDay())
            ->count();
        $this->line("Last 24 hours: {$last24h}");

        $this->newLine();

        // Top suspicious IPs
        $this->info('Top 5 Suspicious IPs (last 24h):');
        $topIps = DB::table('failed_login_attempts')
            ->select('ip_address', DB::raw('COUNT(*) as attempt_count'))
            ->where('created_at', '>=', now()->subDay())
            ->groupBy('ip_address')
            ->orderByDesc('attempt_count')
            ->limit(5)
            ->get();

        if ($topIps->isEmpty()) {
            $this->line('  No attempts in the last 24 hours');
        } else {
            foreach ($topIps as $ip) {
                $this->line("  {$ip->ip_address}: {$ip->attempt_count} attempts");
            }
        }

        $this->newLine();

        // Top targeted emails
        $this->info('Top 5 Targeted Emails (last 24h):');
        $topEmails = DB::table('failed_login_attempts')
            ->select('email', DB::raw('COUNT(*) as attempt_count'))
            ->where('created_at', '>=', now()->subDay())
            ->groupBy('email')
            ->orderByDesc('attempt_count')
            ->limit(5)
            ->get();

        if ($topEmails->isEmpty()) {
            $this->line('  No attempts in the last 24 hours');
        } else {
            foreach ($topEmails as $email) {
                $this->line("  {$email->email}: {$email->attempt_count} attempts");
            }
        }

        $this->newLine();
    }
}
