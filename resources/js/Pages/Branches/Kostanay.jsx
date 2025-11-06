import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Kostanay() {
    const title = translationService.t('branchesPages.kostanay.title', 'Костанайский филиал');
    const description = translationService.t('branchesPages.kostanay.description', 'Костанайский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Костанайской области. Филиал проводит мониторинг и анализ деятельности медицинских организаций, реализует образовательные программы и консультативно-методическую помощь медицинским организациям региона.');
    
    // Данные руководства филиала
    const leaders = [
        {
            name: "Алибеков Дамир Жанатович",
            position: "Директор Костанайского филиала",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7142) 54-00-00",
            email: "kostanay@nrchd.kz",
            bio: "Кандидат медицинских наук. Опыт работы в сфере организации здравоохранения более 15 лет."
        },
        {
            name: "Калиева Айгуль Сериккалиевна",
            position: "Заместитель директора",
            photo: "/storage/leadership/placeholder.jpg",
            phone: "+7 (7142) 54-00-01",
            email: "a.kalieva@nrchd.kz",
            bio: "Магистр общественного здравоохранения. Специалист в области управления качеством медицинских услуг."
        }
    ];
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Kostanay"
            leaders={leaders}
        />
    );
}
