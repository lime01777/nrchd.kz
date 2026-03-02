<?php

namespace App\Exports;

use App\Models\HealthTechnology;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class HealthTechnologiesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = HealthTechnology::query();

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['type'])) {
            $query->where('type', $this->filters['type']);
        }
        if (!empty($this->filters['direction'])) {
            $query->whereJsonContains('directions', $this->filters['direction']);
        }
        if (!empty($this->filters['search'])) {
             $search = $this->filters['search'];
             $query->where(function($q) use ($search) {
                 $q->where('name', 'like', "%{$search}%")
                   ->orWhere('developer', 'like', "%{$search}%")
                   ->orWhere('registry_code', 'like', "%{$search}%");
             });
        }
        if (!empty($this->filters['dateFrom'])) {
            $query->where(function($q) {
                $q->where('validation_date', '>=', $this->filters['dateFrom'])
                  ->orWhere('status_date', '>=', $this->filters['dateFrom']);
            });
        }
        if (!empty($this->filters['dateTo'])) {
            $query->where(function($q) {
                $q->where('validation_date', '<=', $this->filters['dateTo'])
                  ->orWhere('status_date', '<=', $this->filters['dateTo']);
            });
        }
        
        // codes
        foreach (['codeA' => 'code_a', 'codeB' => 'code_b', 'codeC' => 'code_c', 'codeD' => 'code_d', 'codeE' => 'code_e'] as $fkey => $dbkey) {
             if (!empty($this->filters[$fkey])) {
                 $query->where($dbkey, $this->filters[$fkey]);
             }
        }

        return $query->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Реестровый код',
            'Наименование технологии',
            'Тип',
            'Статус',
            'Дата статуса / валидации',
            'Разработчик',
            'Инициатор',
            'Направления',
            'Код A',
            'Код B',
            'Код C',
            'Код D',
            'Код E',
            'Уровень риска',
            'Уровень автономности ИИ',
            'TRL'
        ];
    }

    public function map($tech): array
    {
        return [
            $tech->id,
            $tech->registry_code,
            $tech->name,
            $tech->type,
            $tech->status,
            $tech->validation_date ?? $tech->status_date,
            $tech->developer,
            $tech->initiator,
            is_array($tech->directions) ? implode(', ', $tech->directions) : '',
            $tech->code_a,
            $tech->code_b,
            $tech->code_c,
            $tech->code_d,
            $tech->code_e,
            $tech->risk_level,
            $tech->autonomy_level,
            $tech->trl,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
