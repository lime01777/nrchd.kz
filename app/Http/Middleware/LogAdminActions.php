<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogAdminActions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Логируем только методы, изменяющие данные, и только если пользователь авторизован
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']) && $request->user()) {
            
            // Получаем понятное имя сущности из пути (например, news, users, documents)
            $segment = $request->segment(2); // если /admin/news/1, то segment(2) -> 'news'
            
            // Если мы почему-то вне админки, пропускаем, хотя middleware будет висеть на web
            if ($request->segment(1) !== 'admin') {
                return $response;
            }

            // Формируем описание действия
            $actionMap = [
                'POST' => 'создание/отправка',
                'PUT' => 'обновление',
                'PATCH' => 'обновление',
                'DELETE' => 'удаление',
            ];
            
            $action = $actionMap[$request->method()] ?? $request->method();
            $path = $request->path();
            
            // Не логируем загрузки файлов напрямую, чтобы не засорять логи (если нужно, можно убрать)
            if (str_contains($path, 'upload') || str_contains($path, 'media')) {
                // return $response;
            }

            // Используем spatie/laravel-activitylog
            activity('admin')
                ->causedBy($request->user())
                ->withProperties([
                    'method' => $request->method(),
                    'path' => $path,
                    'ip' => $request->ip(),
                    'params' => collect($request->except(['password', 'password_confirmation', '_token']))->take(10)->toArray(),
                ])
                ->log("Сотрудник выполнил действие: {$action} {$path}");
        }

        return $response;
    }
}
