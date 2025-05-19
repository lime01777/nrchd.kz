import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function Documents() {

  return (
    <>
      <Head title="Информационная система Каталог образовательных программ дополнительного образования в сфере здравоохранения" />
      <section className="text-gray-600 body-font pt-8 pb-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="lg:w-full md:w-full px-4 mb-6 md:mb-0">
              <div className="h-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Проведение экспертизы образовательных программ</h2>
                <p className="text-gray-700 mb-4">
                  Проведение экспертизы образовательной программы (ОП) для включения ОП ДО в Каталог осуществляется на основании заключенного с заявителем договора об оказании услуг.
                </p>
                
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">№</th>
                        <th className="py-2 px-3 border-b border-r text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Наименование товара, работ, услуг</th>
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Ед. измерения</th>
                        <th className="py-2 px-3 border-b border-r text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Кол-во</th>
                        <th className="py-2 px-3 border-b text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Цена в тенге (с учетом НДС)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 border-b border-r text-center">1</td>
                        <td className="py-2 px-3 border-b border-r text-sm">Научно-исследовательская работа по проведению экспертизы образовательных программ дополнительного образования в части сертификационных курсов</td>
                        <td className="py-2 px-3 border-b border-r text-center">Услуга</td>
                        <td className="py-2 px-3 border-b border-r text-center">1</td>
                        <td className="py-2 px-3 border-b text-center">Бесплатно (по протоколу утверждения программы на УМО РУМС)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 border-b border-r text-center">2</td>
                        <td className="py-2 px-3 border-b border-r text-sm">Научно-исследовательская работа по проведению экспертизы образовательных программ дополнительного образования в части курсов повышения квалификации</td>
                        <td className="py-2 px-3 border-b border-r text-center">Услуга</td>
                        <td className="py-2 px-3 border-b border-r text-center">1</td>
                        <td className="py-2 px-3 border-b text-center">93 200 тг</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Для включения образовательной программы дополнительного образования в сфере здравоохранения в ИС «Каталог образовательных программ ДО» необходимо пройти экспертизу в ННЦРЗ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="text-gray-600 body-font pb-24">
        <div className="container px-5 mx-auto">
          <div className="flex flex-wrap -m-4">
            <FilesAccord
              folder="MedicalEducation/Documents" 
              title="Информационная система Каталог образовательных программ дополнительного образования в сфере здравоохранения" 
              bgColor="bg-green-50"
              defaultOpen={true}
            />
          </div>
        </div>
      </section>
      
    </>
  )
}

Documents.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Информационная система Каталог образовательных программ дополнительного образования в сфере здравоохранения" 
  parentRoute={route('direction.medical.education')} 
  parentName="Медицинское образование"
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  breadcrumbs={[
    { name: 'Направления', route: 'directions' },
    { name: 'Медицинское образование', route: 'direction.medical.education' },
    { name: 'Информационная система Каталог образовательных программ дополнительного образования в сфере здравоохранения', route: null }
  ]}
  children={page}
/>
