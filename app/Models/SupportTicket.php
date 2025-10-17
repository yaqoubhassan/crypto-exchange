<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ticket_number',
        'subject',
        'category',
        'priority',
        'message',
        'status',
        'attachments',
        'admin_response',
        'resolved_at',
        'resolved_by'
    ];

    protected $casts = [
        'attachments' => 'array',
        'resolved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the ticket
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who resolved the ticket
     */
    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Scope a query to only include open tickets
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Scope a query to only include closed tickets
     */
    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return match ($this->status) {
            'open' => 'blue',
            'in_progress' => 'yellow',
            'resolved' => 'green',
            'closed' => 'gray',
            default => 'gray'
        };
    }

    /**
     * Get priority badge color
     */
    public function getPriorityColorAttribute()
    {
        return match ($this->priority) {
            'low' => 'gray',
            'medium' => 'blue',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray'
        };
    }
}
