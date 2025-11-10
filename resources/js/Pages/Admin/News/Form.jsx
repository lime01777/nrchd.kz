import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ModernMediaUploader from '@/Components/Admin/News/ModernMediaUploader';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

/**
 * Форма создания/редактирования новости с поддержкой галереи.
 */
export default function Form({ news = null, media: initialMediaProp = [], section = null, type = 'news' }) {
    const isEditing = Boolean(news);
    const initialMedia = useMemo(() => {
        if (Array.isArray(news?.media)) {
            return news.media;
        }

        if (Array.isArray(initialMediaProp)) {
            return initialMediaProp;
        }

        return [];
    }, [news?.media, initialMediaProp]);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const currentType = type || section?.type || news?.type || 'news';

    const { data, setData, processing, errors, reset } = useForm({
        title: news?.title || '',
        slug: news?.slug || '',
        excerpt: news?.excerpt || '',
        body: news?.body || '',
        seo_title: news?.seo_title || '',
        seo_description: news?.seo_description || '',
        status: news?.status || 'draft',
        published_at: news?.published_at || '',
        media: initialMedia,
        type: currentType,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, news?.id, initialMedia]);

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
                editor?.commands?.clearContent(true);
            }
        };

        if (isEditing) {
            router.post(route('admin.news.update', { news: news.id, type: currentType }), {
                ...payload,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onFinish,
                onSuccess,
            });
        } else {
            router.post(route('admin.news.store', { type: currentType }), payload, {
                forceFormData: true,
                onFinish,
                onSuccess,
            });
        }
    }, [data, media, isEditing, news?.id, editor, reset, setData, currentType]);

    const handlePublishNow = useCallback(() => {
        setIsPublishing(true);
        submitForm(null, 'published');
    }, [submitForm]);

    return (
        <AdminLayout title={section?.title}>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditing
                                ? (section?.editLabel || 'Редактировать новость')
                                : (section?.createLabel || 'Создать новость')}
                        </h1>
                        {section?.subtitle && (
                            <p className="mt-1 text-sm text-gray-500">{section.subtitle}</p>
                        )}
                        <Link
                            href={route('admin.news.index', { type: currentType })}
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <span className="mr-2">←</span>
                            {section?.returnLabel || 'Вернуться к списку'}
                        </Link>
                    </div>

                    <form onSubmit={(event) => submitForm(event)} className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Заголовок *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Краткое описание новости для превью..."
                                />
                                <InputError message={errors.excerpt} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="body" value="Текст новости *" />
                                <div className="mt-1 border border-gray-300 rounded-md">
                                    {editor && (
                                        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleBold().run()}
                                                className={`px-3 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                                            >
                                                Жирный
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                                className={`px-3 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                            >
                                                Курсив
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                                className={`px-3 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                            >
                                                Список
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().setParagraph().run()}
                                                className="px-3 py-1 rounded text-sm hover:bg-gray-100"
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows={2}
                                        placeholder="Если не указано — используется краткое описание"
                                    />
                                    <InputError message={errors.seo_description} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="status" value="Статус *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
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

                        <div className="bg-white shadow rounded-lg p-6">
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

                        <div className="flex flex-wrap justify-end gap-4">
                            <Link
                                href={route('admin.news.index', { type: currentType })}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Отмена
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing || isPublishing}
                                className="px-4 py-2"
                            >
                                {processing
                                    ? 'Сохранение...'
                                    : isEditing
                                        ? 'Сохранить изменения'
                                        : (section?.createLabel || 'Создать запись')}
                            </PrimaryButton>
                            {!isEditing && (
                                <PrimaryButton
                                    type="button"
                                    disabled={processing || isPublishing}
                                    onClick={handlePublishNow}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700"
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

