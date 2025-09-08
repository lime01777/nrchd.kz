<?php
namespace Database\Seeders;
use App\Models\Translation;
use Illuminate\Database\Seeder;

class TranslationSeeder extends Seeder {
    public function run(): void {
        $pairs = [
            'site.name'      => 'Ұлттық денсаулық сақтауды дамыту орталығы',
            'menu.home'      => 'Басты бет',
            'menu.news'      => 'Жаңалықтар',
            'news.read_more' => 'Толығырақ оқу',
        ];
        foreach ($pairs as $k => $v) {
            Translation::updateOrCreate(
                ['key'=>$k,'locale'=>'kk','namespace'=>'site'],
                ['value'=>$v]
            );
        }
    }
}
