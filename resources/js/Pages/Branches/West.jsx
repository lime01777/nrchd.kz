import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function West() {
    const title = "Западно-Казахстанский филиал";
    const description = "Западно-Казахстанский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
