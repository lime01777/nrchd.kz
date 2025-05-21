import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import FilesAccord from '@/Components/FilesAccord';

export default function ClinicalProtocols() {
  const [showFullText, setShowFullText] = useState(false);
  
  return (
    <>
    <Head title='Клинические протоколы' />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify mb-4'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        <strong>Клинический протокол</strong> – научно доказанные рекомендации по профилактике, диагностике, лечению, 
                        медицинской реабилитации и паллиативной медицинской помощи при определенном заболевании или 
                        состояниях пациентов в соответствии с законодательством Республики Казахстан.
                    </p>
                    <p className="mb-4">
                        Медицинская помощь, предоставляемая субъектами здравоохранения, регулируется стандартами, правилами 
                        и клиническими протоколами в соответствии с законодательством о здравоохранении в Казахстане.
                    </p>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                Существует четыре вида клинических протоколов, охватывающих диагностику и лечение, 
                                медицинские вмешательства, медицинскую реабилитацию и паллиативную помощь.
                            </p>
                            <p className="mb-4">
                                Клинические протоколы разрабатываются научными медицинскими центрами с участием высших 
                                медицинских учебных заведений и неправительственных организаций. Они включают коды 
                                международной классификации болезней.
                            </p>
                            <p className="mb-4">
                                Национальный научный центр регулирует экспертную оценку клинических протоколов с учетом 
                                требований к их разработке, рациональной фармакотерапии и доказательной медицине.
                            </p>
                            <p className="mb-4">
                                Клинические протоколы пересматриваются каждые 5 лет или при появлении новых методов 
                                с более высоким уровнем доказательности.
                            </p>
                            
                            <p className="mb-4 font-semibold">
                                Нормативные документы:
                            </p>
                            
                            <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
                                <li>Об утверждении методики внедрения и оценки эффективности внедрения клинических протоколов в практическое здравоохранение. Приказ Министра здравоохранения Республики Казахстан от 12 ноября 2020 года № ҚР ДСМ - 189/2020.</li>
                                <li>Алгоритм при внедрении и мониторинге внедрения клинических протоколов в практическое здравоохранение.</li>
                                <li>Дорожная карта по мониторингу внедрения клинических протоколов в практическом здравоохранении (в медицинских организациях).</li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setShowFullText(!showFullText)} 
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105"
                >
                    {showFullText ? 'Свернуть' : 'Читать далее'}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`ml-2 transform transition-transform duration-300 ${showFullText ? 'rotate-45' : ''}`}
                    >
                        {showFullText ? (
                            <path d="M19 13H5v-2h14v2z" />
                        ) : (
                            <>
                                <rect x="11.5" y="5" width="1" height="14" />
                                <rect x="5" y="11.5" width="14" height="1" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </div>
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank 
                    h1="Клинические протоколы" 
                    color="bg-blue-100" 
                    colorsec="bg-blue-200" 
                    href={route('clinical.protocols.catalog')}
                />
                <FolderChlank 
                    h1="Мониторинг клинических протоколов" 
                    color="bg-blue-100" 
                    colorsec="bg-blue-200" 
                    href={route('clinical.protocols.monitoring')}
                />
                <FolderChlank 
                    h1="Объединенная комиссия по качеству медицинских услуг" 
                    color="bg-blue-100" 
                    colorsec="bg-blue-200" 
                    href={route('clinical.protocols.commission')}
                />
            </div>
        </div>
    </section>

    <section className="text-gray-600 body-font">
        <div className="container px-5 pt-12 pb-12 mx-auto rounded-2xl">
            {/* Первый аккордеон */}
            <div className="flex flex-wrap px-5 bg-blue-100">
                <FilesAccord 
                    folder="Клинические протоколы/Набор — Нормативно-правовые акты"
                    title="Нормативно-правовые акты"
                    bgColor="bg-blue-100"
                    defaultOpen={true}
                />
            </div>

        </div>
    </section>
    </>
  )
}

ClinicalProtocols.layout = (page) => <LayoutDirection img={'clinicalprotocols'} h1={'Клинические протоколы'} useVideo={true}>{page}</LayoutDirection>;
