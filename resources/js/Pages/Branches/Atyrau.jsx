import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Atyrau() {
    const title = "Атырауский филиал";
    const description = "Атырауский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
