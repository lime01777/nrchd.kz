import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function AdsEvaluation() {
  return (
    <>
      <Head title="Оценка рекламных материалов" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Оценка рекламных материалов</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

AdsEvaluation.layout = (page) => <LayoutDirection img="service-ads" h1="Оценка рекламных материалов">{page}</LayoutDirection>;
