import { Head } from "@inertiajs/react";
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import BannerCatalog from "@/Components/BannerCatalog";
import PageAccordions from "@/Components/PageAccordions";
import FilesAccord from "@/Components/FilesAccord";
import FolderChlank from "@/Components/FolderChlank";

export default function MedicalEducation() {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <>
    <Head title="Медицинское образование" meta={[{ name: 'description', content: 'Медицинское образование: программы, курсы и обучение в сфере здравоохранения.' }]} />
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" data-translate>Медицинское образование в Республике Казахстан</h2>
          <p className="text-gray-700 mb-4 leading-relaxed" data-translate>
            Подготовка медицинских кадров является одним из основных приоритетов государства.
          </p>

          <div className="mb-6">
            <p className="text-gray-700 mb-3" data-translate>
              Для обеспечения системы здравоохранения квалифицированными врачебными кадрами в республике подготовку медицинских кадров проводят:
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span data-translate>8 медицинских ВУЗов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span data-translate>7 факультетов в составе многопрофильных ВУЗов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span data-translate>17 национальных центров, НИИ, НЦ, реализующих программы резидентуры</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3" data-translate>Обучение врачей проводится по следующим уровням образования:</h3>
            
            <div className="overflow-hidden border border-green-100 rounded-lg mb-6">
              {/* Базовое и интегрированное образование */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                <div className="bg-green-50 p-5">
                  <h4 className="font-semibold mb-2 text-green-800" data-translate>Базовое высшее медицинское образование</h4>
                  <p className="text-gray-700" data-translate>7 лет (бакалавриат + интернатура) – 3 специальности</p>
                </div>
                <div className="bg-green-50 p-5">
                  <h4 className="font-semibold mb-2 text-green-800" data-translate>Непрерывное интегрированное медицинское образование</h4>
                  <p className="text-gray-700" data-translate>6 лет (бакалавриат + магистратура + интернатура) – 4 специальности</p>
                </div>
              </div>
              
              {/* Послевузовское образование */}
              <div className="bg-green-50 p-5 border-t border-green-100">
                <h4 className="font-semibold mb-2 text-green-800" data-translate>Послевузовское образование</h4>
                <ul className="list-none space-y-1 text-gray-700">
                  <li data-translate>• Резидентура – по 49 специальностям от 2 до 4 лет</li>
                  <li data-translate>• Профильная магистратура (1-1,5 года)</li>
                  <li data-translate>• Научно-педагогическая магистратура (2 года)</li>
                  <li data-translate>• Докторантура PhD (3 года)</li>
                </ul>
              </div>
              
              {/* Подготовка средних медицинских кадров */}
              <div className="bg-green-50 p-5 border-t border-green-100">
                <h4 className="font-semibold mb-2 text-green-800" data-translate>Подготовка средних медицинских кадров</h4>
                <p className="text-gray-700" data-translate>С техническим и профессиональным, послесредним образованием осуществляют 94 медицинских колледжа</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3" data-translate>Методологическое сопровождение и мониторинг эффективности деятельности организаций медицинского образования и науки в области подготовки кадров для системы здравоохранения:</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">1.</span>
                <p className="text-gray-700" data-translate>Изучение институциональной среды медицинских ВУЗов, медицинских и высших колледжей РК (по таким составляющим как качество образовательного процесса; администрирование образовательного процесса и культура безопасности; качество научного процесса; качество клинического процесса; антикоррупционная культура и противодействие коррупции) на основе опроса обучающихся, профессорско-преподавательского состава и административно-управленческого персонала;</p>
              </div>
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">2.</span>
                <p className="text-gray-700" data-translate>Проведение рейтинговой оценки образовательной деятельности медицинских ВУЗов, медицинских колледжей, НИИ, НЦ в соответствии с утвержденной методикой по итогам учебного года.</p>
              </div>
              <div className="flex">
                <span className="font-semibold text-green-600 mr-2">3.</span>
                <p className="text-gray-700" data-translate>Координация контроля качества дополнительного образования, экспертизы образовательных программ дополнительного образования в области здравоохранения и ведение информационной системы каталога образовательных программ дополнительного образования.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-5 py-8 mx-auto">
        <div className="flex flex-wrap -m-4">
          <FolderChlank 
            h1="Информационная система Каталог образовательных программ дополнительного образования в сфере здравоохранения"
            data-translate-h1="true"
            color="bg-green-100" 
            colorsec="bg-green-200" 
            href={route('direction.medical.education.documents')}
          />
          <FolderChlank 
            h1="Перечень организаций дополнительного образования по медицинским специальностям"
            data-translate-h1="true"
            color="bg-green-100" 
            colorsec="bg-green-200" 
            href={route('direction.medical.education.recommendations')}
          />
          <FolderChlank 
            h1="Результаты рейтинговой оценки по образовательной деятельности медицинских ВУЗов, НИИ, НЦ, ВМК и МК"
            data-translate-h1="true"
            color="bg-green-100" 
            colorsec="bg-green-200" 
            href={route('direction.medical.education.rating')}
          />
        </div>
      </div>


    </section>
    <BannerCatalog />
    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            
            {/* Второй аккордеон */}
                <FilesAccord 
                    folder="MedicalEducation/class mediumd"
                    title="Повышение квалификации для среднего медперсонала"
                    bgColor="bg-green-100"
                />
            
            {/* Третий аккордеон */}
                <FilesAccord 
                    folder="MedicalEducation/class menedger"
                    title="Повышение квалификации для менеджеров"
                    bgColor="bg-green-100"
                />
            
            {/* Четвертый аккордеон */}
                <FilesAccord 
                    folder="MedicalEducation/class doctor"
                    title="Повышение квалификации для врачей"
                    bgColor="bg-green-100"
                />
        </div>
    </section>

    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className="bg-green-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Контактная информация
          </h3>
          <p className="text-lg mb-4">
            По возникшим вопросам касательно процедуры подачи заявок для экспертизы и включения программ сертификационных курсов и повышения квалификации в Каталог просим обратиться в:
          </p>
          
          <div className="pl-4 border-l-4 border-green-300 mt-5 mb-5">
            <p className="font-medium text-gray-700 mb-1">Департамент развития медицинского образования и науки ННЦРЗ</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Рабочий телефон:</p>
                  <p className="text-base font-medium">+7(7172) 700950 (вн. 1114)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Мобильный телефон:</p>
                  <p className="text-base font-medium">+7(707)189-46-80</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Электронный адрес:</p>
                  <a href="mailto:ddmes.rcrz@mail.ru" className="text-base font-medium text-green-700 hover:underline">ddmes.rcrz@mail.ru</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Контактное лицо:</p>
                  <p className="text-base font-medium">Есдаулет Самат Азаматұлы</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
    
  )
}

MedicalEducation.layout = (page) => <LayoutDirection img={'medicaleducation'} h1={'Медицинское образование'} useVideo={true}>{page}</LayoutDirection>;
