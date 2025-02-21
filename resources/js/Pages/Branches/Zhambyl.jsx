import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Zhambyl() {
    const title = "Жамбылский филиал";
    const description = "Жамбылский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
