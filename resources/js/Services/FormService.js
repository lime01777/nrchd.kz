/**
 * Сервис для работы с формами
 * Отправляет все формы на email office@nrchd.kz
 */

import axios from 'axios';

class FormService {
    /**
     * Отправить форму через API
     * 
     * @param {string} formType - Тип формы (contact, accreditation, service_request и т.д.)
     * @param {object} formData - Данные формы
     * @param {Array} files - Массив файлов (опционально)
     * @returns {Promise} - Promise с результатом отправки
     */
    static async submitForm(formType, formData, files = []) {
        try {
            // Для отслеживания процесса отправки в консоли
            console.log(`Отправка формы типа: ${formType}`, formData);
            
            // Если есть файлы, используем FormData для отправки
            if (files && files.length > 0) {
                const formDataObj = new FormData();
                formDataObj.append('formType', formType);
                
                // Добавляем все поля формы
                Object.keys(formData).forEach(key => {
                    formDataObj.append(`formData[${key}]`, formData[key]);
                });
                
                // Добавляем файлы
                files.forEach((file, index) => {
                    formDataObj.append(`files[${index}]`, file);
                });
                
                // Отправляем форму с файлами
                return await axios.post('/api/forms/submit', formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            // Отправка формы без файлов
            return await axios.post('/api/forms/submit', {
                formType,
                formData
            });
        } catch (error) {
            console.error(`Ошибка при отправке формы типа ${formType}:`, error);
            throw error;
        }
    }
    
    /**
     * Отправить форму обратной связи
     * 
     * @param {object} data - Данные формы обратной связи
     * @returns {Promise} - Promise с результатом отправки
     */
    static async submitContactForm(data) {
        try {
            return await axios.post('/api/forms/contact', data);
        } catch (error) {
            console.error('Ошибка при отправке формы обратной связи:', error);
            throw error;
        }
    }
    
    /**
     * Отправить форму запроса на аккредитацию
     * 
     * @param {object} data - Данные формы аккредитации
     * @returns {Promise} - Promise с результатом отправки
     */
    static async submitAccreditationForm(data) {
        try {
            return await axios.post('/api/forms/accreditation', data);
        } catch (error) {
            console.error('Ошибка при отправке формы аккредитации:', error);
            throw error;
        }
    }
    
    /**
     * Отправить форму заявки на услугу
     * 
     * @param {object} data - Данные формы услуги
     * @returns {Promise} - Promise с результатом отправки
     */
    static async submitServiceForm(data) {
        try {
            return await axios.post('/api/forms/service', data);
        } catch (error) {
            console.error('Ошибка при отправке формы заявки на услугу:', error);
            throw error;
        }
    }
}

export default FormService;
