<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Назначаем роль admin первому пользователю или пользователю из ENV.
        $primaryAdmin = User::query()->find(1);

        $envAdminEmail = env('ADMIN_EMAIL');
        $emailAdmin = null;

        if ($envAdminEmail) {
            $emailAdmin = User::query()->where('email', $envAdminEmail)->first();
        }

        $targetUser = $emailAdmin ?? $primaryAdmin;

        if (! $targetUser) {
            $this->command?->warn('AdminRoleSeeder: администратор не найден, проверьте наличие пользователя с id=1 или переменную ADMIN_EMAIL.');

            return;
        }

        if ($targetUser->role !== 'admin') {
            $targetUser->forceFill([
                'role' => 'admin',
            ])->save();

            $this->command?->info(sprintf('AdminRoleSeeder: пользователю %s присвоена роль admin.', $targetUser->email ?? $targetUser->id));
        }
    }
}
