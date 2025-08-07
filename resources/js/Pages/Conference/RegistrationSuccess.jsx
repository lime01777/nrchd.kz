import React from 'react';
import ConferenceLayout from '@/Layouts/ConferenceLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Страница успешной регистрации на конференцию
 * 
 * @param {object} props Свойства компонента
 * @param {string} props.registrationType Тип регистрации ('participant' или 'speaker')
 * @param {string} props.email Email зарегистрированного участника
 * @returns {React.ReactElement} Страница с подтверждением регистрации
 */
export default function RegistrationSuccess({ registrationType, email }) {
  return (
    <ConferenceLayout>
      <Head>
        <title>Регистрация успешно завершена - NRCHD Conference 2025</title>
        <meta name="description" content="Ваша регистрация на конференцию успешно завершена" />
      </Head>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Ваша регистрация успешно завершена!</h1>
            
            {registrationType === 'participant' ? (
              <p className="text-lg text-gray-600 mb-8">
                Благодарим вас за регистрацию на конференцию NRCHD 2025. 
                Информация о подтверждении участия и детали оплаты отправлены на вашу электронную почту <strong className="text-blue-600">{email}</strong>.
              </p>
            ) : (
              <p className="text-lg text-gray-600 mb-8">
                Благодарим вас за подачу заявки в качестве спикера на конференцию NRCHD 2025.
                Мы рассмотрим вашу заявку и свяжемся с вами по электронной почте <strong className="text-blue-600">{email}</strong> в ближайшее время.
              </p>
            )}
            
            <div className="bg-blue-50 p-6 rounded-lg mb-10">
              <h2 className="text-xl font-semibold mb-3">Что дальше?</h2>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Проверьте свою электронную почту для получения подтверждения регистрации</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Оплатите регистрационный взнос по указанным в письме реквизитам</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>После подтверждения оплаты вы получите официальное приглашение</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Следите за обновлениями на сайте и в социальных сетях</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href={route('conference.home')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Вернуться на главную
              </Link>
              <Link
                href={route('conference.program')}
                className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Посмотреть программу
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ConferenceLayout>
  );
}
