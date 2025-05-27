import React from 'react';
import LayoutBranch from '@/Layouts/LayoutBranch';
import { Head } from '@inertiajs/react';

// Определение переменных вне компонента, чтобы они были доступны и в layout
const title = "Карагандинский филиал";
const description = "Карагандинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой координирует работу медицинских организаций Карагандинской области. Филиал осуществляет научно-методическое сопровождение, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.";

// Данные руководства филиала
const leaders = [
    {
        name: "Мухамеджанов Берик Турганбаевич",
        position: "Директор Карагандинского филиала",
        photo: "/storage/leadership/placeholder.jpg",
        phone: "+7 (7212) 41-00-00",
        email: "karaganda@nrchd.kz",
        bio: "Доктор медицинских наук, профессор. Автор более 40 научных работ по вопросам организации здравоохранения."
    },
    {
        name: "Амирханова Динара Еркиновна",
        position: "Заместитель директора по научной работе",
        photo: "/storage/leadership/placeholder.jpg",
        phone: "+7 (7212) 41-00-01",
        email: "d.amirkhanova@nrchd.kz",
        bio: "Кандидат медицинских наук. Специалист в области медицинской статистики и общественного здравоохранения."
    },
    {
        name: "Сабитов Тимур Куанышевич",
        position: "Заместитель директора по организационно-методической работе",
        photo: "/storage/leadership/placeholder.jpg",
        phone: "+7 (7212) 41-00-02",
        email: "t.sabitov@nrchd.kz",
        bio: "Магистр здравоохранения. Эксперт в области информатизации здравоохранения и телемедицины."
    }
];

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
        </>
    );
}

Karaganda.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={title} 
    description={description}
    branchFolder="Karaganda"
    leaders={leaders}
>{page}</LayoutBranch>
