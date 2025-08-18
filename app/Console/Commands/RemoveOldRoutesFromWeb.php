<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RemoveOldRoutesFromWeb extends Command
{
    protected $signature = 'remove:old-routes-from-web';
    protected $description = 'Remove old routes from web.php that are now in localized.php';

    public function handle()
    {
        $this->info('🔧 Removing old routes from web.php...');
        
        // Читаем web.php
        $content = File::get('routes/web.php');
        
        // Список маршрутов для удаления
        $routesToRemove = [
            // Направления
            "Route::get('/medical-education', function () {\n    return Inertia::render('Direction/MedicalEducation');\n})->name('medical.education');",
            "Route::get('/human-resources', function () {\n    return Inertia::render('Direction/HumanResources');\n})->name('human.resources');",
            "Route::get('/electronic-health', function () {\n    return Inertia::render('Direction/ElectronicHealth');\n})->name('electronic.health');",
            "Route::get('/medical-accreditation', function () {\n    return Inertia::render('Direction/MedicalAccreditation');\n})->name('medical.accreditation');",
            "Route::get('/health-rate', function () {\n    return Inertia::render('Direction/HealthRate');\n})->name('health.rate');",
            "Route::get('/strategic-initiatives', function () {\n    return Inertia::render('Direction/StrategicInitiatives');\n})->name('strategic.initiatives');",
            "Route::get('/medical-rating', function () {\n    return Inertia::render('Direction/MedicalRating');\n})->name('medical.rating');",
            "Route::get('/medical-science', function () {\n    return Inertia::render('Direction/MedicalScience');\n})->name('medical.science');",
            "Route::get('/bioethics', function () {\n    return Inertia::render('Direction/Bioethics');\n})->name('bioethics');",
            "Route::get('/drug-policy', function () {\n    return Inertia::render('Direction/DrugPolicy');\n})->name('drug.policy');",
            "Route::get('/primary-healthcare', function () {\n    return Inertia::render('Direction/PrimaryHealthCare');\n})->name('primary.healthcare');",
            "Route::get('/health-accounts', function () {\n    return Inertia::render('Direction/HealthAccounts');\n})->name('health.accounts');",
            "Route::get('/medical-statistics', function () {\n    return Inertia::render('Direction/MedicalStatistics');\n})->name('medical.statistics');",
            "Route::get('/direction/tech-competence', function () {\n    return Inertia::render('Direction/TechCompetence');\n})->name('direction.tech.competence');",
            "Route::get('/center-prevention', function () {\n    return Inertia::render('Direction/CenterPrevention');\n})->name('center.prevention');",
            
            // О центре
            "Route::get('/about-centre', function () {\n    return Inertia::render('AboutCentre/AboutCentre');\n})->name('about.centre');",
            "Route::get('/salidat-kairbekova', function () {\n    return Inertia::render('AboutCentre/SalidatKairbekova');\n})->name('salidat.kairbekova');",
            "Route::get('/vacancy-jobs', function () {\n    return Inertia::render('AboutCentre/Vacancy');\n})->name('about.vacancy');",
            "Route::get('/about-faq', function () {\n    return Inertia::render('AboutCentre/FAQ');\n})->name('about.faq');",
            "Route::get('/about-contacts', function () {\n    return Inertia::render('AboutCentre/Contacts');\n})->name('about.contacts');",
            "Route::get('/about-partners', function () {\n    return Inertia::render('AboutCentre/Partners');\n})->name('about.partners');",
            
            // Услуги
            "Route::get('/training', function () {\n    return Inertia::render('Services/Training');\n})->name('services.training');",
            "Route::get('/ads-evaluation', function () {\n    return Inertia::render('Services/AdsEvaluation');\n})->name('services.adsEvaluation');",
            "Route::get('/health-tech-assessment', function () {\n    return Inertia::render('Services/HealthTechAssessment');\n})->name('services.healthTechAssessment');",
            "Route::get('/drug-expertise', function () {\n    return Inertia::render('Services/DrugExpertise');\n})->name('services.drugExpertise');",
            "Route::get('/education-programs', function () {\n    return Inertia::render('Services/EducationPrograms');\n})->name('services.educationPrograms');",
            "Route::get('/medical-expertise', function () {\n    return Inertia::render('Services/MedicalExpertise');\n})->name('services.medicalExpertise');",
            "Route::get('/accreditation', function () {\n    return Inertia::render('Services/Accreditation');\n})->name('services.accreditation');",
            "Route::get('/post-accreditation-monitoring', function () {\n    return Inertia::render('Services/PostAccreditationMonitoring');\n})->name('services.postAccreditationMonitoring');",
            
            // Филиалы
            "Route::get('/astana', function () {\n    return Inertia::render('Branches/Astana');\n})->name('branches.astana');",
            "Route::get('/almaty', function () {\n    return Inertia::render('Branches/Almaty');\n})->name('branches.almaty');",
            "Route::get('/abay', function () {\n    return Inertia::render('Branches/Abay');\n})->name('branches.abay');",
            "Route::get('/akmola', function () {\n    return Inertia::render('Branches/Akmola');\n})->name('branches.akmola');",
            "Route::get('/aktobe', function () {\n    return Inertia::render('Branches/Aktobe');\n})->name('branches.aktobe');",
            "Route::get('/almaty_region', function () {\n    return Inertia::render('Branches/AlmatyRegion');\n})->name('branches.almatyregion');",
            "Route::get('/atyrau', function () {\n    return Inertia::render('Branches/Atyrau');\n})->name('branches.atyrau');",
            "Route::get('/east', function () {\n    return Inertia::render('Branches/East');\n})->name('branches.east');",
            "Route::get('/zhambyl', function () {\n    return Inertia::render('Branches/Zhambyl');\n})->name('branches.zhambyl');",
            "Route::get('/zhetisu', function () {\n    return Inertia::render('Branches/Zhetisu');\n})->name('branches.zhetisu');",
            "Route::get('/west', function () {\n    return Inertia::render('Branches/West');\n})->name('branches.west');",
            "Route::get('/karaganda', function () {\n    return Inertia::render('Branches/Karaganda');\n})->name('branches.karaganda');",
            "Route::get('/kostanay', function () {\n    return Inertia::render('Branches/Kostanay');\n})->name('branches.kostanay');",
            "Route::get('/kyzylorda', function () {\n    return Inertia::render('Branches/Kyzylorda');\n})->name('branches.kyzylorda');",
            "Route::get('/mangistau', function () {\n    return Inertia::render('Branches/Mangistau');\n})->name('branches.mangistau');",
            "Route::get('/pavlodar', function () {\n    return Inertia::render('Branches/Pavlodar');\n})->name('branches.pavlodar');",
            "Route::get('/north', function () {\n    return Inertia::render('Branches/North');\n})->name('branches.north');",
            "Route::get('/turkestan', function () {\n    return Inertia::render('Branches/Turkestan');\n})->name('branches.turkestan');",
            "Route::get('/ulytau', function () {\n    return Inertia::render('Branches/Ulytau');\n})->name('branches.ulytau');",
            "Route::get('/shymkent', function () {\n    return Inertia::render('Branches/Shymkent');\n})->name('branches.shymkent');",
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
        
        $this->info("🎉 Successfully removed {$removedCount} routes from web.php!");
        
        return 0;
    }
}
