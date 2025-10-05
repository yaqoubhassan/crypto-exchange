<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'is_active' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    public function wallets()
    {
        return $this->hasMany(Wallet::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function kyc()
    {
        return $this->hasOne(UserKyc::class);
    }

    public function getWalletBalance($cryptocurrencyId)
    {
        $wallet = $this->wallets()->where('cryptocurrency_id', $cryptocurrencyId)->first();
        return $wallet ? $wallet->balance : 0;
    }

    public function createWalletIfNotExists($cryptocurrencyId)
    {
        return $this->wallets()->firstOrCreate([
            'cryptocurrency_id' => $cryptocurrencyId,
        ], [
            'balance' => 0,
            'locked_balance' => 0,
        ]);
    }
}