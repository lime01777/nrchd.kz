import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Pavlodar() {
    const title = "Павлодарский филиал";
    const description = "Павлодарский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
