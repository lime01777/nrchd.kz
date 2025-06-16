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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    console.log('File:', fileInputRef.current?.files[0]);
    
    // Reset form after submission
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
    
    // Show success message
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <>
      <Head title="Отраслевой центр технологических компетенций" />
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
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center"></h2>
          <div className="bg-blue-50 p-8 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row">
              {/* Форма слева (1/3) */}
              <div className="w-full md:w-1/3 md:pr-8 mb-8 md:mb-0">
                {/* Form heading */}
                <div className="mb-6">
                  <h5 className="text-base text-gray-800 font-medium">
                    Заявка
                  </h5>
                </div>
                
                {formSubmitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
                    Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  {/* Name field */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">Как к вам обращаться</div>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Phone field */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">Телефон</div>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Email field */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">E-mail</div>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-0 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Project name field */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">Название проекта</div>
                    <input 
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full border-0 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  
                  {/* Detailed request field */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">Расскажите подробнее о запросе</div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="2"
                      className="w-full border-0 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500 bg-transparent resize-none"
                    ></textarea>
                  </div>
                  
                  {/* File upload field */}
                  <div className="mb-8">
                    <div className="text-xs text-gray-500 font-medium mb-1">Презентация проекта:</div>
                    <div className="flex items-center justify-between border-b border-gray-300 py-1">
                      <span className="text-sm text-gray-400">загрузите файл сюда</span>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      </label>
                    </div>
                    {fileName && <div className="text-sm text-blue-600 mt-1">{fileName}</div>}
                  </div>
                  
                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white text-xs uppercase tracking-wider hover:bg-blue-700 focus:outline-none"
                  >
                    подать заявку
                  </button>
                </form>
              </div>
              
              {/* Текстовая информация справа (2/3) */}
              <div className="w-full md:w-2/3 md:pl-8 border-t md:border-t-0 md:border-l border-gray-300 pt-6 md:pt-0 md:pl-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Отраслевой центр технологических компетенций</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Отраслевой центр технологических компетенций (ОЦТК) ориентирован на содействие технологическому развитию и укреплению компетенций, способствуя прогрессу и инновациям в системе здравоохранения Республики Казахстан.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Направления деятельности:</h4>
                  <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">
                    <li>Foresight прогнозирование в сфере науки и технологий в здравоохранении</li>
                    <li>Формирование технологических политик и стратегий</li>
                    <li>Внедрение инновационных технологий в медицинские организации</li>
                    <li>Развитие технологических компетенций медицинских специалистов</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Как мы можем помочь вам:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Аналитика и оценка</h5>
                      <p className="text-sm text-gray-600">Оценка и анализ технологических решений в сфере здравоохранения</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Обучение и консультации</h5>
                      <p className="text-sm text-gray-600">Повышение технологических компетенций специалистов системы здравоохранения</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Партнерство и сотрудничество</h5>
                      <p className="text-sm text-gray-600">Взаимодействие с государственными и частными организациями здравоохранения</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Поддержка стартапов</h5>
                      <p className="text-sm text-gray-600">Содействие в развитии и внедрении инновационных решений в здравоохранении</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

TechCompetence.layout = (page) => <LayoutDirection img={'techcomtence'} h1={'Отраслевой центр технологических компетенций'} useVideo={true}>{page}</LayoutDirection>;
