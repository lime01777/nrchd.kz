import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function BioethicsBiobanks() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.bioethicsSubpages.biobanks.title', 'Биобанки')} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-4'>
            <p className="tracking-wide leading-relaxed mb-4">
              {t('directionsPages.bioethicsSubpages.biobanks.intro')}
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4 w-full">
              {t('directionsPages.bioethicsSubpages.biobanks.procedureTitle')}
            </h2>

            <div className="w-full mb-6">
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Заявитель направляет в Центральную комиссию по биоэтике заявление о создании биобанка и соответствующий пакет документов.</li>
                <li>Центральная комиссия по биоэтике рассматривает заявление и пакет документов о создании биобанка в течение 30 (тридцати) календарных дней после получения запроса.</li>
                <li>При необходимости Центральная комиссия по биоэтике запрашивает у исследовательского центра разъяснения по конкретным положениям в представленном перечне документов. Время, необходимое для представления исследовательским центром данных не входит в сроки рассмотрения заявления Центральной комиссией и не превышает 60 календарных дней.</li>
              </ol>
            </div>

            <div className="w-full mb-6">
              <p className="text-gray-700 mb-3">
                Центральная комиссия по биоэтике принимает решение:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>одобрить создание биобанка;</li>
                <li>направление на доработку заявки на создание биобанка;</li>
                <li>отказ в выдаче одобрения на создание биобанка.</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full">
              {t('directionsPages.bioethicsSubpages.biobanks.packagesTitle')}
            </h3>

            <div className="w-full mb-6">
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>заявление с указанием наименования биобанка;</li>
                <li>юридические и финансовые реквизиты владельца биобанка;</li>
                <li>информацию о местоположении и способах хранения и кодирования биологических образцов, а также данных, связанных с этими образцами, и условия управления этими данными;</li>
                <li>описание области (областей) деятельности биобанка, принципов и условий, которые применяются при сборе и хранении биологических образцов и данных; предоставления доступа к ним для целей исследований и другого использования биологических образцов, информации и ограничений, касающихся использования биологических образцов;</li>
                <li>утвержденные формы информированного согласия;</li>
                <li>информацию о процедурах учета, уничтожения биологических образцов и персональных данных;</li>
                <li>информацию о наличии обученного персонала, отвечающего за сбор и хранение биологических образцов и данных, предоставления доступа к ним, проведение исследований.</li>
              </ol>
            </div>

            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('directionsPages.bioethicsSubpages.biobanks.monitoringTitle')}
              </h3>
              <p className="text-gray-700 mb-3">
                Деятельность биобанка подлежит внешнему мониторингу со стороны Центральной комиссии по биоэтике один раз в 5 лет.
              </p>
              <p className="text-gray-700 mb-3">
                При принятии исследовательским центром решения о закрытии биобанка или уничтожении биологических образцов, персональных данных, хранящихся в биобанке, исследовательский центр должен известить Центральную комиссию по биоэтике.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <FilesAccord 
                folder={t('directionsPages.bioethicsSubpages.biobanks.folder')}
                title={t('directionsPages.bioethicsSubpages.biobanks.documentsTitle')}
                bgColor="bg-blue-200"
                defaultOpen={true}
            />
        </div>
    </section>
    </>
  )
}

BioethicsBiobanks.layout = page => <LayoutFolderChlank    
  h1={translationService.t('directionsPages.bioethicsSubpages.biobanks.h1')}
  title="Биобанки"
  parentRoute={route('bioethics')}
  parentName={translationService.t('directionsPages.bioethicsSubpages.biobanks.parentName')}
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  buttonBorderColor="border-blue-200"
  breadcrumbs={[
    { name: translationService.t('directionsPages.bioethicsSubpages.biobanks.breadcrumbDirections'), route: 'directions' },
    { name: translationService.t('directionsPages.bioethicsSubpages.biobanks.breadcrumbBioethics'), route: 'bioethics' },
    { name: translationService.t('directionsPages.bioethicsSubpages.biobanks.h1'), route: null }
  ]}
>{page}</LayoutFolderChlank>
