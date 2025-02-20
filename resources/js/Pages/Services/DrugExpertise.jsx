import { Head } from '@inertiajs/react';
import React from 'react';

export default function Training() {
  return (
    <>
      <Head title="Организация и проведение обучающих циклов" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Организация и проведение обучающих циклов</h1>
        <p className="mt-4">Здесь будет информация об услуге...</p>
      </div>
    </>
  );
}

Training.layout = (page) => <Layout img="service-training" h1="Организация и проведение обучающих циклов">{page}</Layout>;
