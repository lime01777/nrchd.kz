<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixSpecificRoutes extends Command
{
    protected $signature = 'fix:specific-routes';
    protected $description = 'Fix specific routes that require locale parameter';

    public function handle()
    {
        $this->info('🔧 Fixing specific routes that require locale parameter...');
        
        $filesToFix = [
            'resources/js/Components/Header.jsx',
            'resources/js/Components/News.jsx',
            'resources/js/Pages/VacancyShow.jsx',
            'resources/js/Pages/Direction/DrugPolicy.jsx',
            'resources/js/Pages/Direction/Bioethics.jsx',
            'resources/js/Pages/Direction/HealthRate.jsx',
            'resources/js/Pages/Direction/ClinicalProtocols/Catalog.jsx',
            'resources/js/Pages/Direction/ClinicalProtocols/Monitoring.jsx',
            'resources/js/Pages/Direction/ClinicalProtocols/Commission.jsx',
            'resources/js/Pages/Direction/Bioethics/LocalCommissions.jsx',
            'resources/js/Pages/Direction/Bioethics/Expertise.jsx',
            'resources/js/Pages/Direction/Bioethics/Composition.jsx',
            'resources/js/Pages/Direction/Bioethics/Certification.jsx',
            'resources/js/Pages/Direction/Bioethics/Biobanks.jsx',
            'resources/js/Pages/Direction/Accreditation/TrainingMaterials.jsx',
            'resources/js/Pages/Direction/Accreditation/StandardsArchive.jsx',
            'resources/js/Pages/Direction/Accreditation/Guides.jsx',
            'resources/js/Pages/Direction/Accreditation/Experts.jsx',
            'resources/js/Pages/Direction/Accreditation/Commission.jsx',
            'resources/js/Pages/Direction/Accreditation/ActiveStandards.jsx',
            'resources/js/Pages/Direction/HumanResources/MedicalWorkers.jsx',
            'resources/js/Pages/Direction/HumanResources/Managers.jsx',
            'resources/js/Pages/Direction/HumanResources/Graduates.jsx',
            'resources/js/Pages/Direction/HealthRate/QualityCommission.jsx',
            'resources/js/Pages/Direction/DrugPolicy/Regulations.jsx',
            'resources/js/Pages/Direction/DrugPolicy/Commission.jsx',
        ];
        
        $fixedCount = 0;
        
        foreach ($filesToFix as $file) {
            if (File::exists($file)) {
                $content = File::get($file);
                $originalContent = $content;
                
                // Исправляем маршруты
                $content = $this->fixRoutes($content);
                
                if ($content !== $originalContent) {
                    File::put($file, $content);
                    $this->info("✅ Fixed: {$file}");
                    $fixedCount++;
                }
            }
        }
        
        $this->info("🎉 Fixed {$fixedCount} files!");
        return 0;
    }
    
    private function fixRoutes($content)
    {
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
        
        // Исправляем конкретные маршруты
        $routeReplacements = [
            "route('home')" => "route('home', { locale })",
            "route('news')" => "route('news', { locale })",
            "route('vacancy.jobs')" => "route('about.vacancy', { locale })",
            "route('drug.policy.commission')" => "route('drug.policy.commission', { locale })",
            "route('drug.policy.regulations')" => "route('drug.policy.regulations', { locale })",
            "route('bioethics.composition')" => "route('bioethics.composition', { locale })",
            "route('bioethics.expertise')" => "route('bioethics.expertise', { locale })",
            "route('bioethics.certification')" => "route('bioethics.certification', { locale })",
            "route('bioethics.biobanks')" => "route('bioethics.biobanks', { locale })",
            "route('bioethics.local-commissions')" => "route('bioethics.local-commissions', { locale })",
            "route('health.rate.omt.reports')" => "route('health.rate.omt.reports', { locale })",
            "route('health.rate.quality.commission')" => "route('health.rate.quality.commission', { locale })",
            "route('clinical.protocols')" => "route('clinical.protocols', { locale })",
            "route('medical.accreditation')" => "route('medical.accreditation', { locale })",
            "route('human.resources')" => "route('human.resources', { locale })",
            "route('drug.policy')" => "route('drug.policy', { locale })",
            "route('health.rate')" => "route('health.rate', { locale })",
            "route('bioethics')" => "route('bioethics', { locale })",
        ];
        
        foreach ($routeReplacements as $oldRoute => $newRoute) {
            $content = str_replace($oldRoute, $newRoute, $content);
        }
        
        return $content;
    }
}
