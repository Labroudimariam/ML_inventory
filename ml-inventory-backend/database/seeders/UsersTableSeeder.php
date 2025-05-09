<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'adminuser',
            'phone' => '0600000001',
            'gender' => 'male',
            'cin' => 'AA123456',
            'date_of_birth' => '1980-01-01',
            'address' => '123 Admin Street',
            'permanent_address' => '123 Admin Street',
            'city' => 'Admin City',
            'country' => 'Admin Country',
            'postal_code' => '12345',
            'role' => 'admin',
            'profile_picture' => null,
            'is_driver' => false,
            'driver_license_number' => null,
            'vehicle_type' => null,
            'vehicle_registration' => null,
            'reset_password_token' => null,
            'reset_password_expires' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Subadmin
        User::create([
            'name' => 'Sub Admin User',
            'email' => 'subadmin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'subadminuser',
            'phone' => '0600000002',
            'gender' => 'female',
            'cin' => 'BB654321',
            'date_of_birth' => '1990-05-10',
            'address' => '456 Subadmin Street',
            'permanent_address' => '456 Subadmin Street',
            'city' => 'Subadmin City',
            'country' => 'Subadmin Country',
            'postal_code' => '67890',
            'role' => 'subadmin',
            'profile_picture' => null,
            'is_driver' => false,
            'driver_license_number' => null,
            'vehicle_type' => null,
            'vehicle_registration' => null,
            'reset_password_token' => null,
            'reset_password_expires' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Storekeeper
        User::create([
            'name' => 'Storekeeper User',
            'email' => 'storekeeper@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'storekeeperuser',
            'phone' => '0600000003',
            'gender' => 'male',
            'cin' => 'CC789456',
            'date_of_birth' => '1995-08-15',
            'address' => '789 Storekeeper Street',
            'permanent_address' => '789 Storekeeper Street',
            'city' => 'Storekeeper City',
            'country' => 'Storekeeper Country',
            'postal_code' => '11223',
            'role' => 'storekeeper',
            'profile_picture' => null,
            'is_driver' => false,
            'driver_license_number' => null,
            'vehicle_type' => null,
            'vehicle_registration' => null,
            'reset_password_token' => null,
            'reset_password_expires' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Optional: add a driver user
        User::create([
            'name' => 'Driver User',
            'email' => 'driver@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'driveruser',
            'phone' => '0600000004',
            'gender' => 'male',
            'cin' => 'DD321654',
            'date_of_birth' => '1992-11-25',
            'address' => '101 Driver Road',
            'permanent_address' => '101 Driver Road',
            'city' => 'Driver City',
            'country' => 'Driver Country',
            'postal_code' => '44556',
            'role' => 'driver',
            'profile_picture' => null,
            'is_driver' => true,
            'driver_license_number' => 'DRV123456',
            'vehicle_type' => 'Truck',
            'vehicle_registration' => 'XYZ-789',
            'reset_password_token' => null,
            'reset_password_expires' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
