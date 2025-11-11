<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;

/**
 * Политика доступа для модели News
 * 
 * Правила:
 * - viewAny/view: все пользователи
 * - create/update/delete/restore: только роли admin или editor
 */
class NewsPolicy
{
    /**
     * Определяет, может ли пользователь просматривать список новостей
     * Доступно всем
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Определяет, может ли пользователь просматривать конкретную новость
     * Доступно всем
     *
     * @param User $user
     * @param News $news
     * @return bool
     */
    public function view(User $user, News $news): bool
    {
        return true;
    }

    /**
     * Определяет, может ли пользователь создавать новости
     * Только для ролей admin или editor
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'editor'], true);
    }

    /**
     * Определяет, может ли пользователь обновлять новость
     * Только для ролей admin или editor
     *
     * @param User $user
     * @param News $news
     * @return bool
     */
    public function update(User $user, News $news): bool
    {
        return in_array($user->role, ['admin', 'editor'], true);
    }

    /**
     * Определяет, может ли пользователь удалять новость
     * Только для ролей admin или editor
     *
     * @param User $user
     * @param News $news
     * @return bool
     */
    public function delete(User $user, News $news): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Определяет, может ли пользователь восстанавливать удаленную новость
     * Только для ролей admin или editor
     *
     * @param User $user
     * @param News $news
     * @return bool
     */
    public function restore(User $user, News $news): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Определяет, может ли пользователь окончательно удалять новость
     * Только для ролей admin или editor
     *
     * @param User $user
     * @param News $news
     * @return bool
     */
    public function forceDelete(User $user, News $news): bool
    {
        return $user->role === 'admin';
    }
}
