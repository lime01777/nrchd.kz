<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class FixNonLocalizedRoutes extends Command
{
    protected $signature = 'fix:non-localized-routes';
    protected $description = 'Исправляет нелокализованные маршруты, добавляя их в localized.php';

    public function handle()
    {
        $this->info('🛣️ Исправление нелокализованных маршрутов...');
        
        $routes = Route::getRoutes();
        $nonLocalizedRoutes = [];
        
        foreach ($routes as $route) {
            $uri = $route->uri();
            $methods = $route->methods();
            
            // Исключаем API, админ, аутентификацию и другие служебные маршруты
            if (!str_contains($uri, '{locale}') && 
                !str_starts_with($uri, 'api/') && 
                !str_starts_with($uri, 'admin/') && 
                !str_starts_with($uri, 'sanctum/') && 
                !str_starts_with($uri, 'translations/') &&
                !str_starts_with($uri, 'login') &&
                !str_starts_with($uri, 'register') &&
                !str_starts_with($uri, 'forgot-password') &&
                !str_starts_with($uri, 'reset-password') &&
                !str_starts_with($uri, 'confirm-password') &&
                !str_starts_with($uri, 'verify-email') &&
                !str_starts_with($uri, 'logout') &&
                !str_starts_with($uri, 'change-language') &&
                $uri !== '' &&
                $uri !== 'up') {
                
                $nonLocalizedRoutes[] = [
                    'uri' => $uri,
                    'methods' => $methods,
                    'name' => $route->getName(),
                    'action' => $route->getActionName()
                ];
            }
        }
        
        if (empty($nonLocalizedRoutes)) {
            $this->info('✅ Все маршруты уже локализованы!');
            return 0;
        }
        
        $this->info("Найдено нелокализованных маршрутов: " . count($nonLocalizedRoutes));
        
        // Читаем текущий localized.php
        $localizedPath = base_path('routes/localized.php');
        $localizedContent = File::get($localizedPath);
        
        // Добавляем новые маршруты
        $newRoutes = $this->generateLocalizedRoutes($nonLocalizedRoutes);
        
        // Вставляем новые маршруты перед закрывающей скобкой группы
        $pattern = '/(\s*}\); \/\/ Конец группы локализованных маршрутов)/';
        $replacement = $newRoutes . "\n\n    " . '$1';
        
        if (preg_match($pattern, $localizedContent)) {
            $localizedContent = preg_replace($pattern, $replacement, $localizedContent);
        } else {
            // Если не нашли комментарий, добавляем перед последней закрывающей скобкой
            $localizedContent = str_replace(
                "\n});",
                $newRoutes . "\n});",
                $localizedContent
            );
        }
        
        // Сохраняем обновленный файл
        File::put($localizedPath, $localizedContent);
        
        $this->info("✅ Добавлено " . count($nonLocalizedRoutes) . " локализованных маршрутов");
        
        // Удаляем старые маршруты из web.php
        $this->removeOldRoutes($nonLocalizedRoutes);
        
        return 0;
    }
    
    private function generateLocalizedRoutes($routes)
    {
        $output = "\n    // === НЕЛОКАЛИЗОВАННЫЕ МАРШРУТЫ ===\n";
        
        foreach ($routes as $route) {
            $uri = $route['uri'];
            $name = $route['name'];
            $action = $route['action'];
            
            // Определяем тип действия
            if (str_contains($action, 'Controller@')) {
                // Контроллер
                $output .= $this->generateControllerRoute($uri, $name, $action);
            } else {
                // Closure
                $output .= $this->generateClosureRoute($uri, $name);
            }
        }
        
        return $output;
    }
    
    private function generateControllerRoute($uri, $name, $action)
    {
        $controller = str_replace('App\Http\Controllers\\', '', $action);
        $method = substr($controller, strrpos($controller, '@') + 1);
        $controller = substr($controller, 0, strrpos($controller, '@'));
        
        return "    Route::get('/{$uri}', [\\App\\Http\\Controllers\\{$controller}::class, '{$method}'])->name('{$name}');\n";
    }
    
    private function generateClosureRoute($uri, $name)
    {
        return "    Route::get('/{$uri}', function (\$locale) {\n" .
               "        return Inertia::render('" . $this->guessComponentName($uri) . "', [\n" .
               "            'locale' => \$locale,\n" .
               "            'translations' => TranslationService::getForPage('" . $this->guessPageKey($uri) . "', \$locale),\n" .
               "        ]);\n" .
               "    })->name('{$name}');\n";
    }
    
    private function guessComponentName($uri)
    {
        // Простая логика для определения имени компонента
        $parts = explode('/', $uri);
        $lastPart = end($parts);
        
        // Преобразуем kebab-case в PascalCase
        $componentName = str_replace('-', '', ucwords($lastPart, '-'));
        
        return $componentName;
    }
    
    private function guessPageKey($uri)
    {
        // Преобразуем URI в ключ страницы
        return str_replace('-', '_', $uri);
    }
    
    private function removeOldRoutes($routes)
    {
        $webPath = base_path('routes/web.php');
        $webContent = File::get($webPath);
        
        foreach ($routes as $route) {
            $uri = $route['uri'];
            $name = $route['name'];
            
            // Удаляем маршрут из web.php
            $pattern = "/Route::get\('\/" . preg_quote($uri, '/') . "'.*?\)->name\('" . preg_quote($name, '/') . "'\);/s";
            $webContent = preg_replace($pattern, '', $webContent);
        }
        
        // Очищаем пустые строки
        $webContent = preg_replace('/\n\s*\n\s*\n/', "\n\n", $webContent);
        
        File::put($webPath, $webContent);
        
        $this->info("✅ Удалены старые маршруты из web.php");
    }
}
