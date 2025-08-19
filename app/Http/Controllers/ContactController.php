<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Mail\TechCompetenceFormMail;

class ContactController extends Controller
{
    /**
     * Отправить заявку с формы Отраслевого центра технологических компетенций
     */
    public function sendTechCompetenceForm(Request $request)
    {
        // Валидация данных
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'projectName' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,ppt,pptx' // 10MB max
        ]);

        try {
            // Сохраняем файл, если он есть
            $filePath = null;
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('tech-competence-files', $fileName, 'public');
            }

            // Данные для email
            $data = [
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'projectName' => $request->projectName,
                'message' => $request->message,
                'filePath' => $filePath,
                'fileName' => $filePath ? basename($filePath) : null
            ];

            // Логируем получение заявки
            Log::info('Заявка с формы ОЦТК получена:', $data);

            // Отправляем email
            Mail::to('no-reply@nrchd.kz')->send(new TechCompetenceFormMail(formData: $data));

            return response()->json([
                'success' => true,
                'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка при отправке заявки ОЦТК:', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при отправке заявки. Попробуйте позже.'
            ], 500);
        }
    }
}
