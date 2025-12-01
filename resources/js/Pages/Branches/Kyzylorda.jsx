import React from 'react';
import BranchTemplate from './BranchTemplate';
import { Head } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

export default function Kyzylorda() {
    const title = translationService.t('branchesPages.kyzylorda.title', 'Филиал области Кызылорда');
    const description = translationService.t('branchesPages.kyzylorda.description', 'Кызылординский филиал Национального научного центра развития здравоохранения имени Салидат Каирбековой осуществляет координацию и методическое сопровождение медицинских организаций Кызылординской области. Филиал проводит мониторинг качества медицинских услуг, реализует образовательные программы и участвует в реализации государственных программ в области здравоохранения.');
    
    return (
        <BranchTemplate 
            title={title} 
            description={description}
            branchFolder="Kyzylorda"
        />
    );
}
