<?php

namespace App\Services;

use App\Events\NotificationSent;
use App\Mail\NotificationMail;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
  /**
   * Notification type to preference mapping
   */
  private static $typePreferenceMap = [
    // Trading related
    'admin_new_order' => ['browser' => 'browser_trading_alerts', 'email' => 'email_trading_alerts'],
    'admin_trade_alert' => ['browser' => 'browser_trading_alerts', 'email' => 'email_trading_alerts'],
    'order_filled' => ['browser' => 'browser_trading_alerts', 'email' => 'email_trading_alerts'],
    'order_cancelled' => ['browser' => 'browser_trading_alerts', 'email' => 'email_trading_alerts'],
    'price_alert' => ['browser' => 'browser_trading_alerts', 'email' => 'email_trading_alerts'],

    // Wallet related
    'deposit_completed' => ['browser' => 'browser_wallet_transactions', 'email' => 'email_wallet_transactions'],
    'withdrawal_completed' => ['browser' => 'browser_wallet_transactions', 'email' => 'email_wallet_transactions'],
    'withdrawal_pending' => ['browser' => 'browser_wallet_transactions', 'email' => 'email_wallet_transactions'],
    'transaction_completed' => ['browser' => 'browser_wallet_transactions', 'email' => 'email_wallet_transactions'],

    // Security related
    'security_alert' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_security_alerts'],
    'login_alert' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_security_alerts'],
    'password_changed' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_security_alerts'],
    '2fa_enabled' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_security_alerts'],

    // KYC related
    'kyc_approved' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_notifications_enabled'],
    'kyc_rejected' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_notifications_enabled'],

    // Support related
    'support_ticket_update' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_notifications_enabled'],

    // Marketing
    'promotional' => ['browser' => 'browser_notifications_enabled', 'email' => 'email_marketing'],
  ];

  /**
   * Check if user wants to receive this type of notification
   */
  private static function shouldSendBrowserNotification(User $user, string $type): bool
  {
    // Check if browser notifications are globally enabled
    if (!$user->browser_notifications_enabled) {
      return false;
    }

    // Check specific notification type preference
    if (isset(self::$typePreferenceMap[$type]['browser'])) {
      $preference = self::$typePreferenceMap[$type]['browser'];
      return $user->$preference ?? true;
    }

    // Default to enabled if no specific preference exists
    return true;
  }

  /**
   * Check if user wants to receive email for this type of notification
   */
  private static function shouldSendEmail(User $user, string $type): bool
  {
    // Check if email notifications are globally enabled
    if (!$user->email_notifications_enabled) {
      return false;
    }

    // Check specific notification type preference
    if (isset(self::$typePreferenceMap[$type]['email'])) {
      $preference = self::$typePreferenceMap[$type]['email'];
      return $user->$preference ?? true;
    }

    // Default to enabled if no specific preference exists
    return true;
  }

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
  ): ?Notification {
    // Check if user wants browser notifications for this type
    if (!self::shouldSendBrowserNotification($user, $type)) {
      // Still send email if enabled, but don't create browser notification
      if (self::shouldSendEmail($user, $type)) {
        self::sendEmail($user, $type, $title, $message, $link);
      }
      return null;
    }

    // Create browser notification
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

    // Send email if user has email notifications enabled for this type
    if (self::shouldSendEmail($user, $type)) {
      self::sendEmail($user, $type, $title, $message, $link);
    }

    return $notification;
  }

  /**
   * Send email notification
   */
  private static function sendEmail(User $user, string $type, string $title, string $message, ?string $link = null): void
  {
    try {
      Mail::to($user->email)->send(new NotificationMail($type, $title, $message, $link));
    } catch (\Exception $e) {
      // Log error but don't fail the notification
      Log::error('Failed to send notification email', [
        'user_id' => $user->id,
        'type' => $type,
        'error' => $e->getMessage()
      ]);
    }
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
