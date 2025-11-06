import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Shymkent() {
    const title = translationService.t('branchesPages.shymkent.title', 'Шымкентский филиал');
    const description = translationService.t('branchesPages.shymkent.description', 'Шымкентский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ключевым центром научно-методической поддержки медицинских организаций города Шымкент. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Туребеков Марат Ерланович",
            position: "Директор Шымкентского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7252) 53-00-00",
            email: "shymkent@nrchd.kz",
            bio: "Доктор медицинских наук, профессор. Автор более 60 научных работ и 3 монографий."
        },
        {
            name: "Абдрахманова Айгуль Сабитовна",
            position: "Заместитель директора по научной работе",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7252) 53-00-01",
            email: "a.abdrakhmanova@nrchd.kz",
            bio: "Кандидат медицинских наук. Специалист в области эпидемиологии и организации здравоохранения."
        },
        {
            name: "Калыбекова Динара Талгатовна",
            position: "Заместитель директора по организационно-методической работе",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7252) 53-00-02",
            email: "d.kalybekova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области управления медицинскими организациями."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Shymkent"
            leaders={leaders}
        />
    );
}
