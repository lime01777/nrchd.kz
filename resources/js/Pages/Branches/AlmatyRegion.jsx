import React from 'react';
import BranchTemplate from './BranchTemplate';

export default function AlmatyRegion() {
    const title = "Алматинский областной филиал";
    const description = "Алматинский областной филиал занимается..."; // Добавьте описание здесь

    return (
        <BranchTemplate title={title} description={description} />
    );
}
 