<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentApiController extends Controller
{
    /**
     * Получить документы по ID аккордеона
     */
    public function getByAccordionId($accordionId)
    {
        // Для научно-медицинской экспертизы
        if ($accordionId === 'medical-education') {
            $documents = Storage::disk('public')->files('documents');
            
            // Определяем секции и документы
            $sections = [
                [
                    'title' => 'Научно-медицинская экспертиза',
                    'documents' => [
                        [
                            'description' => 'МР по оформлению и утверждению НМР',
                            'filetype' => 'pdf',
                            'img' => 2,
                            'filesize' => '24 KB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/ustav.pdf'
                        ],
                        [
                            'description' => 'О проведении НМЭ',
                            'filetype' => 'doc',
                            'img' => 1,
                            'filesize' => '24 KB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/3.docx'
                        ],
                        [
                            'description' => 'Приказ о научно-медицинской экспертизе',
                            'filetype' => 'pdf',
                            'img' => 2,
                            'filesize' => '24 KB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/ustav.pdf'
                        ],
                        [
                            'description' => 'Приказ о рабочем органе',
                            'filetype' => 'doc',
                            'img' => 1,
                            'filesize' => '24 KB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/3.docx'
                        ]
                    ]
                ],
                [
                    'title' => 'Повышение квалификации для среднего медперсонала',
                    'documents' => [
                        [
                            'description' => 'Совершенствование системы оценки медицинских технологий',
                            'filetype' => 'xls',
                            'img' => 3,
                            'filesize' => '87 KB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/2.xlsx'
                        ]
                    ]
                ],
                [
                    'title' => 'Повышение квалификации для врачей',
                    'documents' => [
                        [
                            'description' => 'Совершенствование системы оценки медицинских технологий',
                            'filetype' => 'ppt',
                            'img' => 4,
                            'filesize' => '8.4 MB',
                            'date' => '27.03.2024',
                            'url' => '/storage/documents/4.pptx'
                        ]
                    ]
                ]
            ];
            
            return response()->json($sections);
        }
        
        // Для других аккордеонов можно добавить другую логику
        
        return response()->json([]);
    }
}
