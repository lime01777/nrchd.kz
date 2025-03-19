import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function SettingsIndex() {
  const [activeTab, setActiveTab] = useState('general');
  
  const { data: generalData, setData: setGeneralData, post: postGeneral, processing: processingGeneral, errors: generalErrors } = useForm({
    siteName: 'Национальный центр развития здравоохранения',
    siteDescription: 'Официальный сайт Национального центра развития здравоохранения Республики Казахстан',
    contactEmail: 'info@nrchd.kz',
    contactPhone: '+7 (7172) 70-95-30',
    address: 'Казахстан, г. Астана, ул. Иманова, 13'
  });

  const { data: socialData, setData: setSocialData, post: postSocial, processing: processingSocial, errors: socialErrors } = useForm({
    facebook: 'https://facebook.com/nrchd.kz',
    instagram: 'https://instagram.com/nrchd.kz',
    twitter: '',
    youtube: 'https://youtube.com/nrchd.kz',
    linkedin: ''
  });

  const { data: backupData, setData: setBackupData, post: postBackup, processing: processingBackup, errors: backupErrors } = useForm({
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: '30'
  });

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    postGeneral(route('admin.settings.update.general'));
  };

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    postSocial(route('admin.settings.update.social'));
  };

  const handleBackupSubmit = (e) => {
    e.preventDefault();
    postBackup(route('admin.settings.update.backup'));
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Настройки</h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              Основные
            </button>
            <button
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'social'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('social')}
            >
              Социальные сети
            </button>
            <button
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('backup')}
            >
              Резервное копирование
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Основные настройки */}
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Название сайта
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="siteName"
                      id="siteName"
                      value={generalData.siteName}
                      onChange={(e) => setGeneralData('siteName', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {generalErrors.siteName && (
                    <p className="mt-2 text-sm text-red-600">{generalErrors.siteName}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Описание сайта
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      rows={3}
                      value={generalData.siteDescription}
                      onChange={(e) => setGeneralData('siteDescription', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {generalErrors.siteDescription && (
                    <p className="mt-2 text-sm text-red-600">{generalErrors.siteDescription}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Контактный email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      value={generalData.contactEmail}
                      onChange={(e) => setGeneralData('contactEmail', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {generalErrors.contactEmail && (
                    <p className="mt-2 text-sm text-red-600">{generalErrors.contactEmail}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Контактный телефон
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="contactPhone"
                      id="contactPhone"
                      value={generalData.contactPhone}
                      onChange={(e) => setGeneralData('contactPhone', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {generalErrors.contactPhone && (
                    <p className="mt-2 text-sm text-red-600">{generalErrors.contactPhone}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Адрес
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={generalData.address}
                      onChange={(e) => setGeneralData('address', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {generalErrors.address && (
                    <p className="mt-2 text-sm text-red-600">{generalErrors.address}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={processingGeneral}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {processingGeneral ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
              </div>
            </form>
          )}

          {/* Настройки социальных сетей */}
          {activeTab === 'social' && (
            <form onSubmit={handleSocialSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="facebook"
                      id="facebook"
                      value={socialData.facebook.replace('https://', '')}
                      onChange={(e) => setSocialData('facebook', `https://${e.target.value}`)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="facebook.com/yourpage"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      id="instagram"
                      value={socialData.instagram.replace('https://', '')}
                      onChange={(e) => setSocialData('instagram', `https://${e.target.value}`)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="instagram.com/yourhandle"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      value={socialData.twitter.replace('https://', '')}
                      onChange={(e) => setSocialData('twitter', `https://${e.target.value}`)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="twitter.com/yourhandle"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                    YouTube
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="youtube"
                      id="youtube"
                      value={socialData.youtube.replace('https://', '')}
                      onChange={(e) => setSocialData('youtube', `https://${e.target.value}`)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="youtube.com/channel/your-channel"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      value={socialData.linkedin.replace('https://', '')}
                      onChange={(e) => setSocialData('linkedin', `https://${e.target.value}`)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="linkedin.com/company/your-company"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={processingSocial}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {processingSocial ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
              </div>
            </form>
          )}

          {/* Настройки резервного копирования */}
          {activeTab === 'backup' && (
            <form onSubmit={handleBackupSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoBackup"
                        name="autoBackup"
                        type="checkbox"
                        checked={backupData.autoBackup}
                        onChange={(e) => setBackupData('autoBackup', e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoBackup" className="font-medium text-gray-700">
                        Автоматическое резервное копирование
                      </label>
                      <p className="text-gray-500">
                        Включить автоматическое создание резервных копий базы данных и файлов
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                    Частота резервного копирования
                  </label>
                  <div className="mt-1">
                    <select
                      id="backupFrequency"
                      name="backupFrequency"
                      value={backupData.backupFrequency}
                      onChange={(e) => setBackupData('backupFrequency', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled={!backupData.autoBackup}
                    >
                      <option value="daily">Ежедневно</option>
                      <option value="weekly">Еженедельно</option>
                      <option value="monthly">Ежемесячно</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="backupRetention" className="block text-sm font-medium text-gray-700">
                    Срок хранения резервных копий (дней)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="backupRetention"
                      id="backupRetention"
                      value={backupData.backupRetention}
                      onChange={(e) => setBackupData('backupRetention', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled={!backupData.autoBackup}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Создать резервную копию сейчас
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={processingBackup}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {processingBackup ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

SettingsIndex.layout = page => <AdminLayout title="Настройки">{page}</AdminLayout>;
