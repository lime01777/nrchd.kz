import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Turkestan() {
    const title = "Туркестанский филиал";
    const description = "Туркестанский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение системы здравоохранения Туркестанской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Алиев Дамир Талгатович",
            position: "Директор Туркестанского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (72533) 7-00-00",
            email: "turkestan@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в системе здравоохранения более 14 лет."
        },
        {
            name: "Искакова Гульназ Толегеновна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (72533) 7-00-01",
            email: "g.iskakova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области организации здравоохранения и эпидемиологии."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Turkestan"
            leaders={leaders}
        />
    );
}
