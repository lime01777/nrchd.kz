import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Astana() {
    const title = "Астанинский филиал";
    const description = "Астанинский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
