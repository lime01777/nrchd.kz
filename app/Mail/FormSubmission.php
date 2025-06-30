<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Support\Facades\Log;

class FormSubmission extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Тип формы
     * 
     * @var string
     */
    protected $formType;
    
    /**
     * Данные формы
     * 
     * @var array
     */
    protected $formData;
    
    /**
     * Файлы, прикрепленные к форме
     * 
     * @var array
     */
    protected $attachedFiles = [];

    /**
     * Create a new message instance.
     */
    public function __construct(string $formType, array $formData, array $files = [])
    {
        $this->formType = $formType;
        $this->formData = $formData;
        $this->attachedFiles = $files;
        
        // Записываем информацию в лог
        Log::info('Создание письма для формы', [
            'type' => $formType,
            'recipient' => 'office@nrchd.kz',
            'has_files' => !empty($files)
        ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->getSubject(),
            to: ['office@nrchd.kz']
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.form-submission',
            with: [
                'formType' => $this->formType,
                'formData' => $this->formData,
                'formTitle' => $this->getFormTitle()
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];
        
        foreach ($this->attachedFiles as $file) {
            if (isset($file['path']) && file_exists($file['path'])) {
                $attachments[] = Attachment::fromPath($file['path'])
                    ->as($file['name'] ?? basename($file['path']))
                    ->withMime($file['mime'] ?? null);
            }
        }
        
        return $attachments;
    }
    
    /**
     * Получить заголовок письма в зависимости от типа формы
     *
     * @return string
     */
    protected function getSubject(): string
    {
        $subjects = [
            'contact' => 'Новое сообщение с формы обратной связи | ННЦРЗ',
            'accreditation' => 'Новая заявка на аккредитацию | ННЦРЗ',
            'service_request' => 'Новая заявка на услугу | ННЦРЗ',
            'medical_accreditation' => 'Заявка на медицинскую аккредитацию | ННЦРЗ',
        ];
        
        return $subjects[$this->formType] ?? 'Новая заявка с сайта ННЦРЗ';
    }
    
    /**
     * Получить название формы для отображения в письме
     *
     * @return string
     */
    protected function getFormTitle(): string
    {
        $titles = [
            'contact' => 'Сообщение с формы обратной связи',
            'accreditation' => 'Заявка на аккредитацию',
            'service_request' => 'Заявка на услугу',
            'medical_accreditation' => 'Заявка на медицинскую аккредитацию',
        ];
        
        return $titles[$this->formType] ?? 'Заявка с сайта';
    }
}
