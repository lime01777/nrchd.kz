<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NewsDebugController extends Controller
{
    public function debug(Request $request)
    {
        // Логируем все данные запроса
        Log::info('Данные запроса при создании новости', [
            'all' => $request->all(),
            'has_images' => $request->has('images'),
            'images_input' => $request->input('images'),
            'images_files' => $request->hasFile('images') ? 'есть файлы' : 'нет файлов',
            'main_image' => $request->input('main_image')
        ]);

        return response()->json(['status' => 'debug logged']);
    }
}
