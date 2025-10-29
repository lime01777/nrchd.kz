<?php

namespace App\Http\Controllers;

use App\Models\ContactApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactApplicationController extends Controller
{
    /**
     * Обработка отправки общей формы обратной связи
     */
    public function store(Request $request)
    {
        // Валидация формы
        $validated = $request->validate([
            'category' => 'required|string|in:' . implode(',', array_keys(ContactApplication::getCategories())),
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
            'organization' => 'nullable|string|max:255',
            'project_name' => 'nullable|string|max:255',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // Максимум 10MB
        ], [
            'category.required' => 'Укажите категорию обращения',
            'name.required' => 'Пожалуйста, укажите ваше имя',
            'email.required' => 'Пожалуйста, укажите адрес электронной почты',
            'email.email' => 'Введите корректный адрес электронной почты',
            'phone.required' => 'Пожалуйста, укажите номер телефона',
            'message.required' => 'Пожалуйста, введите сообщение',
            'attachment.mimes' => 'Файл должен быть в формате PDF, DOC, DOCX, JPG, JPEG или PNG',
            'attachment.max' => 'Размер файла не должен превышать 10MB',
        ]);
        
        try {
            // Сохраняем файл прямо в папку public (без symlink)
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                // Генерируем безопасное имя файла
                $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
                // Сохраняем в public/contact_attachments/
                $attachmentPath = $file->storeAs('contact_attachments', $fileName, 'public_direct');
            }
            
            // Сохраняем заявку в базу данных
            $application = ContactApplication::create([
                'category' => $validated['category'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'subject' => $validated['subject'] ?? null,
                'message' => $validated['message'],
                'organization' => $validated['organization'] ?? null,
                'project_name' => $validated['project_name'] ?? null,
                'attachment_path' => $attachmentPath,
                'status' => 'new',
            ]);
            
            // Логируем создание заявки
            Log::info('Новая заявка обратной связи создана', [
                'application_id' => $application->id,
                'category' => $validated['category'],
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
            
            // Возвращаем успешный ответ
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
                    'application_id' => $application->id,
                ]);
            }
            
            return back()->with('success', 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            
        } catch (\Exception $e) {
            Log::error('Ошибка при создании заявки обратной связи', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз позже.',
                ], 500);
            }
            
            return back()->with('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз позже.');
        }
    }
}

