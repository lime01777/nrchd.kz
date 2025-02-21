import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Almaty() {
    const title = "Алматинский филиал";
    const description = "Алматинский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
