import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import ImportantDoc from '@/Components/ImportantDoc';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FilesAccord from '@/Components/FilesAccord';
import ActualFile from '@/Components/ActualFile';
import FAQ from '@/Components/FAQ';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};


export default function HealthAccounts() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

  return (
    <>
    <Head title={tComponent('directions.health_accounts', 'Национальные счета здравоохранения')} meta={[{ name: 'description', content: 'Национальные счета здравоохранения: статистические данные и мониторинг финансовых потоков в системе здравоохранения Казахстана.' }]} />
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed text-lg text-gray-700">
            Национальные счета здравоохранения – статистическое данное, благодаря которому проводится регулярный, всесторонний и последовательный мониторинг финансовых потоков в системе здравоохранения страны. Это важный инструмент для объективного и рационального распределения ресурсов как для принятия решений, так и личного пользования граждан.
          </p>
        </div>
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <FolderChlank 
          color="bg-gray-200"
          colorsec="bg-gray-300"
          title="Документы Национальных счетов здравоохранения" 
          description="Основные документы и отчеты"
          href={route('health-accounts.documents')}
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <ActualFile 
          folder="Национальные счета/Актуальные файлы" 
          title="Актуальная информация НСЗ" 
          bgColor="bg-purple-100"
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <FilesAccord 
            folder="Национальные счета/Отчеты" 
            title="Отчеты Национальных счетов здравоохранения" 
            bgColor="bg-purple-50"
          />
        </div>
      </div>
    </section>

    </>
  );
}

HealthAccounts.layout = (page) => <LayoutDirection img="account" h1={t('directions.health_accounts', 'Национальные счета здравоохранения')}>{page}</LayoutDirection>;
