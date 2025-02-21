import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Akmola() {
    const title = "Акмолинский филиал";
    const description = "Акмолинский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
