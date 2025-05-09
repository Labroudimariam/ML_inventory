<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('username')->unique();
            $table->string('phone')->unique();
            $table->string('gender')->nullable();
            $table->string('cin')->unique();
            $table->date('date_of_birth');
            $table->text('address');
            $table->text('permanent_address')->nullable();
            $table->string('city');
            $table->string('country');
            $table->string('postal_code')->nullable();
            $table->enum('role', ['admin', 'subadmin', 'storekeeper', 'driver'])->default('storekeeper');
            $table->string('profile_picture')->nullable();
            
            // New driver-specific fields
            $table->boolean('is_driver')->default(false);
            $table->string('driver_license_number')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('vehicle_registration')->nullable();
            
            $table->string('reset_password_token')->nullable();
            $table->timestamp('reset_password_expires')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};