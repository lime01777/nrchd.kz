import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function North() {
    const title = "Северо-Казахстанский филиал";
    const description = "Северо-Казахстанский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
