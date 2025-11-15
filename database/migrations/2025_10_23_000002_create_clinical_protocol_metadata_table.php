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
        Schema::create('clinical_protocol_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('file_path')->unique();
            $table->json('medicine_category_ids')->nullable();
            $table->json('mkb_codes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinical_protocol_metadata');
    }
};

