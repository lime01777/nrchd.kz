import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function EducationPrograms() {
  return (
    <>
      <Head title="Образовательные программы" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Образовательные программы</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

EducationPrograms.layout = (page) => <LayoutDirection img="service-education" h1="Образовательные программы">{page}</LayoutDirection>;
