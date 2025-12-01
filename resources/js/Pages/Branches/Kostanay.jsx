import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Kostanay() {
    const title = translationService.t('branchesPages.kostanay.title', 'Филиал области Костанай');
    const description = translationService.t('branchesPages.kostanay.description', 'Костанайский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Костанайской области. Филиал проводит мониторинг и анализ деятельности медицинских организаций, реализует образовательные программы и консультативно-методическую помощь медицинским организациям региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Kostanay"
        />
    );
}
