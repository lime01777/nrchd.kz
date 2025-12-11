import { Head, usePage } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FilesAccord from '@/Components/FilesAccord';
import VideoModal from '@/Components/VideoModal';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

// Компонент формы постаккредитационного мониторинга для отображения в шапке
const PostMonitoringForm = () => {
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
    alert(t('servicesPages.postAccreditationMonitoring.form.successMessage'));
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
    alert(t('servicesPages.postAccreditationMonitoring.form.googleDriveAlert'));
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...attachedFiles];
    updatedFiles.splice(index, 1);
    setAttachedFiles(updatedFiles);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">{t('servicesPages.postAccreditationMonitoring.form.title')}</h2>
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-3">
          <label htmlFor="organizationName" className="block text-gray-700 text-sm font-medium mb-1">{t('servicesPages.postAccreditationMonitoring.form.organizationName')}</label>
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
          <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">{t('servicesPages.postAccreditationMonitoring.form.address')}</label>
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
          <label htmlFor="bin" className="block text-gray-700 text-sm font-medium mb-1">{t('servicesPages.postAccreditationMonitoring.form.bin')}</label>
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
          <label htmlFor="director" className="block text-gray-700 text-sm font-medium mb-1">{t('servicesPages.postAccreditationMonitoring.form.director')}</label>
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
          <label htmlFor="approvalDate" className="block text-gray-700 text-sm font-medium mb-1">{t('servicesPages.postAccreditationMonitoring.form.approvalDate')}</label>
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
            {t('servicesPages.postAccreditationMonitoring.form.responsiblePerson')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input 
              type="text" 
              name="responsiblePerson"
              placeholder={t('servicesPages.postAccreditationMonitoring.form.fullName')}
              value={formData.responsiblePerson}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <input 
              type="tel" 
              name="phone"
              placeholder={t('form.phone', 'Телефон')}
              value={formData.phone}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
        </div>
        
        {/* Прикрепить документы */}
        <div className="mb-3">
          <p className="block text-sm font-medium text-gray-800 mb-1">{t('servicesPages.postAccreditationMonitoring.form.attachDocuments')}</p>
          <p className="text-xs text-gray-600 mb-2">{t('servicesPages.postAccreditationMonitoring.form.attachDocumentsHint')}</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
          />
          
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={handleAttachClick}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {t('servicesPages.postAccreditationMonitoring.form.uploadFile')}
            </button>
            
            <button
              type="button"
              onClick={handleGoogleDriveClick}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.71 3.5L1.15 15L4.58 21L11.13 9.5M9.73 15L6.3 21H17.87L21.3 15M22.85 15L15.42 3.5H7.71L15.13 15" />
              </svg>
              {t('servicesPages.postAccreditationMonitoring.form.googleDrive')}
            </button>
          </div>
          
          {/* Список прикрепленных файлов */}
          {attachedFiles.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-md p-2 bg-gray-50">
              <ul className="text-xs">
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
        
        <div className="flex items-center mb-3">
          <input 
            type="checkbox" 
            id="consent" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="consent" className="ml-2 block text-xs text-gray-700">
            {t('servicesPages.postAccreditationMonitoring.form.consent')}
          </label>
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md text-sm transition duration-300 w-auto"
          >
            {t('servicesPages.postAccreditationMonitoring.form.submitReport')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function PostAccreditationMonitoring() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const openVideoModal = (videoUrl, fileName) => {
    setSelectedVideo(videoUrl);
    setSelectedFileName(fileName);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedFileName('');
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

  return (
    <>
              <Head title={t('services.post_accreditation_monitoring', 'Постаккредитационный мониторинг')} meta={[{ name: 'description', content: 'Постаккредитационный мониторинг медицинских организаций.' }]} />
      
      <section className="text-gray-600 body-font">
        <div className="container mx-auto py-8 md:py-16 px-4 md:px-5">
          <div className="flex flex-wrap -mx-2 md:-mx-4">
            
            {/* Левая колонка - описание услуги */}
            <div className="w-full lg:w-1/2 px-2 md:px-4 mb-8 md:mb-10 lg:mb-0">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">{t('servicesPages.postAccreditationMonitoring.aboutTitle')}</h2>
              <div className="leading-relaxed text-sm md:text-base space-y-3">
                <p>
                  {t('servicesPages.postAccreditationMonitoring.description1')}
                </p>
                <p>
                  {t('servicesPages.postAccreditationMonitoring.description2')}
                </p>
                <p>
                  {t('servicesPages.postAccreditationMonitoring.description3')}
                </p>
              </div>
              <br />
              {/* Заголовок и кнопка скачать шаблон */}
              <div className="bg-blue-700 text-white text-center py-3 px-4 rounded-lg mb-4">
                <h2 className="text-lg md:text-xl font-medium">{t('servicesPages.postAccreditationMonitoring.reportTitle')}</h2>
              </div>
              
              <button 
                onClick={handleDownloadTemplate}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm md:text-base transition duration-300 w-full mb-5"
              >
                {t('servicesPages.postAccreditationMonitoring.downloadTemplate')}
              </button>
            </div>
            
            {/* Правая колонка - информация */}
            <div className="w-full lg:w-1/2 px-2 md:px-4">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('servicesPages.postAccreditationMonitoring.importantInfoTitle')}</h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <p>
                    {t('servicesPages.postAccreditationMonitoring.importantInfo1')}
                  </p>
                  <p>
                    {t('servicesPages.postAccreditationMonitoring.importantInfo2')}
                  </p>
                  <p>
                    {t('servicesPages.postAccreditationMonitoring.importantInfo3')}
                  </p>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-md font-medium text-blue-800 mb-2">{t('servicesPages.postAccreditationMonitoring.contactTitle')}</h4>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>{t('servicesPages.postAccreditationMonitoring.department')}</strong>
                  </p>
                  <p className="text-sm text-gray-600">{t('servicesPages.postAccreditationMonitoring.address')}</p>
                  <p className="text-sm text-gray-600">{t('servicesPages.postAccreditationMonitoring.phone')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-16">
        <div className="container px-5 mx-auto">
          <FilesAccord
            folder="Услуги/Постаккредитационный мониторинг" 
            title={t('servicesPages.postAccreditationMonitoring.planTitle')} 
            bgColor="bg-blue-50"
            onVideoClick={openVideoModal}
          />
        </div>
      </section>

      {isModalOpen && (
        <VideoModal
          videoUrl={selectedVideo}
          fileName={selectedFileName}
          onClose={closeVideoModal}
        />
      )}
    </>
  );
}

  PostAccreditationMonitoring.layout = (page) => {
    const tLocal = (key, fallback = '') => translationService.t(key, fallback);
    return <ServicesPageLayout
      title={tLocal('servicesPages.postAccreditationMonitoring.layoutTitle')}
      img="service-accreditation"
      bgColor="bg-blue-300"
      hideForm={true}
    >{page}</ServicesPageLayout>;
  };
