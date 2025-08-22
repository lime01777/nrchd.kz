<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RemoveSubRoutesFromWeb extends Command
{
    protected $signature = 'remove:sub-routes-from-web';
    protected $description = 'Remove sub-routes from web.php that are now in localized.php';

    public function handle()
    {
        $this->info('🔧 Removing sub-routes from web.php...');
        
        // Читаем web.php
        $content = File::get('routes/web.php');
        
        // Список подмаршрутов для удаления
        $routesToRemove = [
            // Подмаршруты медицинского образования
            "Route::get('/direction/medical-education/documents', function () {\n    return Inertia::render('Direction/MedEducation/Documents');\n})->name('direction.medical.education.documents');",
            "Route::get('/direction/medical-education/recommendations', function () {\n    return Inertia::render('Direction/MedEducation/Recommendations');\n})->name('direction.medical.education.recommendations');",
            "Route::get('/direction/medical-education/rating', function () {\n    return Inertia::render('Direction/MedEducation/Rating');\n})->name('direction.medical.education.rating');",
            
            // Подмаршруты медицинской науки
            "Route::get('/medical-science/research', function () {\n    return Inertia::render('Direction/MedicalScience/Research');\n})->name('medical.science.research');",
            "Route::get('/medical-science/clinical', function () {\n    return Inertia::render('Direction/MedicalScience/Clinical');\n})->name('medical.science.clinical');",
            "Route::get('/medical-science/tech', function () {\n    return Inertia::render('Direction/MedicalScience/Tech');\n})->name('medical.science.tech');",
            "Route::get('/medical-science/council', function () {\n    return Inertia::render('Direction/MedicalScience/Council');\n})->name('medical.science.council');",
            
            // Подмаршруты лекарственной политики
            "Route::get('/drug-policy/commission', function () {\n    return Inertia::render('Direction/DrugPolicy/Commission');\n})->name('drug.policy.commission');",
            "Route::get('/drug-policy/regulations', function () {\n    return Inertia::render('Direction/DrugPolicy/Regulations');\n})->name('drug.policy.regulations');",
            
            // Подмаршруты первичной медико-санитарной помощи
            "Route::get('/primary-healthcare/outpatient', function () {\n    return Inertia::render('Direction/PrimaryHealthCare/Outpatient');\n})->name('primary.healthcare.outpatient');",
            "Route::get('/primary-healthcare/prevention', function () {\n    return Inertia::render('Direction/PrimaryHealthCare/Prevention');\n})->name('primary.healthcare.prevention');",
            
            // Подмаршруты медицинской статистики
            "Route::get('/medical-statistics/reports', function () {\n    return Inertia::render('Direction/MedStats/Reports');\n})->name('medical.statistics.reports');",
            "Route::get('/medical-statistics/statdata', function () {\n    return Inertia::render('Direction/MedStats/StatData');\n})->name('medical.statistics.statdata');",
            "Route::get('/medical-statistics/analytics', function () {\n    return Inertia::render('Direction/MedStats/Analytics');\n})->name('medical.statistics.analytics');",
            
            // Подмаршруты рейтинга медицинских организаций
            "Route::get('/medical-rating/regional', function () {\n    return Inertia::render('Direction/MedicalRating/Regional');\n})->name('medical.rating.regional');",
            "Route::get('/medical-rating/quality', function () {\n    return Inertia::render('Direction/MedicalRating/Quality');\n})->name('medical.rating.quality');",
            
            // Подмаршруты аккредитации
            "Route::get('/accreditation/guides', function () {\n    return Inertia::render('Direction/Accreditation/Guides');\n})->name('accreditation.guides');",
            "Route::get('/accreditation/experts', function () {\n    return Inertia::render('Direction/Accreditation/Experts');\n})->name('accreditation.experts');",
            "Route::get('/accreditation/training-materials', function () {\n    return Inertia::render('Direction/Accreditation/TrainingMaterials');\n})->name('accreditation.training');",
            "Route::get('/accreditation/active-standards', function () {\n    return Inertia::render('Direction/Accreditation/ActiveStandards');\n})->name('accreditation.standards');",
            "Route::get('/accreditation/standards-archive', function () {\n    return Inertia::render('Direction/Accreditation/StandardsArchive');\n})->name('accreditation.archive');",
            "Route::get('/accreditation/commission', function () {\n    return Inertia::render('Direction/Accreditation/Commission');\n})->name('accreditation.commission');",
            
            // Подмаршруты биоэтики
            "Route::get('/bioethics/expertise', function () {\n    return Inertia::render('Direction/Bioethics/Expertise');\n})->name('bioethics.expertise');",
            "Route::get('/bioethics/certification', function () {\n    return Inertia::render('Direction/Bioethics/Certification');\n})->name('bioethics.certification');",
            "Route::get('/bioethics/biobanks', function () {\n    return Inertia::render('Direction/Bioethics/Biobanks');\n})->name('bioethics.biobanks');",
            "Route::get('/bioethics/local-commissions', function () {\n    return Inertia::render('Direction/Bioethics/LocalCommissions');\n})->name('bioethics.local-commissions');",
            "Route::get('/bioethics/composition', function () {\n    return Inertia::render('Direction/Bioethics/Composition');\n})->name('bioethics.composition');",
            
            // Подмаршруты оценки технологий здравоохранения
            "Route::get('/health-rate/otz-reports', function () {\n    return Inertia::render('Direction/HealthRate/OtzReports');\n})->name('health.rate.otz.reports');",
            "Route::get('/health-rate/quality-commission', function () {\n    return Inertia::render('Direction/HealthRate/QualityCommission');\n})->name('health.rate.quality.commission');",
            
            // Подмаршруты стратегических инициатив
            "Route::get('/strategic-initiatives/initiatives', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Initiatives');\n})->name('strategic.initiatives.initiatives');",
            "Route::get('/strategic-initiatives/tourism', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Tourism');\n})->name('strategic.initiatives.tourism');",
            "Route::get('/strategic-initiatives/partnership', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Partnership');\n})->name('strategic.initiatives.partnership');",
            "Route::get('/strategic-initiatives/expert', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Expert');\n})->name('strategic.initiatives.expert');",
            "Route::get('/strategic-initiatives/coalition', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Coalition');\n})->name('strategic.initiatives.coalition');",
            "Route::get('/strategic-initiatives/astana-declaration', function () {\n    return Inertia::render('Direction/StrategicInitiatives/AstanaDeclaration');\n})->name('strategic.initiatives.astana.declaration');",
            "Route::get('/strategic-initiatives/research', function () {\n    return Inertia::render('Direction/StrategicInitiatives/Research');\n})->name('strategic.initiatives.research');",
            
            // Подмаршруты кадровых ресурсов
            "Route::get('/human-resources/medical-workers', function () {\n    return Inertia::render('Direction/HumanResources/MedicalWorkers');\n})->name('human.resources.medical.workers');",
            "Route::get('/human-resources/managers', function () {\n    return Inertia::render('Direction/HumanResources/Managers');\n})->name('human.resources.managers');",
            "Route::get('/human-resources/graduates', function () {\n    return Inertia::render('Direction/HumanResources/Graduates');\n})->name('human.resources.graduates');",
        ];
        
        $removedCount = 0;
        foreach ($routesToRemove as $route) {
            if (strpos($content, $route) !== false) {
                $content = str_replace($route, '', $content);
                $removedCount++;
            }
        }
        
        // Очищаем лишние пустые строки
        $content = preg_replace('/\n\s*\n\s*\n/', "\n\n", $content);
        
        // Сохраняем обновленный файл
        File::put('routes/web.php', $content);
        
        $this->info("🎉 Successfully removed {$removedCount} sub-routes from web.php!");
        
        return 0;
    }
}
