<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
  /**
   * Log an activity for this model
   */
  public function logActivity(string $action, string $description, ?array $properties = null): ActivityLog
  {
    return ActivityLog::log(
      $this->id,
      $action,
      $description,
      $properties
    );
  }

  /**
   * Get all activity logs for this user
   */
  public function activityLogs()
  {
    return $this->hasMany(ActivityLog::class, 'user_id');
  }

  /**
   * Get recent activity logs (last 30 days by default)
   */
  public function recentActivity(int $days = 30)
  {
    return $this->activityLogs()
      ->where('created_at', '>=', now()->subDays($days))
      ->orderBy('created_at', 'desc')
      ->get();
  }
}
