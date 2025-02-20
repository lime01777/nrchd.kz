import { Head } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FileAccordTitle from '@/Components/FileAccordTitle';
import FileAccordChlank from '@/Components/FileAccordChlank';

export default function Accreditation() {
  return (
    <>
      <Head title="Аккредитация медицинских организаций" />
      <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap px-12 text-justify mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Аккредитация медицинских организаций</h1>
            <p className="tracking-wide leading-relaxed">
              Национальный научный центр развития здравоохранения проводит аккредитацию медицинских организаций 
              на соответствие требованиям законодательства Республики Казахстан в области здравоохранения.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-150 ease-in">
              Подать заявку
            </button>
          </div>
        </div>
      </section>

      {/* Блок с информацией о сроках */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 pb-12 mx-auto">
          <div className="flex md:flex-row flex-wrap bg-fuchsia-100 p-6 rounded-lg">
            <div className="w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Регистрация заявки</h2>
              <p className="text-gray-700">1 рабочий день</p>
            </div>
            <div className="w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Срок проведения оценки</h2>
              <p className="text-gray-700">10 рабочих дней</p>
            </div>
          </div>
        </div>
      </section>

      {/* Прейскурант */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 pb-12 mx-auto">
          <FileAccordTitle title="Прейскурант" />
          <FileAccordChlank description="Прейскурант на услуги аккредитации" filetype="pdf" img={2} />
        </div>
      </section>

      {/* Полезные материалы */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 pb-12 mx-auto">
          <FileAccordTitle title="Полезные материалы" />
          <FileAccordChlank description="Шаблон договора" filetype="doc" img={2} />
          <FileAccordChlank description="Дополнительное соглашение" filetype="doc" img={2} />
          <FileAccordChlank description="Форма заявления" filetype="pdf" img={2} />
        </div>
      </section>

      {/* Форма заявки */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 pb-12 mx-auto bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Заявка на аккредитацию</h2>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Полное наименование организации" className="p-2 border rounded-md w-full" />
              <input type="text" placeholder="Форма собственности" className="p-2 border rounded-md w-full" />
              <input type="text" placeholder="Год создания организации" className="p-2 border rounded-md w-full" />
              <input type="text" placeholder="Адрес" className="p-2 border rounded-md w-full" />
              <input type="text" placeholder="Расчетный счет" className="p-2 border rounded-md w-full" />
              <input type="text" placeholder="Руководитель (ФИО)" className="p-2 border rounded-md w-full" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Прикрепите документы (PDF)</label>
              <input type="file" className="mt-2 p-2 border rounded-md w-full" />
            </div>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg">Отправить</button>
            </div>
          </form>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-8 pb-12 mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Контактная информация</h2>
          <p><strong>Адрес:</strong> Астана, ул. А. Иманова 11, Бизнес центр «Нурсаулет-1», 3 этаж, кабинет 306/3</p>
          <p><strong>График работы:</strong> Пн-Пт, 9:00 - 18:00 (обед 13:00 - 14:00)</p>
          <p><strong>Email:</strong> a.skakova@nrchd.kz, s.zhaldybaeva@nrchd.kz</p>
          <p><strong>Телефон:</strong> 8-7172-700-950 (внутренний: 1049, 1079)</p>
        </div>
      </section>
    </>
  )
}

Accreditation.layout = (page) => <LayoutDirection img="headaccreditation" h1="Аккредитация медицинских организаций">{page}</LayoutDirection>;
