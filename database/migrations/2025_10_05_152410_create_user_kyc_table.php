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
        Schema::create('user_kyc', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->string('nationality');
            $table->text('address');
            $table->string('city');
            $table->string('state_province');
            $table->string('postal_code');
            $table->string('country');
            $table->string('phone_number');
            $table->string('document_type'); // passport, driver_license, national_id
            $table->string('document_number');
            $table->string('document_front_image')->nullable(); // Path to document front image
            $table->string('document_back_image')->nullable(); // Path to document back image
            $table->string('selfie_image')->nullable(); // Path to selfie image
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            $table->unique('user_id'); // One KYC record per user
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_kyc');
    }
};
