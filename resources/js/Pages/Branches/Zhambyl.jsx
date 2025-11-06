import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Zhambyl() {
    const title = translationService.t('branchesPages.zhambyl.title', 'Жамбылский филиал');
    const description = translationService.t('branchesPages.zhambyl.description', 'Жамбылский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Жамбылской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Турсунов Даулет Бакытжанович",
            position: "Директор Жамбылского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7262) 45-00-00",
            email: "zhambyl@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 15 лет."
        },
        {
            name: "Сарсенбаева Динара Муратовна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7262) 45-00-01",
            email: "d.sarsenbaeva@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области эпидемиологии и здоровья населения."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Zhambyl"
            leaders={leaders}
        />
    );
}
