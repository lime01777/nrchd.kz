import { Head, usePage } from "@inertiajs/react";
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import BannerCatalog from "@/Components/BannerCatalog";
import PageAccordions from "@/Components/PageAccordions";
import FilesAccord from "@/Components/FilesAccord";
import FolderChlank from "@/Components/FolderChlank";

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};


export default function MedicalEducation() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода внутри компонента
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

  const [showFullText, setShowFullText] = useState(false);

  return (
    <>
    <Head title={tComponent('directions.medical_education', 'Медицинское образование')} meta={[{ name: 'description', content: 'Медицинское образование: программы, курсы и обучение в сфере здравоохранения.' }]} />
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {tComponent('directions.medical_education', 'Медицинское образование')}
        </h1>
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
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Рейтинг" 
                    description="Рейтинг медицинских образовательных учреждений"
                    href={route('direction.medical.education.rating')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Документы" 
                    description="Документы по медицинскому образованию"
                    href={route('direction.medical.education.documents')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="ГОСО и ТУП" 
                    description="Стандарты образования и типовые учебные планы"
                    href={route('direction.medical.education.goso_tup')}
                />
                <FolderChlank 
                    color="bg-gray-200"
                    colorsec="bg-gray-300"
                    title="Рекомендации" 
                    description="Рекомендации по медицинскому образованию"
                    href={route('direction.medical.education.recommendations')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

MedicalEducation.layout = (page) => <LayoutDirection img="medicaleducation" h1={t('directions.medical_education', 'Медицинское образование')}>{page}</LayoutDirection>;
