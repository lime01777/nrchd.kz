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
        Log::info('Метод sendTechCompetenceForm вызван', [
            'method' => $request->method(),
            'url' => $request->url(),
            'headers' => $request->headers->all(),
            'data' => $request->all()
        ]);
        
        // Валидация данных
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'projectName' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,ppt,pptx' // 10MB max
        ]);

        Log::info('Валидация прошла успешно');

        try {
            // Сохраняем файл, если он есть
            $filePath = null;
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('tech-competence-files', $fileName, 'public');
                Log::info('Файл сохранен:', ['path' => $filePath]);
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

            // Отправляем email через SMTP с несколькими попытками
            $emailSent = false;
            
            // Попытка 1: Доверенный SMTP (с правильным local_domain)
            try {
                Mail::mailer('smtp_trusted')->to('r.kyliev@nrchd.kz')->send(new TechCompetenceFormMail($data));
                Log::info('Email успешно отправлен через доверенный SMTP');
                $emailSent = true;
            } catch (\Exception $trustedException) {
                Log::error('Ошибка отправки email через доверенный SMTP:', [
                    'error' => $trustedException->getMessage()
                ]);
                
                // Попытка 2: Обычный SMTP
                try {
                    Mail::mailer('smtp')->to('r.kyliev@nrchd.kz')->send(new TechCompetenceFormMail($data));
                    Log::info('Email успешно отправлен через SMTP');
                    $emailSent = true;
                } catch (\Exception $mailException) {
                    Log::error('Ошибка отправки email через SMTP:', [
                        'error' => $mailException->getMessage()
                    ]);
                    
                    // Попытка 3: SMTP без аутентификации (для хостинга)
                    try {
                        Mail::mailer('smtp_hosting')->to('r.kyliev@nrchd.kz')->send(new TechCompetenceFormMail($data));
                        Log::info('Email успешно отправлен через SMTP хостинга');
                        $emailSent = true;
                    } catch (\Exception $hostingException) {
                        Log::error('Ошибка отправки email через SMTP хостинга:', [
                            'error' => $hostingException->getMessage()
                        ]);
                        
                        // Попытка 4: Log mailer как резервный вариант
                        try {
                            Mail::mailer('log')->to('r.kyliev@nrchd.kz')->send(new TechCompetenceFormMail($data));
                            Log::info('Email сохранен в лог (резервный режим)');
                            $emailSent = true;
                        } catch (\Exception $logException) {
                            Log::error('Ошибка сохранения email в лог:', [
                                'error' => $logException->getMessage()
                            ]);
                        }
                    }
                }
            }
            
            if (!$emailSent) {
                Log::error('Все попытки отправки email не удались');
            }

            return response()->json([
                'success' => true,
                'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка при отправке заявки ОЦТК:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при отправке заявки. Попробуйте позже.'
            ], 500);
        }
    }
}
