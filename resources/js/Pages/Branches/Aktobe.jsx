import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Aktobe() {
    const title = "Актюбинский филиал";
    const description = "Актюбинский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
