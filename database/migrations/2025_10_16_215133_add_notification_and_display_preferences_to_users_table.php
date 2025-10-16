<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Email notification preferences
            $table->boolean('email_notifications_enabled')->default(true)->after('location');
            $table->boolean('email_trading_alerts')->default(true)->after('email_notifications_enabled');
            $table->boolean('email_wallet_transactions')->default(true)->after('email_trading_alerts');
            $table->boolean('email_security_alerts')->default(true)->after('email_wallet_transactions');
            $table->boolean('email_marketing')->default(false)->after('email_security_alerts');

            // Browser/Push notification preferences
            $table->boolean('browser_notifications_enabled')->default(true)->after('email_marketing');
            $table->boolean('browser_trading_alerts')->default(true)->after('browser_notifications_enabled');
            $table->boolean('browser_wallet_transactions')->default(true)->after('browser_trading_alerts');

            // Display preferences
            $table->string('theme')->default('light')->after('browser_wallet_transactions'); // light, dark, system
            $table->string('language')->default('en')->after('theme');
            $table->string('timezone')->default('UTC')->after('language');
            $table->string('currency_display')->default('USD')->after('timezone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email_notifications_enabled',
                'email_trading_alerts',
                'email_wallet_transactions',
                'email_security_alerts',
                'email_marketing',
                'browser_notifications_enabled',
                'browser_trading_alerts',
                'browser_wallet_transactions',
                'theme',
                'language',
                'timezone',
                'currency_display',
            ]);
        });
    }
};
