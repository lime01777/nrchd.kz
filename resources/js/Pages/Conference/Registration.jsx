import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Tab } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { RiUserLine, RiMicLine, RiTeamLine, RiBuilding4Line } from 'react-icons/ri';

/**
 * Страница регистрации на Международную конференцию по медицинскому туризму
 * 
 * @returns {React.ReactElement} Форма регистрации участника, спикера, партнера или организатора
 */
export default function Registration() {
  // Состояние для переключения между различными типами регистрации
  const [selectedTab, setSelectedTab] = useState(0);

  // Форма для обработки данных регистрации
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    type: 'participant', // 'participant', 'speaker', 'partner', 'sponsor'
    topic: '',
    category: '',
    country: '',
    city: '',
    participation_format: 'offline', // 'offline' или 'online'
    attendance_days: [],
    dietary_requirements: '',
    special_needs: '',
    company_description: '',
    partnership_interest: [],
    sponsorship_package: '',
    agree_terms: false,
    agree_photo: false,
  });

  // Обработчик изменения вкладки
  const handleTabChange = (index) => {
    setSelectedTab(index);
    // Обновляем тип регистрации в зависимости от выбранной вкладки
    const types = ['participant', 'speaker', 'partner', 'sponsor'];
    setData('type', types[index]);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Обработка множественного выбора (чекбоксы)
    if (name === 'attendance_days' || name === 'partnership_interest') {
      const updatedArray = [...data[name]];
      if (checked) {
        updatedArray.push(value);
      } else {
        const index = updatedArray.indexOf(value);
        if (index !== -1) updatedArray.splice(index, 1);
      }
      setData(name, updatedArray);
    } else {
      // Стандартная обработка для других полей
      setData(name, type === 'checkbox' ? checked : value);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('conference.registration.submit'));
  };

  return (
    <ConferenceLayout title="Регистрация">
      <Head>
        <title>Регистрация - Международная конференция по медицинскому туризму</title>
        <meta name="description" content="Регистрация на международную конференцию по медицинскому туризму в Казахстане, 13-17 октября 2025" />
      </Head>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">Регистрация на международную конференцию по медицинскому туризму</h1>
              <p className="text-lg text-center text-gray-700 mb-4">
                Международная конференция и выставка «Развитие медицинского туризма в Казахстане: перспективы и возможности»<br />
                13-17 октября 2025 года, Астана-Алматы
              </p>
              <div className="text-center text-gray-600 bg-blue-50 p-4 rounded-lg mb-6">
                <p>Выберите категорию регистрации, которая лучше всего описывает вашу роль на конференции:</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Вкладки для выбора типа регистрации */}
              <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
                <Tab.List className="flex bg-blue-50">
                  <Tab 
                    className={({ selected }) =>
                      `flex-1 py-4 px-4 text-center font-medium focus:outline-none transition-colors
                       ${selected ? 'bg-white border-t-2 border-blue-600' : 'hover:bg-blue-100'}`
                    }
                  >
                    Участник
                  </Tab>
                  <Tab 
                    className={({ selected }) =>
                      `flex-1 py-4 px-4 text-center font-medium focus:outline-none transition-colors
                       ${selected ? 'bg-white border-t-2 border-blue-600' : 'hover:bg-blue-100'}`
                    }
                  >
                    Спикер
                  </Tab>
                  <Tab 
                    className={({ selected }) =>
                      `flex-1 py-4 px-4 text-center font-medium focus:outline-none transition-colors
                       ${selected ? 'bg-white border-t-2 border-blue-600' : 'hover:bg-blue-100'}`
                    }
                  >
                    Партнер
                  </Tab>
                  <Tab 
                    className={({ selected }) =>
                      `flex-1 py-4 px-4 text-center font-medium focus:outline-none transition-colors
                       ${selected ? 'bg-white border-t-2 border-blue-600' : 'hover:bg-blue-100'}`
                    }
                  >
                    Спонсор
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    {/* Форма для участника */}
                    <div className="p-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-blue-800 mb-2">Регистрация участника конференции</h3>
                        <p className="text-sm text-gray-600">
                          Заполните форму ниже для регистрации на Международную конференцию по медицинскому туризму.
                        </p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Личная информация */}
                          <div className="mb-4">
                            <InputLabel htmlFor="name" value="ФИО *" />
                            <TextInput
                              id="name"
                              type="text"
                              name="name"
                              value={data.name}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.name} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                              id="email"
                              type="email"
                              name="email"
                              value={data.email}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.email} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="phone" value="Телефон *" />
                            <TextInput
                              id="phone"
                              type="text"
                              name="phone"
                              value={data.phone}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="country" value="Страна *" />
                            <TextInput
                              id="country"
                              type="text"
                              name="country"
                              value={data.country}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.country} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="city" value="Город *" />
                            <TextInput
                              id="city"
                              type="text"
                              name="city"
                              value={data.city}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.city} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="organization" value="Организация *" />
                            <TextInput
                              id="organization"
                              type="text"
                              name="organization"
                              value={data.organization}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.organization} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="position" value="Должность *" />
                            <TextInput
                              id="position"
                              type="text"
                              name="position"
                              value={data.position}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.position} className="mt-2" />
                          </div>
                          
                          {/* Информация об участии */}
                          <div className="mb-4 md:col-span-2">
                            <h3 className="font-medium text-lg border-b border-gray-200 pb-2 mb-4">Информация об участии</h3>
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="category" value="Категория участника *" />
                            <select
                              id="category"
                              name="category"
                              value={data.category}
                              className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                              onChange={handleChange}
                              required
                            >
                              <option value="">Выберите категорию</option>
                              <option value="healthcare_professional">Медицинский работник / Специалист здравоохранения</option>
                              <option value="tourism_professional">Специалист в области туризма</option>
                              <option value="academic">Представитель ВУЗа, НИИ, научного центра</option>
                              <option value="government">Представитель государственных органов</option>
                              <option value="international">Международный делегат</option>
                              <option value="student">Студент / Ординатор / Резидент</option>
                              <option value="other">Другое</option>
                            </select>
                            <InputError message={errors.category} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <div className="mb-2">
                              <InputLabel value="Формат участия *" />
                            </div>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="participation_format"
                                  value="offline"
                                  checked={data.participation_format === 'offline'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Очно</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="participation_format"
                                  value="online"
                                  checked={data.participation_format === 'online'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Онлайн</span>
                              </label>
                            </div>
                            <InputError message={errors.participation_format} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <div className="mb-2">
                              <InputLabel value="Дни посещения *" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="attendance_days"
                                  value="13_october_astana"
                                  checked={data.attendance_days.includes('13_october_astana')}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="ml-2">13 октября (Астана)</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="attendance_days"
                                  value="14_october_astana"
                                  checked={data.attendance_days.includes('14_october_astana')}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="ml-2">14 октября (Астана)</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="attendance_days"
                                  value="16_october_almaty"
                                  checked={data.attendance_days.includes('16_october_almaty')}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="ml-2">16 октября (Алматы)</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="attendance_days"
                                  value="17_october_almaty"
                                  checked={data.attendance_days.includes('17_october_almaty')}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <span className="ml-2">17 октября (Алматы)</span>
                              </label>
                            </div>
                            <InputError message={errors.attendance_days} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="dietary_requirements" value="Предпочтения в питании (если есть)" />
                            <TextInput
                              id="dietary_requirements"
                              type="text"
                              name="dietary_requirements"
                              value={data.dietary_requirements}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              placeholder="Например: вегетарианское, без глютена, халяль и т.д."
                            />
                            <InputError message={errors.dietary_requirements} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="special_needs" value="Особые требования (если есть)" />
                            <TextInput
                              id="special_needs"
                              type="text"
                              name="special_needs"
                              value={data.special_needs}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              placeholder="Например: доступ для инвалидных колясок, услуги перевода и т.д."
                            />
                            <InputError message={errors.special_needs} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <label className="flex items-center">
                              <Checkbox
                                name="agree_terms"
                                checked={data.agree_terms}
                                onChange={handleChange}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                Я согласен с <a href="#" className="text-blue-600 hover:underline">условиями участия</a> и <a href="#" className="text-blue-600 hover:underline">политикой конфиденциальности</a> *
                              </span>
                            </label>
                            <InputError message={errors.agree_terms} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <label className="flex items-center">
                              <Checkbox
                                name="agree_photo"
                                checked={data.agree_photo}
                                onChange={handleChange}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                Я даю согласие на использование моих фотографий и видеозаписей, сделанных во время конференции *
                              </span>
                            </label>
                            <InputError message={errors.agree_photo} className="mt-2" />
                          </div>
                          
                          <div className="md:col-span-2 mt-4">
                            <PrimaryButton disabled={processing}>
                              Зарегистрироваться
                            </PrimaryButton>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    {/* Форма для спикера */}
                    <div className="p-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-blue-800 mb-2">Регистрация спикера конференции</h3>
                        <p className="text-sm text-gray-600">
                          Пожалуйста, заполните форму ниже, если вы хотите выступить с докладом на Международной конференции по медицинскому туризму.
                        </p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Личная информация */}
                          <div className="mb-4">
                            <InputLabel htmlFor="name" value="ФИО *" />
                            <TextInput
                              id="name"
                              type="text"
                              name="name"
                              value={data.name}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.name} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                              id="email"
                              type="email"
                              name="email"
                              value={data.email}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.email} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="phone" value="Телефон *" />
                            <TextInput
                              id="phone"
                              type="text"
                              name="phone"
                              value={data.phone}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="country" value="Страна *" />
                            <TextInput
                              id="country"
                              type="text"
                              name="country"
                              value={data.country}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.country} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="city" value="Город *" />
                            <TextInput
                              id="city"
                              type="text"
                              name="city"
                              value={data.city}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.city} className="mt-2" />
                          </div>
                          
                          <div className="mb-4">
                            <InputLabel htmlFor="organization" value="Организация *" />
                            <TextInput
                              id="organization"
                              type="text"
                              name="organization"
                              value={data.organization}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.organization} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="position" value="Должность *" />
                            <TextInput
                              id="position"
                              type="text"
                              name="position"
                              value={data.position}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                            />
                            <InputError message={errors.position} className="mt-2" />
                          </div>
                          
                          {/* Информация о выступлении */}
                          <div className="mb-4 md:col-span-2">
                            <h3 className="font-medium text-lg border-b border-gray-200 pb-2 mb-4">Информация о выступлении</h3>
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="topic" value="Тема выступления *" />
                            <TextInput
                              id="topic"
                              type="text"
                              name="topic"
                              value={data.topic}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              required
                              placeholder="Укажите предлагаемую тему вашего доклада"
                            />
                            <InputError message={errors.topic} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="abstract" value="Краткое описание выступления *" />
                            <textarea
                              id="abstract"
                              name="abstract"
                              value={data.abstract}
                              className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                              onChange={handleChange}
                              required
                              rows="4"
                              placeholder="Опишите основные тезисы вашего выступления (до 300 слов)"
                            />
                            <InputError message={errors.abstract} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <div className="mb-2">
                              <InputLabel value="Предпочтительный формат выступления *" />
                            </div>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="participation_format"
                                  value="offline"
                                  checked={data.participation_format === 'offline'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Очно</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="participation_format"
                                  value="online"
                                  checked={data.participation_format === 'online'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Онлайн</span>
                              </label>
                            </div>
                            <InputError message={errors.participation_format} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <div className="mb-2">
                              <InputLabel value="Предпочтительная локация *" />
                            </div>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="preferred_location"
                                  value="astana"
                                  checked={data.preferred_location === 'astana'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Астана (13-14 октября)</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="preferred_location"
                                  value="almaty"
                                  checked={data.preferred_location === 'almaty'}
                                  onChange={handleChange}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Алматы (16-17 октября)</span>
                              </label>
                            </div>
                            <InputError message={errors.preferred_location} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <InputLabel htmlFor="special_requirements" value="Особые требования для выступления (если есть)" />
                            <TextInput
                              id="special_requirements"
                              type="text"
                              name="special_requirements"
                              value={data.special_requirements}
                              className="mt-1 block w-full"
                              onChange={handleChange}
                              placeholder="Например: проектор, звуковое оборудование и т.д."
                            />
                            <InputError message={errors.special_requirements} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <label className="flex items-center">
                              <Checkbox
                                name="agree_terms"
                                checked={data.agree_terms}
                                onChange={handleChange}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                Я согласен с <a href="#" className="text-blue-600 hover:underline">условиями участия</a> и <a href="#" className="text-blue-600 hover:underline">политикой конфиденциальности</a> *
                              </span>
                            </label>
                            <InputError message={errors.agree_terms} className="mt-2" />
                          </div>
                          
                          <div className="mb-4 md:col-span-2">
                            <label className="flex items-center">
                              <Checkbox
                                name="agree_photo"
                                checked={data.agree_photo}
                                onChange={handleChange}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                Я даю согласие на использование моих фотографий и видеозаписей, сделанных во время конференции *
                              </span>
                            </label>
                            <InputError message={errors.agree_photo} className="mt-2" />
                          </div>
                          
                          <div className="md:col-span-2 mt-4">
                            <PrimaryButton disabled={processing}>
                              Зарегистрироваться
                            </PrimaryButton>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
            
            <div className="mt-8 text-center text-gray-600 text-sm">
              * - обязательные поля для заполнения
            </div>
            
            <div className="mt-10 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Информация об оплате</h3>
              <p className="mb-4">
                После регистрации вам будет отправлена информация об оплате регистрационного взноса 
                на указанный email-адрес.
              </p>
              <p>
                По вопросам оплаты и регистрации обращайтесь по адресу <a href="mailto:conference@nrchd.kz" className="text-blue-600 hover:underline">conference@nrchd.kz</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}
