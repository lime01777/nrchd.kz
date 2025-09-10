import React from 'react';
import { Head } from '@inertiajs/react';
import LayoutFolderChlank from '@/Layouts/LayoutFolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function BioethicsDocuments() {
  return (
    <>
      <Head title='Документы по биоэтике' />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Документы по биоэтике</h2>
            
            <div className="space-y-6">
              {/* Документы по биоэтике */}
              <FilesAccord
                title="Документы по биоэтике"
                folderPath="Bioethics/Documents"
                bgColor="bg-blue-50"
                textColor="text-blue-800"
                borderColor="border-blue-200"
              />
              
              {/* Формы и заявления */}
              <FilesAccord
                title="Формы и заявления"
                folderPath="Bioethics/Forms"
                bgColor="bg-green-50"
                textColor="text-green-800"
                borderColor="border-green-200"
              />
              
              {/* Шаблоны документов */}
              <FilesAccord
                title="Шаблоны документов"
                folderPath="Bioethics/Templates"
                bgColor="bg-purple-50"
                textColor="text-purple-800"
                borderColor="border-purple-200"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BioethicsDocuments.layout = page => <LayoutFolderChlank 
  bgColor="bg-white"
  h1="Документы по биоэтике" 
  parentRoute="/bioethics" 
  parentName="Центральная комиссия по биоэтике"
  heroBgColor="bg-blue-100"
  buttonBgColor="bg-blue-100"
  buttonHoverBgColor="hover:bg-blue-200"
>{page}</LayoutFolderChlank>;
