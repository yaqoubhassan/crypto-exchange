<?php

namespace App\Models;

use App\Models\Cryptocurrency;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'user_id',
        'cryptocurrency_id',
        'type',
        'amount',
        'fee',
        'price',
        'status',
        'external_tx_id',
        'from_address',
        'to_address',
        'notes',
        'metadata',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'fee' => 'decimal:8',
        'price' => 'decimal:8',
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cryptocurrency()
    {
        return $this->belongsTo(Cryptocurrency::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}

