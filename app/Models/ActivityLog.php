<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'device',
        'browser',
        'platform',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that owns the activity log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log an activity
     */
    public static function log(
        int $userId,
        string $action,
        string $description,
        ?array $properties = null
    ): self {
        $request = request();

        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => self::getDevice($request->userAgent()),
            'browser' => self::getBrowser($request->userAgent()),
            'platform' => self::getPlatform($request->userAgent()),
            'properties' => $properties,
        ]);
    }

    /**
     * Get device type from user agent
     */
    private static function getDevice(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/mobile|android|iphone|ipad|phone/i', $userAgent)) {
            if (preg_match('/ipad|tablet/i', $userAgent)) {
                return 'Tablet';
            }
            return 'Mobile';
        }

        return 'Desktop';
    }

    /**
     * Get browser from user agent
     */
    private static function getBrowser(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $userAgent)) return 'Internet Explorer';
        if (preg_match('/Opera|OPR/i', $userAgent)) return 'Opera';

        return 'Unknown';
    }

    /**
     * Get platform from user agent
     */
    private static function getPlatform(?string $userAgent): ?string
    {
        if (!$userAgent) return null;

        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Macintosh|Mac OS X/i', $userAgent)) return 'macOS';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS|iPhone|iPad/i', $userAgent)) return 'iOS';

        return 'Unknown';
    }
}
