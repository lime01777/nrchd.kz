import React, { useState } from 'react';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

/**
 * Компонент для парсинга метаданных из URL (для материалов СМИ)
 */
export default function UrlParser({ onMetadataParsed, onUrlChange, initialUrl = '' }) {
    const [url, setUrl] = useState(initialUrl);
    const [parsing, setParsing] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    const handleParse = async () => {
        if (!url || !url.trim()) {
            setError('Введите URL');
            return;
        }

        // Валидация URL
        try {
            new URL(url);
        } catch {
            setError('Некорректный URL');
            return;
        }

        setParsing(true);
        setError('');
        setPreview(null);

        try {
            const response = await axios.post('/admin/news/parse-url', {
                url: url.trim(),
            });

            if (response.data.success) {
                const metadata = response.data.data;
                setPreview(metadata);
                if (onMetadataParsed) {
                    onMetadataParsed(metadata);
                }
            } else {
                setError(response.data.error || 'Не удалось получить данные');
            }
        } catch (err) {
            console.error('Ошибка парсинга URL:', err);
            setError(err.response?.data?.error || 'Ошибка при получении данных из ссылки');
        } finally {
            setParsing(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleParse();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <InputLabel htmlFor="external_url" value="Ссылка на публикацию в СМИ *" />
                <div className="mt-1 flex gap-2">
                    <TextInput
                        id="external_url"
                        type="url"
                        value={url}
                        onChange={(e) => {
                            const newUrl = e.target.value;
                            setUrl(newUrl);
                            setError('');
                            setPreview(null);
                            // Вызываем callback для обновления external_url в форме
                            if (onUrlChange) {
                                onUrlChange(newUrl);
                            }
                        }}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        placeholder="https://example.com/article"
                        required
                    />
                    <PrimaryButton
                        type="button"
                        onClick={handleParse}
                        disabled={parsing || !url.trim()}
                        className="whitespace-nowrap"
                    >
                        {parsing ? 'Загрузка...' : 'Получить данные'}
                    </PrimaryButton>
                </div>
                <InputError message={error} className="mt-2" />
            </div>

            {preview && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                        {preview.image && (
                            <img
                                src={preview.image}
                                alt={preview.title || 'Превью'}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                                {preview.title || 'Без названия'}
                            </h4>
                            {preview.description && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {preview.description}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500 truncate">
                                {preview.url}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

