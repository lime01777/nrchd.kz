import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/Forms/InputError';
import InputLabel from '@/Components/Forms/InputLabel';
import TextInput from '@/Components/Forms/TextInput';
import PrimaryButton from '@/Components/UI/PrimaryButton';
import ModernMediaUploader from '@/Components/Admin/News/ModernMediaUploader';
import CategorySelector from '@/Components/Admin/News/CategorySelector';
import UrlParser from '@/Components/Admin/News/UrlParser';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

/**
 * Форма создания/редактирования новости с поддержкой галереи.
 */
export default function Form({ news = null, media: initialMediaProp = [], section = 'news', sectionMeta = null, type = 'news', availableCategories = [] }) {
    const isEditing = Boolean(news);
    const meta = sectionMeta || {};
    const currentSection = section || type || news?.type || 'news';
    const initialMedia = useMemo(() => {
        if (Array.isArray(news?.media)) {
            return news.media;
        }

        if (Array.isArray(initialMediaProp)) {
            return initialMediaProp;
        }

        return [];
    }, [news?.media, initialMediaProp]);

    const initialCategories = useMemo(() => {
        if (Array.isArray(news?.category)) {
            return news.category;
        }

        return [];
    }, [news?.category]);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const currentType = currentSection;
    const indexRoute = currentType === 'news'
        ? route('admin.news.index')
        : route('admin.news.index', currentType);

    const { data, setData, processing, errors, reset } = useForm({
        title: news?.title || '',
        slug: news?.slug || '',
        excerpt: news?.excerpt || '',
        body: news?.body || '',
        seo_title: news?.seo_title || '',
        seo_description: news?.seo_description || '',
        external_url: news?.external_url || '',
        cover_image_path: news?.cover_image_path || '',
        status: news?.status || 'draft',
        published_at: news?.published_at || '',
        media: initialMedia,
        type: currentType,
        section: currentType,
        category: initialCategories,
        locale: news?.locale || 'ru',
    });

    const [media, setMedia] = useState(initialMedia);
    const [isPublishing, setIsPublishing] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: true,
                orderedList: true,
                link: false,
            }),
            Image.configure({ inline: false, allowBase64: true }),
            LinkExtension.configure({ openOnClick: false })
        ],
        content: data.body,
        onUpdate: ({ editor }) => {
            setData('body', editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && isEditing && news?.body) {
            editor.commands.setContent(news.body);
        }
    }, [editor, isEditing, news?.body]);

    useEffect(() => {
        if (!isEditing) {
            editor?.commands?.setContent(data.body || '');
        }
    }, [editor]);

    useEffect(() => {
        if (!isEditing && !news?.id) {
            // Для режима создания достаточно стартового состояния
            return;
        }

        setMedia(initialMedia);
        setData('media', initialMedia);
        setData('category', initialCategories);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, news?.id, initialMedia, initialCategories]);

    const generateSlug = () => {
        const slug = data.title
            .toLowerCase()
            .replace(/[^-\uFFFF\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        setData('slug', slug);
    };

    const handleMediaUploaded = useCallback((uploaded) => {
        if (!uploaded || uploaded.length === 0) {
            return;
        }

        setMedia((prev) => {
            const mapped = uploaded.map((item, index) => ({
                ...item,
                position: item.position ?? prev.length + index,
            }));
            const updated = [...prev, ...mapped];
            setData('media', updated);
            return updated;
        });
    }, [setData]);

    const handleMediaRemoved = useCallback(async (mediaId) => {
        const target = media.find((item) => item.id === mediaId);
        setMedia((prev) => {
            const updated = prev.filter((item) => item.id !== mediaId);
            setData('media', updated);
            return updated;
        });

        if (!csrfToken || !target?.path || target?.is_external || target?.source === 'external') {
            return;
        }

        try {
            await fetch('/admin/news/media/temp', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ path: target.path }),
            });
        } catch (error) {
            console.error('Ошибка удаления медиа файла', error);
        }
    }, [media, csrfToken, setData]);

    const submitForm = useCallback((event = null, statusOverride = null) => {
        if (event) {
            event.preventDefault();
        }

        const finalStatus = statusOverride ?? data.status;
        setData('status', finalStatus);

        const payload = {
            ...data,
            status: finalStatus,
            media,
            body: editor ? editor.getHTML() : data.body,
            type: currentType,
            section: currentType,
            cover_image_path: data.cover_image_path || null,
            // Для типа "media" всегда передаем пустой массив категорий
            category: currentType === 'media' ? [] : (data.category || []),
        };
        delete payload.cover;

        const onFinish = () => {
            setIsPublishing(false);
        };

        const onSuccess = () => {
            if (!isEditing) {
                reset();
                setMedia([]);
                setData('media', []);
                setData('category', []);
                editor?.commands?.clearContent(true);
            }
        };

        if (isEditing) {
            router.post(route('admin.news.update', { news: news.id }), {
                ...payload,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onFinish,
                onSuccess,
            });
        } else {
            console.log('Отправка формы создания новости (Form.jsx):', {
                title: payload.title,
                body_length: payload.body?.length || 0,
                category_count: payload.category?.length || 0,
                status: payload.status,
                media_count: media.length,
                type: payload.type
            });

            router.post(route('admin.news.store'), payload, {
                forceFormData: true,
                onFinish,
                onSuccess,
                onError: (errors) => {
                    console.error('Ошибки валидации в Form.jsx:', errors);
                    if (errors) {
                        Object.keys(errors).forEach(key => {
                            console.error(`Ошибка в поле ${key}:`, errors[key]);
                        });

                        // Если ошибка 419 (CSRF токен истек), обновляем страницу
                        if (errors.error && errors.error.includes('419') ||
                            (typeof errors === 'object' && errors.status === 419)) {
                            alert('Сессия истекла. Страница будет обновлена.');
                            window.location.reload();
                            return;
                        }
                    }
                },
                onCancel: () => {
                    console.log('Запрос отменен');
                },
            });
        }
    }, [data, media, isEditing, news?.id, editor, reset, setData, currentType]);

    const handlePublishNow = useCallback(() => {
        setIsPublishing(true);
        submitForm(null, 'published');
    }, [submitForm]);

    return (
        <AdminLayout title={meta?.title}>
            <div className="min-h-screen bg-gray-50/50 pb-12 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100/80 relative overflow-hidden">
                        {/* Decorative gradient blob */}
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                    {isEditing
                                        ? (meta?.editLabel || 'Редактировать новость')
                                        : (meta?.createLabel || 'Создать новость')}
                                </h1>
                                {meta?.subtitle && (
                                    <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {meta.subtitle}
                                    </p>
                                )}
                            </div>

                            <Link
                                href={indexRoute}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50/50/80 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                {meta?.returnLabel || 'Вернуться к списку'}
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={(event) => submitForm(event)} className="space-y-6">
                        {/* Парсер URL для материалов СМИ */}
                        {currentType === 'media' && (
                            <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-100/50 rounded-2xl p-6 md:p-8">
                                <UrlParser
                                    initialUrl={data.external_url}
                                    onUrlChange={(url) => {
                                        // Обновляем external_url при изменении URL в поле ввода
                                        setData('external_url', url);
                                    }}
                                    onMetadataParsed={(metadata) => {
                                        // Автозаполнение полей из метаданных
                                        if (metadata.title && !data.title) {
                                            setData('title', metadata.title);
                                        }
                                        if (metadata.description && !data.excerpt) {
                                            setData('excerpt', metadata.description);
                                        }
                                        if (metadata.description && !data.body) {
                                            setData('body', `<p>${metadata.description}</p>`);
                                            editor?.commands.setContent(`<p>${metadata.description}</p>`);
                                        }
                                        if (metadata.image) {
                                            // Добавляем изображение как медиа (даже если уже есть медиа)
                                            const imageMedia = {
                                                id: `external-${Date.now()}`,
                                                type: 'image',
                                                path: metadata.image,
                                                url: metadata.image,
                                                name: metadata.title || 'Изображение',
                                                is_external: true,
                                                is_cover: true, // Помечаем как обложку
                                            };
                                            // Если медиа уже есть, добавляем в начало, иначе создаем новый массив
                                            if (media.length > 0) {
                                                setMedia([imageMedia, ...media]);
                                            } else {
                                                setMedia([imageMedia]);
                                            }
                                            // Также устанавливаем как cover_image_path для сохранения
                                            setData('cover_image_path', metadata.image);
                                        }
                                        // Сохраняем URL
                                        setData('external_url', metadata.url);
                                    }}
                                />
                                <InputError message={errors.external_url} className="mt-2" />
                            </div>
                        )}

                        <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-100/50 rounded-2xl p-6 md:p-8 space-y-8">
                            <div>
                                <InputLabel htmlFor="title" value="Заголовок *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    placeholder={currentType === 'media' ? 'Заголовок будет заполнен автоматически из ссылки' : 'Введите заголовок новости'}
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Для СМИ скрываем ненужные поля, если данные уже подтянуты */}
                            {currentType !== 'media' && (
                                <>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <InputLabel htmlFor="slug" value="URL-адрес (slug)" />
                                            <button
                                                type="button"
                                                onClick={generateSlug}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Обновить из заголовка
                                            </button>
                                        </div>
                                        <TextInput
                                            id="slug"
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Автоматически генерируется из заголовка"
                                        />
                                        <InputError message={errors.slug} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="excerpt" value="Краткое описание" />
                                        <textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            rows={3}
                                            placeholder="Краткое описание новости для превью..."
                                        />
                                        <InputError message={errors.excerpt} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="body" value="Текст новости *" />
                                        <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
                                            {editor && (
                                                <div className="border-b border-gray-100 bg-gray-50/50/80 backdrop-blur-sm px-3 py-2 flex flex-wrap gap-1.5 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                                        className={`px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors ${editor.isActive('bold') ? 'bg-white shadow-sm text-blue-600 border border-gray-200' : 'text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent'}`}
                                                    >
                                                        Жирный
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                                        className={`px-3 py-1.5 rounded-2xl text-sm font-medium italic transition-colors ${editor.isActive('italic') ? 'bg-white shadow-sm text-blue-600 border border-gray-200' : 'text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent'}`}
                                                    >
                                                        Курсив
                                                    </button>
                                                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                                        className={`px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-blue-600 border border-gray-200' : 'text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent'}`}
                                                    >
                                                        Список
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().setParagraph().run()}
                                                        className="px-3 py-1.5 rounded-2xl text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent transition-colors"
                                                    >
                                                        Абзац
                                                    </button>
                                                </div>
                                            )}
                                            <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[320px] focus:outline-none" />
                                        </div>
                                        <InputError message={errors.body} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="seo_title" value="SEO заголовок" />
                                            <TextInput
                                                id="seo_title"
                                                type="text"
                                                value={data.seo_title}
                                                onChange={(e) => setData('seo_title', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Если не указано — используется основной заголовок"
                                            />
                                            <InputError message={errors.seo_title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="seo_description" value="SEO описание" />
                                            <textarea
                                                id="seo_description"
                                                value={data.seo_description}
                                                onChange={(e) => setData('seo_description', e.target.value)}
                                                className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                                rows={2}
                                                placeholder="Если не указано — используется краткое описание"
                                            />
                                            <InputError message={errors.seo_description} className="mt-2" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <InputLabel value="Язык версии / Тіл нұсқасы" className="mb-2" />
                                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200 shadow-inner">
                                        <div className="flex items-center">
                                            <input
                                                id="locale_ru"
                                                name="locale"
                                                type="radio"
                                                value="ru"
                                                checked={data.locale === 'ru'}
                                                onChange={(e) => setData('locale', e.target.value)}
                                                className="h-4 w-4 border-gray-200 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="locale_ru" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                                                Русская версия
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="locale_kz"
                                                name="locale"
                                                type="radio"
                                                value="kz"
                                                checked={data.locale === 'kz'}
                                                onChange={(e) => setData('locale', e.target.value)}
                                                className="h-4 w-4 border-gray-200 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="locale_kz" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                                                Қазақша нұсқасы
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="locale_en"
                                                name="locale"
                                                type="radio"
                                                value="en"
                                                checked={data.locale === 'en'}
                                                onChange={(e) => setData('locale', e.target.value)}
                                                className="h-4 w-4 border-gray-200 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="locale_en" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                                                English (отображается везде)
                                            </label>
                                        </div>
                                    </div>
                                    <InputError message={errors.locale} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value={currentType === 'media' ? 'Статус' : 'Статус *'} />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        required={currentType !== 'media'}
                                    >
                                        <option value="draft">Черновик</option>
                                        <option value="published">Опубликовано</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="published_at" value="Дата и время публикации" />
                                    <TextInput
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.published_at} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Категории и медиа только для обычных новостей */}
                        {currentType !== 'media' && (
                            <>
                                <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-100/50 rounded-2xl p-6 md:p-8">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Категории</h2>
                                    {availableCategories.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            Список категорий пуст. Обратитесь к администратору для настройки.
                                        </p>
                                    ) : (
                                        <CategorySelector
                                            selectedCategories={data.category}
                                            onCategoriesChange={(categories) => setData('category', categories)}
                                            availableCategories={availableCategories}
                                            maxCategories={5}
                                        />
                                    )}
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-100/50 rounded-2xl p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">Галерея</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Загрузите дополнительные изображения или видео (поддерживаются форматы jpg, png, webp, mp4 и др.).
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-400">Файлов: {media.length}</span>
                                    </div>
                                    <ModernMediaUploader
                                        existingMedia={media}
                                        onMediaUploaded={handleMediaUploaded}
                                        onMediaRemoved={handleMediaRemoved}
                                        maxFiles={30}
                                    />
                                    <InputError message={errors.media} className="mt-2" />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-6 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm mt-8">
                            <Link
                                href={indexRoute}
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50/50 focus:ring-4 focus:ring-gray-100 transition-all font-medium text-center"
                            >
                                Отмена
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing || isPublishing}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                {processing
                                    ? 'Сохранение...'
                                    : isEditing
                                        ? 'Сохранить изменения'
                                        : (meta?.createLabel || 'Создать запись')}
                            </PrimaryButton>
                            {!isEditing && (
                                <PrimaryButton
                                    type="button"
                                    disabled={processing || isPublishing}
                                    onClick={handlePublishNow}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl shadow-md hover:shadow-lg focus:ring-green-300 transition-all"
                                >
                                    {isPublishing ? 'Публикация...' : 'Сохранить и опубликовать'}
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

