<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserKyc extends Model
{
    use HasFactory;

    protected $table = 'user_kycs';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'nationality',
        'address',
        'city',
        'state_province',
        'postal_code',
        'country',
        'phone_number',
        'document_type',
        'document_number',
        'document_front_image',
        'document_back_image',
        'selfie_image',
        'verification_status',
        'rejection_reason',
        'verified_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('verification_status', 'approved');
    }
}
