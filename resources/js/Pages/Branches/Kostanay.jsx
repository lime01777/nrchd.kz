import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Kostanay() {
    const title = "Костанайский филиал";
    const description = "Костанайский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
