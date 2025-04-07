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
        // Insert the admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),  
            'username' => 'adminuser',
            'date_of_birth' => '1980-01-01',
            'address' => '123 Admin Street',
            'permanent_address' => '123 Admin Street',
            'city' => 'Admin City',
            'country' => 'Admin Country',
            'postal_code' => '12345',
            'role' => 'admin',
            'profile_picture' => null, 
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert the subadmin user
        User::create([
            'name' => 'Sub Admin User',
            'email' => 'subadmin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'subadminuser',
            'date_of_birth' => '1990-05-10',
            'address' => '456 Subadmin Street',
            'permanent_address' => '456 Subadmin Street',
            'city' => 'Subadmin City',
            'country' => 'Subadmin Country',
            'postal_code' => '67890',
            'role' => 'subadmin',
            'profile_picture' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert the storekeeper user
        User::create([
            'name' => 'Storekeeper User',
            'email' => 'storekeeper@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'username' => 'storekeeperuser',
            'date_of_birth' => '1995-08-15',
            'address' => '789 Storekeeper Street',
            'permanent_address' => '789 Storekeeper Street',
            'city' => 'Storekeeper City',
            'country' => 'Storekeeper Country',
            'postal_code' => '11223',
            'role' => 'storekeeper',
            'profile_picture' => null,
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
