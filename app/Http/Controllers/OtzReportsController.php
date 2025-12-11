<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class OtzReportsController extends Controller
{
    /**
     * Базовый путь к папке с отчетами ОТЗ
     */
    private function getReportsBasePath()
    {
        return public_path('storage/documents/Оценка технологии здравоохранения/Папка — Отчеты ОМТ');
    }

    /**
     * Отображает страницу отчетов ОТЗ с фильтрами по годам и наименованию
     */
    public function index(Request $request)
    {
        // Получаем список годов из папок
        $years = $this->getAvailableYears();
        
        // Получаем выбранный год из запроса (если есть)
        $selectedYear = $request->input('year', '');

        return Inertia::render('Direction/HealthRate/OtzReports', [
            'years' => $years,
            'selectedYear' => $selectedYear,
        ]);
    }

    /**
     * Получает список доступных годов из папок
     */
    private function getAvailableYears()
    {
        $basePath = $this->getReportsBasePath();
        
        if (!File::isDirectory($basePath)) {
            Log::warning('Папка с отчетами ОТЗ не найдена', ['path' => $basePath]);
            return [];
        }

        $years = [];
        $directories = File::directories($basePath);
        
        foreach ($directories as $directory) {
            $folderName = basename($directory);
            // Проверяем, является ли имя папки годом (4 цифры)
            if (preg_match('/^\d{4}$/', $folderName)) {
                $years[] = $folderName;
            }
        }
        
        // Сортируем годы по убыванию (новые сначала)
        rsort($years);
        
        return $years;
    }

}
