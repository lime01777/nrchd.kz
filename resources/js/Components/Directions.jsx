import React, { useState } from 'react';
import DirectionsChlank from './DirectionsChlank';
import { router } from '@inertiajs/react';

const Directions = () => {
    const allDirections = [
        { imgname: 1, title: "Медицинское образование", bgcolor: "bg-green-100", bgborder: "border-green-200", url: "/medical-education", hasRoute: false, path: "/medical-education"},
        { imgname: 2, title: "Кадровые ресурсы здравоохранения", bgcolor: "bg-rose-100", bgborder: "border-rose-200", url: "/human-resources", hasRoute: false, path: "/human-resources"},
        { imgname: 3, title: "Электронное здравоохранение", bgcolor: "bg-fuchsia-100", bgborder: "border-fuchsia-200", url: "/electronic-health", hasRoute: false, path: "/electronic-health"},
        { imgname: 4, title: "Аккредитация", bgcolor: "bg-yellow-100", bgborder: "border-yellow-200", url: "/medical-accreditation", hasRoute: false, path: "/medical-accreditation"},
        { imgname: 5, title: "Оценка технологий здравоохранения", bgcolor: "bg-violet-100", bgborder: "border-violet-200", url: "/health-tech-assessment", hasRoute: false, path: "/health-tech-assessment"},
        { imgname: 6, title: "Клинические протоколы", bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "/clinical-protocols", hasRoute: false, path: "/clinical-protocols"},
        { imgname: 7, title: "Стратегические инициативы и международное сотрудничество", bgcolor: "bg-green-100", bgborder: "border-green-200", url: "/strategic-initiatives", hasRoute: false, path: "/strategic-initiatives"},
        { imgname: 8, title: "Рейтинг медицинских организаций", bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "/rating", hasRoute: false, path: "/rating"},
        { imgname: 9, title: "Медицинская наука", bgcolor: "bg-gray-100", bgborder: "border-gray-200", url: "/medical-science", hasRoute: false, path: "/medical-science"},
        { imgname: 10, title: "Лекарственная политика", bgcolor: "bg-yellow-100", bgborder: "border-yellow-200", url: "/drug-policy", hasRoute: false, path: "/drug-policy"},
        { imgname: 11, title: "Первичная медико-санитарная помощь", bgcolor: "bg-green-100", bgborder: "border-green-200", url: "/primary-healthcare", hasRoute: false, path: "/primary-healthcare"},
        { imgname: 12, title: "Национальные счета здравоохранения", bgcolor: "bg-purple-200", bgborder: "border-purple-200", url: "/national-health-accounts", hasRoute: false, path: "/national-health-accounts"},
        { imgname: 13, title: "Центр профилактики и укрепления здоровья", bgcolor: "bg-blue-100", bgborder: "border-blue-200", url: "/center-prevention", hasRoute: false, path: "/center-prevention"}
    ];

    const [ showMore, setShowMore ] = useState(false);

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 pb-24 mx-auto">
            <div className="flex flex-row w-full justify-between text-center mb-10">
                <div className='flex'>
                    <h1 className="sm:text-2xl text-2xl font-semibold title-font text-gray-900 mb-2">Направления</h1>
                </div>
            </div>
            <div className="flex flex-wrap -m-4">
                {allDirections.slice(0, 6).map((direction, index) =>(
                <DirectionsChlank key={index} imgname={direction.imgname} title={direction.title}
                    bgcolor={direction.bgcolor} bgborder={direction.bgborder} url={direction.url} hasRoute={direction.hasRoute} path={direction.path} />
                ))}
            </div>
            {/* Скрытые направления */}
            <div className={`flex flex-wrap -mx-4 mt-4 transition-all duration-500 delay-75 ease-in-out overflow-hidden ${ showMore
                ? "md:max-h-[1000px] max-h-[1500px]" : "max-h-0" }`}>
                {allDirections.slice(6).map((direction, index) => (
                <DirectionsChlank key={index} imgname={direction.imgname} title={direction.title}
                    bgcolor={direction.bgcolor} bgborder={direction.bgborder} url={direction.url} hasRoute={direction.hasRoute} path={direction.path} />
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <button onClick={()=> setShowMore(!showMore)}
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px]
                    rounded-xl p-3 transition-all duration-150 ease-in"
                    >
                    {showMore ? "Скрыть направления" : "Все направления"}
                </button>
            </div>
        </div>
    </section>
  );
}

export default Directions