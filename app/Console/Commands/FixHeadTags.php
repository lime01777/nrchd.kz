<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixHeadTags extends Command
{
	protected $signature = 'fix:head-tags';
	protected $description = 'Replace `<Head {t(...` with `<Head title={t(...}` across JSX files and collapse nested t() inside title';

	public function handle()
	{
		$this->info('🔧 Fixing Head tags...');
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
		$fixes = 0;

		// 1) <Head {t('key', ...)} -> <Head title={t('key', ...)}
		$pattern1 = '/<Head\s*\{\s*t\(([^)]*)\)\s*\}/u';
		$replaced = preg_replace($pattern1, '<Head title={t($1)}', $src, -1, $count1);
		if ($count1 > 0 && $replaced !== null) {
			$src = $replaced;
			$fixes += $count1;
		}

		// 2) title={t('key', {t('key','Text')})} -> title={t('key','Text')}
		$pattern2 = '/title=\{\s*t\(\s*([\'\"][^\'\"]+[\'\"])\s*,\s*\{\s*t\(\s*\1\s*,\s*([\'\"][^\'\"]+[\'\"])\s*\)\s*\}\s*\)\s*\}/u';
		$replaced2 = preg_replace($pattern2, 'title={t($1, $2)}', $src, -1, $count2);
		if ($count2 > 0 && $replaced2 !== null) {
			$src = $replaced2;
			$fixes += $count2;
		}

		if ($fixes > 0) {
			File::put($path, $src);
		}
		return $fixes;
	}
}
