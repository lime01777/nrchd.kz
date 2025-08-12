<?php

require_once 'vendor/autoload.php';

use App\Http\Controllers\Admin\NewsController;

echo "Testing NewsController...\n";

try {
    $controller = new NewsController();
    echo "Controller created successfully\n";
    
    // Проверяем, есть ли метод store
    if (method_exists($controller, 'store')) {
        echo "Method 'store' exists\n";
    } else {
        echo "Method 'store' does not exist\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
