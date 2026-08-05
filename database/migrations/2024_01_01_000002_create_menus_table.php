<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('module_key');
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('route_path');
            $table->string('frontend_path')->nullable();
            $table->string('backend_controller')->nullable();
            $table->string('backend_service')->nullable();
            $table->string('backend_repository')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('menus')->noActionOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};