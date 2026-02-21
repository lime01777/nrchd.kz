import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function Zhetisu() {
    const title = translationService.t('branchesPages.zhetisu.title', 'Территориальный департамент области Жетысу');
    const description = translationService.t('branchesPages.zhetisu.description', 'Жетысуский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Жетысуской области. Территориальный департамент координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Zhetisu"
        />
    );
}