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
    <Head title="Медицинское образование" />
    <section className="text-gray-600 body-font pb-8">

        <div className="container px-5 py-12 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Система образования в Республике Казахстан</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Уровни образования:</h3>
              <ul className="list-none space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-1">•</span>
                  <span>Среднее образование (общее среднее образование, техническое и профессиональное образование)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-1">•</span>
                  <span>Послесреднее образование</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-1">•</span>
                  <span>Высшее образование</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 mt-1">•</span>
                  <span>Послевузовское образование</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Медицинское образование</h3>
              <p className="text-gray-700 mb-4">
                Медицинское образование Республики Казахстан осуществляется по уровням: бакалавриат, магистратура, резидентура и докторантура.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Подготовку медицинских кадров проводят:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>8 медицинских ВУЗов</li>
                  <li>7 факультетов в составе многопрофильных ВУЗов</li>
                  <li>17 национальных центров, НИИ, НЦ, реализующих программы резидентуры</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Уровни обучения врачей</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Базовое высшее медицинское образование</h4>
                  <p className="text-gray-700">7 лет (бакалавриат + интернатура) – 3 специальности</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Непрерывное интегрированное медицинское образование</h4>
                  <p className="text-gray-700">6 лет (бакалавриат + магистратура + интернатура) – 4 специальности</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Послевузовское образование</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Резидентура – по 49 специальностям от 2 до 4 лет</li>
                  <li>Профильная магистратура (1-1,5 года)</li>
                  <li>Научно-педагогическая магистратура (2 года)</li>
                  <li>Докторантура PhD (3 года)</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Подготовка средних медицинских кадров</h4>
                <p className="text-gray-700">С техническим и профессиональным, послесредним образованием осуществляют 94 медицинских колледжа</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Основные задачи:</h3>
              <p className="text-gray-700 mb-4">
                Методологическое сопровождение и мониторинг эффективности деятельности организаций медицинского образования и науки в области подготовки кадров для системы здравоохранения:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Изучение институциональной среды медицинских ВУЗов, медицинских и высших колледжей РК (по таким составляющим как качество образовательного процесса; администрирование образовательного процесса и культура безопасности; качество научного процесса; качество клинического процесса; антикоррупционная культура и противодействие коррупции) на основе опроса обучающихся, профессорско-преподавательского состава и административно-управленческого персонала;</li>
                <li>Проведение рейтинговой оценки образовательной деятельности медицинских ВУЗов, медицинских колледжей, НИИ, НЦ в соответствии с утвержденной методикой по итогам учебного года.</li>
                <li>Координация контроля качества дополнительного образования, экспертизы образовательных программ дополнительного образования в области здравоохранения и ведение информационной системы каталога образовательных программ дополнительного образования.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="container px-5 py-8 mx-auto">
          <div className="flex flex-wrap -m-4">
            <FolderChlank 
              h1="Нормативные документы" 
              color="bg-purple-100" 
              colorsec="bg-purple-200" 
              href={route('direction.medical.education.documents')}
            />
            <FolderChlank 
              h1="Методические рекомендации" 
              color="bg-purple-100" 
              colorsec="bg-purple-200" 
              href={route('direction.medical.education.recommendations')}
            />
            <FolderChlank 
              h1="Рейтинговая оценка МОО" 
              color="bg-purple-100" 
              colorsec="bg-purple-200" 
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
    </>
    
  )
}

MedicalEducation.layout = (page) => <LayoutDirection img={'medicaleducation'} h1={'Медицинское образование'}>{page}</LayoutDirection>;
