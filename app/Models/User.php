<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Проверяет, является ли пользователь администратором
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Проверяет, является ли пользователь редактором новостей.
     */
    public function isEditor(): bool
    {
        return $this->role === 'editor';
    }

    /**
     * Проверяет, является ли пользователь менеджером документов
     */
    public function isDocumentManager(): bool
    {
        return $this->role === 'document_manager';
    }

    /**
     * Проверяет, имеет ли пользователь доступ к админ-панели
     */
    public function hasAdminAccess(): bool
    {
        return $this->isAdmin() || $this->isEditor() || $this->isDocumentManager();
    }
}
