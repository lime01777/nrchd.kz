import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';
import BranchContactInfo from '@/Components/BranchContactInfo';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = translationService.t('branchesPages.astana.title', 'Филиал города Астана');
const description = translationService.t('branchesPages.astana.description', 'Астанинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ведущим региональным центром в сфере развития здравоохранения. Филиал координирует научно-исследовательскую деятельность медицинских организаций города, внедряет инновационные подходы в сфере управления здравоохранением и оказывает консультативно-методическую помощь медицинским организациям столицы.');

export default function Astana() {
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
            <BranchContactInfo branchFolder="Astana" title={title} />
        </>
    );
}

Astana.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Astana"
>{page}</LayoutBranch>
