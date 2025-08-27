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
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Заголовок вакансии
            $table->string('slug')->unique(); // URL-слаг
            $table->text('excerpt')->nullable(); // Краткое описание
            $table->json('body')->nullable(); // Основной контент
            $table->string('city')->nullable(); // Город
            $table->string('department')->nullable(); // Отдел
            $table->string('employment_type')->nullable(); // Тип занятости
            $table->enum('status', ['draft', 'published'])->default('draft'); // Статус
            $table->timestamp('published_at')->nullable(); // Дата публикации
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
