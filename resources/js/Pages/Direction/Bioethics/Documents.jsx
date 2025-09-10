import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import SimpleFileDisplay from '@/Components/SimpleFileDisplay';

export default function BioethicsDocuments() {
  return (
    <>
      <Head title='Документы по биоэтике' />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Документы по биоэтике</h2>
            
            {/* Порядок подачи заявки */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Порядок подачи заявки на проведение биоэтической экспертизы
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Заявка на биоэтическую экспертизу подается не позднее, чем за <strong>30 рабочих дней</strong> до ближайшего заседания Центральной комиссии по биоэтике МЗ РК в соответствии с графиком заседаний.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Заявка и сопроводительные документы подаются в Секретариат Комиссии и регистрируются при условии полноты представленных документов.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Заявка рассматривается в течение <strong>14 дней</strong> с момента проведения оплаты за этическую экспертизу.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">4</span>
                    <span>Все процедуры осуществляются в соответствии с подзаконными актами и стандартными операционными процедурами Центральной комиссии по биоэтике.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Пакет документов */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Пакет документов для биоэтической экспертизы
              </h3>

              {/* Интервенционное исследование */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 bg-green-100 p-3 rounded-lg border-l-4 border-green-500">
                  Интервенционное клиническое исследование
                </h4>
                <p className="text-gray-700 mb-4">
                  Для получения одобрения клинического исследования заявитель подает в Секретариат ЦКБ следующие документы в бумажном и электронном вариантах:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>заявку на проведение клинического исследования по форме с сопроводительным письмом;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>протокол клинического исследования (оригинал или копию), подписанный спонсором или его уполномоченным представителем и исследователем;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>синопсис протокола клинического исследования для международных исследований на государственном и/или русском языках;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>брошюру исследователя, составленную с учетом стадии разработки образца для клинического исследования;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>инструкцию (проект) по медицинскому применению лекарственного средства, изделия медицинского назначения или медицинской техники;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>информацию для субъекта исследования о клиническом исследовании на государственном и русском языках;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>форму информированного согласия субъектов исследования на государственном и русском языках;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>резюме исследователя, подтверждающее его квалификацию и сертификат о прохождении курсов GCP;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>сведения о клинических базах/сайтах;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>доверенность, выданную спонсором с четко определенными делегированными полномочиями, если заявитель клинического испытания не является спонсором;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>информацию, касающуюся мероприятий по набору субъектов исследования (материалы информационного и рекламного характера, которые будут использоваться для привлечения субъектов исследования к клиническому исследованию (при наличии) на государственном и русском языках);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>копию (или проект) договора страхования гражданско-правовой ответственности спонсора за причинение вреда здоровью и жизни субъектам исследования;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>документ, определяющий условия выплаты вознаграждения или компенсации субъектам исследования за участие в клиническом исследовании (если это предусмотрено протоколом клинического исследования);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>опись предоставляемых документов.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Неинтервенционное исследование */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 bg-purple-100 p-3 rounded-lg border-l-4 border-purple-500">
                  Неинтервенционное исследование
                </h4>
                <p className="text-gray-700 mb-4">
                  Для проведения неинтервенционного клинического исследования заявитель подает в Секретариат Комиссии следующие документы в бумажном и электронном вариантах:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>заявку на проведение клинического исследования (в бумажном и электронном вариантах) по прилагаемой форме с сопроводительным письмом;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>резюме исследователя, подтверждающее его квалификацию и сертификат о прохождении курсов GCP;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>копию регистрационного удостоверения на лекарственное средство;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>копию инструкции по медицинскому применению (утвержденный вариант);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>протокол клинического исследования, подписанный спонсором или уполномоченным представителем спонсора;</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>информацию для субъектов исследования о клиническом исследовании на государственном и русском языках (если это требуется по протоколу);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>форму информированного согласия субъекта исследования на государственном и русском языках (если это требуется по протоколу);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>образец индивидуальной регистрационной формы на бумажном носителе (если это требуется по протоколу);</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>опись предоставляемых документов.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>


            
            <div className="space-y-6">
              {/* Документы по биоэтике */}
              <SimpleFileDisplay
                title="documents\Bioethics\Documents"
                folderPath="Bioethics/Documents"
                bgColor="bg-blue-50"
                textColor="text-blue-800"
                borderColor="border-blue-200"
              />

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BioethicsDocuments.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Документы по биоэтике" 
  parentRoute="/bioethics" 
  parentName="Центральная комиссия по биоэтике"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;
