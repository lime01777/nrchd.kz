import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GoogleDriveDocuments from '@/Components/GoogleDriveDocuments';

export default function GoogleDriveExample({ auth }) {
  // Состояние для хранения API ключей
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfigured(true);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Пример интеграции с Google Drive</h2>}
    >
      <Head title="Google Drive Example" meta={[{ name: 'description', content: 'Пример интеграции Google Drive для документов.' }]} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-bold mb-6">Интеграция с Google Drive</h1>
              
              {!isConfigured ? (
                <div className="mb-8">
                  <p className="mb-4">
                    Для работы с Google Drive API необходимо настроить ключи API. Следуйте инструкциям ниже:
                  </p>
                  <ol className="list-decimal list-inside mb-6">
                    <li className="mb-2">Перейдите в <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                    <li className="mb-2">Создайте новый проект или выберите существующий</li>
                    <li className="mb-2">Перейдите в раздел "API и сервисы" и активируйте Google Drive API</li>
                    <li className="mb-2">Создайте учетные данные (API Key и OAuth 2.0 Client ID)</li>
                    <li className="mb-2">Укажите разрешенные домены для редиректа (включая ваш домен)</li>
                    <li className="mb-2">Скопируйте API Key и Client ID в форму ниже</li>
                  </ol>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
                      <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="AIzaSyA..."
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client ID</label>
                      <input
                        type="text"
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123456789-abcdefg.apps.googleusercontent.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="folderId" className="block text-sm font-medium text-gray-700">ID папки Google Drive</label>
                      <input
                        type="text"
                        id="folderId"
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="1a2b3c4d5e6f7g8h9i"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        ID папки можно найти в URL после "folders/" при открытии папки в Google Drive
                      </p>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Применить настройки
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Настройки подключения</h2>
                    <button
                      onClick={() => setIsConfigured(false)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Изменить настройки
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p><strong>API Key:</strong> {apiKey.substring(0, 6)}...{apiKey.substring(apiKey.length - 4)}</p>
                    <p><strong>Client ID:</strong> {clientId.substring(0, 6)}...{clientId.substring(clientId.length - 10)}</p>
                    <p><strong>Folder ID:</strong> {folderId}</p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Пример компонента с моковыми данными</h2>
                <p className="mb-4">
                  Ниже представлен пример компонента с моковыми данными (без реального подключения к Google Drive):
                </p>
                <div className="border border-gray-200 rounded-lg p-4">
                  <GoogleDriveDocuments 
                    title="Документы из Google Drive (Моковые данные)" 
                    folderId="mock_folder_id" 
                  />
                </div>
              </div>

              {isConfigured && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Пример компонента с реальными данными</h2>
                  <p className="mb-4">
                    Ниже представлен пример компонента с реальным подключением к Google Drive:
                  </p>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <GoogleDriveDocuments 
                      title="Документы из Google Drive" 
                      folderId={folderId}
                      apiKey={apiKey}
                      clientId={clientId}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Важное примечание</h3>
                <p className="text-yellow-700">
                  В реальном приложении не рекомендуется хранить API ключи на клиентской стороне. 
                  Лучшей практикой является создание серверного API-прокси, который будет взаимодействовать с Google Drive API.
                  Это позволит защитить ваши ключи API и обеспечить более безопасное взаимодействие с Google Drive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
