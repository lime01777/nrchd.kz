import React, { useState } from 'react';

/**
 * Универсальный компонент формы обратной связи
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.formType - Тип формы для идентификации на сервере (contact, feedback и т.д.)
 * @param {string} props.title - Заголовок формы
 * @param {string} props.btnText - Текст кнопки отправки формы
 * @param {string} props.bgColor - Цвет фона формы
 * @param {Array} props.additionalFields - Дополнительные поля формы
 * @param {Function} props.onSuccess - Функция, вызываемая при успешной отправке формы
 * @returns {JSX.Element}
 */
const ContactForm = ({ 
    formType = 'contact',
    title = 'Свяжитесь с нами',
    btnText = 'Отправить',
    bgColor = 'bg-white',
    btnColor = 'bg-yellow-600 hover:bg-yellow-700',
    additionalFields = [],
    onSuccess = null
}) => {
    // Базовое состояние формы
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    
    // Состояния для управления процессом отправки
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [files, setFiles] = useState([]);
    
    // Обработка изменений в полях формы
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };
    
    // Обработка загрузки файлов
    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };
    
    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // Динамический импорт сервиса форм
            const { default: FormService } = await import('@/Services/FormService');
            
            // Отправка данных через API
            const response = await FormService.submitForm(formType, formData, files);
            
            // Обработка успешного ответа
            console.log('Форма успешно отправлена:', response.data);
            setSubmitStatus({ 
                success: true, 
                message: 'Форма успешно отправлена. Мы свяжемся с вами в ближайшее время.' 
            });
            
            // Очистка формы
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
            setFiles([]);
            
            // Вызов пользовательской функции обратного вызова при успешной отправке
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            setSubmitStatus({ 
                success: false, 
                message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className={`${bgColor} rounded-lg shadow-md p-4 border border-gray-200`}>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">{title}</h2>
            
            {/* Отображение статуса отправки формы */}
            {submitStatus && (
                <div className={`mb-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitStatus.message}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="text-sm">
                {/* Поле имя/организация */}
                <div className="mb-3">
                    <label htmlFor="name" className="block text-gray-700 text-xs font-medium mb-1">
                        Ваше имя / Организация
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>
                
                {/* Поля email и телефон в две колонки */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-xs font-medium mb-1">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 text-xs font-medium mb-1">
                            Телефон
                        </label>
                        <input 
                            type="tel" 
                            id="phone" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                
                {/* Дополнительные поля формы */}
                {additionalFields.length > 0 && additionalFields.map((field, index) => (
                    <div key={index} className="mb-3">
                        <label htmlFor={field.id} className="block text-gray-700 text-xs font-medium mb-1">
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea 
                                id={field.id} 
                                rows={field.rows || 3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={formData[field.id] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required={field.required}
                            ></textarea>
                        ) : field.type === 'select' ? (
                            <select
                                id={field.id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={formData[field.id] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required={field.required}
                            >
                                <option value="">Выберите...</option>
                                {field.options && field.options.map((option, i) => (
                                    <option key={i} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type={field.type || 'text'} 
                                id={field.id} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={formData[field.id] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
                
                {/* Поле для сообщения */}
                <div className="mb-3">
                    <label htmlFor="message" className="block text-gray-700 text-xs font-medium mb-1">
                        Сообщение
                    </label>
                    <textarea 
                        id="message" 
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    ></textarea>
                </div>
                
                {/* Согласие на обработку данных */}
                <div className="flex items-center mb-4">
                    <input 
                        type="checkbox" 
                        id="consent" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                        disabled={isSubmitting}
                    />
                    <label htmlFor="consent" className="ml-2 block text-xs text-gray-700">
                        Я согласен на обработку персональных данных
                    </label>
                </div>
                
                {/* Кнопка отправки */}
                <div className="flex justify-center">
                    <button 
                        type="submit"
                        className={`${btnColor} text-white font-medium py-2 px-6 rounded-md text-sm transition duration-300 w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Отправка...' : btnText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
