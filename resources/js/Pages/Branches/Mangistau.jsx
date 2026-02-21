import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/Services/TranslationService';

export default function Mangistau() {
    const title = translationService.t('branchesPages.mangistau.title', 'Территориальный департамент области Мангистау');
    const description = translationService.t('branchesPages.mangistau.description', 'Мангистауский территориальный департамент Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Мангистауской области. Территориальный департамент координирует деятельность медицинских учреждений, проводит мониторинг качества оказываемых услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Mangistau"
        />
    );
}