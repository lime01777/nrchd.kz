<?php
namespace App\Services\Translation;
use App\Models\Translation;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Кеш → БД → DeepL. Сохраняет всё в БД. Дефолтная локаль — kk.
 */
class TranslationService {
    public function __construct(
        private readonly DeepLClient $deepl,
        private readonly string $defaultLocale = 'kk',
    ) {}

    public function get(string $key, string $locale, ?string $namespace = null, ?string $context = null): string {
        $ck = $this->cacheKey($key,$locale,$namespace,$context);
        return Cache::rememberForever($ck, function () use ($key,$locale,$namespace,$context) {
            $found = Translation::query()
                ->where(compact('key','locale'))
                ->when($namespace, fn($q) => $q->where('namespace',$namespace))
                ->when($context, fn($q) => $q->where('context',$context))
                ->value('value');

            if ($found !== null) return $found;

            $source = $this->findDefault($key,$namespace,$context) ?? $this->humanizeKey($key);

            if (Str::lower($locale) === Str::lower($this->defaultLocale)) {
                $this->store($key,$locale,$source,$namespace,$context);
                return $source;
            }

            $translated = $this->deepl->translate([$source], strtoupper($locale))[0] ?? $source;
            $this->store($key,$locale,$translated,$namespace,$context);
            return $translated;
        });
    }

    public function dictionary(string $locale, ?string $namespace = null, ?string $context = null): array {
        $q = Translation::query()->where('locale',$locale);
        if ($namespace) $q->where('namespace',$namespace);
        if ($context) $q->where('context',$context);
        return $q->pluck('value','key')->toArray();
    }

    /** Массово гарантирует наличие ключей для локали. */
    public function ensureKeys(array $keys, string $locale, ?string $namespace = null, ?string $context = null): void {
        foreach ($keys as $k) $this->get($k,$locale,$namespace,$context);
    }

    public function store(string $key,string $locale,string $value,?string $namespace=null,?string $context=null): void {
        Translation::updateOrCreate(
            ['key'=>$key,'locale'=>$locale,'namespace'=>$namespace,'context'=>$context],
            ['value'=>$value]
        );
        Cache::forget($this->cacheKey($key,$locale,$namespace,$context));
    }

    private function findDefault(string $key,?string $namespace,?string $context): ?string {
        return Translation::query()
            ->where('key',$key)->where('locale',$this->defaultLocale)
            ->when($namespace, fn($q) => $q->where('namespace',$namespace))
            ->when($context, fn($q) => $q->where('context',$context))
            ->value('value');
    }

    private function humanizeKey(string $key): string {
        return Str::of($key)->replace(['.','_'],' ')->headline();
    }

    private function cacheKey(string $key,string $locale,?string $namespace,?string $context): string {
        return 'i18n:'.md5(json_encode([$key,$locale,$namespace,$context]));
    }
}
