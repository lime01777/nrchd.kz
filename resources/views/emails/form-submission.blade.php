<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $formTitle }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #267ca5;
            color: white;
            padding: 10px 15px;
            border-radius: 5px 5px 0 0;
            margin: -20px -20px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        table tr:last-child td {
            border-bottom: none;
        }
        .field-name {
            font-weight: bold;
            width: 30%;
            vertical-align: top;
        }
        .field-value {
            width: 70%;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $formTitle }}</h1>
        </div>
        
        <p>Вы получили новую заявку с сайта ННЦРЗ.</p>
        
        <table>
            @foreach($formData as $key => $value)
                <tr>
                    <td class="field-name">{{ ucfirst(str_replace('_', ' ', $key)) }}</td>
                    <td class="field-value">
                        @if(is_array($value))
                            {{ implode(', ', $value) }}
                        @else
                            {{ $value }}
                        @endif
                    </td>
                </tr>
            @endforeach
            <tr>
                <td class="field-name">Дата</td>
                <td class="field-value">{{ date('d.m.Y H:i:s') }}</td>
            </tr>
        </table>
        
        <div class="footer">
            <p>Это письмо было отправлено автоматически с сайта Национального научного центра развития здравоохранения имени Салидат Каирбековой.</p>
        </div>
    </div>
</body>
</html>
