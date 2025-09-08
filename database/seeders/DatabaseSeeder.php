<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\NewsSeeder;
use Database\Seeders\TestNewsSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@nrchd.kz',
            'password' => bcrypt('Admin12345'),
        ]);
        
        // Запуск сидера для тестовых новостей
        $this->call(TestNewsSeeder::class);
        
        $this->call([
            NewsSeeder::class,
            TranslationSeeder::class,
        ]);
    }
}
