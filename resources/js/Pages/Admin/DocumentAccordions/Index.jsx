import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Table, Button, Badge } from '@/Components/UI';

export default function Index() {
    const { accordions = [], flash } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Управление аккордеонами документов" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Управление аккордеонами документов</h1>
                    <Link href={route('admin.document-accordions.create')}>
                        <Button variant="primary">Добавить аккордеон</Button>
                    </Link>
                </div>

                {flash && flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{flash.success}</span>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <Table>
                        <Table.Head>
                            <Table.Row>
                                <Table.Cell>ID</Table.Cell>
                                <Table.Cell>Название</Table.Cell>
                                <Table.Cell>Страница</Table.Cell>
                                <Table.Cell>Папка</Table.Cell>
                                <Table.Cell>Заголовок</Table.Cell>
                                <Table.Cell>Статус</Table.Cell>
                                <Table.Cell>Порядок</Table.Cell>
                                <Table.Cell>Действия</Table.Cell>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            {accordions && accordions.length > 0 ? (
                                accordions.map((accordion) => (
                                    <Table.Row key={accordion.id}>
                                        <Table.Cell>{accordion.id}</Table.Cell>
                                        <Table.Cell>{accordion.name}</Table.Cell>
                                        <Table.Cell>{accordion.page_route || 'Не указано'}</Table.Cell>
                                        <Table.Cell className="max-w-xs truncate" title={accordion.folder_path}>
                                            {accordion.folder_path}
                                        </Table.Cell>
                                        <Table.Cell>{accordion.title}</Table.Cell>
                                        <Table.Cell>
                                            {accordion.is_active ? (
                                                <Badge variant="success">Активен</Badge>
                                            ) : (
                                                <Badge variant="default">Неактивен</Badge>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{accordion.sort_order}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex space-x-2">
                                                <Link href={route('admin.document-accordions.edit', accordion.id)}>
                                                    <Button variant="primary" className="mr-2">
                                                        Редактировать
                                                    </Button>
                                                </Link>
                                                <Link 
                                                    href={route('admin.document-accordions.destroy', accordion.id)} 
                                                    method="delete" 
                                                    as="button"
                                                    onBefore={() => confirm('Вы уверены, что хотите удалить этот аккордеон?')}
                                                >
                                                    <Button variant="danger">
                                                        Удалить
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan="8" className="text-center py-4">
                                        Аккордеоны не найдены
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
