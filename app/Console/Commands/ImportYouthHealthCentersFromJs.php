<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use App\Models\YouthHealthCenter;

class ImportYouthHealthCentersFromJs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yhc:import-from-js {--path=resources/js/Components/YouthHealthCentersMap.jsx} {--no-truncate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Импортировать МЦЗ из файла YouthHealthCentersMap.jsx в базу данных';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $path = base_path($this->option('path'));
        if (!File::exists($path)) {
            $this->error('Файл не найден: ' . $path);
            return Command::FAILURE;
        }

        $content = File::get($path);

        // Найти блок массива const youthHealthCenters = [ ... ];
        if (!preg_match('/const\s+youthHealthCenters\s*=\s*\[(.*)\];/sU', $content, $m)) {
            $this->error('Не удалось найти массив youthHealthCenters в файле.');
            return Command::FAILURE;
        }

        $arrayBlock = $m[1];

        // Разделить на объекты по закрывающей скобке }, (не идеально, но достаточно для структуры файла)
        // Будем находить блоки { ... }
        preg_match_all('/\{([\s\S]*?)\}/', $arrayBlock, $objects);

        if (empty($objects[1])) {
            $this->error('Не найдено ни одного объекта центра.');
            return Command::FAILURE;
        }

        if (!$this->option('no-truncate')) {
            YouthHealthCenter::truncate();
        }

        $imported = 0;
        foreach ($objects[1] as $block) {
            // Парсим поля
            $name = $this->matchStringField($block, 'name');
            $org = $this->matchStringField($block, 'org|organization');
            $address = $this->matchStringField($block, 'address');
            $region = $this->matchStringField($block, 'region');
            [$lat, $lng] = $this->matchPosition($block);

            if (!$name || !$address || !$region || $lat === null || $lng === null) {
                // пропускаем блоки, не являющиеся данными центра
                continue;
            }

            YouthHealthCenter::create([
                'name' => $name,
                'organization' => $org ?: '',
                'address' => $address,
                'region' => $region,
                'latitude' => $lat,
                'longitude' => $lng,
                'is_active' => true,
            ]);
            $imported++;
        }

        $this->info("Импортировано центров: {$imported}");
        return Command::SUCCESS;
    }

    private function matchStringField(string $block, string $fieldPattern): ?string
    {
        // Ищем: field: 'value'
        $pattern = "~(" . $fieldPattern . ")\\s*:\\s*'([^']*)'~u";
        if (preg_match($pattern, $block, $m)) {
            return trim($m[2]);
        }
        return null;
    }

    private function matchPosition(string $block): array
    {
        // Ищем: position: [lat, lng]
        if (preg_match('/position\s*:\s*\[\s*([-\d\.]+)\s*,\s*([-\d\.]+)\s*\]/', $block, $m)) {
            return [floatval($m[1]), floatval($m[2])];
        }
        return [null, null];
    }
}
