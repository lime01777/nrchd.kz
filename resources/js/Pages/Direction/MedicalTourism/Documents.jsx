import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';
import translationService from '@/services/TranslationService';

export default function MedicalTourismDocuments() {
  const t = (key, fallback = '') => translationService.t(key, fallback);
  
  return (
    <>
      <Head title={t('directionsPages.medicalTourismSubpages.documents.title', 'Документы')} />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className='flex flex-wrap px-12 text-justify mb-8'>
            <p className="tracking-wide leading-relaxed">
              В данном разделе представлены основные документы, регламентирующие деятельность в сфере 
              медицинского туризма в Казахстане. Эти документы содержат информацию о стандартах качества, 
              процедурах сертификации, правах и обязанностях участников медицинского туризма.
            </p>
          </div>
          
          <div className="px-8 mb-12">
            <FilesAccord
              title="Нормативные документы"
              items={[
                { title: 'Концепция развития медицинского туризма в Республике Казахстан', description: 'PDF, 2.3 МБ' },
                { title: 'Правила оказания медицинских услуг иностранным гражданам', description: 'PDF, 1.8 МБ' },
                { title: 'Стандарты качества медицинских услуг для иностранных пациентов', description: 'PDF, 1.5 МБ' },
                { title: 'Порядок сертификации медицинских организаций для медицинского туризма', description: 'PDF, 2.1 МБ' },
                { title: 'Требования к инфраструктуре медицинских организаций', description: 'PDF, 1.2 МБ' }
              ]}
            />
            

          </div>
        </div>
      </section>
    </>
  );
}

MedicalTourismDocuments.layout = page => <LayoutFolderChlank 
  h1="Документы" 
  parentRoute={route('medical.tourism')}
  parentName="Медицинский туризм" 
  heroBgColor="bg-green-100"
  buttonBgColor="bg-green-100"
  buttonHoverBgColor="hover:bg-green-200"
  buttonBorderColor="border-green-200"
  >{page}</LayoutFolderChlank>;
