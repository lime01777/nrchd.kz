import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Input, Select, Checkbox } from '@/Components/UI';
import { getPageColor } from '@/Utils/pageColors';

export default function Edit({ accordion, folders, pages }) {
    const { data, setData, put, processing, errors } = useForm({
        name: accordion.name || '',
        page_route: accordion.page_route || '',
        folder_path: accordion.folder_path || '',
        title: accordion.title || '',
        is_active: accordion.is_active || false,
        sort_order: accordion.sort_order || 0,
        bg_color: accordion.bg_color || 'bg-gray-100' // Добавляем поле bg_color с данными из аккордеона
    });

    // Фильтрация страниц для отображения только направлений и их подстраниц
    const directionPages = pages.filter(page => {
        const route = page.route.toLowerCase();
        return route.includes('direction') || 
               route.includes('направления') || 
               route.includes('napravlenia') ||
               route.includes('primaryhealthcare') ||
               route.includes('electronichealth') ||
               route.includes('healthrate');
    });
    
    // Сортировка страниц по имени для удобства
    directionPages.sort((a, b) => a.name.localeCompare(b.name));

    // Доступные цвета для выбора
    const availableColors = [
        { value: 'bg-gray-100', label: 'Серый' },
        { value: 'bg-red-100', label: 'Красный' },
        { value: 'bg-blue-100', label: 'Синий' },
        { value: 'bg-green-100', label: 'Зеленый' },
        { value: 'bg-yellow-100', label: 'Желтый' },
        { value: 'bg-purple-100', label: 'Фиолетовый' },
        { value: 'bg-pink-100', label: 'Розовый' },
        { value: 'bg-indigo-100', label: 'Индиго' },
        { value: 'bg-orange-100', label: 'Оранжевый' },
        { value: 'bg-teal-100', label: 'Бирюзовый' },
        { value: 'bg-fuchsia-100', label: 'Фуксия' },
    ];

    // Автоматически устанавливаем цвет фона на основе выбранной страницы
    const handlePageChange = (e) => {
        const pageRoute = e.target.value;
        const bgColor = getPageColor(pageRoute) || 'bg-gray-100';
        
        setData({
            ...data,
            page_route: pageRoute,
            bg_color: bgColor
        });
        
        // Название аккордеона по умолчанию равно названию выбранной страницы
        if (!data.name) {
            const selectedPage = pages.find(page => page.route === pageRoute);
            if (selectedPage) {
                setData('name', selectedPage.name);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.document-accordions.update', accordion.id), data);
    };

    return (
        <AdminLayout>
            <Head title="Редактирование аккордеона документов" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Редактирование аккордеона документов</h1>
                    <Link href={route('admin.document-accordions.index')}>
                        <Button variant="secondary">Назад к списку</Button>
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Select
                                    label="Страница направления"
                                    name="page_route"
                                    value={data.page_route}
                                    onChange={handlePageChange}
                                    error={errors.page_route}
                                    required
                                >
                                    <option value="">Выберите страницу направления</option>
                                    {directionPages.map((page) => (
                                        <option key={page.route} value={page.route}>
                                            {page.name} ({page.route})
                                        </option>
                                    ))}
                                </Select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Всего найдено страниц направлений: {directionPages.length}
                                </p>
                            </div>
                            
                            <div>
                                <Input
                                    label="Название аккордеона"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />
                            </div>
                            
                            <div>
                                <Select
                                    label="Папка с документами"
                                    name="folder_path"
                                    value={data.folder_path}
                                    onChange={(e) => setData('folder_path', e.target.value)}
                                    error={errors.folder_path}
                                    required
                                >
                                    <option value="">Выберите папку</option>
                                    {folders.map((folder) => (
                                        <option key={folder.path} value={folder.path}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            
                            <div>
                                <Input
                                    label="Заголовок аккордеона"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Заголовок, который будет отображаться на странице
                                </p>
                            </div>
                            
                            <div>
                                <Input
                                    label="Порядок сортировки"
                                    name="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                    error={errors.sort_order}
                                />
                            </div>
                            
                            <div>
                                <Select
                                    label="Цвет фона"
                                    name="bg_color"
                                    value={data.bg_color}
                                    onChange={(e) => setData('bg_color', e.target.value)}
                                    error={errors.bg_color}
                                >
                                    {availableColors.map((color) => (
                                        <option key={color.value} value={color.value}>
                                            {color.label}
                                        </option>
                                    ))}
                                </Select>
                                <div className={`mt-2 p-2 rounded ${data.bg_color}`}>
                                    Предпросмотр выбранного цвета
                                </div>
                            </div>
                            
                            <div className="flex items-center mt-4">
                                <Checkbox
                                    name="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    label="Активен"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
