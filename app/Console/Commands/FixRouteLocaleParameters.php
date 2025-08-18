<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixRouteLocaleParameters extends Command
{
    protected $signature = 'fix:route-locale-parameters';
    protected $description = 'Fix route calls that require locale parameter';

    // Маршруты, которые требуют параметр locale
    protected $routesRequiringLocale = [
        // Клинические протоколы
        'clinical.protocols',
        'clinical.protocols.catalog',
        'clinical.protocols.monitoring',
        'clinical.protocols.commission',
        
        // Направления
        'medical.education',
        'human.resources',
        'electronic.health',
        'medical.accreditation',
        'health.rate',
        'strategic.initiatives',
        'medical.rating',
        'medical.science',
        'bioethics',
        'drug.policy',
        'primary.healthcare',
        'health.accounts',
        'medical.statistics',
        'direction.tech.competence',
        'center.prevention',
        
        // О центре
        'about.centre',
        'salidat.kairbekova',
        'about.vacancy',
        'about.faq',
        'about.contacts',
        'about.partners',
        
        // Услуги
        'services.training',
        'services.adsEvaluation',
        'services.healthTechAssessment',
        'services.drugExpertise',
        'services.educationPrograms',
        'services.medicalExpertise',
        'services.accreditation',
        'services.postAccreditationMonitoring',
        
        // Филиалы
        'branches.astana',
        'branches.almaty',
        'branches.abay',
        'branches.akmola',
        'branches.aktobe',
        'branches.almatyregion',
        'branches.atyrau',
        'branches.east',
        'branches.zhambyl',
        'branches.zhetisu',
        'branches.west',
        'branches.karaganda',
        'branches.kostanay',
        'branches.kyzylorda',
        'branches.mangistau',
        'branches.pavlodar',
        'branches.north',
        'branches.turkestan',
        'branches.ulytau',
        'branches.shymkent',
        
        // Основные страницы
        'news',
        'about',
        'contacts',
        'documents',
        'services',
        'vacancies',
        'home'
    ];

    public function handle()
    {
        $this->info('🔧 Fixing route calls that require locale parameter...');
        
        $jsxFiles = $this->findJsxFiles();
        $fixedCount = 0;
        
        foreach ($jsxFiles as $file) {
            $content = File::get($file);
            $originalContent = $content;
            
            foreach ($this->routesRequiringLocale as $routeName) {
                // Ищем вызовы route('routeName') без параметров
                $pattern = "/route\\(['\"`]\\Q{$routeName}\\E['\"`]\\)/";
                $replacement = "route('{$routeName}', { locale })";
                
                if (preg_match($pattern, $content)) {
                    $content = preg_replace($pattern, $replacement, $content);
                    
                    // Добавляем импорт usePage если его нет
                    if (strpos($content, 'usePage') === false && strpos($content, 'import') !== false) {
                        $content = preg_replace(
                            '/import\s+([^}]+)\s+from\s+[\'"`]@inertiajs\/react[\'"`]/',
                            'import { $1, usePage } from \'@inertiajs/react\'',
                            $content
                        );
                    }
                    
                    // Добавляем получение locale если его нет
                    if (strpos($content, 'const { locale }') === false && strpos($content, 'usePage') !== false) {
                        $content = preg_replace(
                            '/(function\s+\w+\s*\([^)]*\)\s*\{)/',
                            '$1' . "\n  const { locale } = usePage().props;",
                            $content
                        );
                    }
                }
            }
            
            if ($content !== $originalContent) {
                File::put($file, $content);
                $this->info("✅ Fixed: {$file}");
                $fixedCount++;
            }
        }
        
        $this->info("🎉 Fixed {$fixedCount} files!");
        return 0;
    }
    
    private function findJsxFiles()
    {
        $files = [];
        $directories = [
            'resources/js/Components',
            'resources/js/Pages',
            'resources/js/Layouts'
        ];
        
        foreach ($directories as $directory) {
            if (File::exists($directory)) {
                $jsxFiles = File::glob($directory . '/**/*.jsx');
                $files = array_merge($files, $jsxFiles);
            }
        }
        
        return $files;
    }
}
