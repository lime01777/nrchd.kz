import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Mangistau() {
    const title = translationService.t('branchesPages.mangistau.title', 'Филиал области Мангистау');
    const description = translationService.t('branchesPages.mangistau.description', 'Мангистауский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Мангистауской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества оказываемых услуг и реализует образовательные программы для медицинских работников региона.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Mangistau"
        />
    );
}