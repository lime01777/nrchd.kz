import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderImportantFile = ({ folder, title, description }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching documents from folder:', folder);
        const response = await axios.get(`/api/files?folder=${encodeURIComponent(folder)}`);
        console.log('API response:', response.data);
        if (response.data && Array.isArray(response.data)) {
          const docs = response.data
            .filter(item => !item.isDirectory && item.name) // Проверяем, что имя файла существует
            .map(doc => {
              return {
                ...doc,
                fileType: getFileExtension(doc.name),
                title: formatFileName(doc.name),
                url: `/storage/documents/${folder}/${doc.name}`
              };
            });
          console.log('Processed documents:', docs);
          setDocuments(docs);
        } else {
          console.error('Invalid response format', response.data);
          setError('Неверный формат данных от сервера');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err.message || 'Ошибка при загрузке документов');
        setIsLoading(false);
      }
    };

    if (folder) {
      fetchDocuments();
    } else {
      setIsLoading(false);
      setError('Не указана папка с документами');
    }
  }, [folder]);

  // Получение типа файла из его имени
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Форматирование имени файла (удаление расширения)
  const formatFileName = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    if (parts.length > 1) {
      parts.pop();
      return parts.join('.');
    }
    return filename;
  };

  // Форматирование размера файла - вынесено как общая функция
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    bytes = parseInt(bytes);
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return size.toFixed(1) + ' ' + units[unitIndex];
  };

  // Форматирование даты - вынесено как общая функция
  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      return new Date().toLocaleDateString('ru-RU');
    }
  };

  // Открытие документа
  const openDocument = (document) => {
    setActiveDocument(document);
    setShowModal(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowModal(false);
    setActiveDocument(null);
  };

  // Рендер иконки в зависимости от типа файла
  const renderFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <img src="/icons/pdf.svg" alt="PDF" className="w-6 h-6" />;
      case 'doc':
      case 'docx':
        return <img src="/icons/word.svg" alt="Word" className="w-6 h-6" />;
      case 'xls':
      case 'xlsx':
        return <img src="/icons/excel.svg" alt="Excel" className="w-6 h-6" />;
      case 'ppt':
      case 'pptx':
        return <img src="/icons/powerpoint.svg" alt="PowerPoint" className="w-6 h-6" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <img src="/icons/image.svg" alt="Image" className="w-6 h-6" />;
      default:
        return <img src="/icons/document.svg" alt="Document" className="w-6 h-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded my-4">
        <p>Документы не найдены в указанной папке.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Слайдер документов (левая часть) - 1/3 ширины */}
        <div className="w-full md:w-1/3">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="document-slider"
          >
            {documents.map((doc, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 h-full">
                  <h4 className="text-lg font-medium mb-4 text-gray-800">{doc.title}</h4>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {renderFileIcon(doc.fileType)}
                      <span className="text-sm text-gray-500">{doc.fileType.toUpperCase()}</span>
                    </div>
                    
                    <DocumentInfo url={doc.url} />
                  </div>
                  
                  <button 
                    onClick={() => openDocument(doc)}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Открыть
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Статичный текст (правая часть) - 2/3 ширины */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {/* Модальное окно для просмотра документов */}
      {showModal && activeDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-2 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h3 className="text-lg font-medium">{activeDocument.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="h-[calc(90vh-5rem)] overflow-auto">
              {activeDocument.fileType === 'pdf' ? (
                <iframe 
                  src={`${activeDocument.url}#toolbar=0&navpanes=0`} 
                  className="w-full h-full"
                  title={activeDocument.title}
                ></iframe>
              ) : ['jpg', 'jpeg', 'png', 'gif'].includes(activeDocument.fileType) ? (
                <img 
                  src={activeDocument.url} 
                  alt={activeDocument.title}
                  className="max-w-full max-h-full mx-auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="mb-4 text-gray-600">Этот тип файла не поддерживается для предпросмотра</p>
                  <a 
                    href={activeDocument.url} 
                    download
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Скачать файл
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент для получения и отображения информации о файле
const DocumentInfo = ({ url }) => {
  const [fileInfo, setFileInfo] = useState({
    fileSize: '',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFileInfo = async () => {
      // Если URL не определен, сразу устанавливаем значения по умолчанию
      if (!url) {
        setFileInfo({
          fileSize: '∼ MB',
          date: new Date().toLocaleDateString('ru-RU')
        });
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Очищаем URL от абсолютных путей Windows, если они случайно попали
        let cleanUrl = url;
        if (url.includes('C:/xampp/htdocs/public/') || url.includes('C:\\xampp\\htdocs\\public\\')) {
          const parts = url.split('public/');
          if (parts.length > 1) {
            cleanUrl = '/' + parts[1];
          }
        }
        
        // Кодируем URL для обработки кириллицы и пробелов
        const encodedUrl = encodeURI(cleanUrl);
        console.log('Fetching file info for URL:', encodedUrl);
        
        const response = await axios.head(encodedUrl);
        console.log('HEAD response headers:', response.headers);
        
        const contentLength = response.headers['content-length'];
        const lastModified = response.headers['last-modified'];
        
        let info = {
          fileSize: contentLength ? formatFileSize(contentLength) : '∼ MB',
          date: lastModified ? new Date(lastModified).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU')
        };
        
        setFileInfo(info);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при получении информации о файле:', error);
        setFileInfo({
          fileSize: '∼ MB',
          date: new Date().toLocaleDateString('ru-RU')
        });
        setIsLoading(false);
      }
    };

    getFileInfo();
  }, [url]);

  // Вспомогательная функция для форматирования размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    bytes = parseInt(bytes);
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return size.toFixed(1) + ' ' + units[unitIndex];
  };

  if (isLoading) {
    return <span className="text-sm text-gray-400">Загрузка...</span>;
  }

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{fileInfo.fileSize}</span>
      <span className="text-sm text-gray-500">{fileInfo.date}</span>
    </div>
  );
};

export default SliderImportantFile;
