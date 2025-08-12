import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsLocalCommissions() {
  return (
    <>
      <Head title="Перечень локальных этических комиссий" meta={[{ name: 'description', content: 'Перечень локальных этических комиссий по биоэтике в Республике Казахстан.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed mb-4">
              Министерством здравоохранения Республики Казахстан на заседании Ученого Совета 9 января 2007 года рекомендовано создание локальных этических комиссий по биоэтике (ЛКБ) во всех организациях медицинского образования и науки, организациях здравоохранения.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              ЛКБ должны осуществлять независимую этическую экспертизу биомедицинских исследований, выполняемых в данной организации, гарантировать соблюдение прав пациентов, участвующих в исследованиях, а также вести мониторинг и промежуточный контроль хода исследования после получения разрешения на его проведение.
            </p>

            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Основные функции локальных этических комиссий:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Независимая этическая экспертиза биомедицинских исследований</li>
                <li>Гарантия соблюдения прав пациентов, участвующих в исследованиях</li>
                <li>Мониторинг хода исследований после получения разрешения</li>
                <li>Промежуточный контроль проведения исследований</li>
                <li>Оценка этической обоснованности исследовательских проектов</li>
                <li>Контроль качества информированного согласия участников</li>
              </ul>
            </div>

            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Организации, где создаются ЛКБ:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Организации медицинского образования</li>
                <li>Организации науки</li>
                <li>Организации здравоохранения</li>
                <li>Научно-исследовательские институты</li>
                <li>Высшие учебные заведения медицинского профиля</li>
              </ul>
            </div>

            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Координация с Центральной комиссией по биоэтике:
              </h3>
              <p className="text-gray-700 mb-3">
                Центральная комиссия по биоэтике ведет реестр локальных комиссий, осуществляет координацию их деятельности и обеспечивает единообразие подходов к биоэтической экспертизе. Все ЛКБ должны быть сертифицированы Центральной комиссией по биоэтике для получения права на проведение этической экспертизы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Registry"
                title="Реестр локальных комиссий"
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Contacts"
                title="Контактная информация"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Competence"
                title="Сферы компетенции"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
            <FilesAccord 
                folder="Bioethics/LocalCommissions/Reports"
                title="Отчеты о деятельности"
                bgColor="bg-blue-200"
                defaultOpen={false}
            />
        </div>
    </section>
    </>
  )
}

BioethicsLocalCommissions.layout = page => <LayoutFolderChlank 
  title="Перечень локальных этических комиссий"
  parentRoute={route('bioethics')}
  parentName="Центральная комиссия по биоэтике"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  buttonBorderColor="border-blue-200"
>{page}</LayoutFolderChlank>
