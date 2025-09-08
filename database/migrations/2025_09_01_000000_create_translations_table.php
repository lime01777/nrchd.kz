<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Таблица key-value переводов с пространствами имён и контекстом.
 */
return new class extends Migration {
    public function up(): void {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('key', 191);
            $table->string('locale', 10);
            $table->text('value');
            $table->string('namespace', 64)->nullable();
            $table->string('context', 64)->nullable();
            $table->timestamps();

            $table->unique(['key','locale','namespace','context'], 'uniq_key_locale_ns_ctx');
            $table->index(['locale','key']);
        });
    }
    
    public function down(): void {
        Schema::dropIfExists('translations');
    }
};
