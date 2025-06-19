<?php
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Логируем действия
$log = fopen(__DIR__.'/storage/logs/windsurf.log', 'a');
fwrite($log, date('Y-m-d H:i:s')." - Создание/обновление админ-пользователя\n");

$user = User::where('email', 'lime0177@gmail.com')->first();

if ($user) {
    // Обновляем существующего пользователя
    $user->name = 'Администратор';
    $user->password = Hash::make('E32we32w@');
    $user->save();
    echo "Пользователь обновлен\n";
    fwrite($log, "Обновлен пользователь с email lime0177@gmail.com\n");
} else {
    // Создаем нового пользователя
    $user = new User();
    $user->name = 'Администратор';
    $user->email = 'lime0177@gmail.com';
    $user->password = Hash::make('E32we32w@');
    $user->save();
    echo "Пользователь создан\n";
    fwrite($log, "Создан новый пользователь с email lime0177@gmail.com\n");
}

fclose($log);
echo "Готово! Вы можете войти с логином lime0177@gmail.com и паролем E32we32w@\n";
?>
