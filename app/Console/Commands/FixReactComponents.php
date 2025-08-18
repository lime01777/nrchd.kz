<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixReactComponents extends Command
{
    protected $signature = 'fix:react-components';
    protected $description = 'Исправляет проблемы в React компонентах (t() функция, usePage импорт)';

    public function handle()
    {
        $this->info('🔧 Исправление React компонентов...');
        
        $jsxFiles = File::glob(resource_path('js/**/*.jsx'));
        $fixedCount = 0;
        
        foreach ($jsxFiles as $file) {
            $content = File::get($file);
            $originalContent = $content;
            $fileFixed = false;
            
            // Исправление 1: Добавление t() функции если используется
            if (str_contains($content, 't(') && !str_contains($content, 'const t = ')) {
                $content = $this->addTranslationFunction($content);
                $fileFixed = true;
            }
            
            // Исправление 2: Добавление usePage импорта если используется
            if (str_contains($content, 'usePage()') && !preg_match('/import.*usePage.*from.*@inertiajs/', $content)) {
                $content = $this->addUsePageImport($content);
                $fileFixed = true;
            }
            
            // Исправление 3: Исправление route() вызовов без locale
            if (preg_match('/route\([\'"][^\'"]+[\'"]\)/', $content) && 
                !str_contains($content, 'route(') && str_contains($content, '{ locale }')) {
                $content = $this->fixRouteCalls($content);
                $fileFixed = true;
            }
            
            if ($fileFixed) {
                File::put($file, $content);
                $fixedCount++;
                $this->info("✅ Исправлен: " . basename($file));
            }
        }
        
        $this->info("🎉 Исправлено компонентов: {$fixedCount}");
        
        return 0;
    }
    
    private function addTranslationFunction($content)
    {
        // Проверяем, есть ли уже usePage импорт
        if (str_contains($content, 'import.*usePage')) {
            // Добавляем t() функцию после usePage
            $pattern = '/(import.*usePage.*from.*@inertiajs.*react.*;)/';
            $replacement = '$1' . "\n" . '    const { translations } = usePage().props;' . "\n" . '    const t = (key, fallback = \'\') => translations?.[key] || fallback;';
            $content = preg_replace($pattern, $replacement, $content);
        } else {
            // Добавляем usePage импорт и t() функцию
            $pattern = '/(import.*from.*@inertiajs.*react.*;)/';
            $replacement = '$1' . "\n" . 'import { usePage } from \'@inertiajs/react\';' . "\n" . '    const { translations } = usePage().props;' . "\n" . '    const t = (key, fallback = \'\') => translations?.[key] || fallback;';
            $content = preg_replace($pattern, $replacement, $content);
        }
        
        return $content;
    }
    
    private function addUsePageImport($content)
    {
        // Проверяем, есть ли уже usePage в импортах
        if (preg_match('/import.*\{.*usePage.*\}.*from.*@inertiajs/', $content)) {
            return $content; // Уже есть
        }
        
        // Добавляем usePage к существующим импортам из @inertiajs/react
        $pattern = '/import\s+\{([^}]*)\}\s+from\s+[\'"]@inertiajs\/react[\'"]/';
        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, 'import { $1, usePage } from \'@inertiajs/react\'', $content);
        } else {
            // Добавляем новый импорт
            $pattern = '/(import.*from.*@inertiajs.*react.*;)/';
            $replacement = '$1' . "\n" . 'import { usePage } from \'@inertiajs/react\';';
            $content = preg_replace($pattern, $replacement, $content);
        }
        
        return $content;
    }
    
    private function fixRouteCalls($content)
    {
        // Список маршрутов, которые требуют locale параметр
        $routesRequiringLocale = [
            'home', 'news', 'about', 'contacts', 'services', 'documents', 'vacancies',
            'medical.education', 'medical.science', 'medical.accreditation', 'medical.rating',
            'medical.statistics', 'human.resources', 'electronic.health', 'drug.policy',
            'primary.healthcare', 'health.rate', 'health.accounts', 'strategic.initiatives',
            'bioethics', 'clinical.protocols', 'center.prevention', 'direction.tech.competence',
            'branches.astana', 'branches.almaty', 'branches.abay', 'branches.akmola',
            'branches.aktobe', 'branches.almatyregion', 'branches.atyrau', 'branches.east',
            'branches.zhambyl', 'branches.zhetisu', 'branches.west', 'branches.karaganda',
            'branches.kostanay', 'branches.kyzylorda', 'branches.mangistau', 'branches.pavlodar',
            'branches.north', 'branches.turkestan', 'branches.ulytau', 'branches.shymkent',
            'about.centre', 'about.contacts', 'about.faq', 'about.partners', 'salidat.kairbekova',
            'vacancy.jobs', 'services.training', 'services.adsEvaluation', 'services.healthTechAssessment',
            'services.drugExpertise', 'services.educationPrograms', 'services.medicalExpertise',
            'services.accreditation', 'services.postAccreditationMonitoring'
        ];
        
        foreach ($routesRequiringLocale as $route) {
            $pattern = "/route\\(['\"]" . preg_quote($route, '/') . "['\"]\\)/";
            $replacement = "route('{$route}', { locale })";
            $content = preg_replace($pattern, $replacement, $content);
        }
        
        return $content;
    }
}
