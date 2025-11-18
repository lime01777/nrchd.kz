import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import translationService from '@/services/TranslationService';

// Константы для конфигурации
const INITIAL_BATCH = 60;
const LOAD_MORE_STEP = 60;
const MAX_CONCURRENT_REQUESTS = 5; // Максимальное количество параллельных HEAD-запросов
const IS_DEV = process.env.NODE_ENV === 'development';

// Вспомогательная функция для логирования (только в dev режиме)
const devLog = (...args) => {
  if (IS_DEV) {
    console.log(...args);
  }
};

const devError = (...args) => {
  if (IS_DEV) {
    console.error(...args);
  }
};

const devWarn = (...args) => {
  if (IS_DEV) {
    console.warn(...args);
  }
};

function SimpleFileDisplay({ 
  folder = '', 
  title = '', 
  limit = 0, 
  searchTerm = '', 
  medicine = '',
  mkb = '',
  category = '',
  year = '',
  fileType = '',
  type = '', // Добавляем параметр type для фильтрации по типу документа
  bgColor = 'bg-green-100',
  useClinicalProtocols = false,
  onFilesLoaded = null,
  onError = null, // Добавляем проп для обработки ошибок
  singleColumn = false, // Добавляем проп для отображения в одну колонку
  hideDownload = false // Добавляем проп для скрытия кнопки скачивания
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [copiedFileId, setCopiedFileId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [fileInfos, setFileInfos] = useState({});
  
  // Refs для управления cleanup
  const abortControllerRef = useRef(null);
  const timeoutRefsRef = useRef([]);
  const originalOverflowRef = useRef(null);
  
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
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Создаем новый AbortController для этого запроса
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    const fetchFiles = async () => {
      try {
        setLoading(true);
        
        // Проверка на SSR
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        const baseUrl = window.location.origin;
        const params = new URLSearchParams();
        
        // Выбираем API-эндпоинт в зависимости от режима работы
        let apiEndpoint = `${baseUrl}/api/files`;
        
        if (useClinicalProtocols) {
          apiEndpoint = `${baseUrl}/api/clinical-protocols`;
          
          if (folder) {
            const normalizedFolder = folder.replace(/\\/g, '/');
            params.append('folder', normalizedFolder);
          }
          if (searchTerm) params.append('search', searchTerm);
          // Передаем параметры фильтрации для клинических протоколов
          if (medicine) params.append('medicine', medicine);
          if (mkb) params.append('mkb', mkb);
          if (category) params.append('category', category);
          if (year) params.append('year', year);
        } else {
          // Стандартный режим работы с файлами из папки
          if (folder) {
            // Нормализуем путь, заменяя обратные слеши на прямые для корректной работы URL
            const normalizedFolder = folder.replace(/\\/g, '/');
            params.append('folder', normalizedFolder);
          }
          if (title) {
            params.append('title', title);
          }
          
          // Формируем строку поиска с учетом всех параметров фильтрации
          let fullSearchTerm = searchTerm || '';
          
          // Добавляем раздел медицины в строку поиска, если он указан
          if (medicine) {
            fullSearchTerm += ` medicine:${medicine}`;
          }
          
          // Добавляем категорию МКБ в строку поиска, если она указана
          if (mkb) {
            fullSearchTerm += ` mkb:${mkb}`;
          }
          
          // Добавляем категорию протокола в строку поиска, если она указана
          if (category) {
            fullSearchTerm += ` category:${category}`;
          }

          // Добавляем тип документа в строку поиска, если он указан
          if (type) {
            fullSearchTerm += ` type:${type}`;
          }
          
          // Добавляем параметр поиска в URL
          if (fullSearchTerm.trim() !== '') {
            params.append('search', fullSearchTerm.trim());
          }
        }
        
        devLog(`Fetching files from: ${apiEndpoint}${params.toString() ? '?' + params.toString() : ''}`);
        devLog('Search parameters:', { 
          searchTerm, 
          medicine, 
          mkb, 
          category, 
          year, 
          fileType,
          type,
          useClinicalProtocols,
          folder
        });
        
        devLog(`Выполняем запрос к API: ${apiEndpoint}${params.toString() ? '?' + params.toString() : ''}`);
        
        let response;
        try {
          response = await axios.get(`${apiEndpoint}${params.toString() ? '?' + params.toString() : ''}`, {
            signal: abortController.signal
          });
          devLog('API response получен:', response);
          devLog('API response data:', response.data);
          
          if (!response.data) {
            const errorMessage = 'Ответ API не содержит данных';
            devError(errorMessage);
            setError('Ошибка при загрузке файлов: нет данных');
            
            // Передаем ошибку в родительский компонент, если проп предоставлен
            if (onError) {
              onError(errorMessage);
            }
            
            setLoading(false);
            return;
          }
          
          // Проверяем наличие ошибки в ответе API
          if (response.data.error) {
            const errorMessage = `Ошибка API: ${response.data.error}`;
            devError(errorMessage);
            setError(errorMessage);
            
            // Передаем ошибку в родительский компонент, если проп предоставлен
            if (onError) {
              onError(errorMessage);
            }
            
            setLoading(false);
            return;
          }
        } catch (error) {
          // Игнорируем ошибки отмены запроса
          if (error.name === 'AbortError' || error.name === 'CanceledError') {
            return;
          }
          
          // Извлекаем сообщение об ошибке из ответа API, если оно есть
          let errorMessage = 'Ошибка при загрузке файлов';
          
          if (error.response) {
            // Сервер ответил с кодом ошибки
            const responseData = error.response.data;
            if (responseData && responseData.error) {
              errorMessage = responseData.error;
              // Если есть детали, добавляем их к сообщению
              if (responseData.details) {
                devError('Детали ошибки:', responseData.details);
                // Можно добавить детали в сообщение, если нужно
                if (responseData.details.full_path) {
                  errorMessage += ` (Путь: ${responseData.details.full_path})`;
                }
              }
            } else {
              errorMessage = `Ошибка сервера: ${error.response.status} ${error.response.statusText}`;
            }
          } else if (error.request) {
            // Запрос был отправлен, но ответа не получено
            errorMessage = 'Не удалось получить ответ от сервера. Проверьте подключение к интернету.';
          } else {
            // Ошибка при настройке запроса
            errorMessage = `Ошибка при выполнении запроса: ${error.message}`;
          }
          
          devError('Ошибка при запросе к API:', error);
          devError('API Endpoint:', apiEndpoint);
          devError('Search Parameters:', { searchTerm, medicine, mkb, category, year, fileType, type });
          devError('Full error response:', error.response?.data);
          
          setError(errorMessage);
          
          // Передаем ошибку в родительский компонент, если проп предоставлен
          if (onError) {
            onError(errorMessage);
          }
          
          setLoading(false);
          return;
        }
        
        // Обработка данных от API
        let filesData = [];
        
        if (useClinicalProtocols) {
          // Обработка данных из API клинических протоколов
          devLog('Обрабатываем данные клинических протоколов:', response.data);
          
          if (response.data && response.data.documents) {
            devLog('Найдены документы в response.data.documents:', response.data.documents);
            filesData = response.data.documents;
          } else if (response.data && response.data.protocols) {
            // Если данные в формате clinical_protocols.json
            devLog('Найдены протоколы в response.data.protocols:', response.data.protocols);
            filesData = response.data.protocols;
          } else {
            const errorMessage = 'Не найдены ни documents, ни protocols в ответе API. Response data: ' + JSON.stringify(response.data);
            devError(errorMessage);
            devError('Full response:', response);
            
            // Передаем ошибку в родительский компонент, если проп предоставлен
            if (onError) {
              onError(errorMessage);
            }
            
            setLoading(false);
            return;
          }
        } else if (response.data && Array.isArray(response.data)) {
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
        
        devLog('Processed files data:', filesData);
        
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
        setVisibleCount(Math.min(INITIAL_BATCH, limitedFiles.length || INITIAL_BATCH));
        
        // Получаем информацию о размере и дате для каждого файла
        // Оптимизация: батчинг HEAD-запросов для обычных файлов
        const fileInfoPromises = limitedFiles.map((file, index) => {
          if (file.url && file.url !== "#") {
            // Для клинических протоколов не делаем HEAD-запрос, используем данные из JSON
            if (useClinicalProtocols) {
              return Promise.resolve({
                id: file.id || file.url,
                size: file.size ? formatFileSize(file.size) : (file.filesize || '—'),
                date: formatDate(file.modified || file.date || file.created_at || '')
              });
            }
            
            // Для обычных файлов делаем HEAD-запрос с задержкой для батчинга
            // Запросы выполняются батчами по MAX_CONCURRENT_REQUESTS
            const batchDelay = Math.floor(index / MAX_CONCURRENT_REQUESTS) * 100;
            
            return new Promise((resolve) => {
              setTimeout(() => {
                axios.head(file.url, { signal: abortController.signal })
                  .then(response => {
                    const contentLength = response.headers['content-length'];
                    const lastModified = response.headers['last-modified'];
                    
                    resolve({
                      id: file.id || file.url,
                      size: contentLength ? formatFileSize(contentLength) : '0 Bytes',
                      date: lastModified ? formatDate(new Date(lastModified)) : formatDate(file.date || file.created_at || '')
                    });
                  })
                  .catch(error => {
                    // Игнорируем ошибки отмены
                    if (error.name === 'AbortError' || error.name === 'CanceledError') {
                      resolve(null);
                      return;
                    }
                    devError('Error fetching file info:', error);
                    resolve({
                      id: file.id || file.url,
                      size: formatFileSize(file.size || 0),
                      date: formatDate(file.date || file.created_at || '')
                    });
                  });
              }, batchDelay);
            });
          }
          
          return Promise.resolve({
            id: file.id || file.url,
            size: formatFileSize(file.size || 0),
            date: formatDate(file.date || file.created_at || '')
          });
        });
        
        // Используем Promise.allSettled для устойчивости к ошибкам
        Promise.allSettled(fileInfoPromises).then(results => {
          const infos = results
            .map((result, index) => {
              if (result.status === 'fulfilled' && result.value) {
                return result.value;
              }
              // Fallback для неудачных запросов
              const file = limitedFiles[index];
              return {
                id: file.id || file.url,
                size: formatFileSize(file.size || 0),
                date: formatDate(file.date || file.created_at || '')
              };
            })
            .filter(Boolean);
          const fileInfoMap = {};
          infos.forEach((info, index) => {
            fileInfoMap[limitedFiles[index].id || limitedFiles[index].url] = info;
          });
          setFileInfos(fileInfoMap);
          
          // Вызываем обработчик onFilesLoaded, если он предоставлен
          if (onFilesLoaded && Array.isArray(filesData)) {
            try {
              onFilesLoaded(filesData.length);
            } catch (error) {
              devError('Ошибка при вызове onFilesLoaded:', error);
              
              // Передаем ошибку в родительский компонент, если проп предоставлен
              if (onError) {
                onError(`Ошибка при обработке данных: ${error.message}`);
              }
            }
          }
          setLoading(false);
        }).catch(error => {
          // Игнорируем ошибки отмены
          if (error.name === 'AbortError' || error.name === 'CanceledError') {
            return;
          }
          devError('Ошибка при загрузке файлов:', error);
          setError('Ошибка при загрузке файлов. Пожалуйста, попробуйте позже.');
          setLoading(false);
        });
      } catch (err) {
        // Игнорируем ошибки отмены
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        devError('Error fetching files:', err);
        setError('Ошибка при загрузке файлов');
        setLoading(false);
      }
    };

    fetchFiles();
    
    // Cleanup функция
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [folder, title, limit, searchTerm, medicine, mkb, category, year, fileType, type, useClinicalProtocols, onFilesLoaded, onError]);

  // Определение иконки по типу файла
  const getFileTypeIcon = (file) => {
    const extension = getFileExtension(file);
    
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
  const getFileTypeShort = (file) => {
    const extension = getFileExtension(file);
    if (!extension) return '';
    
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
  const getFileType = (file) => {
    if (!file) return null;
    
    const extension = getFileExtension(file);
    if (!extension) return null;
    
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
  
  const extractFileName = (file) => {
    if (file?.name && typeof file.name === 'string' && file.name.includes('.')) {
      return file.name;
    }

    if (file?.url && typeof file.url === 'string') {
      try {
        const cleanUrl = file.url.split('?')[0];
        const segments = cleanUrl.split('/');
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.includes('.')) {
          return lastSegment;
        }
      } catch (error) {
        devWarn('Не удалось извлечь имя файла из URL', error);
      }
    }

    return file?.name || '';
  };

  const getFileExtension = (file) => {
    if (file?.filetype && typeof file.filetype === 'string') {
      return file.filetype.replace('.', '').toLowerCase();
    }

    if (file?.extension && typeof file.extension === 'string') {
      return file.extension.replace('.', '').toLowerCase();
    }

    const fileName = extractFileName(file);
    if (fileName) {
      return fileName.split('.').pop().toLowerCase();
    }

    return '';
  };

  // Получаем абсолютный URL для файла
  const getAbsoluteFileUrl = useCallback((url) => {
    if (!url || url === "#") return "";
    
    // Проверка на SSR
    if (typeof window === 'undefined') {
      return url;
    }
    
    // Если URL уже абсолютный (начинается с http:// или https://), возвращаем его как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Иначе добавляем origin текущего сайта
    const origin = window.location?.origin || '';
    return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }, []);
  
  // Функция для закрытия модального окна
  const closeModal = useCallback(() => {
    setShowModal(false);
    
    // Восстанавливаем исходное значение overflow
    if (typeof document !== 'undefined' && document.body && originalOverflowRef.current !== null) {
      document.body.style.overflow = originalOverflowRef.current;
      originalOverflowRef.current = null;
    }
    
    setActiveFile(null);
    setViewerUrl(null);
    setIsLoading(false);
    setModalError(null);
  }, []);
  
  // Конвертация документов Office с помощью Google Docs Viewer
  const convertOfficeDocument = useCallback((file) => {
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
      devError('Ошибка при конвертации документа:', error);
      setModalError('Не удалось подготовить документ для просмотра');
      setIsLoading(false);
      return null;
    }
  }, [getAbsoluteFileUrl]);

  // Функция для открытия файла
  const handleFileClick = useCallback((file, e) => {
    if (e) e.preventDefault();
    devLog("Opening file:", file);
    
    setActiveFile(file);
    setShowModal(true);
    
    // Сохраняем исходное значение overflow и устанавливаем hidden
    if (typeof document !== 'undefined' && document.body) {
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    
    const fileName = extractFileName(file);
    devLog("File name for determining type:", fileName);
    
    const fileType = getFileType(fileName);
    devLog("Detected file type:", fileType);
    
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
  }, [convertOfficeDocument, closeModal]);
  
  // Cleanup при размонтировании компонента
  useEffect(() => {
    return () => {
      // Восстанавливаем overflow при размонтировании
      if (typeof document !== 'undefined' && document.body && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
      }
      // Очищаем все таймеры
      timeoutRefsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefsRef.current = [];
    };
  }, []);
  
  // Функция для копирования информации о файле
  const copyFileInfo = useCallback((file) => {
    const fileInfo = [
      `${translationService.t('components.simpleFileDisplay.fileName', 'Название')}: ${file.description || file.name || translationService.t('components.simpleFileDisplay.file', 'Файл')}`,
      file.category ? `${translationService.t('components.simpleFileDisplay.category', 'Категория')}: ${file.category}` : '',
      file.medicine ? `${translationService.t('components.simpleFileDisplay.medicineSection', 'Раздел медицины')}: ${file.medicine}` : '',
      file.mkb ? `${translationService.t('components.simpleFileDisplay.mkb', 'МКБ')}: ${file.mkb}` : '',
      file.year ? `${translationService.t('components.simpleFileDisplay.year', 'Год')}: ${file.year}` : '',
      file.filetype ? `${translationService.t('components.simpleFileDisplay.fileType', 'Тип файла')}: ${file.filetype.toUpperCase()}` : '',
      `${translationService.t('components.simpleFileDisplay.link', 'Ссылка')}: ${file.url}`
    ].filter(Boolean).join('\n');
    
    // Проверка на наличие Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fileInfo).then(() => {
        setCopiedFileId(file.id || file.url);
        const timeoutId = setTimeout(() => {
          setCopiedFileId(null);
          // Удаляем timeout из массива после выполнения
          timeoutRefsRef.current = timeoutRefsRef.current.filter(id => id !== timeoutId);
        }, 2000);
        timeoutRefsRef.current.push(timeoutId);
      }).catch((error) => {
        devError('Ошибка при копировании в буфер обмена:', error);
        // Fallback для старых браузеров
        if (document.execCommand) {
          const textArea = document.createElement('textarea');
          textArea.value = fileInfo;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            setCopiedFileId(file.id || file.url);
            const timeoutId = setTimeout(() => {
              setCopiedFileId(null);
              timeoutRefsRef.current = timeoutRefsRef.current.filter(id => id !== timeoutId);
            }, 2000);
            timeoutRefsRef.current.push(timeoutId);
          } catch (err) {
            devError('Ошибка при использовании fallback копирования:', err);
          }
          document.body.removeChild(textArea);
        }
      });
    } else {
      devWarn('Clipboard API не доступен');
    }
  }, []);

  const normalize = (value) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';

  // Фильтрация файлов на клиентской стороне
  const filteredFiles = useMemo(() => {
    // Если нет параметров фильтрации, возвращаем все файлы
    if ((!searchTerm || searchTerm.trim() === '') && 
        !medicine && !mkb && !category && !year && !fileType) {
      return files;
    }
    
    return files.filter(file => {
      const medicineList = Array.isArray(file.medicine_categories) && file.medicine_categories.length
        ? file.medicine_categories
        : (file.medicine ? [file.medicine] : []);

      const mkbList = Array.isArray(file.mkb_codes) && file.mkb_codes.length
        ? file.mkb_codes
        : (file.mkb ? [file.mkb] : []);

      // Фильтрация по поисковому запросу
      if (searchTerm && searchTerm.trim() !== '') {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const fileName = (file.name || '').toLowerCase();
        const fileDescription = (file.description || '').toLowerCase();
        
        if (!fileName.includes(normalizedSearchTerm) && 
            !fileDescription.includes(normalizedSearchTerm)) {
          return false;
        }
      }
      
      // Фильтрация по разделу медицины
      if (medicine) {
        const normalizedMedicine = normalize(medicine);
        const hasMedicine = medicineList.some(
          (item) => normalize(item) === normalizedMedicine
        );
        if (!hasMedicine) {
          return false;
        }
      }
      
      // Фильтрация по категории МКБ
      if (mkb) {
        const normalizedMkb = normalize(mkb);
        const hasMkb = mkbList.some(
          (item) => normalize(item) === normalizedMkb
        );
        if (!hasMkb) {
          return false;
        }
      }
      
      // Фильтрация по категории протокола
      if (category && file.category !== category) {
        return false;
      }
      
      // Фильтрация по году
      if (year && file.year !== parseInt(year)) {
        return false;
      }
      
      // Фильтрация по типу файла
      if (fileType && file.filetype !== fileType.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  }, [files, searchTerm, medicine, mkb, category, year, fileType, type]);

  const filteredLength = filteredFiles.length;

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, filteredLength || INITIAL_BATCH));
  }, [filteredLength]);

  const visibleFiles = useMemo(() => filteredFiles.slice(0, visibleCount), [filteredFiles, visibleCount]);
  const hasMore = visibleCount < filteredFiles.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_STEP, filteredFiles.length));
  }, [filteredFiles.length]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2">{translationService.t('components.simpleFileDisplay.loading', 'Загрузка файлов...')}</p>
      </div>
    );
  }

  const activeFileType = activeFile ? getFileType(activeFile) : null;

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
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      
      {filteredFiles.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
          {translationService.t('components.simpleFileDisplay.noDocuments', 'Нет доступных документов')}
        </div>
      ) : (
        <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
          {visibleFiles.map((file, index) => {
            // Подготовка полей файла, учитывая разные форматы данных
            const fileName = extractFileName(file);
            const fileDescription = file.description || file.name || 'Файл';
            const fileId = file.id || file.url;
            const fallbackSize = file.filesize
              ? (typeof file.filesize === 'string' ? file.filesize : formatFileSize(file.filesize))
              : (file.size ? formatFileSize(file.size) : '—');
            const fallbackDate = formatDate(file.modified || file.date || file.created_at || '');
            const fileInfo = fileInfos[fileId] || { size: fallbackSize, date: fallbackDate };
            const fileType = getFileTypeShort(file);
            const iconType = getFileTypeIcon(file);
            
            return (
              <div className="w-full" key={index}>
                <div className="flex flex-col h-[250px] bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <div className="flex-grow overflow-hidden">
                    <h2 className="font-medium leading-normal text-gray-800 line-clamp-4 mb-3">{fileDescription}</h2>
                    
                    {/* Метки для файлов */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(
                        Array.isArray(file.medicine_categories) && file.medicine_categories.length
                          ? file.medicine_categories
                          : (file.medicine ? [file.medicine] : [])
                      ).map((item, idx) => (
                        <span key={`med-${idx}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Раздел: {item}
                        </span>
                      ))}
                      {(
                        Array.isArray(file.mkb_codes) && file.mkb_codes.length
                          ? file.mkb_codes
                          : (file.mkb ? [file.mkb] : [])
                      ).map((item, idx) => (
                        <span key={`mkb-${idx}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          МКБ: {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex mt-auto justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleFileClick(file, e)}
                        className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                        <span>{translationService.t('components.simpleFileDisplay.open', 'Открыть')}</span>
                      </button>
                      {!hideDownload && (
                        <a
                          href={file.url}
                          download
                          className="cursor-pointer text-black inline-flex items-center border-gray-300 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200">
                          <span>{translationService.t('components.simpleFileDisplay.download', 'Скачать')}</span>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col text-xs text-gray-600 text-right leading-tight">
                      <div className="flex items-center justify-end gap-1">
                        <img src={`/img/FileType/${iconType}.png`} alt="" className="w-4 h-4" />
                        <span className="uppercase">{fileType}</span>
                      </div>
                      <span>{fileInfo.size}</span>
                      {fileInfo.date && <span className="text-gray-400">{fileInfo.date}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 text-center">
        {translationService.t('components.simpleFileDisplay.showing', 'Показано')} {visibleFiles.length} {translationService.t('components.simpleFileDisplay.of', 'из')} {filteredFiles.length}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            {translationService.t('components.simpleFileDisplay.showMore', 'Показать ещё')}
          </button>
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
                  <p className="text-gray-600">{translationService.t('components.simpleFileDisplay.preparingDocument', 'Подготовка документа к просмотру...')}</p>
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
                    {translationService.t('components.simpleFileDisplay.downloadFile', 'Скачать файл')}
                  </a>
                </div>
              ) : activeFileType === 'image' ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <img 
                    src={activeFile.url} 
                    alt={activeFile.description || activeFile.name} 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : activeFileType === 'pdf' ? (
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
              ) : activeFileType === 'video' ? (
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
              ) : ['word', 'excel', 'powerpoint'].includes(activeFileType) && viewerUrl ? (
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
              ) : ['word', 'excel', 'powerpoint'].includes(activeFileType) ? (
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
                    {translationService.t('components.simpleFileDisplay.downloadFile', 'Скачать файл')}
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
                    {translationService.t('components.simpleFileDisplay.downloadFile', 'Скачать файл')}
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
                {translationService.t('components.simpleFileDisplay.openInNewTab', 'Открыть в новой вкладке')}
              </a>
              <button 
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {translationService.t('components.simpleFileDisplay.close', 'Закрыть')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleFileDisplay;
