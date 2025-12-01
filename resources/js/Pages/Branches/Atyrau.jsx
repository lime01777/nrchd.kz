import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Atyrau() {
    const title = translationService.t('branchesPages.atyrau.title', 'Филиал области Атырау');
    const description = translationService.t('branchesPages.atyrau.description', 'Атырауский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет координацию деятельности медицинских организаций Атырауской области. Филиал занимается внедрением современных методов управления здравоохранением, проводит мониторинг качества медицинских услуг и участвует в реализации государственных программ в области здравоохранения.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Atyrau"
        />
    );
}
