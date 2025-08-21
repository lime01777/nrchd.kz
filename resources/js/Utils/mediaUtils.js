/**
 * Утилиты для безопасной работы с медиа-файлами
 * Предотвращают DOMException при работе с невалидными файлами
 */

/**
 * Проверяет, является ли файл валидным изображением
 * @param {File} file - файл для проверки
 * @returns {boolean} - true если файл валиден
 */
export function isValidImageFile(file) {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  // Проверяем размер файла (максимум 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    console.warn('Файл слишком большой:', file.name, file.size);
    return false;
  }
  
  // Проверяем тип файла
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    console.warn('Неподдерживаемый тип файла:', file.name, file.type);
    return false;
  }
  
  return true;
}

/**
 * Проверяет, является ли файл валидным видео
 * @param {File} file - файл для проверки
 * @returns {boolean} - true если файл валиден
 */
export function isValidVideoFile(file) {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  // Проверяем размер файла (максимум 50MB для видео)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    console.warn('Видео файл слишком большой:', file.name, file.size);
    return false;
  }
  
  // Проверяем тип файла
  const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
  if (!validTypes.includes(file.type)) {
    console.warn('Неподдерживаемый тип видео файла:', file.name, file.type);
    return false;
  }
  
  return true;
}

/**
 * Проверяет, является ли URL валидным для изображения
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL валиден
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') {
    return false;
  }
  
  // Проверяем, что это валидный URL или blob URL
  return trimmedUrl.startsWith('http') || 
         trimmedUrl.startsWith('blob:') || 
         trimmedUrl.startsWith('/');
}

/**
 * Проверяет, является ли URL валидным для видео
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL валиден
 */
export function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') {
    return false;
  }
  
  // Проверяем расширение файла
  const extension = trimmedUrl.split('.').pop()?.toLowerCase();
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  
  // Проверяем, что это валидный URL или blob URL с видео расширением
  return (trimmedUrl.startsWith('http') || 
          trimmedUrl.startsWith('blob:') || 
          trimmedUrl.startsWith('/')) &&
         videoExtensions.includes(extension);
}

/**
 * Безопасно создает URL объект для файла
 * @param {File} file - файл для создания URL
 * @returns {string|null} - URL объект или null при ошибке
 */
export function createSafeObjectURL(file) {
  if (!isValidImageFile(file) && !isValidVideoFile(file)) {
    return null;
  }
  
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Ошибка при создании URL объекта для файла:', file.name, error);
    return null;
  }
}

/**
 * Безопасно освобождает URL объект
 * @param {string} url - URL объект для освобождения
 */
export function revokeSafeObjectURL(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('blob:')) {
    return;
  }
  
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.warn('Ошибка при освобождении URL объекта:', error);
  }
}

/**
 * Фильтрует массив изображений, оставляя только валидные
 * @param {Array} images - массив изображений
 * @returns {Array} - отфильтрованный массив
 */
export function filterValidImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }
  
  return images.filter(img => {
    if (img instanceof File) {
      return isValidImageFile(img);
    } else if (typeof img === 'string') {
      return isValidImageUrl(img);
    }
    return false;
  });
}

/**
 * Фильтрует массив медиа-файлов, оставляя только валидные
 * @param {Array} media - массив медиа-файлов
 * @returns {Array} - отфильтрованный массив
 */
export function filterValidMedia(media) {
  if (!Array.isArray(media)) {
    return [];
  }
  
  return media.filter(item => {
    if (item instanceof File) {
      return isValidImageFile(item) || isValidVideoFile(item);
    } else if (typeof item === 'string') {
      return isValidImageUrl(item) || isValidVideoUrl(item);
    }
    return false;
  });
}

/**
 * Очищает массив URL объектов
 * @param {Array} images - массив изображений с URL объектами
 */
export function cleanupObjectURLs(images) {
  if (!Array.isArray(images)) {
    return;
  }
  
  images.forEach(img => {
    if (img && img.url && img.url.startsWith('blob:')) {
      revokeSafeObjectURL(img.url);
    }
  });
}
