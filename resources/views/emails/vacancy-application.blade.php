<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Новая заявка на вакансию</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .vacancy-info {
            background-color: #dbeafe;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .field-value {
            background-color: white;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #2563eb;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Новая заявка на вакансию</h1>
    </div>
    
    <div class="content">
        <div class="vacancy-info">
            <strong>Вакансия:</strong> {{ $vacancy['title'] }}<br>
            <strong>Департамент:</strong> {{ $vacancy['department'] ?? 'Не указан' }}<br>
            <strong>Место работы:</strong> {{ $vacancy['city'] ?? 'Не указано' }}
        </div>

        <h3 style="color: #1e40af; margin-bottom: 15px;">Информация о кандидате:</h3>
        
        <div class="field">
            <div class="field-label">Имя:</div>
            <div class="field-value">{{ $applicant['name'] }}</div>
        </div>
        
        <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">
                <a href="mailto:{{ $applicant['email'] }}">{{ $applicant['email'] }}</a>
            </div>
        </div>
        
        <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">
                <a href="tel:{{ $applicant['phone'] }}">{{ $applicant['phone'] }}</a>
            </div>
        </div>
        
        @if(isset($applicant['cover_letter']) && $applicant['cover_letter'])
        <div class="field">
            <div class="field-label">Сопроводительное письмо:</div>
            <div class="field-value">{{ $applicant['cover_letter'] }}</div>
        </div>
        @endif
        
        <div class="field">
            <div class="field-label">Резюме:</div>
            <div class="field-value">
                Резюме прикреплено к письму
            </div>
        </div>
        
        <div class="footer">
            <p>Это письмо было отправлено автоматически с сайта ННЦРЗ им. Салидат Каирбековой.</p>
            <p>Время отправки: {{ now()->format('d.m.Y H:i:s') }}</p>
            <p>Ссылка на вакансию: <a href="{{ config('app.url') }}/about-centre/vacancies/{{ $vacancy['slug'] }}">{{ config('app.url') }}/about-centre/vacancies/{{ $vacancy['slug'] }}</a></p>
        </div>
    </div>
</body>
</html>

