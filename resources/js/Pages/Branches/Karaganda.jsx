import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';
import BranchContactInfo from '@/Components/BranchContactInfo';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = translationService.t('branchesPages.karaganda.title', 'Территориальный департамент области Караганда');
const description = translationService.t('branchesPages.karaganda.description', 'Карагандинский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой координирует работу медицинских организаций Карагандинской области. Территориальный департамент осуществляет научно-методическое сопровождение, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');

export default function Karaganda() {
    return (
        <>
            <Head title={title} />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-wrap px-12 text-justify">
                        <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </section>
            <BranchContactInfo branchFolder="Karaganda" title={title} />
        </>
    );
}

Karaganda.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Karaganda"
>{page}</LayoutBranch>
