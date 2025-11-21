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
        Schema::create('medtech_registry', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Название технологии/проекта
            $table->text('description')->nullable(); // Краткое описание
            $table->string('type')->nullable(); // Тип (Software, Hardware, Медицинское изделие, Сервис, Методика)
            $table->string('application_area')->nullable(); // Область применения (кардиология, онкология и т.д.)
            $table->integer('trl')->nullable(); // TRL (1-9)
            $table->string('status')->nullable(); // Статус (Идея, Экспертиза, Пилот, Апробация, Внедрено)
            $table->string('developer')->nullable(); // Разработчик (организация/команда)
            $table->text('pilot_sites')->nullable(); // Пилотные площадки (краткое указание)
            $table->text('full_description')->nullable(); // Полное описание для карточки
            $table->boolean('is_active')->default(true); // Активна ли запись
            $table->integer('order')->default(0); // Порядок сортировки
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtech_registry');
    }
};
