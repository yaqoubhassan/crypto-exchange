<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends BaseVerifyEmail
{
  /**
   * Get the mail representation of the notification.
   */
  public function toMail($notifiable): MailMessage
  {
    $verificationUrl = $this->verificationUrl($notifiable);

    return (new MailMessage)
      ->subject('Verify Your Email Address - ' . config('app.name'))
      ->view('emails.verify-email', ['url' => $verificationUrl]);
  }
}
