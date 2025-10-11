<?php

namespace App\Services;

use App\Events\NotificationSent;
use App\Models\Notification;
use App\Models\User;

class NotificationService
{
  /**
   * Create and broadcast a notification
   */
  public static function send(
    User $user,
    string $type,
    string $title,
    string $message,
    ?string $icon = null,
    ?string $link = null,
    ?array $data = null
  ): Notification {
    $notification = Notification::create([
      'user_id' => $user->id,
      'type' => $type,
      'title' => $title,
      'message' => $message,
      'icon' => $icon,
      'link' => $link,
      'data' => $data ? json_encode($data) : null,
    ]);

    // Broadcast the notification in real-time
    broadcast(new NotificationSent($notification))->toOthers();

    return $notification;
  }

  /**
   * Send notification to multiple users
   */
  public static function sendToMany(
    array $userIds,
    string $type,
    string $title,
    string $message,
    ?string $icon = null,
    ?string $link = null,
    ?array $data = null
  ): void {
    foreach ($userIds as $userId) {
      $user = User::find($userId);
      if ($user) {
        self::send($user, $type, $title, $message, $icon, $link, $data);
      }
    }
  }

  /**
   * Send notification to all admins
   */
  public static function sendToAdmins(
    string $type,
    string $title,
    string $message,
    ?string $icon = null,
    ?string $link = null,
    ?array $data = null
  ): void {
    $admins = User::where('is_admin', true)->get();

    foreach ($admins as $admin) {
      self::send($admin, $type, $title, $message, $icon, $link, $data);
    }
  }

  /**
   * Send notification to all users
   */
  public static function sendToAll(
    string $type,
    string $title,
    string $message,
    ?string $icon = null,
    ?string $link = null,
    ?array $data = null
  ): void {
    $users = User::all();

    foreach ($users as $user) {
      self::send($user, $type, $title, $message, $icon, $link, $data);
    }
  }
}
