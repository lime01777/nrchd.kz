import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Mangistau() {
    const title = "Мангистауский филиал";
    const description = "Мангистауский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
