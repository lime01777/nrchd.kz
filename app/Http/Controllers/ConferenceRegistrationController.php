<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ConferenceRegistration;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class ConferenceRegistrationController extends Controller
{
    /**
     * Обработка формы регистрации на конференцию
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'organization' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'type' => 'required|in:participant,speaker',
            'topic' => 'required_if:type,speaker|string|nullable|max:500',
            'participantCategory' => 'required_if:type,participant|string|nullable|max:100',
            'agreement' => 'required|accepted',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // Преобразование данных для сохранения
        $data = $validator->validated();
        
        // Переименование поля participantCategory в participant_category для соответствия базе данных
        if (isset($data['participantCategory'])) {
            $data['participant_category'] = $data['participantCategory'];
            unset($data['participantCategory']);
        }
        
        // Удаление поля agreement, так как оно не сохраняется в базе
        unset($data['agreement']);
        
        // Сохранение данных регистрации
        $registration = ConferenceRegistration::create($data);
        
        // В реальном проекте здесь должна быть отправка уведомления по email
        // Mail::to($data['email'])->send(new ConferenceRegistrationConfirmation($data));
        
        // Сохраняем данные в сессии для отображения на странице успеха
        session(['registrationType' => $data['type']]);
        session(['registrationEmail' => $data['email']]);
        
        // Редирект на страницу успешной регистрации
        return redirect()->route('conference.registration.success');
    }
}
