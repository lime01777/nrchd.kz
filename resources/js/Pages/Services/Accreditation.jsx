import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import ServicesPageLayout from '@/Layouts/ServicesPageLayout';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import ServiceTimeline from '@/Components/ServiceTimeline';
import PriceList from '@/Components/PriceList';
import FilesAccord from '@/Components/FilesAccord';
import FAQ from '@/Components/FAQ';

export default function Accreditation() {
  const [files, setFiles] = useState([]);
  
  const timelineItems = [
    { title: "Регистрация заявки", value: "1 рабочий день" },
    { title: "Срок проведения оценки", value: "10 рабочих дней" },
  ];

  const priceItems = [
    { 
      name: "Аккредитация медицинской организации (до 200 коек)", 
      unit: "1 организация", 
      priceWithVAT: "300 000 тенге", 
      priceWithoutVAT: "267 857 тенге" 
    },
    { 
      name: "Аккредитация медицинской организации (200-400 коек)", 
      unit: "1 организация", 
      priceWithVAT: "400 000 тенге", 
      priceWithoutVAT: "357 143 тенге" 
    },
    { 
      name: "Аккредитация медицинской организации (более 400 коек)", 
      unit: "1 организация", 
      priceWithVAT: "500 000 тенге", 
      priceWithoutVAT: "446 429 тенге" 
    }
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
    <>
      <Head title="Аккредитация медицинских организаций и организаций здравоохранения" />

      <div className="container mx-auto py-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mt-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Аккредитация в области здравоохранения - процедура признания соответствия субъектов здравоохранения стандартам аккредитации, 
                подтверждающая способность аккредитуемого субъекта выполнять работы и услуги в соответствии с требованиями стандартов аккредитации.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div id="service-timeline">
              <ServiceTimeline items={timelineItems} />
            </div>
          </div>
        </div>
        
        <PriceList 
          title="Прейскурант" 
          items={priceItems} 
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
        
        {/* Форма заявки на аккредитацию */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Заявка на аккредитацию</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-800 mb-1">
                  Полное наименование организации
                </label>
                <input 
                  type="text" 
                  id="orgName" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="№, кем и когда выдано" 
                />
              </div>
              
              <div>
                <label htmlFor="ownership" className="block text-sm font-medium text-gray-800 mb-1">
                  Форма собственности организации
                </label>
                <input 
                  type="text" 
                  id="ownership" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="№, кем и когда выдано" 
                />
              </div>
              
              <div>
                <label htmlFor="foundingYear" className="block text-sm font-medium text-gray-800 mb-1">
                  Год создания организации
                </label>
                <input 
                  type="text" 
                  id="foundingYear" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="№, кем и когда выдано" 
                />
              </div>
              
              <div>
                <label htmlFor="registration" className="block text-sm font-medium text-gray-800 mb-1">
                  Свидетельство (справка) о государственной регистрации/перерегистрации
                </label>
                <input 
                  type="text" 
                  id="registration" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="№, кем и когда выдано" 
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-1">
                  Адрес
                </label>
                <input 
                  type="text" 
                  id="address" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="Индекс, город, район, область, улица, № дома, телефон, факс" 
                />
              </div>
              
              <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-800 mb-1">
                  Расчетный счет
                </label>
                <input 
                  type="text" 
                  id="bankAccount" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="№ счета, наименование и местонахождение банка" 
                />
              </div>
              
              <div>
                <label htmlFor="director" className="block text-sm font-medium text-gray-800 mb-1">
                  Руководитель
                </label>
                <input 
                  type="text" 
                  id="director" 
                  className="w-full py-1 px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-gray-500"
                  placeholder="Фамилия, имя, отчество" 
                />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="block text-sm font-medium text-gray-800 mb-2">Прикрепите к заявке в формате PDF</p>
              <ol className="list-decimal pl-6 mb-4 text-sm text-gray-600 space-y-1">
                <li>Заявление с подписью</li>
                <li>Устав организации</li>
                <li>Свидетельство о государственной регистрации/перерегистрации</li>
                <li>Лицензия с приложениями</li>
              </ol>
              
              <div className="mt-4">
                <label htmlFor="files" className="inline-block px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                  Прикрепить файлы
                  <input 
                    type="file" 
                    id="files" 
                    multiple 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
                
                <div className="mt-2">
                  {files.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Выбрано файлов: {files.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                type="submit" 
                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Контактная информация */}
      <section className="text-gray-600 body-font pt-10 pb-16">
        <div className="container px-5 mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Контактная информация</h2>
            <div className="mb-4">
              <p className="mb-1"><strong>По всем вопросам обращайтесь в Департамент совершенствования лекарственной политики.</strong></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-1"><strong>Адрес</strong></p>
                <p className="text-gray-600">Астана, ул. А. Иманова 11, Бизнес центр «Нурсаулет-1», 3 этаж, кабинет 306/3</p>
              </div>
              <div>
                <p className="mb-1"><strong>График работы</strong></p>
                <p className="text-gray-600">Пн.-Пт. с 9:00 до 18:00, Перерыв на обед с 13:00 до 14:00</p>
              </div>
              <div>
                <p className="mb-1"><strong>Эл. почта</strong></p>
                <p className="text-gray-600">
                  <a href="mailto:a.skakova@nrchd.kz" className="text-blue-600 hover:underline">a.skakova@nrchd.kz</a>, 
                  <a href="mailto:s.zhaldybaeva@nrchd.kz" className="text-blue-600 hover:underline ml-1">s.zhaldybaeva@nrchd.kz</a>
                </p>
              </div>
              <div>
                <p className="mb-1"><strong>Телефон</strong></p>
                <p className="text-gray-600">8-7172-700-950, внутренний номер: 1049, 1079</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Accreditation.layout = (page) => <ServicesPageLayout title="Аккредитация медицинских организаций" img="service-accreditation" bgColor="bg-purple-100">{page}</ServicesPageLayout>;
