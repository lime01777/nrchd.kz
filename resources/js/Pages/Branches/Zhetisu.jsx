import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function Zhetisu() {
    const title = "Жетысуский филиал";
    const description = "Жетысуский филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
