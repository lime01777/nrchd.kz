import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function MedicalExpertise() {
  return (
    <>
      <Head title="Медицинская экспертиза" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Медицинская экспертиза</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

MedicalExpertise.layout = (page) => <LayoutDirection img="service-medical" h1="Медицинская экспертиза">{page}</LayoutDirection>;
