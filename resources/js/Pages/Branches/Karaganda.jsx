import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Karaganda() {
    const title = "Карагандинский филиал";
    const description = "Карагандинский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
