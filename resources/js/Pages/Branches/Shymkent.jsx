import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Shymkent() {
    const title = "Шымкентский филиал";
    const description = "Шымкентский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
