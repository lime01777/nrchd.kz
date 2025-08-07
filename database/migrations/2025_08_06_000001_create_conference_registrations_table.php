<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Запуск миграции.
     */
    public function up(): void
    {
        Schema::create('conference_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Имя участника
            $table->string('surname'); // Фамилия участника
            $table->string('email'); // Email участника
            $table->string('phone'); // Телефон участника
            $table->string('organization'); // Организация
            $table->string('position'); // Должность
            $table->enum('type', ['participant', 'speaker']); // Тип участия: участник или докладчик
            $table->text('topic')->nullable(); // Тема доклада (для спикеров)
            $table->string('participant_category')->nullable(); // Категория участника (для расчета стоимости)
            $table->string('ip_address')->nullable(); // IP-адрес при регистрации
            $table->boolean('payment_status')->default(false); // Статус оплаты
            $table->timestamps();
        });
    }

    /**
     * Откат миграции.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_registrations');
    }
};
