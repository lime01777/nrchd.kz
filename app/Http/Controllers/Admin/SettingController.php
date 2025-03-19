<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        // Здесь будет логика получения настроек сайта
        // Пока возвращаем тестовые данные
        $settings = [
            'general' => [
                'site_name' => 'НРЦРЗ',
                'site_description' => 'Национальный Республиканский Центр Развития Здравоохранения',
                'contact_email' => 'info@nrchd.kz',
                'contact_phone' => '+7 (7172) 70-15-50',
                'address' => 'г. Астана, ул. Иманова, 13',
            ],
            'social' => [
                'facebook' => 'https://facebook.com/nrchd',
                'instagram' => 'https://instagram.com/nrchd.kz',
                'twitter' => 'https://twitter.com/nrchd',
                'youtube' => 'https://youtube.com/nrchd',
            ],
            'backup' => [
                'auto_backup' => true,
                'backup_frequency' => 'daily',
                'backup_retention' => 7,
            ],
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(Request $request)
    {
        // Валидация данных
        $validated = $request->validate([
            'general.site_name' => 'required|string|max:255',
            'general.site_description' => 'required|string',
            'general.contact_email' => 'required|email',
            'general.contact_phone' => 'required|string|max:255',
            'general.address' => 'required|string|max:255',
            'social.facebook' => 'nullable|url',
            'social.instagram' => 'nullable|url',
            'social.twitter' => 'nullable|url',
            'social.youtube' => 'nullable|url',
            'backup.auto_backup' => 'boolean',
            'backup.backup_frequency' => 'required|string|in:daily,weekly,monthly',
            'backup.backup_retention' => 'required|integer|min:1|max:30',
        ]);

        // Здесь будет логика сохранения настроек

        return redirect()->route('admin.settings')->with('success', 'Настройки успешно сохранены');
    }

    /**
     * Create a backup.
     */
    public function createBackup()
    {
        // Здесь будет логика создания резервной копии

        return redirect()->route('admin.settings')->with('success', 'Резервная копия успешно создана');
    }
}
