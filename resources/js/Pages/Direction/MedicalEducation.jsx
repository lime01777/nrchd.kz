import { Head } from "@inertiajs/react";
import React, { useState } from 'react';
import LayoutDirection from "@/Layouts/LayoutDirection";
import BannerCatalog from "@/Components/BannerCatalog";
import FilesAccord from "@/Components/FilesAccord";

export default function MedicalEducation() {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <>
    <Head title="NNCRZ" />
    <section className="text-gray-600 body-font pb-8">

        <div className="container px-5 py-12 mx-auto">
            <p className="tracking-wide">
            Департамент медицинского образования и науки (далее - Департамент) является структурным подразделением Республиканского государственного предприятия на праве хозяйственного ведения «Национальный научный центр развития здравоохранения имени Салидат Каирбековой» Министерства здравоохранения Республики Казахстан. 
     Департамент осуществляет содействие развитию и модернизации медицинского образования и науки, внедрению инновационных технологий в отрасли и разработки эффективных управленческих решений.  
            </p>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showFullText ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="tracking-wide mt-4">
            К компетенции Департамента относится:
            <br></br>- Научно-исследовательские проекты, реализуемые ННЦРЗ.
            <br></br>- Присвоение  и пересмотр статуса научной организации в области здравоохранения, а также проведение оценки результативности научной, научно-технической и инновационной деятельности.
            <br></br>- Проведение научно-исследовательской работы по проведению научно – медицинской экспертизы научных программ и разработок.
            <br></br>- Проведение рейтинговой оценки образовательной деятельности медицинских организации образования и науки.
            <br></br>- Проведение научно-исследовательской работы по проведению экспертизы образовательной программы дополнительного образования  подготовки медицинских кадров.
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setShowFullText(!showFullText)} 
                  className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                  rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 transform hover:scale-105"
                >
                    {showFullText ? 'Скрыть' : 'Читать далее'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="currentColor" className={`ml-1 transition-transform duration-500 ease-in-out ${showFullText ? 'rotate-45' : ''}`}>
                        <rect x="11.5" y="5" width="1" height="14" />
                        <rect x="5" y="11.5" width="14" height="1" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
    <BannerCatalog />
    <FilesAccord />
    </>
    
  )
}

MedicalEducation.layout = (page) => <LayoutDirection img={'medicaleducation'} h1={'Медицинское образование'}>{page}</LayoutDirection>;
