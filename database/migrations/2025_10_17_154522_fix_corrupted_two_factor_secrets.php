<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Find all users with 2FA enabled
        $users = DB::table('users')
            ->where('two_factor_enabled', true)
            ->whereNotNull('two_factor_secret')
            ->get();

        foreach ($users as $user) {
            try {
                // Try to decrypt the secret
                decrypt($user->two_factor_secret);
                // If it works, leave it as is
            } catch (\Exception $e) {
                // If decryption fails, disable 2FA for this user
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'two_factor_enabled' => false,
                        'two_factor_secret' => null,
                    ]);

                Log::warning("Disabled corrupted 2FA for user ID: {$user->id}");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot reverse this migration
    }
};
