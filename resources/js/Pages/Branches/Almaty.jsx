import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Almaty() {
    const title = "Алматинский филиал";
    const description = "Алматинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ключевым центром научно-методической поддержки медицинских организаций города Алматы. Филиал осуществляет экспертно-аналитическую деятельность, проводит образовательные мероприятия и активно участвует в реализации государственных программ в области здравоохранения.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Досмухаметов Аскар Бахытжанович",
            position: "Директор Алматинского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (727) 250-00-00",
            email: "almaty@nrchd.kz",
            bio: "Доктор медицинских наук, профессор. Автор более 50 научных работ и 5 монографий по вопросам организации здравоохранения."
        },
        {
            name: "Исмаилова Динара Нурлановна",
            position: "Заместитель директора по научной работе",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (727) 250-00-01",
            email: "d.ismailova@nrchd.kz",
            bio: "Кандидат медицинских наук, доцент. Эксперт в области доказательной медицины и клинических исследований."
        },
        {
            name: "Байгазиев Ерлан Бахытович",
            position: "Заместитель директора по организационно-методической работе",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (727) 250-00-02",
            email: "e.baigaziev@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области менеджмента здравоохранения."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Almaty"
            leaders={leaders}
        />
    );
}
