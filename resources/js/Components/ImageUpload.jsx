import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Компонент загрузки изображения с предпросмотром и валидацией
 * 
 * @param {string} name - имя поля формы
 * @param {string} label - метка поля
 * @param {string} currentImageUrl - URL текущего изображения (для редактирования)
 * @param {string} currentImageAlt - альтернативный текст текущего изображения
 * @param {Function} onImageChange - callback при изменении изображения
 * @param {Object} errors - ошибки валидации
 */
export default function ImageUpload({
    name = 'cover',
    label = 'Обложка',
    currentImageUrl = null,
    currentImageAlt = null,
    onImageChange = null,
    errors = {},
}) {
    const [preview, setPreview] = useState(currentImageUrl);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    /**
     * Обработка выбора файла
     */
    const handleFileSelect = (file) => {
        // Валидация типа файла
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Недопустимый тип файла. Разрешены: JPG, PNG, WebP');
            return;
        }

        // Валидация размера (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB в байтах
        if (file.size > maxSize) {
            alert('Размер файла не должен превышать 5 МБ');
            return;
        }

        // Валидация минимального размера (800x400)
        const img = new Image();
        img.onload = () => {
            if (img.width < 800 || img.height < 400) {
                alert('Минимальный размер изображения: 800×400 пикселей');
                return;
            }

            // Создаем превью
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
                if (onImageChange) {
                    onImageChange(file);
                }
            };
            reader.readAsDataURL(file);
        };
        img.onerror = () => {
            alert('Ошибка при загрузке изображения');
        };
        img.src = URL.createObjectURL(file);
    };

    /**
     * Обработка клика по области загрузки
     */
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    /**
     * Обработка изменения файла через input
     */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    /**
     * Обработка drag & drop
     */
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    /**
     * Обработка drop файла
     */
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    /**
     * Удаление изображения
     */
    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImageChange) {
            onImageChange(null);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {/* Превью изображения */}
            {preview && (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt={currentImageAlt || 'Превью обложки'}
                        className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
                        style={{ maxHeight: '400px' }}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Удалить изображение"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Область загрузки */}
            <div
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    ${preview ? 'hidden' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="space-y-2">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold text-blue-600">Нажмите для загрузки</span> или перетащите файл сюда
                    </div>
                    <div className="text-xs text-gray-500">
                        JPG, PNG, WebP (макс. 5 МБ, мин. 800×400px)
                    </div>
                </div>
            </div>

            {/* Ошибки валидации */}
            {errors[name] && (
                <p className="text-sm text-red-600">{errors[name]}</p>
            )}
        </div>
    );
}

