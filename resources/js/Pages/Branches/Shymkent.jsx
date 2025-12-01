import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Shymkent() {
    const title = translationService.t('branchesPages.shymkent.title', 'Филиал города Шымкент');
    const description = translationService.t('branchesPages.shymkent.description', 'Шымкентский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой является ключевым центром научно-методической поддержки медицинских организаций города Шымкент. Филиал координирует деятельность медицинских учреждений, проводит мониторинг качества медицинских услуг и реализует образовательные программы для медицинских работников.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Shymkent"
        />
    );
}
