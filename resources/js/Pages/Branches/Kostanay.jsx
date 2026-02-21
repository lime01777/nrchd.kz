import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function Kostanay() {
    const title = translationService.t('branchesPages.kostanay.title', 'Территориальный департамент области Костанай');
    const description = translationService.t('branchesPages.kostanay.description', 'Костанайский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Костанайской области. Территориальный департамент проводит мониторинг и анализ деятельности медицинских организаций, реализует образовательные программы и консультативно-методическую помощь медицинским организациям региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Kostanay"
        />
    );
}
