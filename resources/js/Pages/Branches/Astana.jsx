import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = "Астанинский филиал";
const description = `Астанинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ведущим региональным центром в сфере развития здравоохранения. Филиал координирует научно-исследовательскую деятельность медицинских организаций города, внедряет инновационные подходы в сфере управления здравоохранением и оказывает консультативно-методическую помощь медицинским организациям столицы.`;

// Данные руководства филиала
const leaders = [
    {
        name: "Сериков Алмаз Булатович",
        position: "Директор Астанинского филиала",
        photo: "/img/leadership/director-astana.jpg",
        phone: "+7 (7172) 70-09-50",
        email: "astana@nrchd.kz",
        bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 15 лет."
    },
    {
        name: "Искакова Айгуль Муратовна",
        position: "Заместитель директора по научной работе",
        photo: "/img/leadership/deputy-astana.jpg",
        phone: "+7 (7172) 70-09-51",
        email: "a.iskakova@nrchd.kz",
        bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и анализа данных."
    }
];

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
        </>
    );
}

Astana.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Astana"
    leaders={leaders}
>{page}</LayoutBranch>
