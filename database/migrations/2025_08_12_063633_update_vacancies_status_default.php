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
        Schema::table('vacancies', function (Blueprint $table) {
            // Изменяем значение по умолчанию для поля status с 'draft' на 'published'
            $table->enum('status', ['draft', 'published'])->default('published')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            // Возвращаем значение по умолчанию обратно на 'draft'
            $table->enum('status', ['draft', 'published'])->default('draft')->change();
        });
    }
};
