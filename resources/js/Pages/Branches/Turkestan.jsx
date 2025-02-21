import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Turkestan() {
    const title = "Туркестанский филиал";
    const description = "Туркестанский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
