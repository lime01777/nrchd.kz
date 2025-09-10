import { Head } from "@inertiajs/react";
import React from 'react';
import LayoutFolderChlank from "@/Layouts/LayoutFolderChlank";
import SimpleFileDisplay from "@/Components/SimpleFileDisplay";

export default function BioethicsExpertise() {
  return (
    <>
      <Head title="СОП" meta={[{ name: 'description', content: 'Стандартные операционные процедуры биоэтической экспертизы.' }]} />

      {/* Документы и материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            <SimpleFileDisplay 
                folder="Bioethics/Expertise/Documents"
                bgColor="bg-white"
            />
        </div>
    </section>
    </>
  )
}

BioethicsExpertise.layout = page => <LayoutFolderChlank 
  h1="СОП"
  title="Стандартные операционные процедуры биоэтической экспертизы"
  parentRoute={route('bioethics')}
  parentName="Центральная комиссия по биоэтике"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
  buttonBorderColor="border-blue-200"
>{page}</LayoutFolderChlank>
