<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Экспорт реестра медицинских технологий</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #dddddd;
            padding: 4px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h2>Реестр технологий здравоохранения</h2>
    <table>
        <thead>
            <tr>
                <th>Реестровый код</th>
                <th>Наименование</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Направления</th>
                <th>Разработчик</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
            <tr>
                <td>{{ $item->registry_code }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ current(array_filter([
                     'digital' => 'Цифровая',
                     'ai_software' => 'ИИ/ПО',
                     'medical_device' => 'Медицинское изделие',
                     'biomedical' => 'Клеточная/биомедицинская',
                     'drug' => 'Лекарственная',
                     'organizational' => 'Организационная',
                     'combined' => 'Комбинированная'
                 ], fn($k) => $k === $item->type, ARRAY_FILTER_USE_KEY)) ?: $item->type }}</td>
                <td>{{ current(array_filter([
                    'project' => 'Проект',
                    'pilot' => 'На пилоте',
                    'implementation' => 'На стадии внедрения',
                    'scaling' => 'Масштабирование',
                    'suspended' => 'Приостановлено',
                    'archive' => 'Архив'
                ], fn($k) => $k === $item->status, ARRAY_FILTER_USE_KEY)) ?: $item->status }}</td>
                <td>{{ $item->validation_date ?: $item->status_date }}</td>
                <td>{{ is_array($item->directions) ? implode(', ', $item->directions) : '' }}</td>
                <td>{{ $item->developer }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
