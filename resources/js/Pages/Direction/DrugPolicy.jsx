import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FilesAccord from '@/Components/FilesAccord';
import FolderChlank from '@/Components/FolderChlank';
import FAQ from '@/Components/FAQ';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};


export default function DrugPolicy() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

  const faqItems = [
    {
      question: "Перечни возмещения в рамках ГОБМП и ОСМС",
      answer: (
        <div className="space-y-2">
          <div className="flex flex-col space-y-4">
            <a href="https://adilet.zan.kz/rus/docs/V2100022782" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              КНФ - Казахстанский национальный лекарственный формуляр
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2000021479" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень орфанных заболеваний и лекарственных средств
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100024078" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень закупа ЕД (единого дистрибьютора)
            </a>
            
            <a href="https://adilet.zan.kz/rus/docs/V2100023885" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Перечень АЛО (амбулаторного лекарственного обеспечения)
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня ЕД
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования КНФ
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2100023783" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня АЛО (утратили силу)
            </a>

            <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Правила формирования перечня орфанных заболеваний и ЛС
            </a>
          </div>
        </div>
      )
    },
    {
      question: "Правила формирования перечней",
      answer: (
        <div className="space-y-2">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021454" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 16 октября 2020 года № ҚР ДСМ-135/2020 «Об утверждении правил формирования перечня орфанных заболеваний и лекарственных средств для их лечения»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021913" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ и.о. Министра здравоохранения Республики Казахстан от 24 декабря 2020 года № ҚР ДСМ-326/2020 «Об утверждении правил формирования Казахстанского национального лекарственного формуляра, а также правил разработки лекарственных формуляров организаций здравоохранения»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2000021910" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ и.о. Министра здравоохранения Республики Казахстан от 24 декабря 2020 года № ҚР ДСМ-324/2020 «Об утверждении правил формирования перечня закупа лекарственных средств и медицинских изделий в рамках гарантированного объема бесплатной медицинской помощи и (или) в системе обязательного социального медицинского страхования»
              </a>
            </li>
            <li>
              <a href="https://adilet.zan.kz/rus/docs/V2100023783#z120" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Приказ Министра здравоохранения Республики Казахстан от 29 июля 2021 года № ҚР ДСМ-68 «Об утверждении Правил формирования перечня лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан Республики Казахстан с определенными заболеваниями (состояниями)»
              </a>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: "Нормативно-правовая база",
      answer: (
        <div className="space-y-2">
          <p>
            <a href="https://adilet.zan.kz/rus/docs/K2000000360" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК «О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ»
            </a>
          </p>
          <p className="mt-3">
            Данный Кодекс регулирует общественные отношения в области здравоохранения с целью реализации конституционного права граждан на охрану здоровья.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <Head title="Лекарственная политика" meta={[{ name: 'description', content: 'Лекарственная политика: перечни возмещения, правила формирования и нормативно-правовая база в сфере здравоохранения.' }]} />
      
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify'>
            <p className="tracking-wide leading-relaxed mb-4">
              Лекарственная политика является важнейшим компонентом системы здравоохранения, направленным на обеспечение населения качественными, безопасными и эффективными лекарственными средствами. Национальный научный центр развития здравоохранения имени Салидат Каирбековой играет ключевую роль в формировании и реализации лекарственной политики в Республике Казахстан.
            </p>
            
            <p className="tracking-wide leading-relaxed mb-4">
              Основными направлениями работы в области лекарственной политики являются:
            </p>
            
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Формирование и обновление перечней лекарственных средств в рамках гарантированного объема бесплатной медицинской помощи (ГОБМП) и обязательного социального медицинского страхования (ОСМС)</li>
              <li>Разработка и совершенствование правил формирования лекарственных перечней</li>
              <li>Проведение экспертизы лекарственных средств и медицинских изделий</li>
              <li>Мониторинг эффективности и безопасности лекарственных средств</li>
              <li>Разработка методических рекомендаций по рациональному использованию лекарственных средств</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
          <div className='flex flex-wrap'>
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title="Регламенты" 
              description="Нормативно-правовые акты в области лекарственной политики"
              href={route('drug.policy.regulations')}
            />
            <FolderChlank 
              color="bg-gray-200"
              colorsec="bg-gray-300"
              title="Комиссия" 
              description="Информация о комиссии по лекарственной политике"
              href={route('drug.policy.commission')}
            />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font py-12 bg-gray-50">
        <div className="container px-5 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Часто задаваемые вопросы</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ответы на наиболее частые вопросы по лекарственной политике
            </p>
          </div>
          <FAQ items={faqItems} />
        </div>
      </section>
    </>
  );
}

DrugPolicy.layout = (page) => <LayoutDirection img="drugpolicy" h1={t('directions.drug_policy', 'Лекарственная политика')}>{page}</LayoutDirection>;
