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
            // Добавляем новые поля для вакансий
            $table->json('functional_responsibilities')->nullable()->after('body'); // Функциональные обязанности
            $table->json('qualification_requirements')->nullable()->after('functional_responsibilities'); // Квалификационные требования
            $table->json('application_procedure')->nullable()->after('qualification_requirements'); // Порядок подачи заявки
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            // Удаляем добавленные поля
            $table->dropColumn([
                'functional_responsibilities',
                'qualification_requirements', 
                'application_procedure'
            ]);
        });
    }
};
