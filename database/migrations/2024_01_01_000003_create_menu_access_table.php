<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_access', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('menu_id');
            $table->boolean('can_view')->default(true);
            $table->boolean('can_create')->default(false);
            $table->boolean('can_edit')->default(false);
            $table->boolean('can_delete')->default(false);
            $table->timestamps();

            $table->foreign('group_id')->references('id')->on('groups')->noActionOnDelete();
            $table->foreign('menu_id')->references('id')->on('menus')->noActionOnDelete();
            $table->unique(['group_id', 'menu_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_access');
    }
};