<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $notificationType;
    public string $notificationTitle;
    public string $notificationMessage;
    public ?string $notificationLink;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $type,
        string $title,
        string $message,
        ?string $link = null
    ) {
        $this->notificationType = $type;
        $this->notificationTitle = $title;
        $this->notificationMessage = $message;
        $this->notificationLink = $link;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->notificationTitle,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
