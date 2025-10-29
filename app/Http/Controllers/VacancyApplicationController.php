<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\VacancyApplication;
use App\Mail\VacancyApplicationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class VacancyApplicationController extends Controller
{
    /**
     * Обработка отправки заявки на вакансию
     */
    public function store(Request $request, $slug)
    {
        // Находим вакансию по slug
        $vacancy = Vacancy::where('slug', $slug)->where('status', 'published')->firstOrFail();
        
        // Валидация формы с более подробными сообщениями об ошибках
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // Максимум 5MB
            'cover_letter' => 'nullable|string|max:2000',
        ], [
            'name.required' => 'Пожалуйста, укажите ваше имя',
            'email.required' => 'Пожалуйста, укажите адрес электронной почты',
            'email.email' => 'Введите корректный адрес электронной почты',
            'phone.required' => 'Пожалуйста, укажите номер телефона',
            'resume.required' => 'Необходимо прикрепить резюме',
            'resume.mimes' => 'Резюме должно быть в формате PDF, DOC или DOCX',
            'resume.max' => 'Размер файла резюме не должен превышать 5MB',
        ]);
        
        try {
            // Сохраняем файл резюме прямо в папку public (без symlink)
            $resumePath = null;
            if ($request->hasFile('resume')) {
                $file = $request->file('resume');
                // Генерируем безопасное имя файла
                $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
                // Сохраняем в public/resumes/
                $resumePath = $file->storeAs('resumes', $fileName, 'public_direct');
            }
            
            // Сохраняем заявку в базу данных
            $application = VacancyApplication::create([
                'vacancy_id' => $vacancy->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'cover_letter' => $validated['cover_letter'] ?? null,
                'resume_path' => $resumePath,
                'status' => 'new',
            ]);
            
            // Сохраняем данные заявки в лог
            Log::channel('windsurf')->info('Новая заявка на вакансию сохранена', [
                'application_id' => $application->id,
                'vacancy_id' => $vacancy->id,
                'vacancy_title' => $vacancy->title,
                'applicant_name' => $validated['name'],
                'applicant_email' => $validated['email'],
                'applicant_phone' => $validated['phone'],
                'resume_path' => $resumePath,
            ]);
            
            // Отправляем email с заявкой на hr@nrchd.kz
            try {
                Mail::to('hr@nrchd.kz')->send(new VacancyApplicationMail(
                    [
                        'title' => $vacancy->title,
                        'department' => $vacancy->department,
                        'city' => $vacancy->city,
                        'slug' => $vacancy->slug,
                    ],
                    $validated,
                    $resumePath
                ));
                
                Log::channel('windsurf')->info('Email о заявке на вакансию успешно отправлен на hr@nrchd.kz');
            } catch (\Exception $mailError) {
                // Если не удалось отправить email, логируем ошибку, но не прерываем процесс
                Log::channel('windsurf')->error('Ошибка при отправке email о заявке на вакансию', [
                    'error' => $mailError->getMessage(),
                    'trace' => $mailError->getTraceAsString(),
                ]);
            }
            
            // Возвращаем успешный ответ через Inertia
            return back()->with('success', 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Ошибка при отправке заявки на вакансию', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'vacancy_slug' => $slug,
            ]);
            
            return back()->with('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз позже.');
        }
    }
}
