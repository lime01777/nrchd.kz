import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import VideoModal from '@/Components/VideoModal';
import FilesAccord from '@/Components/FilesAccord';
import MedTechPlatform from '@/Components/MedTech/MedTechPlatform';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function TechCompetence() {
    const { flash, medTechData = {} } = usePage().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State для формы с использованием useForm от Inertia
  const { data, setData, post, processing, errors, reset } = useForm({
    category: 'tech_competence',
    name: '',
    phone: '',
    email: '',
    project_name: '',
    message: '',
    attachment: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    post(route('contact.submit'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 5000);
      },
    });
  };

  return (
    <>
              <Head title={t('directionsPages.techCompetence.title', 'Отраслевой центр технологических компетенций')} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('directionsPages.techCompetence.mainTitle')}</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('directionsPages.techCompetence.intro1')}
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('directionsPages.techCompetence.intro2')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('directionsPages.techCompetence.tasksTitle')}</h3>
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <ul className="list-none space-y-2">
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>{t('directionsPages.techCompetence.task1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>{t('directionsPages.techCompetence.task2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>{t('directionsPages.techCompetence.task3')}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('directionsPages.techCompetence.directionsTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('directionsPages.techCompetence.direction1Title')}</h4>
                  <p className="text-gray-700">{t('directionsPages.techCompetence.direction1Description')}</p>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('directionsPages.techCompetence.direction2Title')}</h4>
                  <p className="text-gray-700">{t('directionsPages.techCompetence.direction2Description')}</p>
                </div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">{t('directionsPages.techCompetence.direction3Title')}</h4>
                <p className="text-gray-700">{t('directionsPages.techCompetence.direction3Description')}</p>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{t('directionsPages.techCompetence.direction4Title')}</h4>
                <p className="text-gray-700">{t('directionsPages.techCompetence.direction4Description')}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {t('directionsPages.techCompetence.conclusion')}
            </p>
          </div>

          {/* Технологическая платформа MedTech */}
          <MedTechPlatform
            documents={medTechData.documents || []}
            registry={medTechData.registry || []}
            pilotSites={medTechData.pilot_sites || []}
            content={medTechData.content || {}}
            algorithmImage={medTechData.algorithm_image || null}
          />
        </div>
      </section>
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <FilesAccord 
            folder={t('directionsPages.techCompetence.regulatoryDocsFolder')} 
            title={t('directionsPages.techCompetence.regulatoryDocsTitle')} 
            bgColor="bg-blue-100"
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
      
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 h-full w-full py-12">
          <div className="container mx-auto px-5">
            <div className="flex flex-col md:flex-row items-center">
              {/* Заголовок и описание слева (2/3) */}
              <div className="w-full md:w-3/5 md:pr-16 mb-10 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{t('directionsPages.techCompetence.formSectionTitle')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-xl" style={{ whiteSpace: 'pre-line' }}>
                  {t('directionsPages.techCompetence.formDescription')}
                </p>

                
                {formSubmitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md my-4">
                    {t('directionsPages.techCompetence.formSuccessMessage')}
                  </div>
                )}

                {flash?.error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4">
                    {flash.error}
                  </div>
                )}
              </div>
              
              {/* Форма справа (1/3) */}
              <div className="w-full md:w-2/5 md:pl-8 bg-white bg-opacity-50 p-6 rounded-lg">
                <form onSubmit={handleSubmit} className="w-full">
                  {/* Name field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formNameLabel')} <span className="text-red-500">*</span></div>
                    <input 
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      required
                      className={`w-full border-0 border-b-2 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  {/* Phone field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formPhoneLabel')} <span className="text-red-500">*</span></div>
                    <input 
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      required
                      className={`w-full border-0 border-b-2 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  {/* Email field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formEmailLabel')} <span className="text-red-500">*</span></div>
                    <input 
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      required
                      className={`w-full border-0 border-b-2 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  {/* Project name field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formProjectNameLabel')}</div>
                    <input 
                      type="text"
                      name="project_name"
                      value={data.project_name}
                      onChange={(e) => setData('project_name', e.target.value)}
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Message field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formMessageLabel')} <span className="text-red-500">*</span></div>
                    <textarea 
                      name="message"
                      rows="4"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      required
                      className={`w-full border-2 border-gray-300 rounded-md px-3 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent resize-none ${errors.message ? 'border-red-500' : ''}`}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  
                  {/* File upload field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">{t('directionsPages.techCompetence.formAttachmentLabel')}</div>
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setData('attachment', e.target.files[0])}
                      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.attachment && <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>}
                  </div>
                  
                  {/* Submit button */}
                  <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? t('directionsPages.techCompetence.formSubmitting') : t('directionsPages.techCompetence.formSubmitButton')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

TechCompetence.layout = (page) => <LayoutDirection img="science" h1={t('direction_tech_competence', 'Отраслевой центр технологических компетенций')}>{page}</LayoutDirection>;
