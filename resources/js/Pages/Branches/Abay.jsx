import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';
import BranchContactInfo from '@/Components/BranchContactInfo';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = "Филиал области Абай"; // data-translate добавлен в компоненте LayoutBranch
const description = "Филиал области Абай занимается координацией и реализацией государственной политики в сфере здравоохранения на территории области Абай. Филиал осуществляет мониторинг качества медицинских услуг, проводит анализ состояния здоровья населения и разрабатывает рекомендации по улучшению системы здравоохранения в регионе."; // data-translate добавлен в разметке страницы

export default function Abay() {
    return (
        <>
            <Head title={title} />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-wrap px-12 text-justify">
                        <p className="mb-4 tracking-wide text-gray-700 leading-relaxed" data-translate>
                            {description}
                        </p>
                    </div>
                </div>
            </section>
            <BranchContactInfo branchFolder="Abay" title={title} />
        </>
    );
}

Abay.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Abay"
>{page}</LayoutBranch>