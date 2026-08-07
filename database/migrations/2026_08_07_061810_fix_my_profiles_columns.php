<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('my_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('my_profiles', 'title')) {
                $table->dropColumn('title');
            }
            if (Schema::hasColumn('my_profiles', 'description')) {
                $table->dropColumn('description');
            }

            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('institution_name')->nullable();
            $table->text('institution_address')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('my_profiles', function (Blueprint $table) {
            $columns = ['user_id', 'full_name', 'email', 'phone', 'address', 'institution_name', 'institution_address', 'start_date', 'end_date', 'status', 'notes'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('my_profiles', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
