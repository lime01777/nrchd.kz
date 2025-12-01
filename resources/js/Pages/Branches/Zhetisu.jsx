import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Zhetisu() {
    const title = translationService.t('branchesPages.zhetisu.title', 'Филиал области Жетысу');
    const description = translationService.t('branchesPages.zhetisu.description', 'Жетысуский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Жетысуской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Zhetisu"
        />
    );
}