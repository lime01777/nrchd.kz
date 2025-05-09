import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Abay() {
    const title = "Филиал области Абай";
    const description = "Филиал области Абай занимается координацией и реализацией государственной политики в сфере здравоохранения на территории области Абай. Филиал осуществляет мониторинг качества медицинских услуг, проводит анализ состояния здоровья населения и разрабатывает рекомендации по улучшению системы здравоохранения в регионе.";

    return (
        <BranchTemplate title={title} description={description} />
    );
}
