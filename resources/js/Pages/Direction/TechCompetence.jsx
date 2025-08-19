import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import VideoModal from '@/Components/VideoModal';
import FilesAccord from '@/Components/FilesAccord';

export default function TechCompetence() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectName: '',
    message: ''
  });
  const [fileName, setFileName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    
    // Создаем FormData для отправки файла
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('projectName', formData.projectName);
    formDataToSend.append('message', formData.message);
    
    // Добавляем файл, если он есть
    if (fileInputRef.current?.files[0]) {
      formDataToSend.append('file', fileInputRef.current.files[0]);
    }

    console.log('FormData created:', {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      projectName: formData.projectName,
      message: formData.message,
      hasFile: !!fileInputRef.current?.files[0]
    });

    try {
      console.log('Sending POST request to /api/contact/tech-competence');
      
      // Попробуем сначала fetch
      let response;
      try {
        response = await fetch('/api/contact/tech-competence', {
          method: 'POST',
          body: formDataToSend,
        });
      } catch (fetchError) {
        console.log('Fetch failed, trying XMLHttpRequest:', fetchError);
        
        // Альтернативный способ через XMLHttpRequest
        response = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/contact/tech-competence', true);
          
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                ok: true,
                status: xhr.status,
                statusText: xhr.statusText,
                json: () => JSON.parse(xhr.responseText)
              });
            } else {
              reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
          };
          
          xhr.onerror = function() {
            reject(new Error('Network error'));
          };
          
          xhr.send(formDataToSend);
        });
      }

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        // Показываем сообщение об успехе
        setFormSubmitted(true);
        
        // Сбрасываем форму
        setFormData({
          name: '',
          phone: '',
          email: '',
          projectName: '',
          message: ''
        });
        setFileName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      } else {
        // Показываем ошибку
        alert(result.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
    }
  };

  return (
    <>
      <Head title="Отраслевой центр технологических компетенций" meta={[{ name: 'description', content: 'Отраслевой центр технологических компетенций в сфере здравоохранения: инновации, разработки и технологические решения.' }]} />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Отраслевой центр технологических компетенций</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                Отраслевой центр технологических компетенций (ОЦТК) в здравоохранении создан на основании приказа Министра здравоохранения Республики Казахстан №667 от 18.10.2021 года на базе Национального научного центра развития здравоохранения имени Салидат Каирбековой.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                ОЦТК является ключевым элементом в развитии и внедрении инновационных технологий в систему здравоохранения.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Основные задачи деятельности ОЦТК</h3>
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <ul className="list-none space-y-2">
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Foresight прогнозирование в сфере науки и технологий, новых профессий и компетенций для системы здравоохранения</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Участие в формировании технологических политик (стратегий)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-grey-600 mr-2 mt-1">•</span>
                    <span>Содействие организациям здравоохранения во внедрении технологий мирового уровня и разработок казахстанских исследователей, в соответствии со спецификой организации</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Основные направления деятельности</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Аналитическая работа</h4>
                  <p className="text-gray-700">Анализ мировых трендов и прогнозирование развития технологий в здравоохранении</p>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Развитие компетенций</h4>
                  <p className="text-gray-700">Формирование и развитие технологических компетенций у специалистов здравоохранения</p>
                </div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Внедрение технологий</h4>
                <p className="text-gray-700">Содействие организациям здравоохранения во внедрении современных технологий и инновационных разработок</p>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Координация и сотрудничество</h4>
                <p className="text-gray-700">Координация взаимодействия между организациями здравоохранения, научными центрами и исследовательскими институтами</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              ОЦТК ориентирован на содействие технологическому развитию и укреплению компетенций, способствуя прогрессу и инновациям в системе здравоохранения Республики Казахстан.
            </p>
          </div>
        </div>
      </section>
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 mx-auto">
          <FilesAccord 
            folder="Медицинская наука\Папка - Отраслевой центр технологических компетенций\Набор-НПА" 
            title="Нормативная документация" 
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
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Отраслевой центр технологических компетенций</h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-xl">

Мы рассматриваем предложения от стартапов, врачей и научных коллективов и предоставляем поддержку по вопросам оценки технологии, правовой проработки, путей коммерциализации и интеграции в систему здравоохранения.
Наша задача — сопровождать перспективные решения на ранних этапах развития и содействовать их продвижению в рамках действующих нормативных и стратегических документов МЗ РК.
                </p>

                
                {formSubmitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md my-4">
                    Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}
              </div>
              
              {/* Форма справа (1/3) */}
              <div className="w-full md:w-2/5 md:pl-8 bg-white bg-opacity-50 p-6 rounded-lg">
                <form onSubmit={handleSubmit} className="w-full">
                  {/* Name field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">Как к вам обращаться <span className="text-red-500">*</span></div>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Phone field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">Телефон <span className="text-red-500">*</span></div>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Email field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">E-mail <span className="text-red-500">*</span></div>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Project name field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">Название проекта</div>
                    <input 
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Detailed request field */}
                  <div className="mb-8">
                    <div className="text-base text-gray-700 mb-2 font-medium">Расскажите о запросе</div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border-0 border-b-2 border-gray-300 py-2 text-lg focus:outline-none focus:border-blue-500 bg-transparent resize-none"
                    ></textarea>
                  </div>
                  

                  
                  {/* Submit and file upload buttons */}
                  <div className="w-full mb-4">
                    {fileName && (
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-blue-600">{fileName}</span>
                        <span className="text-xs text-gray-500 ml-2">(.pdf, .doc, .docx, .ppt, .pptx)</span>
                      </div>
                    )}
                    <div className="flex justify-end space-x-4">
                      <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 bg-gray-200 text-gray-700 text-sm uppercase tracking-wider hover:bg-gray-300 focus:outline-none flex items-center font-medium rounded-sm">
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        Прикрепить файл
                      </label>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white text-sm uppercase tracking-wider hover:bg-blue-700 focus:outline-none flex items-center font-medium"
                      >
                        подать заявку
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

TechCompetence.layout = (page) => <LayoutDirection img={'techcomtence'} h1={'Отраслевой центр технологических компетенций'} useVideo={true}>{page}</LayoutDirection>;
