import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Zhetisu() {
    const title = translationService.t('branchesPages.zhetisu.title', 'Жетысуский филиал');
    const description = translationService.t('branchesPages.zhetisu.description', 'Жетысуский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Жетысуской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Джумагалиев Бахытжан Аманжолович",
            position: "Директор Жетысуского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7282) 24-00-00",
            email: "zhetisu@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере здравоохранения более 15 лет."
        },
        {
            name: "Турсынбекова Асель Сериковна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7282) 24-00-01",
            email: "a.tursynbekova@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области медицинской статистики и анализа данных."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Zhetisu"
            leaders={leaders}
        />
    );
}