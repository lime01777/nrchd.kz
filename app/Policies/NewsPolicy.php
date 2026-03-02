<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;

/**
 * Политика доступа для модели News
 * 
 * Правила:
 * - Пользователь имеет доступ к действиям, если у него есть соответствующее разрешение
 *   (news для обычных новостей, media для материалов из СМИ).
 * - Администратор имеет доступ ко всему автоматически через метод hasPermission.
 */
class NewsPolicy
{
    /**
     * Проверка общего доступа к списку
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('news') || $user->hasPermission('media');
    }

    /**
     * Просмотр конкретной записи
     */
    public function view(User $user, News $news): bool
    {
        return $user->hasPermission($news->type === 'media' ? 'media' : 'news');
    }

    /**
     * Создание новой записи
     */
    public function create(User $user): bool
    {
        // На этапе создания типа в модели еще нет, поэтому проверяем наличие
        // хотя бы одного из разрешений. Контроллер может дополнительно проверить тип.
        return $user->hasPermission('news') || $user->hasPermission('media');
    }

    /**
     * Обновление записи
     */
    public function update(User $user, News $news): bool
    {
        return $user->hasPermission($news->type === 'media' ? 'media' : 'news');
    }

    /**
     * Удаление записи
     */
    public function delete(User $user, News $news): bool
    {
        return $user->hasPermission($news->type === 'media' ? 'media' : 'news');
    }

    /**
     * Восстановление удаленной записи
     */
    public function restore(User $user, News $news): bool
    {
        return $user->hasPermission($news->type === 'media' ? 'media' : 'news');
    }

    /**
     * Окончательное удаление записи
     */
    public function forceDelete(User $user, News $news): bool
    {
        return $user->hasPermission($news->type === 'media' ? 'media' : 'news');
    }
}
