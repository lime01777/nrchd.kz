<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class VacancyApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $vacancy;
    public $applicant;
    public $resumePath;

    /**
     * Создать новый экземпляр сообщения
     */
    public function __construct($vacancy, $applicant, $resumePath)
    {
        $this->vacancy = $vacancy;
        $this->applicant = $applicant;
        $this->resumePath = $resumePath;
    }

    /**
     * Получить конверт сообщения
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Новая заявка на вакансию: ' . $this->vacancy['title'],
        );
    }

    /**
     * Получить определение содержимого сообщения
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.vacancy-application',
            with: [
                'vacancy' => $this->vacancy,
                'applicant' => $this->applicant,
            ],
        );
    }

    /**
     * Получить вложения для сообщения
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        // Добавляем резюме в качестве вложения
        if ($this->resumePath && Storage::disk('public')->exists($this->resumePath)) {
            $extension = pathinfo($this->resumePath, PATHINFO_EXTENSION);
            $attachments[] = Attachment::fromStorageDisk('public', $this->resumePath)
                ->as('resume_' . str_replace(' ', '_', $this->applicant['name']) . '.' . $extension);
        }

        return $attachments;
    }
}

