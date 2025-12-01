import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Zhambyl() {
    const title = translationService.t('branchesPages.zhambyl.title', 'Филиал области Жамбыл');
    const description = translationService.t('branchesPages.zhambyl.description', 'Жамбылский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет научно-методическое сопровождение медицинских организаций Жамбылской области. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Zhambyl"
        />
    );
}
