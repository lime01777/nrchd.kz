import { Head } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';

export default function PostAccreditationMonitoring() {
  const [formData, setFormData] = useState({
    organizationName: '',
    region: '',
    city: '',
    bin: '',
    director: '',
    approvalDate: '',
    responsiblePerson: '',
    phone: '',
    email: '',
  });
  
  const fileInputRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки формы
    console.log('Submitted data:', formData);
    console.log('Attached files:', attachedFiles);
    // TODO: добавить API для отправки данных
    alert('Отчет успешно отправлен!');
  };
  
  const handleDownloadTemplate = () => {
    const templateUrl = '/storage/documents/Услуги/Постаккредитационный мониторинг/Шаблон -Отчёт об исполнении плана корректирующих мероприятий.docx';
    
    // Создаем временную ссылку для скачивания файла
    const link = document.createElement('a');
    link.href = templateUrl;
    link.setAttribute('download', 'Шаблон -Отчёт об исполнении плана корректирующих мероприятий.docx');
    link.setAttribute('target', '_blank');
    
    // Добавляем ссылку в DOM, кликаем на нее и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    setAttachedFiles([...attachedFiles, ...files]);
  };
  
  const handleGoogleDriveClick = () => {
    // Логика для интеграции с Google Drive
    console.log('Opening Google Drive picker...');
    // В реальном приложении здесь была бы интеграция с Google Drive API
    alert('Функция интеграции с Google Drive находится в разработке');
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...attachedFiles];
    updatedFiles.splice(index, 1);
    setAttachedFiles(updatedFiles);
  };

  return (
    <>
      <Head title="Постаккредитационный мониторинг" />
      
      <section className="text-gray-600 body-font">
        <div className="container mx-auto py-8 md:py-16 px-4 md:px-5">
          <div className="flex flex-wrap -mx-2 md:-mx-4">
            
            {/* Левая колонка - описание услуги */}
            <div className="w-full lg:w-1/2 px-2 md:px-4 mb-8 md:mb-10 lg:mb-0">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">О постаккредитационном мониторинге</h2>
              <div className="leading-relaxed text-sm md:text-base space-y-3">
                <p>
                  Постаккредитационный мониторинг (ПАМ) регламентируется приказами Министра здравоохранения Республики Казахстан от 30 ноября 2020 года № ҚР ДСМ-227/2020 «Об утверждении правил, сроков проведения постаккредитационного мониторинга и отзыва свидетельства об аккредитации в области здравоохранения», председателя Правления РГП на ПХВ «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» от 27 октября 2023 года № 206-Н «Об утверждении порядка проведения постаккредитационного мониторинга медицинских организаций».
                </p>
                <p>
                  ПАМ проводится в плановом порядке 1 раз в 3 года, но не ранее 6-ти месяцев со дня получения свидетельства об аккредитации, в организациях здравоохранения [п.2 ст.25 Кодекса Республики Казахстан от 7 июля 2020 года № 360-VI «О здоровье народа и системе здравоохранения»], прошедших аккредитацию в области здравоохранения, на соответствие установленным требованиям (пп.2 п.2 гл.1).
                </p>
                <p>
                  Внеплановый постаккредитационный мониторинг проводится в случаях поступления в аккредитующий орган на деятельность аккредитованной организации в течение одного года с момента получения свидетельства об аккредитации 2-х жалоб от физических/юридических лиц, по результатам рассмотрения которых подтверждены факты нарушения прав и свобод заявителей.
                </p>
              </div>
              <br />
              {/* Заголовок и кнопка скачать шаблон */}
              <div className="bg-blue-700 text-white text-center py-3 px-4 rounded-lg mb-4">
                <h2 className="text-lg md:text-xl font-medium">Отчёт об исполнении плана корректирующих мероприятий</h2>
              </div>
              
              <button 
                onClick={handleDownloadTemplate}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base transition duration-300 w-full mb-5"
              >
                Скачать шаблон отчёта
              </button>
            </div>
            
            {/* Правая колонка - форма отчета */}
            <div className="w-full lg:w-1/2 px-2 md:px-4">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4 md:p-6">
                  <form onSubmit={handleSubmit}>
                    {/* Поля формы */}
                    <div className="mb-3">
                      <label htmlFor="organizationName" className="block text-gray-700 text-sm font-medium mb-1">Полное наименование организации</label>
                      <input 
                        type="text" 
                        id="organizationName" 
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="region" className="block text-gray-700 text-sm font-medium mb-1">Область</label>
                      <input 
                        type="text" 
                        id="region" 
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">Город</label>
                      <input 
                        type="text" 
                        id="city" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="bin" className="block text-gray-700 text-sm font-medium mb-1">БИН организации</label>
                      <input 
                        type="text" 
                        id="bin" 
                        name="bin"
                        value={formData.bin}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="director" className="block text-gray-700 text-sm font-medium mb-1">Первый руководитель (ФИО)</label>
                      <input 
                        type="text" 
                        id="director" 
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="approvalDate" className="block text-gray-700 text-sm font-medium mb-1">Дата утверждения отчёта по плану корректирующих мероприятий</label>
                      <input 
                        type="date" 
                        id="approvalDate" 
                        name="approvalDate"
                        value={formData.approvalDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Ответственное лицо за <span className="text-red-500">постаккредитационный</span> мониторинг (ФИО, телефон с <span className="text-red-500">Whatsapp</span>, e-mail)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          name="responsiblePerson"
                          placeholder="ФИО"
                          value={formData.responsiblePerson}
                          onChange={handleChange}
                          className="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="Телефон"
                          value={formData.phone}
                          onChange={handleChange}
                          className="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="E-mail"
                          value={formData.email}
                          onChange={handleChange}
                          className="col-span-3 md:col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Прикрепить документы */}
                    <div className="mt-5 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm">Прикрепить <a href="#" className="text-blue-600 hover:underline">документы</a> (утверждённый отчёт по исполнению плана корректирующих мероприятий в формате pdf, подтверждающие документы в архиве)</p>
                      </div>
                      
                      <div className="flex gap-3 mt-2">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                          multiple 
                        />
                        
                        {/* Кнопки для загрузки файлов */}
                        <button
                          type="button"
                          onClick={handleAttachClick}
                          className="flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded-md text-sm transition duration-300"
                          title="Прикрепить файл с компьютера"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Загрузить файл
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleGoogleDriveClick}
                          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition duration-300"
                          title="Прикрепить файл из Google Drive"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.71 3.5L1.15 15L4.58 21L11.13 9.5M9.73 15L6.3 21H17.87L21.3 15M22.85 15L15.42 3.5H7.71L15.13 15" />
                          </svg>
                          Google Drive
                        </button>
                      </div>
                      
                      {/* Список прикрепленных файлов */}
                      {attachedFiles.length > 0 && (
                        <div className="mt-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Прикрепленные файлы:</h4>
                          <ul className="text-sm">
                            {attachedFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between py-1">
                                <span className="truncate max-w-[80%]">{file.name}</span>
                                <button 
                                  type="button" 
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Кнопка отправить */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-5 rounded-md text-sm md:text-base transition duration-300 w-60"
                      >
                        отправить
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

PostAccreditationMonitoring.layout = (page) => <ServicesPageLayout title="Постаккредитационный мониторинг" img="service-accreditation">{page}</ServicesPageLayout>;
