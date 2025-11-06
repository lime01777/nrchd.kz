import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = translationService.t('branchesPages.almaty.title', 'Алматинский филиал');
const description = translationService.t('branchesPages.almaty.description', 'Алматинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ключевым центром научно-методической поддержки медицинских организаций города Алматы. Филиал осуществляет экспертно-аналитическую деятельность, проводит образовательные мероприятия и активно участвует в реализации государственных программ в области здравоохранения.');

// Данные руководства филиала
const leaders = [
    {
        name: "Досмухаметов Аскар Бахытжанович",
        position: "Директор Алматинского филиала",
        photo: "/img/leadership/placeholder.jpg",
        phone: "+7 (727) 250-00-00",
        email: "almaty@nrchd.kz",
        bio: "Доктор медицинских наук, профессор. Автор более 50 научных работ и 5 монографий по вопросам организации здравоохранения."
    },
    {
        name: "Исмаилова Динара Нурлановна",
        position: "Заместитель директора по научной работе",
        photo: "/img/leadership/placeholder.jpg",
        phone: "+7 (727) 250-00-01",
        email: "d.ismailova@nrchd.kz",
        bio: "Кандидат медицинских наук, доцент. Эксперт в области доказательной медицины и клинических исследований."
    },
    {
        name: "Байгазиев Ерлан Бахытович",
        position: "Заместитель директора по организационно-методической работе",
        photo: "/img/leadership/placeholder.jpg",
        phone: "+7 (727) 250-00-02",
        email: "e.baigaziev@nrchd.kz",
        bio: "Магистр общественного здравоохранения. Специалист в области менеджмента здравоохранения."
    }
];

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
        </>
    );
}

Almaty.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Almaty"
    leaders={leaders}
>{page}</LayoutBranch>
