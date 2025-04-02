import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import ServiceTimeline from '@/Components/ServiceTimeline';
import ActualFile from '@/Components/ActualFile';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';

// Компонент формы аккредитации для отображения в шапке
const AccreditationForm = () => {
  const [files, setFiles] = useState([]);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    alert('Форма отправлена');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">Заявка на аккредитацию</h2>
      <form onSubmit={handleSubmit} className="text-sm">
        <div className="mb-3">
          <label htmlFor="orgName" className="block text-gray-700 text-sm font-medium mb-1">
            Полное наименование организации
          </label>
          <input 
            type="text" 
            id="orgName" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>
        
        

        
        <div className="mb-3">
          <label htmlFor="registration" className="block text-gray-700 text-sm font-medium mb-1">
            Свидетельство о государственной регистрации
          </label>
          <input 
            type="text" 
            id="registration" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="№, кем и когда выдано"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">
            Адрес
          </label>
          <input 
            type="text" 
            id="address" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Индекс, город, район, область, улица, № дома"
            required
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
              Телефон
            </label>
            <input 
              type="tel" 
              id="phone" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">
            Дополнительная информация
          </label>
          <textarea 
            id="message" 
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <p className="block text-sm font-medium text-gray-800 mb-1">Прикрепите к заявке в формате PDF:</p>
          <ul className="list-disc pl-5 mb-2 text-xs text-gray-600 space-y-1">
            <li>Заявление с подписью</li>
            <li>Устав организации</li>
            <li>Свидетельство о регистрации</li>
            <li>Лицензия с приложениями</li>
          </ul>
          <input 
            type="file" 
            id="file" 
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-xs file:font-medium
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
            multiple
          />
          <div className="mt-2">
            {files.length > 0 && (
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <input 
            type="checkbox" 
            id="consent" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="consent" className="ml-2 block text-xs text-gray-700">
            Я согласен на обработку персональных данных
          </label>
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-md text-sm transition duration-300 w-auto"
          >
            Отправить заявку
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Accreditation() {
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Срок проведения оценки", value: "10 рабочих дней" },
  ];

  const faqItems = [
    {
      question: "Как получить услугу?",
      answer: (
        <div>
          <h3 className="font-semibold mb-2">Порядок подачи заявления на проведение аккредитации</h3>
          <p className="mb-4">
            Для получения аккредитации медицинской организации заявитель заключает с РГП на ПХВ «Национальный научный центр развития здравоохранения им. С. Каирбековой» (далее – ННЦРЗ) договор установленного образца.
          </p>
          <p className="mb-4">
            Оплата стоимости за проведение аккредитации осуществляется заявителем в соответствии с прейскурантом, утвержденным ННЦРЗ.
          </p>
        </div>
      )
    },
    {
      question: "Нормативно-правовые акты",
      answer: (
        <div>
          <ul className="space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК «О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021687" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 21 декабря 2020 года № ҚР ДСМ-309/2020 «Об утверждении положения о деятельности организаций и (или) структурных подразделений организаций здравоохранения, осуществляющих аккредитацию в области здравоохранения»
              </a>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <>
      <Head title="Аккредитация медицинских организаций и организаций здравоохранения" />

      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-4">
                Одним из основных инструментов управления качеством медицинской помощи выступает аккредитация медицинских организаций, как ключевой процесс оценки обеспечения и поддержания высоких стандартов качества и безопасности оказываемых медицинских услуг и процессов в медицинской организации.
              </p>
              
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Процедура аккредитации включает:</h4>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Самооценку</li>
                <li>Внешнюю комплексную оценку на соответствие установленным стандартам аккредитации</li>
                <li>Постаккредитационный мониторинг</li>
              </ul>

              <h4 className="font-semibold text-lg text-gray-800 mb-2">Конкурентные преимущества и меры мотивации к прохождению аккредитации:</h4>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Подтверждённый уровень качества и безопасности предоставляемых медицинских услуг</li>
                <li>Преимущественное право в системе ОСМС и ГОБМП</li>
                <li>Повышение эффективности управления медицинской организацией</li>
                <li>Рост вовлечённости персонала в развитие и поддержание высокого статуса медицинской организации</li>
                <li>Освобождение от проактивного мониторинга ФСМС и профилактического контроля на следующий календарный год</li>
                <li>Учет статуса аккредитации в рейтинге медицинских организаций</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4">
                Согласно приказа Комитета медицинского и фармацевтического контроля Министерства здравоохранения Республики Казахстан № 99-НҚ от 13.03.2023 года, ННЦРЗ аккредитован уполномоченным органом на осуществление аккредитации медицинских организаций сроком на 5 лет.
              </p>

              <p className="text-gray-700 leading-relaxed">
                ННЦРЗ, представитель государственного сектора среди аккредитующих организаций, обладает высоким экспертным и научным потенциалом, обусловленным историей формирования и опытом начала внедрения аккредитации медицинских организаций в Казахстане, разработки методических рекомендаций, протоколов и стандартов, а также высокой прозрачностью основной деятельности.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div id="service-timeline">
              <ServiceTimeline items={timelineItems} />
            </div>
          </div>
        </div>
        
        <ActualFile 
          title="Действуйщий документ" 
          folder="Услуги/Аккредитация/Документ"
          bgColor="bg-purple-50"
        />
        
        <div className="mt-10">
          <FilesAccord 
            folder="Услуги/Аккредитация" 
            title="Полезные материалы" 
            bgColor="bg-fuchsia-50"
            defaultOpen={true}
          />
        </div>

        <div className="mt-10">
          <FAQ 
            title="Информация об услуге"
            items={faqItems}
          />
        </div>
        
        {/* Контактная информация */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Контактная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Отдел по аккредитации</h3>
              <p className="text-gray-600">г. Астана, улица Иманова, 13</p>
              <p className="text-gray-600">8-7172-700-950, внутренний номер: 1049, 1079</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Accreditation.layout = (page) => <ServicesPageLayout 
  title="Аккредитация медицинских организаций" 
  img="service-accreditation" 
  bgColor="bg-orange-300"
  customForm={<AccreditationForm />}
>{page}</ServicesPageLayout>;
