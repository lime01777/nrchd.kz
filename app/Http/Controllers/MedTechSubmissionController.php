<?php

namespace App\Http\Controllers;

use App\Models\MedTechSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MedTechSubmissionController extends Controller
{
    /**
     * Обработка формы подачи технологии
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'organization' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'technology_name' => 'nullable|string|max:255',
            'description' => 'required|string|min:10',
            'type' => 'nullable|string|max:100',
            'trl' => 'nullable|integer|min:1|max:9',
            'pilot_sites' => 'nullable|string|max:1000',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
        ]);

        try {
            // Сохраняем файл, если есть
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')->store('medtech/submissions', 'public');
            }

            // Создаем запись в БД
            $submission = MedTechSubmission::create([
                'organization' => $validated['organization'],
                'contact_name' => $validated['contact_name'],
                'contact_email' => $validated['contact_email'],
                'contact_phone' => $validated['contact_phone'] ?? null,
                'technology_name' => $validated['technology_name'] ?? null,
                'description' => $validated['description'],
                'type' => $validated['type'] ?? null,
                'trl' => $validated['trl'] ?? null,
                'pilot_sites' => $validated['pilot_sites'] ?? null,
                'attachment_path' => $attachmentPath,
                'status' => 'new',
            ]);

            // Отправляем email (опционально)
            try {
                Mail::raw(
                    "Новая заявка на подачу технологии MedTech\n\n" .
                    "Организация: {$submission->organization}\n" .
                    "Контактное лицо: {$submission->contact_name}\n" .
                    "Email: {$submission->contact_email}\n" .
                    "Телефон: " . ($submission->contact_phone ?? 'не указан') . "\n" .
                    "Название технологии: " . ($submission->technology_name ?? 'не указано') . "\n" .
                    "Описание: {$submission->description}",
                    function ($message) use ($submission) {
                        $message->to('octk@nrchd.kz')
                            ->subject('Новая заявка на подачу технологии MedTech');
                    }
                );
            } catch (\Exception $e) {
                Log::warning('Не удалось отправить email для заявки MedTech', [
                    'submission_id' => $submission->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return back()->with('success', 'Ваша заявка успешно отправлена!');
        } catch (\Exception $e) {
            Log::error('Ошибка при сохранении заявки MedTech', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return back()->withErrors([
                'error' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.',
            ]);
        }
    }
}
