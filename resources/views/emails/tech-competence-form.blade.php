<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Новая заявка с формы ОЦТК</title>
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
        <h1>Новая заявка с формы Отраслевого центра технологических компетенций</h1>
    </div>
    
    <div class="content">
        <div class="field">
            <div class="field-label">Имя:</div>
            <div class="field-value">{{ $formData['name'] }}</div>
        </div>
        
        <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">{{ $formData['phone'] }}</div>
        </div>
        
        <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">{{ $formData['email'] }}</div>
        </div>
        
        @if($formData['projectName'])
        <div class="field">
            <div class="field-label">Название проекта:</div>
            <div class="field-value">{{ $formData['projectName'] }}</div>
        </div>
        @endif
        
        @if($formData['message'])
        <div class="field">
            <div class="field-label">Сообщение:</div>
            <div class="field-value">{{ $formData['message'] }}</div>
        </div>
        @endif
        
        @if($formData['fileName'])
        <div class="field">
            <div class="field-label">Прикрепленный файл:</div>
            <div class="field-value">{{ $formData['fileName'] }}</div>
        </div>
        @endif
        
        <div class="footer">
            <p>Это письмо было отправлено автоматически с сайта ННЦРЗ им. Салидат Каирбековой.</p>
            <p>Время отправки: {{ now()->format('d.m.Y H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
