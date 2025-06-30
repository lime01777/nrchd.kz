<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\FormSubmission;

class FormController extends Controller
{
    /**
     * Основной метод обработки отправки форм
     */
    public function submitForm(Request $request)
    {
        // Валидация формы
        $validated = $request->validate([
            'formType' => 'required|string',
            'formData' => 'required|array',
        ]);

        $formType = $validated['formType'];
        $formData = $validated['formData'];
        
        // Логирование для отладки
        Log::info('Получена форма типа: ' . $formType, ['data' => $formData]);
        
        try {
            // Отправка письма на office@nrchd.kz
            Mail::to('office@nrchd.kz')->send(new FormSubmission($formType, $formData));
            
            // Запись в лог
            Log::info('Форма успешно отправлена на email: office@nrchd.kz', [
                'form_type' => $formType
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Форма успешно отправлена'
            ]);
        } catch (\Exception $e) {
            // Запись ошибки в лог
            Log::error('Ошибка при отправке формы: ' . $e->getMessage(), [
                'form_type' => $formType,
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.'
            ], 500);
        }
    }
    
    /**
     * Обработчик формы обратной связи
     */
    public function contactForm(Request $request)
    {
        // Валидация полей
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);
        
        return $this->submitForm(new Request([
            'formType' => 'contact',
            'formData' => $validated
        ]));
    }
    
    /**
     * Обработчик формы аккредитации
     */
    public function accreditationForm(Request $request)
    {
        // Валидация полей
        $validated = $request->validate([
            'orgName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string',
        ]);
        
        return $this->submitForm(new Request([
            'formType' => 'accreditation',
            'formData' => $validated
        ]));
    }
    
    /**
     * Обработчик формы для заявки на услуги
     */
    public function serviceRequestForm(Request $request)
    {
        // Валидация полей
        $validated = $request->validate([
            'serviceName' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'organization' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'details' => 'nullable|string',
        ]);
        
        return $this->submitForm(new Request([
            'formType' => 'service_request',
            'formData' => $validated
        ]));
    }
}
