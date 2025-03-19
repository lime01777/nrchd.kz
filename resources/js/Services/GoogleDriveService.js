/**
 * Сервис для работы с Google Drive API
 */
class GoogleDriveService {
  constructor() {
    this.API_KEY = null; // Ключ API будет установлен позже
    this.CLIENT_ID = null; // ID клиента будет установлен позже
    this.SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
    this.isInitialized = false;
    this.isLoading = false;
  }

  /**
   * Инициализация сервиса с ключами API
   * @param {string} apiKey - Google API Key
   * @param {string} clientId - Google Client ID
   */
  init(apiKey, clientId) {
    this.API_KEY = apiKey;
    this.CLIENT_ID = clientId;

    if (!this.isLoading && !this.isInitialized) {
      this.isLoading = true;
      return this.loadGoogleDriveAPI();
    }

    return Promise.resolve();
  }

  /**
   * Загрузка Google Drive API
   */
  loadGoogleDriveAPI() {
    return new Promise((resolve, reject) => {
      // Проверяем, загружен ли уже скрипт Google API
      if (typeof gapi !== 'undefined') {
        this.initClient().then(resolve).catch(reject);
        return;
      }

      // Создаем и добавляем скрипт Google API
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        gapi.load('client:auth2', () => {
          this.initClient().then(resolve).catch(reject);
        });
      };
      script.onerror = (error) => {
        reject(new Error('Failed to load Google API script'));
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Инициализация клиента Google API
   */
  initClient() {
    return gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: this.SCOPES
    }).then(() => {
      this.isInitialized = true;
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      console.error('Error initializing Google Drive API client', error);
      throw error;
    });
  }

  /**
   * Проверка авторизации пользователя
   */
  checkAuth() {
    if (!this.isInitialized) {
      return Promise.reject(new Error('Google Drive API not initialized'));
    }

    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      return Promise.resolve();
    } else {
      return authInstance.signIn();
    }
  }

  /**
   * Получение списка файлов из указанной папки
   * @param {string} folderId - ID папки в Google Drive
   * @param {number} pageSize - Количество файлов для загрузки (по умолчанию 100)
   */
  listFiles(folderId, pageSize = 100) {
    if (!this.isInitialized) {
      return Promise.reject(new Error('Google Drive API not initialized'));
    }

    return this.checkAuth().then(() => {
      return gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: pageSize,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)'
      });
    }).then(response => {
      return response.result.files;
    });
  }

  /**
   * Получение метаданных файла
   * @param {string} fileId - ID файла в Google Drive
   */
  getFileMetadata(fileId) {
    if (!this.isInitialized) {
      return Promise.reject(new Error('Google Drive API not initialized'));
    }

    return this.checkAuth().then(() => {
      return gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, modifiedTime, webViewLink, webContentLink'
      });
    }).then(response => {
      return response.result;
    });
  }

  /**
   * Получение URL для просмотра файла
   * @param {string} fileId - ID файла в Google Drive
   */
  getFileViewUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  /**
   * Получение URL для скачивания файла
   * @param {string} fileId - ID файла в Google Drive
   */
  getFileDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
}

// Экспортируем экземпляр сервиса
export default new GoogleDriveService();
