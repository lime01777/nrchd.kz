/**
 * Сервис для взаимодействия с Google Drive через серверный API
 */
class GoogleDriveApiService {
  /**
   * Получение списка файлов из папки Google Drive
   * @param {string} folderId - ID папки в Google Drive
   * @returns {Promise<Array>} - Массив файлов
   */
  async getFiles(folderId) {
    try {
      const response = await fetch(`/api/google-drive/files?folderId=${encodeURIComponent(folderId)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось получить список файлов');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching files from Google Drive API:', error);
      throw error;
    }
  }

  /**
   * Получение метаданных файла
   * @param {string} fileId - ID файла в Google Drive
   * @returns {Promise<Object>} - Метаданные файла
   */
  async getFileMetadata(fileId) {
    try {
      const response = await fetch(`/api/google-drive/file-metadata?fileId=${encodeURIComponent(fileId)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось получить метаданные файла');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching file metadata from Google Drive API:', error);
      throw error;
    }
  }

  /**
   * Получение URL для просмотра файла
   * @param {string} fileId - ID файла в Google Drive
   * @returns {string} - URL для просмотра файла
   */
  getFileViewUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  /**
   * Получение URL для скачивания файла
   * @param {string} fileId - ID файла в Google Drive
   * @returns {string} - URL для скачивания файла
   */
  getFileDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
}

// Экспортируем экземпляр сервиса
export default new GoogleDriveApiService();
