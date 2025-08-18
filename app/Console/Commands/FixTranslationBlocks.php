<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixTranslationBlocks extends Command
{
	protected $signature = 'fix:translation-blocks';
	protected $description = 'Remove duplicated t() blocks and stray ") {" after them in JSX files';

	public function handle()
	{
		$this->info('🔧 Fixing duplicated t() blocks and stray tokens...');
		$files = $this->findJsxFiles();
		$this->info('Found '.count($files).' JSX files');
		$total = 0;
		foreach ($files as $file) {
			$fixed = $this->fixFile($file);
			if ($fixed > 0) {
				$this->line("  ✅ {$file}: {$fixed} fixes");
				$total += $fixed;
			}
		}
		$this->info("✅ Completed. Total fixes: {$total}");
		return 0;
	}

	protected function findJsxFiles(): array
	{
		$dirs = [
			'resources/js/Pages',
			'resources/js/Components',
			'resources/js/Layouts',
		];
		$all = [];
		foreach ($dirs as $dir) {
			if (File::exists($dir)) {
				$all = array_merge($all, File::glob($dir.'/**/*.jsx'));
			}
		}
		return $all;
	}

	protected function fixFile(string $path): int
	{
		$src = File::get($path);
		$original = $src;
		$fixes = 0;

		// 1) Удаляем дубли одного и того же блока t(), идущего подряд
		$patternDup = '/(\n\s*\/\/\s*Функция\s+для\s+получения\s+перевода\s*\n\s*const\s+t\s*=\s*\(key,\s*fallback\s*=\s*\'\'\)\s*=>\s*\{\s*\n\s*return\s+translations\?\.\[key\]\s*\|\|\s*fallback;\s*\n\s*\};\s*)(\n\s*)*(\/\/\s*Функция\s+для\s+получения\s+перевода\s*\n\s*const\s+t\s*=\s*\(key,\s*fallback\s*=\s*\'\'\)\s*=>\s*\{\s*\n\s*return\s+translations\?\.\[key\]\s*\|\|\s*fallback;\s*\n\s*\};)/u';
		$src = preg_replace($patternDup, '$1', $src, -1, $count1);
		if ($count1 > 0) { $fixes += $count1; }

		// 2) Удаляем лишнее ") {" сразу после блока t()
		$patternStray = '/(const\s+t\s*=\s*\(key,\s*fallback\s*=\s*\'\'\)\s*=>\s*\{[\s\S]*?\};)\s*\)\s*\{/u';
		$src = preg_replace($patternStray, '$1', $src, -1, $count2);
		if ($count2 > 0) { $fixes += $count2; }

		if ($fixes > 0 && $src !== $original) {
			File::put($path, $src);
		}
		return $fixes;
	}
}
