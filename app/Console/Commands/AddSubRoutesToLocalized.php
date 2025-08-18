<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class AddSubRoutesToLocalized extends Command
{
    protected $signature = 'add:sub-routes-to-localized';
    protected $description = 'Add sub-routes to localized.php with language prefixes';

    public function handle()
    {
        $this->info('🔧 Adding sub-routes to localized.php...');
        
        // Читаем текущий localized.php
        $localizedContent = File::get('routes/localized.php');
        
        // Добавляем подмаршруты
        $newRoutes = $this->getSubRoutes();
        
        // Находим место для вставки
        $insertPosition = strrpos($localizedContent, '    // === ФИЛИАЛЫ ===');
        
        if ($insertPosition === false) {
            $insertPosition = strrpos($localizedContent, '});');
        }
        
        $updatedContent = substr_replace($localizedContent, $newRoutes, $insertPosition, 0);
        
        // Сохраняем обновленный файл
        File::put('routes/localized.php', $updatedContent);
        
        $this->info("🎉 Successfully added sub-routes to localized.php!");
        
        return 0;
    }
    
    private function getSubRoutes()
    {
        return "
    // === ПОДМАРШРУТЫ ===
    
    // Подмаршруты медицинского образования
    Route::get('/direction/medical-education/documents', function (\$locale) {
        return Inertia::render('Direction/MedEducation/Documents', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('direction_medical_education_documents', \$locale),
        ]);
    })->name('direction.medical.education.documents');
    
    Route::get('/direction/medical-education/recommendations', function (\$locale) {
        return Inertia::render('Direction/MedEducation/Recommendations', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('direction_medical_education_recommendations', \$locale),
        ]);
    })->name('direction.medical.education.recommendations');
    
    Route::get('/direction/medical-education/rating', function (\$locale) {
        return Inertia::render('Direction/MedEducation/Rating', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('direction_medical_education_rating', \$locale),
        ]);
    })->name('direction.medical.education.rating');
    
    // Подмаршруты медицинской науки
    Route::get('/medical-science/research', function (\$locale) {
        return Inertia::render('Direction/MedicalScience/Research', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_science_research', \$locale),
        ]);
    })->name('medical.science.research');
    
    Route::get('/medical-science/clinical', function (\$locale) {
        return Inertia::render('Direction/MedicalScience/Clinical', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_science_clinical', \$locale),
        ]);
    })->name('medical.science.clinical');
    
    Route::get('/medical-science/tech', function (\$locale) {
        return Inertia::render('Direction/MedicalScience/Tech', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_science_tech', \$locale),
        ]);
    })->name('medical.science.tech');
    
    Route::get('/medical-science/council', function (\$locale) {
        return Inertia::render('Direction/MedicalScience/Council', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_science_council', \$locale),
        ]);
    })->name('medical.science.council');
    
    // Подмаршруты лекарственной политики
    Route::get('/drug-policy/commission', function (\$locale) {
        return Inertia::render('Direction/DrugPolicy/Commission', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('drug_policy_commission', \$locale),
        ]);
    })->name('drug.policy.commission');
    
    Route::get('/drug-policy/regulations', function (\$locale) {
        return Inertia::render('Direction/DrugPolicy/Regulations', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('drug_policy_regulations', \$locale),
        ]);
    })->name('drug.policy.regulations');
    
    // Подмаршруты первичной медико-санитарной помощи
    Route::get('/primary-healthcare/outpatient', function (\$locale) {
        return Inertia::render('Direction/PrimaryHealthCare/Outpatient', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('primary_healthcare_outpatient', \$locale),
        ]);
    })->name('primary.healthcare.outpatient');
    
    Route::get('/primary-healthcare/prevention', function (\$locale) {
        return Inertia::render('Direction/PrimaryHealthCare/Prevention', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('primary_healthcare_prevention', \$locale),
        ]);
    })->name('primary.healthcare.prevention');
    
    // Подмаршруты медицинской статистики
    Route::get('/medical-statistics/reports', function (\$locale) {
        return Inertia::render('Direction/MedStats/Reports', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_statistics_reports', \$locale),
        ]);
    })->name('medical.statistics.reports');
    
    Route::get('/medical-statistics/statdata', function (\$locale) {
        return Inertia::render('Direction/MedStats/StatData', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_statistics_statdata', \$locale),
        ]);
    })->name('medical.statistics.statdata');
    
    Route::get('/medical-statistics/analytics', function (\$locale) {
        return Inertia::render('Direction/MedStats/Analytics', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_statistics_analytics', \$locale),
        ]);
    })->name('medical.statistics.analytics');
    
    // Подмаршруты рейтинга медицинских организаций
    Route::get('/medical-rating/regional', function (\$locale) {
        return Inertia::render('Direction/MedicalRating/Regional', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_rating_regional', \$locale),
        ]);
    })->name('medical.rating.regional');
    
    Route::get('/medical-rating/quality', function (\$locale) {
        return Inertia::render('Direction/MedicalRating/Quality', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('medical_rating_quality', \$locale),
        ]);
    })->name('medical.rating.quality');
    
    // Подмаршруты аккредитации
    Route::get('/accreditation/guides', function (\$locale) {
        return Inertia::render('Direction/Accreditation/Guides', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_guides', \$locale),
        ]);
    })->name('accreditation.guides');
    
    Route::get('/accreditation/experts', function (\$locale) {
        return Inertia::render('Direction/Accreditation/Experts', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_experts', \$locale),
        ]);
    })->name('accreditation.experts');
    
    Route::get('/accreditation/training-materials', function (\$locale) {
        return Inertia::render('Direction/Accreditation/TrainingMaterials', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_training', \$locale),
        ]);
    })->name('accreditation.training');
    
    Route::get('/accreditation/active-standards', function (\$locale) {
        return Inertia::render('Direction/Accreditation/ActiveStandards', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_standards', \$locale),
        ]);
    })->name('accreditation.standards');
    
    Route::get('/accreditation/standards-archive', function (\$locale) {
        return Inertia::render('Direction/Accreditation/StandardsArchive', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_archive', \$locale),
        ]);
    })->name('accreditation.archive');
    
    Route::get('/accreditation/commission', function (\$locale) {
        return Inertia::render('Direction/Accreditation/Commission', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('accreditation_commission', \$locale),
        ]);
    })->name('accreditation.commission');
    
    // Подмаршруты биоэтики
    Route::get('/bioethics/expertise', function (\$locale) {
        return Inertia::render('Direction/Bioethics/Expertise', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics_expertise', \$locale),
        ]);
    })->name('bioethics.expertise');
    
    Route::get('/bioethics/certification', function (\$locale) {
        return Inertia::render('Direction/Bioethics/Certification', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics_certification', \$locale),
        ]);
    })->name('bioethics.certification');
    
    Route::get('/bioethics/biobanks', function (\$locale) {
        return Inertia::render('Direction/Bioethics/Biobanks', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics_biobanks', \$locale),
        ]);
    })->name('bioethics.biobanks');
    
    Route::get('/bioethics/local-commissions', function (\$locale) {
        return Inertia::render('Direction/Bioethics/LocalCommissions', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics_local_commissions', \$locale),
        ]);
    })->name('bioethics.local-commissions');
    
    Route::get('/bioethics/composition', function (\$locale) {
        return Inertia::render('Direction/Bioethics/Composition', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('bioethics_composition', \$locale),
        ]);
    })->name('bioethics.composition');
    
    // Подмаршруты оценки технологий здравоохранения
    Route::get('/health-rate/omt-reports', function (\$locale) {
        return Inertia::render('Direction/HealthRate/OmtReports', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('health_rate_omt_reports', \$locale),
        ]);
    })->name('health.rate.omt.reports');
    
    Route::get('/health-rate/quality-commission', function (\$locale) {
        return Inertia::render('Direction/HealthRate/QualityCommission', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('health_rate_quality_commission', \$locale),
        ]);
    })->name('health.rate.quality.commission');
    
    // Подмаршруты стратегических инициатив
    Route::get('/strategic-initiatives/initiatives', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Initiatives', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_initiatives', \$locale),
        ]);
    })->name('strategic.initiatives.initiatives');
    
    Route::get('/strategic-initiatives/tourism', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Tourism', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_tourism', \$locale),
        ]);
    })->name('strategic.initiatives.tourism');
    
    Route::get('/strategic-initiatives/partnership', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Partnership', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_partnership', \$locale),
        ]);
    })->name('strategic.initiatives.partnership');
    
    Route::get('/strategic-initiatives/expert', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Expert', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_expert', \$locale),
        ]);
    })->name('strategic.initiatives.expert');
    
    Route::get('/strategic-initiatives/coalition', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Coalition', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_coalition', \$locale),
        ]);
    })->name('strategic.initiatives.coalition');
    
    Route::get('/strategic-initiatives/astana-declaration', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/AstanaDeclaration', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_astana_declaration', \$locale),
        ]);
    })->name('strategic.initiatives.astana.declaration');
    
    Route::get('/strategic-initiatives/research', function (\$locale) {
        return Inertia::render('Direction/StrategicInitiatives/Research', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('strategic_initiatives_research', \$locale),
        ]);
    })->name('strategic.initiatives.research');
    
    // Подмаршруты кадровых ресурсов
    Route::get('/human-resources/medical-workers', function (\$locale) {
        return Inertia::render('Direction/HumanResources/MedicalWorkers', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('human_resources_medical_workers', \$locale),
        ]);
    })->name('human.resources.medical.workers');
    
    Route::get('/human-resources/managers', function (\$locale) {
        return Inertia::render('Direction/HumanResources/Managers', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('human_resources_managers', \$locale),
        ]);
    })->name('human.resources.managers');
    
    Route::get('/human-resources/graduates', function (\$locale) {
        return Inertia::render('Direction/HumanResources/Graduates', [
            'locale' => \$locale,
            'translations' => TranslationService::getForPage('human_resources_graduates', \$locale),
        ]);
    })->name('human.resources.graduates');
    
";
    }
}
