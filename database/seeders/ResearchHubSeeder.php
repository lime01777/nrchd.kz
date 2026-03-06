<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Research;

class ResearchHubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $researches = [
            [
                'title' => 'HBSC',
                'description' => 'Health Behaviour in School-aged Children (Поведение детей школьного возраста в отношении здоровья). Международное исследование, проводимое в сотрудничестве с ВОЗ.',
                'sample' => 'Дети 11, 13 и 15 лет.',
                'geography' => 'Республика Казахстан (все регионы)',
                'period' => '2022',
                'methodology' => 'Анонимное анкетирование школьников в учебных заведениях по стандартизированному международному протоколу ВОЗ.',
                'citation_rules' => 'Национальный центр общественного здравоохранения МЗ РК. "Поведение детей школьного возраста в отношении здоровья" (HBSC, 2022).',
                'indicators' => [
                    ['name' => 'Физическая активность', 'definition' => 'Доля подростков, занимающихся физической активностью не менее 60 минут в день.'],
                    ['name' => 'Пищевые привычки', 'definition' => 'Ежедневное потребление фруктов и овощей.'],
                    ['name' => 'Психическое здоровье', 'definition' => 'Индекс удовлетворенности жизнью (Шкала Кантрила).'],
                ],
                'files' => [
                    ['title' => 'Национальный отчет HBSC 2022', 'category' => 'report', 'file_type' => 'pdf'],
                    ['title' => 'Executive Summary (Краткий обзор)', 'category' => 'exec_summary', 'file_type' => 'pdf'],
                ],
                'infographics' => [
                    ['title' => 'Физическая активность подростков', 'attributes' => ['brand' => 'HBSC Kazakhstan', 'period' => '2022', 'source' => 'НЦОЗ МЗ РК']],
                    ['title' => 'Потребление фаст-фуда и газировки', 'attributes' => ['brand' => 'HBSC Kazakhstan', 'period' => '2022', 'source' => 'НЦОЗ МЗ РК']],
                ]
            ],
            [
                'title' => 'GATS',
                'description' => 'Global Adult Tobacco Survey (Глобальный опрос взрослого населения о потреблении табака).',
                'sample' => 'Взрослое население от 15 лет и старше.',
                'geography' => 'Республика Казахстан',
                'period' => '2019',
                'methodology' => 'Домохозяйственное исследование с использованием стандартизированной выборки.',
                'citation_rules' => 'Глобальный опрос взрослого населения о потреблении табака (GATS), Казахстан, 2019.',
                'indicators' => [
                    ['name' => 'Ежедневное курение', 'definition' => 'Доля лиц, ежедневно потребляющих курительный табак.'],
                    ['name' => 'Пассивное курение', 'definition' => 'Воздействие табачного дыма дома или на рабочем месте.'],
                ],
                'files' => [
                    ['title' => 'Отчет GATS Казахстан', 'category' => 'report', 'file_type' => 'pdf'],
                ],
                'infographics' => [
                    ['title' => 'Статистика курения в Казахстане', 'attributes' => ['brand' => 'GATS', 'period' => '2019', 'source' => 'ВОЗ / МЗ РК']],
                ]
            ],
            [
                'title' => 'STEPS',
                'description' => 'Национальное исследование факторов риска неинфекционных заболеваний по методологии ВОЗ STEPS.',
                'sample' => 'Взрослое население.',
                'geography' => 'Республика Казахстан',
                'period' => '2023',
                'methodology' => 'Пошаговый подход: Step 1 (Анкетирование), Step 2 (Физические измерения), Step 3 (Биохимические анализы).',
                'citation_rules' => 'Исследование факторов риска НИЗ (STEPS), 2023.',
                'indicators' => [
                    ['name' => 'Повышенное артериальное давление', 'definition' => 'Доля населения с систолическим АД >= 140 мм рт. ст.'],
                    ['name' => 'Избыточная масса тела', 'definition' => 'ИМТ >= 25 кг/м2.'],
                ],
                'files' => [
                    ['title' => 'Отчет STEPS', 'category' => 'report', 'file_type' => 'pdf'],
                ],
                'infographics' => [
                    ['title' => 'Факторы риска НИЗ', 'attributes' => ['brand' => 'STEPS KAZ', 'period' => '2023', 'source' => 'НЦОЗ МЗ РК']],
                ]
            ],
            [
                'title' => 'COSI',
                'description' => 'Childhood Obesity Surveillance Initiative (Европейская инициатива ВОЗ по эпиднадзору за детским ожирением).',
                'sample' => 'Дети младшего школьного возраста (6-9 лет).',
                'geography' => 'Республика Казахстан',
                'period' => '2020',
                'methodology' => 'Антропометрические измерения и анкетирование родителей и школ.',
                'citation_rules' => 'Инициатива ВОЗ по эпиднадзору за детским ожирением (COSI), Казахстан.',
                'indicators' => [
                    ['name' => 'Ожирение среди детей', 'definition' => 'ИМТ > +2 SD по стандартам ВОЗ роста для детей.'],
                ],
                'files' => [
                    ['title' => 'Национальный отчет COSI 2020', 'category' => 'report', 'file_type' => 'pdf'],
                ],
                'infographics' => [
                    ['title' => 'Избыточная масса тела у школьников', 'attributes' => ['brand' => 'COSI', 'period' => '2020', 'source' => 'ВОЗ']],
                ]
            ]
        ];

        foreach ($researches as $index => $data) {
            $research = Research::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'description' => $data['description'],
                'sample' => $data['sample'],
                'geography' => $data['geography'],
                'period' => $data['period'],
                'methodology' => $data['methodology'],
                'citation_rules' => $data['citation_rules'],
                'is_active' => true,
                'sort_order' => $index,
            ]);

            foreach ($data['indicators'] as $i => $ind) {
                $research->indicators()->create([
                    'name' => $ind['name'],
                    'definition' => $ind['definition'],
                    'sort_order' => $i,
                ]);
            }

            foreach ($data['files'] as $i => $file) {
                $research->files()->create([
                    'title' => $file['title'],
                    'category' => $file['category'],
                    'file_path' => 'dummy/' . Str::slug($file['title']) . '.' . $file['file_type'],
                    'file_type' => $file['file_type'],
                    'sort_order' => $i,
                ]);
            }
            
            foreach ($data['infographics'] as $i => $info) {
                $research->infographics()->create([
                    'title' => $info['title'],
                    'attributes' => $info['attributes'],
                    'is_active' => true,
                    'sort_order' => $i,
                ]);
            }
            
            // Add a mock dashboard
            $research->dashboards()->create([
                'title' => 'Основные результаты (' . $data['title'] . ')',
                'type' => 'trend',
                'description' => 'Интерактивная визуализация ключевых показателей',
                'sort_order' => 0,
            ]);
        }
    }
}
