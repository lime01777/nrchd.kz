import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

export default function FAQ() {
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const faqItems = [
        {
            question: "Какие основные направления деятельности центра?",
            answer: "Национальный научный центр развития здравоохранения имени Салидат Каирбековой осуществляет деятельность по следующим ключевым направлениям: разработка и внедрение инновационных медицинских технологий, экспертно-аналитическое сопровождение системы здравоохранения, научно-исследовательская деятельность в области общественного здоровья, а также методологическое обеспечение реализации государственных программ здравоохранения."
        },
        {
            question: "Как подать заявку на участие в научном проекте?",
            answer: "Для участия в научном проекте необходимо подать заявку через официальный сайт центра, заполнив соответствующую форму. К заявке следует приложить резюме, мотивационное письмо и краткое описание вашего интереса к конкретному проекту. После рассмотрения заявки наши специалисты свяжутся с вами для дальнейшего обсуждения возможностей сотрудничества."
        },
        {
            question: "Какие документы необходимы для подачи заявления о сотрудничестве?",
            answer: "Для подачи заявления о сотрудничестве требуются следующие документы: официальное письмо с предложением о сотрудничестве, описание проекта или направления сотрудничества, копии регистрационных документов организации, контактные данные ответственных лиц. Документы можно направить через официальный сайт или по электронной почте."
        },
        {
            question: "Как можно получить консультацию специалистов центра?",
            answer: "Для получения консультации специалистов центра вы можете оставить заявку на сайте, отправить запрос по электронной почте или позвонить по указанным контактным телефонам. В заявке необходимо указать тему консультации и предпочтительный способ связи. Наши специалисты свяжутся с вами в ближайшее время."
        },
        {
            question: "Проводит ли центр образовательные программы и тренинги?",
            answer: "Да, центр регулярно проводит образовательные программы, тренинги, семинары и вебинары по различным направлениям здравоохранения. Информация о предстоящих мероприятиях публикуется на официальном сайте в разделе 'Мероприятия'. Для участия необходимо зарегистрироваться на интересующее вас мероприятие."
        },
        {
            question: "Как получить доступ к публикациям и исследованиям центра?",
            answer: "Публикации и результаты исследований центра доступны на официальном сайте в разделе 'Публикации'. Часть материалов находится в открытом доступе, для получения доступа к полным текстам некоторых специализированных исследований может потребоваться авторизация или запрос через форму обратной связи."
        },
        {
            question: "Сотрудничает ли центр с международными организациями?",
            answer: "Да, Национальный научный центр развития здравоохранения активно сотрудничает с международными организациями, включая ВОЗ, ЮНИСЕФ, ПРООН, а также с ведущими медицинскими и научно-исследовательскими институтами других стран. Мы открыты для новых партнерств и международного сотрудничества."
        }
    ];

    return (
        <>
            <Head title="Вопросы и ответы | NNCRZ" />
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-col text-left w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Часто задаваемые вопросы</h1>
                        <p className="lg:w-2/3 leading-relaxed text-base">
                            В этом разделе вы найдете ответы на наиболее распространенные вопросы о деятельности Национального научного центра развития здравоохранения имени Салидат Каирбековой.
                        </p>
                    </div>
                    <div className="flex flex-wrap -m-2">
                        <div className="p-2 w-full">
                            <div className="bg-white rounded-lg">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                                        <button 
                                            onClick={() => toggleQuestion(index)}
                                            className="w-full py-4 px-5 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                                        >
                                            <span className="text-lg font-medium text-gray-900">{item.question}</span>
                                            <svg 
                                                className={`w-6 h-6 transition-transform duration-200 ${openQuestion === index ? 'transform rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div 
                                            className={`overflow-hidden transition-all duration-300 ${openQuestion === index ? 'max-h-96' : 'max-h-0'}`}
                                        >
                                            <div className="p-5 bg-gray-50 text-gray-600">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-12">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">Не нашли ответ на свой вопрос?</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Вы можете задать свой вопрос через форму обратной связи или связаться с нами напрямую.
                        </p>
                        <div className="flex items-center justify-center">
                            <a href={route('about.contacts')} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                Контактная информация
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

FAQ.layout = (page) => <LayoutDirection img="headcentre" h1="Вопросы и ответы">{page}</LayoutDirection>;
