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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // login, logout, profile_updated, password_changed, etc.
            $table->string('description'); // Human-readable description
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('device')->nullable(); // Desktop, Mobile, Tablet
            $table->string('browser')->nullable(); // Chrome, Firefox, Safari, etc.
            $table->string('platform')->nullable(); // Windows, macOS, iOS, Android, Linux
            $table->json('properties')->nullable(); // Additional data (changes made, etc.)
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
