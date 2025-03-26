import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function HealthTechAssessment() {
  return (
    <>
      <Head title="Оценка технологий здравоохранения" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Оценка технологий здравоохранения</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

HealthTechAssessment.layout = (page) => <LayoutDirection img="service-health-tech" h1="Оценка технологий здравоохранения">{page}</LayoutDirection>;
