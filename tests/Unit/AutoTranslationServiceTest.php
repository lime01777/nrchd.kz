<?php

use App\Services\AutoTranslationService;

it('translates array using provided target and source languages', function () {
    $service = new class extends AutoTranslationService {
        public array $calls = [];

        public function __construct() {}

        public function translateText($text, $targetLanguage, $sourceLanguage = 'kz')
        {
            $this->calls[] = [$text, $targetLanguage, $sourceLanguage];
            return "{$text}_{$targetLanguage}_{$sourceLanguage}";
        }
    };

    $result = $service->translateArray(['greeting' => 'hello'], 'ru', 'en');

    expect($service->calls)->toBe([
        ['hello', 'ru', 'en'],
    ])->and($result['greeting'])->toBe('hello_ru_en');
});

