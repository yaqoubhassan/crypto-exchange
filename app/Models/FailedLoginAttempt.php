<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FailedLoginAttempt extends Model
{
    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get attempts in the last hour
     */
    public static function recentAttempts(int $hours = 1)
    {
        return self::where('created_at', '>=', now()->subHours($hours))->get();
    }

    /**
     * Get attempts by email
     */
    public static function byEmail(string $email, int $hours = 24)
    {
        return self::where('email', $email)
            ->where('created_at', '>=', now()->subHours($hours))
            ->get();
    }

    /**
     * Get attempts by IP address
     */
    public static function byIp(string $ipAddress, int $hours = 24)
    {
        return self::where('ip_address', $ipAddress)
            ->where('created_at', '>=', now()->subHours($hours))
            ->get();
    }

    /**
     * Clean up old attempts
     */
    public static function cleanup(int $days = 7)
    {
        return self::where('created_at', '<', now()->subDays($days))->delete();
    }

    /**
     * Get top suspicious IPs
     */
    public static function topSuspiciousIps(int $limit = 10, int $hours = 24)
    {
        return self::selectRaw('ip_address, COUNT(*) as attempt_count')
            ->where('created_at', '>=', now()->subHours($hours))
            ->groupBy('ip_address')
            ->orderByDesc('attempt_count')
            ->limit($limit)
            ->get();
    }

    /**
     * Get top suspicious emails
     */
    public static function topSuspiciousEmails(int $limit = 10, int $hours = 24)
    {
        return self::selectRaw('email, COUNT(*) as attempt_count')
            ->where('created_at', '>=', now()->subHours($hours))
            ->groupBy('email')
            ->orderByDesc('attempt_count')
            ->limit($limit)
            ->get();
    }
}
