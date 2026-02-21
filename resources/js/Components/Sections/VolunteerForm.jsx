import React, { useState } from 'react';
import translationService from '@/Services/TranslationService';

const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

export default function VolunteerForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        experience: '',
        motivation: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Имитация отправки
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                city: '',
                experience: '',
                motivation: ''
            });
            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    return (
        <section className="py-16 bg-white overflow-hidden relative">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

            <div className="container px-5 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Текстовая часть */}
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Стань частью команды <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">волонтёров ЗОЖ</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Мы ищем активных и целеустремленных людей, готовых помогать в продвижении здорового образа жизни. Вместе мы сможем сделать наше общество более здоровым и осознанным.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Обучение и развитие</h4>
                                    <p className="text-gray-500">Бесплатные тренинги и семинары по теме здоровья</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Новые знакомства</h4>
                                    <p className="text-gray-500">Сообщество единомышленников со всей страны</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Форма */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative">
                            {isSuccess ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка отправлена!</h3>
                                    <p className="text-gray-500">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">ФИО</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                required
                                                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                                placeholder="Александр Иванов"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                                placeholder="example@mail.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Телефон</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                required
                                                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                                placeholder="+7 (___) ___-__-__"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Город</label>
                                            <input
                                                type="text"
                                                id="city"
                                                required
                                                className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                                placeholder="Ваш город"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Почему вы хотите стать волонтером?</label>
                                        <textarea
                                            id="motivation"
                                            rows="3"
                                            required
                                            className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                                            placeholder="Расскажите немного о себе и своих целях..."
                                            value={formData.motivation}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Отправить заявку'}
                                    </button>

                                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest pt-2">
                                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
