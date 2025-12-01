/**
 * Контактная информация для всех филиалов
 * Данные из таблицы контактов филиалов
 * Обновлено на основе предоставленной таблицы
 */

export const branchesContacts = {
    // Городские филиалы
    'Astana': {
        address: 'г. Астана, ул. Иманова, д.13',
        phone: '8 (7172) 731-205',
        email: 'astana@nrchd.kz'
    },
    'Almaty': {
        address: 'г. Алматы, ул. Кунаева, д.86, 4 этаж',
        phone: '8 (727) 351-98-37',
        email: 'almaty@nrchd.kz'
    },
    'Shymkent': {
        address: 'г. Шымкент, проспект Республики, 12А, 9 этаж',
        phone: '8 (7252) 56-28-29',
        email: 'shymkent@nrchd.kz'
    },
    
    // Областные филиалы
    'AlmatyRegion': {
        address: 'г. Конаев, ул. Жамбыла, д.11/1',
        phone: '8 (72772) 23-605',
        email: 'almaty.obl@nrchd.kz'
    },
    'Akmola': {
        address: 'г. Кокшетау, проспект Н. Назарбаева, 7А',
        phone: '8 (7162) 51-40-72',
        email: 'akmola@nrchd.kz'
    },
    'Aktobe': {
        address: 'г. Актобе, проспект Победы, 13',
        phone: '8 (7132) 46-24-54',
        email: 'aktobe@nrchd.kz'
    },
    'Atyrau': {
        address: 'г. Атырау, ул. Әйтеке би, 77',
        phone: '8 (7122) 95-66-02',
        email: 'atyrau@nrchd.kz'
    },
    'Abay': {
        address: 'г. Семей, ул. Кашаганова, 18',
        phone: '8 (7222) 35-56-54',
        email: 'abay@nrchd.kz'
    },
    'Zhambyl': {
        address: 'г. Тараз, ул. Рысбек батыра, 13Г',
        phone: '8 (7262) 34-70-09',
        email: 'zhambyl@nrchd.kz'
    },
    'Zhetisu': {
        address: 'г. Талдыкорган, ул. Желтоксан, 1',
        phone: '8 (7282) 41-06-34',
        email: 'zhetysu@nrchd.kz'
    },
    'West': {
        address: 'г. Уральск, ул. Алматинская, 60, 4 этаж',
        phone: '8 (7112) 24-08-21',
        email: 'zko@nrchd.kz'
    },
    'East': {
        address: 'г. Усть-Каменогорск, ул. Серикбаева, 1, корпус 3, 2 этаж',
        phone: '8 (7232) 61-02-57',
        email: 'vko@nrchd.kz'
    },
    'Karaganda': {
        address: 'г. Караганда, ул. Алиханова, 2',
        phone: '8 (7212) 42-04-56',
        email: 'karaganda@nrchd.kz'
    },
    'Kyzylorda': {
        address: 'г. Кызылорда, пр. Абая, 27, 4 этаж',
        phone: '8 (7242) 23-43-89',
        email: 'kyzylorda@nrchd.kz'
    },
    'Kostanay': {
        address: 'г. Костанай, ул. Быковского, 4а',
        phone: '8 (7142) 26-11-02',
        email: 'kostanay@nrchd.kz'
    },
    'Mangistau': {
        address: 'г. Актау, 16 мкр, здание 22/1',
        phone: '8 (7292) 202-642',
        email: 'mangystau@nrchd.kz'
    },
    'Pavlodar': {
        address: 'г. Павлодар, ул. Астана, 59, 3 этаж, 314 кб.',
        phone: '8 (7182) 32-33-18',
        email: 'pavlodar@nrchd.kz'
    },
    'North': {
        address: 'г. Петропавловск, ул. Сатпаева, 3',
        phone: '8 (7152) 33-39-81',
        email: 'sko@nrchd.kz'
    },
    'Turkestan': {
        address: 'г. Туркестан, 1 м/н, здание 6А, 5 этаж',
        phone: '8 (72533) 9-66-25',
        email: 'turkestan@nrchd.kz'
    },
    'Ulytau': {
        address: 'г. Жезказган, ул. Анаркулова, 9, 1 этаж',
        phone: '8 (7102) 41-45-97',
        email: 'ulytau@nrchd.kz'
    }
};

/**
 * Получить контактную информацию для филиала
 * @param {string} branchFolder - Код папки филиала
 * @returns {object|null} - Объект с контактами или null, если не найден
 */
export function getBranchContacts(branchFolder) {
    if (!branchFolder) return null;
    
    // Нормализуем ключ (первая буква заглавная, остальные строчные)
    const normalizedKey = branchFolder.charAt(0).toUpperCase() + branchFolder.slice(1).toLowerCase();
    
    return branchesContacts[normalizedKey] || branchesContacts[branchFolder] || null;
}

