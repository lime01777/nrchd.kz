import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function DrugExpertise() {
  return (
    <>
      <Head title="Экспертиза лекарственных средств" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Экспертиза лекарственных средств</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

DrugExpertise.layout = (page) => <LayoutDirection img="service-drug" h1="Экспертиза лекарственных средств">{page}</LayoutDirection>;
