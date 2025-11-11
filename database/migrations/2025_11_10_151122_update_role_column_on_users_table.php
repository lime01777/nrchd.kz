<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        // Жёстко нормализуем колонку role: длина 20 символов, значение по умолчанию и индекс.
        if (Schema::hasColumn('users', 'role')) {
            $driver = Schema::getConnection()->getDriverName();

            if (in_array($driver, ['mysql', 'mariadb'], true)) {
                DB::statement("ALTER TABLE users MODIFY role VARCHAR(20) NOT NULL DEFAULT 'user'");
            } elseif ($driver === 'pgsql') {
                DB::statement("ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20)");
                DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
            }
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 20)->default('user')->after('email');
            });
        }

        try {
            Schema::table('users', function (Blueprint $table) {
                // Индекс ускоряет выборку по роли (например, для отчётов).
                $table->index('role');
            });
        } catch (\Throwable $e) {
            // Индекс уже существует — пропускаем, оставляя комментарий для будущей чистки.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('users') || ! Schema::hasColumn('users', 'role')) {
            return;
        }

        try {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex('users_role_index');
            });
        } catch (\Throwable $e) {
            // Индекса нет — ничего не делаем.
        }

        // Возвращаем исходную ширину строки (Laravel по умолчанию использует VARCHAR(255)).
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(255) NOT NULL DEFAULT 'user'");
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(255)");
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
        }
    }
};
