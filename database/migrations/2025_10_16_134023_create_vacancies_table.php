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
        // Проверяем, существует ли таблица
        if (Schema::hasTable('vacancies')) {
            return;
        }
        
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->json('body')->nullable(); // Структурированное описание
            $table->json('functional_responsibilities')->nullable(); // Функциональные обязанности
            $table->json('qualification_requirements')->nullable(); // Квалификационные требования
            $table->json('application_procedure')->nullable(); // Порядок подачи заявок
            $table->string('city')->nullable();
            $table->string('department')->nullable();
            $table->string('employment_type')->nullable(); // Тип занятости (полная, частичная, контракт)
            $table->string('status')->default('draft'); // published, draft, archived
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            // Индексы для оптимизации запросов
            $table->index('status');
            $table->index('slug');
            $table->index('published_at');
            $table->index('city');
        });

        // Таблица для заявок на вакансии
        Schema::create('vacancy_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('cover_letter')->nullable();
            $table->string('resume_path')->nullable(); // Путь к файлу резюме
            $table->json('additional_data')->nullable(); // Дополнительные данные
            $table->string('status')->default('new'); // new, reviewed, shortlisted, rejected, accepted
            $table->text('notes')->nullable(); // Заметки администратора
            $table->timestamps();
            
            // Индексы
            $table->index('vacancy_id');
            $table->index('status');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancy_applications');
        Schema::dropIfExists('vacancies');
    }
};
