<?php
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Логируем действия
$log = fopen(__DIR__.'/storage/logs/windsurf.log', 'a');
fwrite($log, date('Y-m-d H:i:s')." - Создание пользователя для работы с документами\n");

$user = User::where('email', 'cp@nrchd.kz')->first();

if ($user) {
    // Обновляем существующего пользователя
    $user->name = 'Менеджер документов';
    $user->password = Hash::make('E32we32w@');
    $user->role = 'document_manager'; // Устанавливаем роль менеджера документов
    $user->save();
    echo "Пользователь обновлен\n";
    fwrite($log, "Обновлен пользователь с email cp@nrchd.kz\n");
} else {
    // Создаем нового пользователя
    $user = new User();
    $user->name = 'Менеджер документов';
    $user->email = 'cp@nrchd.kz';
    $user->password = Hash::make('E32we32w@');
    $user->role = 'document_manager'; // Устанавливаем роль менеджера документов
    $user->save();
    echo "Пользователь создан\n";
    fwrite($log, "Создан новый пользователь с email cp@nrchd.kz\n");
}

fclose($log);
echo "Готово! Пользователь создан с логином cp@nrchd.kz и паролем E32we32w@\n";
echo "Роль: document_manager (ограниченный доступ только к документам)\n";
?>
