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
        // Schema::create('document_categories', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('title');
        //     $table->string('accordion_id')->nullable();
        //     $table->integer('order')->default(0);
        //     $table->boolean('is_active')->default(true);
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_categories');
    }
};
