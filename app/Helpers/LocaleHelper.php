<?php

namespace App\Helpers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;

class LocaleHelper
{
    /**
     * Генерирует URL с префиксом текущего языка
     *
     * @param string $name Имя маршрута
     * @param array $parameters Параметры маршрута
     * @param bool $absolute Абсолютный URL или относительный
     * @return string
     */
    public static function route($name, $parameters = [], $absolute = true)
    {
        // Добавляем текущий язык в параметры маршрута
        $parameters['locale'] = App::getLocale();
        
        return route($name, $parameters, $absolute);
    }
    
    /**
     * Генерирует URL для переключения на другой язык
     *
     * @param string $locale Код языка (ru, kz, en)
     * @return string
     */
    public static function switchLocaleUrl($locale)
    {
        // Получаем текущий URL
        $currentUrl = URL::current();
        
        // Текущий язык
        $currentLocale = App::getLocale();
        
        // Заменяем текущий язык на новый в URL
        return str_replace('/' . $currentLocale . '/', '/' . $locale . '/', $currentUrl);
    }
    
    /**
     * Возвращает массив доступных языков с их названиями
     *
     * @return array
     */
    public static function getAvailableLocales()
    {
        return [
            'ru' => 'Русский',
            'kz' => 'Қазақша',
            'en' => 'English'
        ];
    }
    
    /**
     * Проверяет, является ли указанный язык текущим
     *
     * @param string $locale Код языка
     * @return bool
     */
    public static function isCurrentLocale($locale)
    {
        return App::getLocale() === $locale;
    }
}
