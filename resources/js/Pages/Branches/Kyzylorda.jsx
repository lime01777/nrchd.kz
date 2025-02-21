import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Kyzylorda() {
    const title = "Кызылординский филиал";
    const description = "Кызылординский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
