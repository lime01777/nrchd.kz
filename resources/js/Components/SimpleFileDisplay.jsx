import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SimpleFileDisplay({ folder, title, bgColor = 'bg-white', onVideoClick, limit, singleColumn = false, hideDownload = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [fileInfos, setFileInfos] = useState({});
  
  // Форматирование даты
  const formatDate = (date) => {
    if (!date || date === 'NaN.NaN.NaN') return '';
    
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date; // Если не удалось преобразовать, возвращаем как есть
      
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (e) {
      return date; // В случае ошибки возвращаем исходную строку
    }
  };
  
  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (typeof bytes === 'string') {
      if (bytes.includes('KB') || bytes.includes('MB') || bytes.includes('GB')) {
        return bytes; // Уже отформатирован
      }
      // Пытаемся преобразовать строку в число
      bytes = parseInt(bytes, 10);
      if (isNaN(bytes)) return '0 Bytes';
    }
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Получение файлов из API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const baseUrl = window.location.origin;
        const params = new URLSearchParams();
        if (folder) {
          // Нормализуем путь, заменяя обратные слеши на прямые для корректной работы URL
          const normalizedFolder = folder.replace(/\\/g, '/');
          params.append('folder', normalizedFolder);
        }
        if (title) {
          params.append('title', title);
        }
        
        console.log('Fetching files from:', `${baseUrl}/api/files?${params.toString()}`);
        
        const response = await axios.get(`${baseUrl}/api/files?${params.toString()}`);
        console.log('API response:', response.data);
        
        // Обработка данных от API
        let filesData = [];
        
        if (response.data && Array.isArray(response.data)) {
          // Получаем файлы из секций, если данные в формате FilesAccord
          response.data.forEach(section => {
            if (section.files) {
              filesData = [...filesData, ...section.files];
            }
            if (section.documents) {
              filesData = [...filesData, ...section.documents];
            }
          });
        } else if (response.data && response.data.files) {
          // Если данные в прямом формате файлов
          filesData = response.data.files;
        }
        
        console.log('Processed files data:', filesData);
        
        // Обрабатываем данные файлов, убеждаемся, что у каждого файла есть имя
        const processedFiles = filesData.map(file => {
          // Если у файла нет имени, пытаемся извлечь его из URL
          if (!file.name && file.url) {
            const urlParts = file.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            return { ...file, name: fileName };
          }
          return file;
        });
        
        // Если есть лимит, ограничиваем количество файлов
        const limitedFiles = limit ? processedFiles.slice(0, limit) : processedFiles;
        
        setFiles(limitedFiles);
        
        // Получаем информацию о размере и дате для каждого файла
        const fileInfoPromises = limitedFiles.map(file => {
          if (file.url && file.url !== "#") {
            return axios.head(file.url)
              .then(response => {
                const contentLength = response.headers['content-length'];
                const lastModified = response.headers['last-modified'];
                
                return {
                  id: file.id || file.url,
                  size: contentLength ? formatFileSize(contentLength) : '0 Bytes',
                  date: lastModified ? formatDate(new Date(lastModified)) : formatDate(file.date || file.created_at || '')
                };
              })
              .catch(error => {
                console.error('Error fetching file info:', error);
                return {
                  id: file.id || file.url,
                  size: formatFileSize(file.size || 0),
                  date: formatDate(file.date || file.created_at || '')
                };
              });
          }
          
          return Promise.resolve({
            id: file.id || file.url,
            size: formatFileSize(file.size || 0),
            date: formatDate(file.date || file.created_at || '')
          });
        });
        
        Promise.all(fileInfoPromises).then(infos => {
          const fileInfoMap = {};
          infos.forEach((info, index) => {
            fileInfoMap[limitedFiles[index].id || limitedFiles[index].url] = info;
          });
          setFileInfos(fileInfoMap);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Ошибка при загрузке файлов');
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folder, title, limit]);

  // Определение иконки по типу файла
  const getFileTypeIcon = (fileName) => {
    console.log("Getting icon for file:", fileName);
    
    if (!fileName) return "1"; // По умолчанию doc формат (1.png)
    
    // Убеждаемся, что fileName строка
    if (typeof fileName !== 'string') {
      return "1";
    }
    
    // Извлекаем расширение файла
    const extension = fileName.split('.').pop().toLowerCase();
    console.log("File extension:", extension);
    
    switch (extension) {
      case 'pdf':
        return "2"; // pdf формат (2.png)
      case 'xls':
      case 'xlsx':
        return "3"; // xlsx формат (3.png)
      case 'txt':
        return "4"; // txt формат (4.png)
      case 'ppt':
      case 'pptx':
        return "5"; // pptx формат (5.png)
      case 'doc':
      case 'docx':
        return "1"; // doc формат (1.png)
      case 'mp4':
      case 'avi':
      case 'mov':
        return "6"; // видео формат
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return "7"; // изображение
      default:
        return "1"; // По умолчанию doc формат
    }
  };
  
  // Получение короткого названия типа файла
  const getFileTypeShort = (fileName) => {
    if (!fileName) return '';
    
    // Убеждаемся, что fileName строка
    if (typeof fileName !== 'string') {
      return '';
    }
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'DOCX';
      case 'xls':
      case 'xlsx':
        return 'XLSX';
      case 'ppt':
      case 'pptx':
        return 'PPTX';
      case 'txt':
        return 'TXT';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'MP4';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'JPG';
      default:
        return extension.toUpperCase();
    }
  };
  
  // Определяем тип файла для отображения в модальном окне
  const getFileType = (fileName) => {
    if (!fileName) return null;
    
    // Убеждаемся, что fileName строка
    if (typeof fileName !== 'string') {
      return null;
    }
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'excel';
    } else if (['ppt', 'pptx'].includes(extension)) {
      return 'powerpoint';
    } else if (['txt'].includes(extension)) {
      return 'text';
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
      return 'video';
    }
    
    return null;
  };
  
  // Получаем абсолютный URL для файла
  const getAbsoluteFileUrl = (url) => {
    if (!url || url === "#") return "";
    
    // Если URL уже абсолютный (начинается с http:// или https://), возвращаем его как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Иначе добавляем origin текущего сайта
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  // Конвертация документов Office с помощью Google Docs Viewer
  const convertOfficeDocument = (file) => {
    try {
      setIsLoading(true);
      setModalError(null);
      
      const fileUrl = file.url || '';
      const absoluteUrl = getAbsoluteFileUrl(fileUrl);
      const encodedUrl = encodeURIComponent(absoluteUrl);
      
      // Google Docs Viewer для просмотра Office документов
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      
      setViewerUrl(googleViewerUrl);
      setIsLoading(false);
      return googleViewerUrl;
    } catch (error) {
      console.error('Ошибка при конвертации документа:', error);
      setModalError('Не удалось подготовить документ для просмотра');
      setIsLoading(false);
      return null;
    }
  };

  // Функция для открытия файла
  const handleFileClick = (file, e) => {
    if (e) e.preventDefault();
    console.log("Opening file:", file);
    
    setActiveFile(file);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    
    const fileName = file.name || '';
    console.log("File name for determining type:", fileName);
    
    const fileType = getFileType(fileName);
    console.log("Detected file type:", fileType);
    
    // Для разных типов файлов разная обработка
    if (['word', 'excel', 'powerpoint'].includes(fileType)) {
      convertOfficeDocument(file);
    } else if (fileType === 'video' && typeof onVideoClick === 'function') {
      // Для видео используем компонент VideoModal
      // Передаем и URL, и описание/имя файла
      onVideoClick(file.url, file.description || file.name || 'Видео');
      closeModal();
    } else {
      // Для других типов файлов сбрасываем состояние просмотрщика
      setViewerUrl(null);
    }
  };
  
  // Функция для закрытия модального окна
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    setActiveFile(null);
    setViewerUrl(null);
    setIsLoading(false);
    setModalError(null);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2" data-translate>Загрузка файлов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className={`py-6 ${bgColor}`}>
      {title && (
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
      )}
      
      {files.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200" data-translate>
          Нет доступных документов
        </div>
      ) : (
        <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
          {files.map((file, index) => {
            // Подготовка полей файла, учитывая разные форматы данных
            const fileName = file.name || '';
            const fileDescription = file.description || file.name || 'Файл';
            const fileId = file.id || file.url;
            const fileInfo = fileInfos[fileId] || { size: '0 Bytes', date: '' };
            const fileType = getFileTypeShort(fileName);
            const iconType = getFileTypeIcon(fileName);
            
            console.log("Rendering file:", fileName, "Icon type:", iconType);
            
            return (
              <div className="w-full" key={index}>
                <div className="flex flex-col h-[200px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <div className="flex-grow overflow-hidden">
                    <h2 className="font-medium leading-normal text-gray-800 line-clamp-6 mb-3">{fileDescription}</h2>
                  </div>
                  <div className="flex mt-auto justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleFileClick(file, e)}
                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                        <span data-translate>Открыть</span>
                      </button>
                      {!hideDownload && (
                        <a
                          href={file.url}
                          download
                          className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                          <span data-translate>Скачать</span>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col text-sm">
                      <div className="flex flex-row items-center">
                        <img src={`/img/FileType/${iconType}.png`} alt="" className="w-4 h-4" />
                        <p className="ml-1 uppercase text-xs text-gray-600">{fileType}, {fileInfo.size}</p>
                      </div>
                      <p className="text-gray-400 text-xs text-right">{fileInfo.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Модальное окно для просмотра документов */}
      {showModal && activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {activeFile.description || activeFile.name || 'Файл'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600" data-translate>Подготовка документа к просмотру...</p>
                </div>
              ) : modalError ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">{modalError}</p>
                  <a 
                    href={activeFile.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              ) : getFileType(activeFile.name) === 'image' ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <img 
                    src={activeFile.url} 
                    alt={activeFile.description || activeFile.name} 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : getFileType(activeFile.name) === 'pdf' ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="w-full h-full">
                    <object 
                      data={activeFile.url} 
                      type="application/pdf"
                      className="w-full h-full min-h-[70vh]">
                      <p>Ваш браузер не поддерживает встроенный просмотр PDF. 
                         <a href={activeFile.url} target="_blank" rel="noopener noreferrer">Скачайте PDF</a>.</p>
                    </object>
                  </div>
                </div>
              ) : getFileType(activeFile.name) === 'video' ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="w-full h-full">
                    <video 
                      src={activeFile.url}
                      className="max-w-full max-h-[70vh]" 
                      controls
                      autoPlay
                    ></video>
                  </div>
                </div>
              ) : ['word', 'excel', 'powerpoint'].includes(getFileType(activeFile.name)) && viewerUrl ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="w-full h-full">
                    <iframe 
                      src={viewerUrl}
                      className="w-full h-full min-h-[70vh]" 
                      title={activeFile.description || activeFile.name}
                      frameBorder="0"
                    ></iframe>
                  </div>
                </div>
              ) : ['word', 'excel', 'powerpoint'].includes(getFileType(activeFile.name)) ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-blue-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Предпросмотр для этого типа файла недоступен</p>
                  <a 
                    href={activeFile.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Предпросмотр для этого типа файла недоступен</p>
                  <a 
                    href={activeFile.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Скачать файл
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <a 
                href={activeFile.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 transition-colors duration-200"
              >
                Открыть в новой вкладке
              </a>
              <button 
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleFileDisplay;
