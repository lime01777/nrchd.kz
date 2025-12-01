import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';
import BranchContactInfo from '@/Components/BranchContactInfo';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = translationService.t('branchesPages.almaty.title', 'Филиал города Алматы');
const description = translationService.t('branchesPages.almaty.description', 'Алматинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ключевым центром научно-методической поддержки медицинских организаций города Алматы. Филиал осуществляет экспертно-аналитическую деятельность, проводит образовательные мероприятия и активно участвует в реализации государственных программ в области здравоохранения.');

export default function Almaty() {
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
            <BranchContactInfo branchFolder="Almaty" title={title} />
        </>
    );
}

Almaty.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Almaty"
>{page}</LayoutBranch>
