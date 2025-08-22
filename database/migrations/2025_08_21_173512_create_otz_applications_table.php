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
        Schema::create('otz_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_id')->unique(); // OT3-2025-XXXX
            $table->string('title'); // Название проекта
            $table->enum('category', ['Комплексная', 'Простая']); // Категория
            $table->enum('current_stage', [
                'Подача заявки',
                'Проверка документов', 
                'Проведение ОТЗ',
                'Рассмотрение комиссиями',
                'Бюджетное одобрение',
                'Формирование тарифов'
            ]); // Текущий этап
            $table->text('description')->nullable(); // Описание проекта
            $table->string('responsible_person')->nullable(); // Ответственное лицо
            $table->string('phone')->nullable(); // Телефон
            $table->string('email')->nullable(); // Email
            $table->date('stage_start_date')->nullable(); // Дата начала этапа
            $table->date('stage_end_date')->nullable(); // Дата окончания этапа
            $table->json('stage_documents')->nullable(); // Документы по этапу
            $table->json('stage_progress')->nullable(); // Прогресс по этапам
            $table->boolean('is_active')->default(true); // Активна ли заявка
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otz_applications');
    }
};
