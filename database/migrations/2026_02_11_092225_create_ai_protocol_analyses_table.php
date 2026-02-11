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
        Schema::create('ai_protocol_analyses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('indication')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, error
            $table->string('result_path')->nullable();
            $table->text('log')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_protocol_analyses');
    }
};
