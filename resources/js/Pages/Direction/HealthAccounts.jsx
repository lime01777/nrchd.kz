import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';
import HealthAccountsDashboard from './HealthAccounts/HealthAccountsDashboard';
import HealthAccountsTabs from './HealthAccounts/HealthAccountsTabs';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function HealthAccounts() {

  return (
    <>
    <Head title={t('directionsPages.healthAccounts.title', 'Национальные счета здравоохранения')} />
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">

        {/* Детальное описание направления Национальных счетов здравоохранения */}
        <div className="flex flex-wrap px-12 text-justify text-gray-700 leading-relaxed space-y-6">
          <div>
            <p>
              {t(
                'directionsPages.healthAccounts.description.paragraph1',
                'Национальными счетами здравоохранения является система регулярного, всестороннего и последовательного мониторинга финансовых потоков в системе здравоохранения страны, используемая для оценки распределения ресурсов здравоохранения с целью их равного и эффективного распределения между мерами, направленными на предупреждение заболеваний и лечение населения.'
              )}
            </p>
          </div>
          <div>
            <p>
              {t(
                'directionsPages.healthAccounts.description.paragraph2Intro',
                'Национальные счета здравоохранения формируются ежегодно на основе международной методологии с использованием следующих источников данных:'
              )}
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              {[
                t(
                  'directionsPages.healthAccounts.description.paragraph2List1',
                  'статистические бюллетени уполномоченного органа в области государственной статистики;'
                ),
                t(
                  'directionsPages.healthAccounts.description.paragraph2List2',
                  'данные центрального уполномоченного органа по исполнению бюджета;'
                ),
                t(
                  'directionsPages.healthAccounts.description.paragraph2List3',
                  'данные местных уполномоченных органов по исполнению бюджета в разрезе медицинских организаций;'
                ),
                t(
                  'directionsPages.healthAccounts.description.paragraph2List4',
                  'статистические данные, опубликованные на официальных интернет-ресурсах Национального Банка Республики Казахстан, Всемирной организации здравоохранения и Организации экономического сотрудничества и развития.'
                ),
              ].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <p className="mt-4">
              {t(
                'directionsPages.healthAccounts.description.paragraph2Conclusion',
                'На основе указанных данных уполномоченный орган формирует аналитический отчет с описанием расходов в разрезе услуг и поставщиков медицинских услуг, а также информацию об источниках их финансирования.'
              )}
            </p>
          </div>
          <div>
            <p>
              {t(
                'directionsPages.healthAccounts.description.paragraph3',
                'Порядок формирования и использования данных национальных счетов здравоохранения определяется уполномоченным органом.'
              )}
            </p>
            <p className="mt-4">
              {t(
                'directionsPages.healthAccounts.description.paragraph4',
                'Таблицы НСЗ – это сводные формы отчетных данных, сгруппированных по доходам схем финансирования, источникам расходов на здравоохранение, основным поставщикам медицинских услуг, функциям поставщиков здравоохранения (услугам здравоохранения) и по заболеваниям.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        {/* Используем именованный маршрут подпапки с документами */}
        <FolderChlank 
          color="bg-gray-200"
          colorsec="bg-gray-300"
          title={t('directionsPages.healthAccounts.subfolders.documents.title')} 
          description={t('directionsPages.healthAccounts.subfolders.documents.description')}
          href={route('health.accounts.documents')}
        />
      </div>
    </section>
    
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        {/* Дашборд с ключевыми финансовыми показателями */}
        <HealthAccountsDashboard t={t} />
      </div>
    </section>

    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        {/* Табличные данные с вкладками */}
        <HealthAccountsTabs t={t} />
      </div>
    </section>

    </>
  );
}

HealthAccounts.layout = (page) => <LayoutDirection img="account" h1={t('directions.health_accounts', 'Национальные счета здравоохранения')}>{page}</LayoutDirection>;
