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
        Schema::create('medtech_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('organization'); // Организация/команда
            $table->string('contact_name'); // ФИО контактного лица
            $table->string('contact_email'); // Контактный e-mail
            $table->string('contact_phone')->nullable(); // Контактный телефон
            $table->string('technology_name')->nullable(); // Название технологии
            $table->text('description')->nullable(); // Краткое описание технологии
            $table->string('type')->nullable(); // Тип технологии
            $table->integer('trl')->nullable(); // Уровень TRL (1-9)
            $table->text('pilot_sites')->nullable(); // Предлагаемые пилотные площадки
            $table->string('attachment_path')->nullable(); // Путь к прикрепленному файлу
            $table->string('status')->default('new'); // Статус заявки (new, reviewed, approved, rejected)
            $table->text('admin_notes')->nullable(); // Заметки администратора
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtech_submissions');
    }
};
