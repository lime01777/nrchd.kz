import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilesAccord from '@/Components/FilesAccord';
import { usePage } from '@inertiajs/react';

export default function PageAccordions() {
    const [accordions, setAccordions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { url } = usePage();
    
    // Получаем текущий маршрут страницы из URL
    const getCurrentRoute = () => {
        const path = url.split('?')[0]; // Удаляем параметры запроса, если они есть
        console.log('Current path:', path); // Отладочный вывод
        
        // Маппинг путей на имена маршрутов
        const routeMap = {
            '/medical-education': 'medical.education',
            '/human-resources': 'human.resources',
            '/science': 'science',
            '/international-cooperation': 'international.cooperation',
            '/press-center': 'press.center',
            // Добавьте другие маршруты по мере необходимости
        };
        
        // Для страницы медицинского образования всегда возвращаем правильный маршрут
        if (path.includes('medical-education')) {
            console.log('Detected medical education page, using route: medical.education');
            return 'medical.education';
        }
        
        // Проверяем точное совпадение
        if (routeMap[path]) {
            return routeMap[path];
        }
        
        // Если точного совпадения нет, проверяем частичное совпадение
        for (const [urlPath, routeName] of Object.entries(routeMap)) {
            if (path.includes(urlPath)) {
                return routeName;
            }
        }
        
        console.log('No route found for path:', path); // Отладочный вывод
        return '';
    };
    
    useEffect(() => {
        const fetchAccordions = async () => {
            try {
                setLoading(true);
                const pageRoute = getCurrentRoute();
                console.log('Fetching accordions for route:', pageRoute); // Отладочный вывод
                
                if (!pageRoute) {
                    setAccordions([]);
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(`${window.location.origin}/api/accordions-for-page`, {
                    params: { page_route: pageRoute }
                });
                
                console.log('Accordions data:', response.data); // Отладочный вывод
                setAccordions(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Ошибка при загрузке аккордеонов:', err);
                setError('Не удалось загрузить аккордеоны для этой страницы');
                setLoading(false);
            }
        };
        
        fetchAccordions();
    }, [url]);
    
    if (loading) {
        return <div className="text-center py-4">Загрузка аккордеонов...</div>;
    }
    
    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }
    
    if (accordions.length === 0) {
        return null;
    }
    
    return (
        <div className="container px-5 py-8 mx-auto">
            {accordions.map((accordion) => (
                <div key={accordion.id} className="mb-8">
                    <FilesAccord 
                        title={accordion.title} 
                        folder={accordion.folder_path} 
                        bgColor={accordion.bg_color}
                        name={accordion.name}
                    />
                </div>
            ))}
        </div>
    );
}
