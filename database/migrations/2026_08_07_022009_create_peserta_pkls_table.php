<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta_pkls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('full_name');
            $table->string('student_number')->nullable();
            $table->string('institution_name');
            $table->string('major')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('supervisor_name')->nullable();
            $table->string('mentor_name')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_pkls');
    }
};