<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateExistingUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update all existing users with default values for new columns
        DB::table('users')->whereNull('status')->update([
            'status' => 'active',
        ]);

        DB::table('users')->whereNull('kyc_status')->update([
            'kyc_status' => 'pending',
        ]);

        DB::table('users')->whereNull('is_active')->update([
            'is_active' => true,
        ]);

        DB::table('users')->whereNull('two_factor_enabled')->update([
            'two_factor_enabled' => false,
        ]);

        $this->command->info('Existing users updated successfully!');
    }
}
