import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function North() {
    const title = "Северо-Казахстанский филиал";
    const description = "Северо-Казахстанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Северо-Казахстанской области. Филиал координирует деятельность медицинских учреждений региона, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Есенбаев Нурлан Болатович",
            position: "Директор Северо-Казахстанского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7152) 46-00-00",
            email: "north@nrchd.kz",
            bio: "Кандидат медицинских наук. Более 15 лет опыта работы в сфере организации и управления здравоохранением."
        },
        {
            name: "Мухамеджанова Аида Сакеновна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7152) 46-00-01",
            email: "a.mukhamedzhanova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области организации первичной медицинской помощи."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="North"
            leaders={leaders}
        />
    );
}
