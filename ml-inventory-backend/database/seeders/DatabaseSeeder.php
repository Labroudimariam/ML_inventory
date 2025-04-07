<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call UsersTableSeeder to insert user data
        $this->call(UsersTableSeeder::class);
    }
}
