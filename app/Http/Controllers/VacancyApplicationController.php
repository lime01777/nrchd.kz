<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VacancyApplicationController extends Controller
{
    /**
     * Обработка отправки заявки на вакансию
     */
    public function store(Request $request, $slug)
    {
        // Находим вакансию по slug
        $vacancy = Vacancy::where('slug', $slug)->where('status', 'published')->firstOrFail();
        
        // Валидация формы
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // Максимум 5MB
            'cover_letter' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        try {
            // Сохраняем файл резюме
            $resumePath = null;
            if ($request->hasFile('resume')) {
                $file = $request->file('resume');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $resumePath = $file->storeAs('resumes', $fileName, 'public');
            }
            
            // Сохраняем данные заявки в лог для демонстрации
            Log::channel('windsurf')->info('Новая заявка на вакансию', [
                'vacancy_id' => $vacancy->id,
                'vacancy_title' => $vacancy->title,
                'applicant_name' => $request->name,
                'applicant_email' => $request->email,
                'applicant_phone' => $request->phone,
                'resume_path' => $resumePath,
            ]);
            
            // В реальной ситуации, здесь мы бы отправляли email с заявкой
            // Mail::to('hr@example.com')->send(new VacancyApplication($vacancy, $request->all(), $resumePath));
            
            // Возвращаем успешный ответ
            return redirect()->back()->with('success', 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        } catch (\Exception $e) {
            Log::channel('windsurf')->error('Ошибка при отправке заявки на вакансию: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз позже.')
                ->withInput();
        }
    }
}
