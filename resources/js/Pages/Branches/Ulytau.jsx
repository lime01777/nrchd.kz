import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Ulytau() {
    const title = "Улытауский филиал";
    const description = "Улытауский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
