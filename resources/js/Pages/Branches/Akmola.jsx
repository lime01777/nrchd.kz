import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';

export default function Akmola() {
    // Используем переменные с data-translate атрибутом в шаблоне
const title = "Акмолинский филиал";
    const description = "Акмолинский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Акмолинской области, проводит мониторинг и оценку качества медицинских услуг, участвует в разработке и внедрении инновационных методов организации медицинской помощи населению.";
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Жумагулов Талгат Куанышевич",
            position: "Директор Акмолинского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7162) 55-30-00",
            email: "akmola@nrchd.kz",
            bio: "Доктор медицинских наук. Автор более 30 научных работ по организации здравоохранения."
        },
        {
            name: "Сарсенбаева Гульнара Жанабековна",
            position: "Заместитель директора по организационно-методической работе",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7162) 55-30-01",
            email: "g.sarsenbaeva@nrchd.kz",
            bio: "Кандидат медицинских наук. Эксперт в области общественного здравоохранения."
        }
    ];
    
    return (
        <BranchTemplate 
            img={'branch'}
            overlay={0.8}
            title={<span className="text-primary">{title}</span>} 
            description={description}
            branchFolder="Akmola"
            leaders={leaders}
        />
    );
}
