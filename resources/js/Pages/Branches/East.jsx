import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function East() {
    const title = "Восточно-Казахстанский филиал";
    const description = "Восточно-Казахстанский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
