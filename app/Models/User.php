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
        'profile_picture',
        'phone',
        'bio',
        'location',
        'is_active',
        'is_admin',
        'status',
        'kyc_status',
        'two_factor_enabled',
        'last_login_at',
        'last_login_ip',

        // Notification preferences
        'email_notifications_enabled',
        'email_trading_alerts',
        'email_wallet_transactions',
        'email_security_alerts',
        'email_marketing',
        'browser_notifications_enabled',
        'browser_trading_alerts',
        'browser_wallet_transactions',

        // Display preferences
        'theme',
        'language',
        'timezone',
        'currency_display',
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
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'is_active' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'email_notifications_enabled' => 'boolean',
        'email_trading_alerts' => 'boolean',
        'email_wallet_transactions' => 'boolean',
        'email_security_alerts' => 'boolean',
        'email_marketing' => 'boolean',
        'browser_notifications_enabled' => 'boolean',
        'browser_trading_alerts' => 'boolean',
        'browser_wallet_transactions' => 'boolean',
    ];

    /**
     * Get all wallets for the user (one per cryptocurrency).
     */
    public function wallets()
    {
        return $this->hasMany(Wallet::class);
    }

    /**
     * Get the primary/default wallet for the user.
     * This returns the first wallet or the one marked as primary.
     * Useful for displaying a single wallet in admin panel.
     */
    public function wallet()
    {
        // Option 1: Return the first wallet
        return $this->hasOne(Wallet::class)->oldest();

        // Option 2: If you have an 'is_primary' column in wallets table:
        // return $this->hasOne(Wallet::class)->where('is_primary', true);

        // Option 3: Return wallet for a specific default cryptocurrency (e.g., BTC):
        // return $this->hasOne(Wallet::class)->where('cryptocurrency_id', 1);
    }

    /**
     * Get the transactions for the user.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the orders for the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the KYC information for the user.
     */
    public function kyc()
    {
        return $this->hasOne(UserKyc::class);
    }

    /**
     * Get all notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get unread notifications for the user.
     */
    public function unreadNotifications()
    {
        return $this->hasMany(Notification::class)->where('is_read', false);
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include verified users.
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope a query to only include users with verified KYC.
     */
    public function scopeKycVerified($query)
    {
        return $query->where('kyc_status', 'verified');
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Check if user account is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->is_active === true;
    }

    /**
     * Check if user has verified their email.
     */
    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    /**
     * Check if user has verified KYC.
     */
    public function hasVerifiedKyc(): bool
    {
        return $this->kyc_status === 'verified';
    }

    /**
     * Get wallet balance for a specific cryptocurrency.
     */
    public function getWalletBalance($cryptocurrencyId)
    {
        $wallet = $this->wallets()->where('cryptocurrency_id', $cryptocurrencyId)->first();
        return $wallet ? $wallet->balance : 0;
    }

    /**
     * Get wallet for a specific cryptocurrency.
     */
    public function getWallet($cryptocurrencyId)
    {
        return $this->wallets()->where('cryptocurrency_id', $cryptocurrencyId)->first();
    }

    /**
     * Create a wallet for a cryptocurrency if it doesn't exist.
     */
    public function createWalletIfNotExists($cryptocurrencyId)
    {
        return $this->wallets()->firstOrCreate([
            'cryptocurrency_id' => $cryptocurrencyId,
        ], [
            'balance' => 0,
            'locked_balance' => 0,
        ]);
    }

    /**
     * Get total balance across all wallets (in USD or base currency).
     * You'll need to implement conversion rates.
     */
    public function getTotalBalance()
    {
        // return $this->wallets()->sum('balance');
        return $this->wallets()
            ->with('cryptocurrency')
            ->get()
            ->sum(function ($wallet) {
                $price = $wallet->cryptocurrency->current_price ?? 0;
                return ($wallet->balance + $wallet->locked_balance) * $price;
            });
    }
}
