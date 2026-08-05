<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'group_id',
        'username',
        'name',
        'email',
        'password',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active'          => 'boolean',
        'password'           => 'hashed',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isAdmin(): bool
    {
        return $this->group && $this->group->isAdmin();
    }

    public function hasMenuAccess(string $moduleKey, string $permission = 'can_view'): bool
    {
        if (!$this->group) {
            return false;
        }

        $menu = Menu::where('module_key', $moduleKey)->first();

        if (!$menu) {
            return false;
        }

        $access = MenuAccess::where('group_id', $this->group_id)
            ->where('menu_id', $menu->id)
            ->first();

        return $access && $access->{$permission};
    }
}