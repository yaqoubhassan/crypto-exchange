<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends BaseResetPassword
{
  /**
   * Get the mail representation of the notification.
   */
  public function toMail($notifiable): MailMessage
  {
    $url = url(route('password.reset', [
      'token' => $this->token,
      'email' => $notifiable->getEmailForPasswordReset(),
    ], false));

    return (new MailMessage)
      ->subject('Reset Your Password - ' . config('app.name'))
      ->view('emails.reset-password', ['url' => $url]);
  }
}
