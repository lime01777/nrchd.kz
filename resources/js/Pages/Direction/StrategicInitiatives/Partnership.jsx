import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import PageAccordions from '@/Components/PageAccordions';

export default function Partnership() {
  return (
    <>
      <Head title="Партнерство - Стратегические инициативы" />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full">Международное партнерство</h2>
            <p className="tracking-wide leading-relaxed mb-4">
              Национальный научный центр развития здравоохранения имени Салидат Каирбековой активно развивает 
              партнерские отношения с ведущими международными организациями здравоохранения, научными и 
              образовательными учреждениями разных стран.
            </p>
            <p className="tracking-wide leading-relaxed mb-4">
              Партнерство с международными организациями позволяет Центру обмениваться опытом, внедрять 
              лучшие мировые практики в систему здравоохранения Казахстана, участвовать в глобальных 
              инициативах по улучшению здоровья населения.
            </p>
          </div>
          
          <div className="flex flex-wrap px-12 text-justify mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full">Ключевые международные партнеры:</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 w-full">
              <li>
                <strong>Всемирная организация здравоохранения (ВОЗ)</strong> - сотрудничество в области 
                разработки политики здравоохранения, обмена опытом и экспертизы, участие в глобальных 
                программах по борьбе с инфекционными и неинфекционными заболеваниями.
              </li>
              <li>
                <strong>ЮНИСЕФ</strong> - совместные проекты по охране здоровья матери и ребенка, 
                вакцинации и питанию, развитию педиатрической службы.
              </li>
              <li>
                <strong>Всемирный банк</strong> - проекты по модернизации системы здравоохранения и 
                повышению эффективности медицинских услуг, финансирование инфраструктурных проектов.
              </li>
              <li>
                <strong>Европейское региональное бюро ВОЗ</strong> - сотрудничество по вопросам 
                общественного здравоохранения, профилактики заболеваний, укрепления систем здравоохранения.
              </li>
              <li>
                <strong>Программа развития ООН (ПРООН)</strong> - проекты по устойчивому развитию 
                здравоохранения, доступу к медицинским услугам, борьбе с ВИЧ/СПИД и туберкулезом.
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <PageAccordions />
    </>
  );
}

Partnership.layout = page => <LayoutFolderChlank 
  h1="Международное партнерство" 
  parentRoute={route('strategic.initiatives')} 
  parentName="Стратегические инициативы и международное сотрудничество"
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
>{page}</LayoutFolderChlank>;
