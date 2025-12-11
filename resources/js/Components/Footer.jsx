import React from 'react';
import FooterNav from './FooterNav';
import { Link } from '@inertiajs/react';
import translationService from '@/services/TranslationService';

const FooterLinks = () => {
    // Функция для получения перевода
    const t = (key, fallback = '') => {
        return translationService.t(key, fallback);
    };
    
    const navLinks1 = [
        {label: t('footer.menu.directions'), url:'medical.education', translate: true},
        {label: t('footer.menu.services'), url:'services.training', translate: true},
        {label: t('footer.menu.branches'), url:'branches.astana', translate: true},
        {label: t('footer.menu.news'), url:'home', translate: true},
        {label: t('footer.menu.vacancies'), url:'vacancy.jobs', translate: true},
    ];
    
    const navLinks2 = [
        {label: t('footer.menu.newsCenter'), url:'home', translate: true},
        {label: t('footer.menu.newsDirections'), url:'home', translate: true},
        {label: t('footer.menu.newsBranches'), url:'home', translate: true},
        {label: t('footer.menu.leader'), url:'salidat.kairbekova', translate: true},
    ];
    
    // Подменю для пунктов главного меню
    const mainMenuSubmenus = {
        'Направления': [
            { title: "Медицинское образование", url: "medical.education", translate: true },
            { title: "Кадровые ресурсы здравоохранения", url: "human.resources", translate: true },
            { title: "Цифровое здравоохранение", url: "electronic.health", translate: true },
            { title: "Аккредитация", url: "medical.accreditation", translate: true },
            { title: "Оценка технологий здравоохранения", url: "health.rate", translate: true },
            { title: "Клинические протоколы", url: "clinical.protocols", translate: true },
            { title: "Стратегические инициативы", url: "strategic.initiatives", translate: true },
            { title: "Рейтинг медицинских организаций", url: "medical.rating", translate: true },
            { title: "Медицинская наука", url: "medical.science", translate: true },
            { title: "Лекарственная политика", url: "drug.policy", translate: true },
            { title: "Первичная медико-санитарная помощь", url: "primary.healthcare", translate: true },
            { title: "Национальные счета здравоохранения", url: "health.accounts", translate: true },
            { title: "Медицинская статистика", url: "medical.statistics", translate: true },
            { title: "Отраслевой центр технологических компетенций", url: "direction.tech.competence", translate: true },
            { title: "Центр профилактики и укрепления здоровья", url: "center.prevention", translate: true },
            { title: "Медицинский туризм", url: "medical.tourism", translate: true },
        ],
        'Услуги': [
            { title: "Организация и проведение обучающих циклов", url: "services.training", translate: true },
            { title: "Оценка рекламных материалов", url: "services.adsEvaluation", translate: true },
            { title: "Оценка технологий здравоохранения", url: "services.healthTechAssessment", translate: true },
            { title: "Профессиональная экспертиза лекарственных средств", url: "services.drugExpertise", translate: true },
            { title: "Экспертиза научно-образовательных программ", url: "services.educationPrograms", translate: true },
            { title: "Научно-медицинская экспертиза", url: "services.medicalExpertise", translate: true },
            { title: "Аккредитация медицинских организаций", url: "services.accreditation", translate: true },
            { title: "Постаккредитационный мониторинг", url: "services.postAccreditationMonitoring", translate: true },
        ],
        'Филиалы': [
            { title: "г. Астана", url: "branches.astana", translate: true },
            { title: "г. Алматы", url: "branches.almaty", translate: true },
            { title: "Абайская область", url: "branches.abay", translate: true },
            { title: "Акмолинская область", url: "branches.akmola", translate: true },
            { title: "Актюбинская область", url: "branches.aktobe", translate: true },
            { title: "Алматинская область", url: "branches.almatyregion", translate: true },
            { title: "Атырауская область", url: "branches.atyrau", translate: true },
            { title: "Восточно-Казахстанская область", url: "branches.east", translate: true },
            { title: "Жамбылская область", url: "branches.zhambyl", translate: true },
            { title: "Жетысуская область", url: "branches.zhetisu", translate: true },
            { title: "Западно-Казахстанская область", url: "branches.west", translate: true },
            { title: "Карагандинская область", url: "branches.karaganda", translate: true },
            { title: "Костанайская область", url: "branches.kostanay", translate: true },
            { title: "Кызылординская область", url: "branches.kyzylorda", translate: true },
            { title: "Мангистауская область", url: "branches.mangistau", translate: true },
            { title: "Павлодарская область", url: "branches.pavlodar", translate: true },
            { title: "Северо-Казахстанская область", url: "branches.north", translate: true },
            { title: "Туркестанская область", url: "branches.turkestan", translate: true },
            { title: "Улытауская область", url: "branches.ulytau", translate: true },
            { title: "г. Шымкент", url: "branches.shymkent", translate: true }
        ]
    };

    return (
        <footer className="text-gray-600 body-font bg-gray-100">
            {/* Горизонтальная линия вверху футера */}
            <div className='pt-4'>
            </div>
            <div className="container mx-auto">
                <hr className="border-t border-gray-300 my-6" />
            </div>

            <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                <div className="flex-grow flex flex-wrap -mb-10 md:mt-0 mt-10 md:text-left text-center">
                    <FooterNav title={t('footer.mainMenu')} links={navLinks1} subMenus={mainMenuSubmenus} />
                    <FooterNav title={t('footer.aboutCenter')} links={navLinks2} />
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4 min-w-[280px] sm:min-w-0">
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3" data-translate>{t('footer.contacts.title')}</h2>

                            <div className="flex items-center mb-2 break-words">
                                <a href="mailto:office@nrchd.kz" className="hover:text-blue-600 hover:underline break-all">
                                    <span className="font-medium text-sm sm:text-base">office@nrchd.kz</span>
                                </a>
                            </div>
                            <div className="flex items-center mt-2 mb-1">
                                <a href="tel:+77172648951" className="hover:text-blue-600 hover:underline">
                                    <span className="font-medium text-sm sm:text-base">+7 (7172) 648-951</span> <span className="text-gray-500 text-sm"></span>
                                </a>
                            </div>
                            <div className="flex items-center">
                                <a href="tel:+77172648951" className="hover:text-blue-600 hover:underline">
                                    <span className="font-medium text-sm sm:text-base">+7 (7172) 648-951</span> <span className="text-gray-500 text-sm"></span>
                                </a>
                            </div>

                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4 min-w-[280px] sm:min-w-0 mt-6 md:mt-0">
                        <h2 className="font-semibold text-gray-900 md:text-base text-sm mb-3">{t('footer.workingHours.title')}</h2>

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                    <span className="text-gray-700 text-sm sm:text-base">{t('footer.workingHours.weekdays')} <span className="">{t('footer.workingHours.time')}</span></span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-700 text-sm sm:text-base">{t('footer.workingHours.lunch')} <span className="">{t('footer.workingHours.lunchTime')}</span></span>
                                </div>
                            </div>

                    </div>
                </div>
            </div>
            <div className="bg-gray-100">
                <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                    <p className="inline text-gray-500 md:text-sm text-xs text-center sm:text-left">{t('footer.legalName')}</p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                        <p className="text-gray-500 text-sm text-center sm:text-left">2025</p>
                    </span>
                </div>
            </div>
        </footer>
    );
};


export default FooterLinks