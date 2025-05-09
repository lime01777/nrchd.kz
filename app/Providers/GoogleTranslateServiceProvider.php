<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;

class GoogleTranslateServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('google-translate', function ($app) {
            $apiKey = env('GOOGLE_TRANSLATE_API_KEY');
            
            if (!$apiKey) {
                Log::error('Google Translate API key not found in .env');
            } else {
                Log::info('Google Translate API key found in .env: ' . substr($apiKey, 0, 3) . '...' . substr($apiKey, -3));
            }
            
            try {
                // Правильная передача API ключа через массив options
                $options = ['key' => $apiKey];
                
                Log::info('Creating GoogleTranslate instance with options: ' . json_encode($options));
                $translator = new GoogleTranslate('ru', 'en', $options);
                
                // Проверяем работу перевода
                $testText = 'Тест перевода';
                try {
                    $testResult = $translator->translate($testText);
                    Log::info('GoogleTranslate test successful', [
                        'input' => $testText,
                        'output' => $testResult
                    ]);
                } catch (\Exception $testError) {
                    Log::error('GoogleTranslate test failed: ' . $testError->getMessage());
                }
                
                return $translator;
            } catch (\Exception $e) {
                Log::error('Failed to initialize GoogleTranslate: ' . $e->getMessage());
                return new GoogleTranslate('ru');
            }
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        // Ничего не делаем при загрузке сервис-провайдера
    }
}
