import React from 'react';

/**
 * Хиро-блок для страницы новостей.
 * Отрисовывает фон с изображением (при наличии) и крупный заголовок/подзаголовок.
 */
export default function HeroNews({ img = null, h1, subtitle = null }) {
    return (
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
            {/* Фоновое изображение при наличии */}
            {img && (
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url(${img})` }}
                />
            )}

            {/* Лёгкий белый оверлей для читабельности текста */}
            <div className="absolute inset-0 -z-10 bg-white/60" />

            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-24 text-left sm:px-6 sm:py-28 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">{h1}</h1>
            </div>
        </section>
    );
}