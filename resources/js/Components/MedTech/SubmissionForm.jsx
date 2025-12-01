import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

/**
 * Компонент блока "Как подать технологию"
 * Содержит инструкции и форму для подачи технологии
 */
export default function SubmissionForm() {
    const [formType, setFormType] = useState('technology'); // 'technology' или 'otz'
    
    const { data, setData, post, processing, errors, reset } = useForm({
        form_type: 'technology', // Тип формы: 'technology' или 'otz'
        organization: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        technology_name: '',
        description: '',
        type: '',
        trl: '',
        pilot_sites: '',
        attachment: null,
        // Поля для ОТЗ
        otz_type: '', // Тип ОТЗ
        otz_description: '', // Описание услуги
        otz_purpose: '', // Цель обращения
        otz_documents: null, // Документы для ОТЗ
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Обновляем form_type перед отправкой
        setData('form_type', formType);
        const routeName = formType === 'otz' ? 'medtech.submit.otz' : 'medtech.submit';
        post(route(routeName), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 10000);
            },
        });
    };

    const technologyTypes = [
        'Software',
        'Hardware',
        'Медицинское изделие',
        'Сервис',
        'Методика',
        'Другое',
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Как подать технологию
            </h3>

            {/* Переключатель типа заявки */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setFormType('technology')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                            formType === 'technology'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Заявка на технологию
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormType('otz')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                            formType === 'otz'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Заявка по ОТЗ (платные услуги)
                    </button>
                </div>
            </div>

            {/* Инструктивный текст */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                    {formType === 'otz' 
                        ? 'Инструкция по подаче заявки по ОТЗ:'
                        : 'Инструкция по подаче технологии:'
                    }
                </h4>
                {formType === 'otz' ? (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Ознакомьтесь с перечнем платных услуг ОЦТК</li>
                        <li>Подготовьте необходимые документы согласно требованиям</li>
                        <li>Заполните форму ниже и прикрепите документы</li>
                        <li>Отправьте заявку через форму или на e-mail: octk@nrchd.kz</li>
                        <li>После рассмотрения заявки с вами свяжутся для согласования условий и стоимости</li>
                    </ol>
                ) : (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>
                            Ознакомьтесь с требованиями и нормативной базой (см. раздел{' '}
                            <a href="#medtech-normative" className="text-blue-600 hover:underline">
                                «Нормативная база»
                            </a>
                            )
                        </li>
                        <li>Подготовьте пакет документов (презентация, описание технологии)</li>
                        <li>Заполните форму ниже и прикрепите необходимые документы</li>
                        <li>Отправьте заявку через форму или на e-mail: octk@nrchd.kz</li>
                    </ol>
                )}
            </div>

            {/* Сообщение об успешной отправке */}
            {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                    Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
                </div>
            )}

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
                {/* Общие поля для обеих форм */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="organization" value="Организация / команда *" />
                        <TextInput
                            id="organization"
                            type="text"
                            value={data.organization}
                            onChange={(e) => setData('organization', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.organization} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_name" value="ФИО контактного лица *" />
                        <TextInput
                            id="contact_name"
                            type="text"
                            value={data.contact_name}
                            onChange={(e) => setData('contact_name', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.contact_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_email" value="Контактный e-mail *" />
                        <TextInput
                            id="contact_email"
                            type="email"
                            value={data.contact_email}
                            onChange={(e) => setData('contact_email', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.contact_email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_phone" value="Контактный телефон *" />
                        <TextInput
                            id="contact_phone"
                            type="tel"
                            value={data.contact_phone}
                            onChange={(e) => setData('contact_phone', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.contact_phone} className="mt-2" />
                    </div>
                </div>

                {/* Поля для заявки на технологию */}
                {formType === 'technology' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="technology_name" value="Название технологии *" />
                                <TextInput
                                    id="technology_name"
                                    type="text"
                                    value={data.technology_name}
                                    onChange={(e) => setData('technology_name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.technology_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="type" value="Тип технологии" />
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Выберите тип</option>
                                    {technologyTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="trl" value="Уровень TRL (1-9)" />
                                <select
                                    id="trl"
                                    value={data.trl}
                                    onChange={(e) => setData('trl', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Выберите уровень</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.trl} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Краткое описание технологии *" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                placeholder="Опишите технологию, её назначение, преимущества"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pilot_sites" value="Предлагаемые пилотные площадки" />
                            <textarea
                                id="pilot_sites"
                                value={data.pilot_sites}
                                onChange={(e) => setData('pilot_sites', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Укажите, если есть предложения по пилотным площадкам"
                            />
                            <InputError message={errors.pilot_sites} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="attachment" value="Прикрепить файл (презентация/описание)" />
                            <input
                                id="attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                onChange={(e) => setData('attachment', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <InputError message={errors.attachment} className="mt-2" />
                        </div>
                    </>
                )}

                {/* Поля для заявки по ОТЗ */}
                {formType === 'otz' && (
                    <>
                        <div>
                            <InputLabel htmlFor="otz_type" value="Тип услуги ОТЗ *" />
                            <select
                                id="otz_type"
                                value={data.otz_type}
                                onChange={(e) => setData('otz_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Выберите тип услуги</option>
                                <option value="expertise">Экспертиза медицинской технологии</option>
                                <option value="assessment">Оценка технологической готовности (TRL)</option>
                                <option value="classification">Классификация по классам риска</option>
                                <option value="clinical_trial">Разработка протокола клинической апробации</option>
                                <option value="hta">Оценка технологий здравоохранения (HTA)</option>
                                <option value="consultation">Консультационные услуги</option>
                                <option value="other">Другое</option>
                            </select>
                            <InputError message={errors.otz_type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="otz_description" value="Описание услуги / объекта экспертизы *" />
                            <textarea
                                id="otz_description"
                                value={data.otz_description}
                                onChange={(e) => setData('otz_description', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                placeholder="Опишите объект экспертизы или услугу, которую необходимо получить"
                            />
                            <InputError message={errors.otz_description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="otz_purpose" value="Цель обращения *" />
                            <textarea
                                id="otz_purpose"
                                value={data.otz_purpose}
                                onChange={(e) => setData('otz_purpose', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                placeholder="Укажите цель обращения, для чего необходима данная услуга"
                            />
                            <InputError message={errors.otz_purpose} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="otz_documents" value="Прикрепить документы *" />
                            <input
                                id="otz_documents"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('otz_documents', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Прикрепите необходимые документы согласно требованиям к выбранному типу услуги
                            </p>
                            <InputError message={errors.otz_documents} className="mt-2" />
                        </div>
                    </>
                )}

                <div className="flex justify-end">
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing 
                            ? 'Отправка...' 
                            : formType === 'otz' 
                                ? 'Подать заявку по ОТЗ' 
                                : 'Подать технологию'
                        }
                    </PrimaryButton>
                </div>
            </form>

            {/* Дополнительная информация */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Контакты:</h4>
                <p className="text-sm text-gray-700">
                    E-mail ОЦТК: <a href="mailto:octk@nrchd.kz" className="text-blue-600 hover:underline">octk@nrchd.kz</a>
                </p>
            </div>
        </div>
    );
}

