<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MigrateAllRoutesToLocalized extends Command
{
    protected $signature = 'migrate:routes-to-localized';
    protected $description = 'Migrate all routes from web.php to localized.php with language prefixes';

    public function handle()
    {
        $this->info('🔧 Migrating all routes to localized.php with language prefixes...');
        
        // Читаем web.php
        $webContent = File::get('routes/web.php');
        
        // Извлекаем все маршруты, которые нужно перенести
        $routesToMigrate = $this->extractRoutes($webContent);
        
        // Читаем текущий localized.php
        $localizedContent = File::get('routes/localized.php');
        
        // Добавляем новые маршруты в localized.php
        $updatedLocalizedContent = $this->addRoutesToLocalized($localizedContent, $routesToMigrate);
        
        // Сохраняем обновленный localized.php
        File::put('routes/localized.php', $updatedLocalizedContent);
        
        // Удаляем маршруты из web.php
        $updatedWebContent = $this->removeRoutesFromWeb($webContent, $routesToMigrate);
        File::put('routes/web.php', $updatedWebContent);
        
        $this->info("🎉 Successfully migrated " . count($routesToMigrate) . " routes!");
        $this->info("✅ Routes added to localized.php");
        $this->info("✅ Routes removed from web.php");
        
        return 0;
    }
    
    private function extractRoutes($content)
    {
        $routes = [];
        
        // Паттерн для поиска маршрутов
        preg_match_all('/Route::get\([\'"`]([^\'"`]+)[\'"`],\s*function\s*\([^)]*\)\s*\{[^}]*return\s+Inertia::render\([\'"`]([^\'"`]+)[\'"`][^}]*\}\)->name\([\'"`]([^\'"`]+)[\'"`]\);/s', $content, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            $routes[] = [
                'path' => $match[1],
                'component' => $match[2],
                'name' => $match[3],
                'full_match' => $match[0]
            ];
        }
        
        // Исключаем маршруты, которые уже есть в localized.php или не должны мигрироваться
        $excludeRoutes = [
            '/',
            '/admin',
            '/api',
            '/auth',
            '/storage',
            '/images',
            '/news-images',
            '/medical-tourism-conference',
            '/news-slider-demo',
            '/examples/google-drive',
            '/about-centre/vacancies'
        ];
        
        $routes = array_filter($routes, function($route) use ($excludeRoutes) {
            foreach ($excludeRoutes as $exclude) {
                if (strpos($route['path'], $exclude) === 0) {
                    return false;
                }
            }
            return true;
        });
        
        return $routes;
    }
    
    private function addRoutesToLocalized($localizedContent, $routes)
    {
        // Находим место для вставки (перед закрывающей скобкой группы маршрутов)
        $insertPosition = strrpos($localizedContent, '    // Добавьте другие маршруты здесь с тем же паттерном');
        
        if ($insertPosition === false) {
            $insertPosition = strrpos($localizedContent, '});');
        }
        
        $newRoutes = "\n";
        foreach ($routes as $route) {
            $newRoutes .= "    // {$route['name']}\n";
            $newRoutes .= "    Route::get('{$route['path']}', function (\$locale) {\n";
            $newRoutes .= "        return Inertia::render('{$route['component']}', [\n";
            $newRoutes .= "            'locale' => \$locale,\n";
            $newRoutes .= "            'translations' => TranslationService::getForPage('" . $this->getPageKey($route['name']) . "', \$locale),\n";
            $newRoutes .= "        ]);\n";
            $newRoutes .= "    })->name('{$route['name']}');\n\n";
        }
        
        return substr_replace($localizedContent, $newRoutes, $insertPosition, 0);
    }
    
    private function removeRoutesFromWeb($content, $routes)
    {
        foreach ($routes as $route) {
            $content = str_replace($route['full_match'], '', $content);
        }
        
        // Очищаем лишние пустые строки
        $content = preg_replace('/\n\s*\n\s*\n/', "\n\n", $content);
        
        return $content;
    }
    
    private function getPageKey($routeName)
    {
        // Преобразуем имя маршрута в ключ страницы для переводов
        $pageKey = str_replace('.', '_', $routeName);
        return $pageKey;
    }
}
