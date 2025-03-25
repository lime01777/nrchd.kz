import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import ImportantDoc from '@/Components/ImportantDoc';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';
import FolderChlank from '@/Components/FolderChlank';
import PageAccordions from '@/Components/PageAccordions';

export default function DrugPolicy() {
  return (
    <>
    <Head title="Лекарственная политика"/>
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 py-12 mx-auto">
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
            Департамент совершенствования лекарственной политики постоянно внедряет лучшие мировые практики 
            в протоколы лечения и профилактики заболеваний, что позволяет как развивать медицину, основанную 
            на доказательствах (доказательную медицину), так совершенствовать формулярную систему.
          </p>
        </div>
        <div className='flex flex-wrap px-12 text-justify mb-4'>
          <p className="tracking-wide leading-relaxed">
            Политика Департамента в области лекарственного обеспечения направлена на рациональное использование 
            лекарственных средств для исключения негативных медицинских, социальных, а также экономических последствий 
            для системы здравоохранения.
          </p>
        </div>
      </div>
    </section>

    {/* Блок с формулярами */}
    <section className="text-gray-600 body-font pb-8">
      <div className="container px-5 mx-auto">
        <div className="flex flex-wrap">
          <FolderChlank 
            h1="Формулярная комиссия МЗ РК" 
            color="bg-yellow-100" 
            colorsec="bg-yellow-200" 
            href={route('drug.policy.commission')}
          />
          <FolderChlank 
            h1="Положение комиссии Формулярной комиссии за 2023 год" 
            color="bg-yellow-100" 
            colorsec="bg-yellow-200" 
            href={route('drug.policy.regulations')}
          />
        </div>
      </div>
    </section>

    {/* Перечни возмещения */}
    <PageAccordions 
      bgColor="bg-yellow-50"
      sections={[
        {
          title: "Перечни возмещения в рамках ГОБМП и ОСМС",
          documents: [
            { 
              description: "Казахстанский национальный лекарственный формуляр", 
              filetype: "pdf", 
              img: 2, 
              filesize: "24 KB",
              date: "22.09.2023",
              url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
            },
            { 
              description: "Перечень основных заболеваний и лекарственных средств для их лечения (бесплатно)", 
              filetype: "pdf", 
              img: 2,
              filesize: "28 KB",
              date: "24.09.2023",
              url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
            },
            { 
              description: "Перечень лекарственных средств и медицинских изделий в рамках ГОБМП", 
              filetype: "pdf", 
              img: 2,
              filesize: "32 KB",
              date: "26.09.2023",
              url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
            }
          ]
        },
        {
          title: "Документы",
          documents: [
            { 
              description: "Приказ МЗ РК «Об утверждении правил формирования Казахстанского национального лекарственного формуляра»", 
              filetype: "pdf", 
              img: 2, 
              filesize: "24 KB",
              date: "22.09.2023",
              url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
            },
            { 
              description: "Приказ МЗ РК «Об утверждении правил формирования перечня лекарственных средств и медицинских изделий для бесплатного и (или) льготного амбулаторного обеспечения отдельных категорий граждан с определенными заболеваниями (состояниями)»", 
              filetype: "pdf", 
              img: 2,
              filesize: "28 KB",
              date: "24.09.2023",
              url: "https://drive.google.com/file/d/1OZsG6PXT-MKle40jlFWF7Gwih-4e6JUg/view"
            }
          ]
        }
      ]}
    />
    </>
  )
}

DrugPolicy.layout = page => <LayoutDirection img="politica" h1="Лекарственная политика">{page}</LayoutDirection>;
