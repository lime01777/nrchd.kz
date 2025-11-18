import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};

// Создаем кастомный маркер с использованием DivIcon
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color: #0078FF; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #FFF; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Данные о молодежных центрах здоровья
const youthHealthCenters = [
  // Атырауская область
  {
    id: 1,
    name: 'Молодежный центр здоровья «Самға»',
    org: 'КГП на ПХВ «Геологская поликлиника»',
    address: 'город Атырау, микрорайон Геолог, Трасса Атырау-Доссор Строение 49',
    region: 'Атырауская область',
    position: [47.1185, 51.9207]
  },
  {
    id: 2,
    name: 'Молодежный центр здоровья «Сенім»',
    org: 'КГП на ПХВ «Атырауская городская поликлиника № 7»',
    address: 'город Атырау, улица С.Бейбарыс строение 39',
    region: 'Атырауская область',
    position: [47.1058, 51.9239]
  },
  
  // Алматинская область
  {
    id: 3,
    name: 'Молодежный центр здоровья «Өмір қуаты»',
    org: 'ГКП на ПХВ «Городская многопрофильная больница города Конаев»',
    address: 'город Конаев, улица Абая 5а /1',
    region: 'Алматинская область',
    position: [43.8833, 77.0833]
  },
  
  // Актюбинская область
  {
    id: 4,
    name: 'Молодежный центр здоровья «Жастар»',
    org: 'ГКП на ПХВ «Городская поликлиника №2»',
    address: 'город Актобе, улица Ахтанова, 50а',
    region: 'Актюбинская область',
    position: [50.3004, 57.1513]
  },
  {
    id: 5,
    name: 'Молодежный центр здоровья «Жасдаурен»',
    org: 'ГКП на ПХВ «Городская поликлиника №6»',
    address: 'город Актобе, улица Есет батыр, 85',
    region: 'Актюбинская область',
    position: [50.2905, 57.1820]
  },
  {
    id: 6,
    name: 'Молодежный центр здоровья «Ювентус»',
    org: 'ГКП на ПХВ «Городская поликлиника №7»',
    address: 'город Актобе, улица Бокенбай батыра, 50А',
    region: 'Актюбинская область',
    position: [50.2836, 57.1669]
  },
  {
    id: 7,
    name: 'Молодежный центр здоровья «Самғау»',
    org: 'НАО ЗКМУ им. М. Оспанова Клиника семейной медицины',
    address: 'город Актобе, улица Маресьева, 74',
    region: 'Актюбинская область',
    position: [50.2975, 57.1457]
  },
  
  // Акмолинская область
  {
    id: 8,
    name: 'Молодежный центр здоровья «Панацея»',
    org: 'ТОО «Клиника Панацея»',
    address: 'город Кокшетау, улица Ауэзова 208А',
    region: 'Акмолинская область',
    position: [53.2818, 69.3972]
  },
  {
    id: 9,
    name: 'Молодежный центр здоровья при Городской поликлинике',
    org: 'ГКП на ПХВ «Городская поликлиника»',
    address: 'город Кокшетау, улица Сейфулина 35',
    region: 'Акмолинская область',
    position: [53.2856, 69.3912]
  },
  
  // Область Абай
  {
    id: 10,
    name: 'Молодежный центр здоровья «Жас Асыл»',
    org: 'КГП на ПХВ «Поликлиника №2 города Семей» УЗ области Абай',
    address: 'город Семей, улица Байтурсынова, 27',
    region: 'Область Абай',
    position: [50.4235, 80.2582]
  },
  {
    id: 11,
    name: 'Молодежный центр здоровья «Жас Өмір»',
    org: 'КГП на ПХВ «Поликлиника №1 города Семей» УЗ области Абай',
    address: 'город Семей, улица Кабанбай батыра 79',
    region: 'Область Абай',
    position: [50.4179, 80.2573]
  },
  {
    id: 12,
    name: 'Молодежный центр здоровья «Салауат»',
    org: 'ТОО «Семейская железнодорожная больница»',
    address: 'город Семей, улица Засядко 91',
    region: 'Область Абай',
    position: [50.4162, 80.2619]
  },
  {
    id: 13,
    name: 'Молодежный центр здоровья «Үміт»',
    org: 'КГП на ПХВ «Многопрофильная центральная районная больница Аягозского района» УЗ области Абай',
    address: 'город Аягоз, улица Рахимова 1а, 3 этаж, кабинет 59',
    region: 'Область Абай',
    position: [47.9623, 80.4401]
  },
  
  // Восточно-Казахстанская область
  {
    id: 14,
    name: 'Молодежный центр здоровья',
    org: 'ТОО «Моя семейная амбулатория»',
    address: 'город Усть-Каменогорск, улица Грузинская 7',
    region: 'Восточно-Казахстанская область',
    position: [49.9781, 82.6112]
  },
  {
    id: 15,
    name: 'Молодежный центр здоровья',
    org: 'ТОО «Вита-1»',
    address: 'город Усть-Каменогорск',
    region: 'Восточно-Казахстанская область',
    position: [49.9522, 82.6295]
  },
  {
    id: 16,
    name: 'Молодежный центр здоровья «Болашак»',
    org: 'КГП на ПХВ «Городская поликлиника №2 города Усть-Каменогорска»',
    address: 'город Усть-Каменогорск, улица Бурова, 61',
    region: 'Восточно-Казахстанская область',
    position: [49.9521, 82.6295]
  },
  {
    id: 17,
    name: 'Молодежный центр здоровья «Үміт»',
    org: 'КГП на ПХВ «Поликлиника №1 города Усть-Каменогорск»',
    address: 'город Усть-Каменогорск, проспект Ауезова, 18',
    region: 'Восточно-Казахстанская область',
    position: [49.9499, 82.6206]
  },
  {
    id: 18,
    name: 'Молодежный центр здоровья «Сенім»',
    org: 'ТОО «Ем алу плюс»',
    address: 'город Усть-Каменогорск, улица Б.Шаяхметова 1/3',
    region: 'Восточно-Казахстанская область',
    position: [49.9552, 82.6189]
  },
  {
    id: 19,
    name: 'Молодежный центр здоровья «Денсаулык»',
    org: 'ТОО «ВА «Денсаулык»',
    address: 'город Усть-Каменогорск, улица Бурова 53',
    region: 'Восточно-Казахстанская область',
    position: [49.9501, 82.6279]
  },
  
  // Жамбылская область
  {
    id: 20,
    name: 'Молодежный центр здоровья «Жігер»',
    org: 'Januia medical center',
    address: 'город Тараз, улица Пушкина 41',
    region: 'Жамбылская область',
    position: [42.9006, 71.3677]
  },
  {
    id: 21,
    name: 'Молодежный центр здоровья «Жан-нұр»',
    org: 'КГП на ПХВ «Городская поликлиника №2»',
    address: 'город Тараз, микрорайон Салтанат 29А',
    region: 'Жамбылская область',
    position: [42.8951, 71.3612]
  },
  {
    id: 22,
    name: 'Молодежный центр здоровья «Алмаз»',
    org: 'Almaz Medical Group',
    address: 'город Тараз, микрорайон Алатау 54а',
    region: 'Жамбылская область',
    position: [42.9035, 71.3729]
  },
  {
    id: 23,
    name: 'Молодежный центр здоровья «Жастар»',
    org: 'ГКП на ПХВ «Городская поликлиника №5»',
    address: 'город Тараз, улица Рыспек батыр 13А, Батыр',
    region: 'Жамбылская область',
    position: [42.8988, 71.3689]
  },
  {
    id: 24,
    name: 'Молодежный центр здоровья «Жан-Шуақ»',
    org: 'ТОО «Zhanshuak Medical Group»',
    address: 'город Тараз',
    region: 'Жамбылская область',
    position: [42.9006, 71.3677]
  },
  {
    id: 25,
    name: 'Молодежный центр здоровья «Мейірім»',
    org: 'Учреждение Медицинский центр «Мейірім»',
    address: 'город Тараз, улица Байзак батыра 227',
    region: 'Жамбылская область',
    position: [42.9057, 71.3752]
  },
  {
    id: 26,
    name: 'Молодежный центр здоровья при Городской поликлинике города Шу',
    org: 'КГП на ПХВ «Городская поликлиника города Шу»',
    address: 'город Шу, улица Сатпаева 155',
    region: 'Жамбылская область',
    position: [43.6001, 73.7609]
  },
  
  // Область Жетысу
  {
    id: 27,
    name: 'Молодежный центр здоровья',
    org: 'ГКП на ПХВ «Городская поликлиника города Талдыкорган»',
    address: 'город Талдыкорган, улица Кабанбай батыра, 66',
    region: 'Область Жетысу',
    position: [45.0167, 78.3667]
  },
  
  // Западно-Казахстанская область
  {
    id: 28,
    name: 'Молодежный центр здоровья «Болашак»',
    org: 'ГКП на ПХВ «Городская поликлиника №5»',
    address: 'город Уральск',
    region: 'Западно-Казахстанская область',
    position: [51.2278, 51.3862]
  },
  {
    id: 29,
    name: 'Молодежный центр здоровья «Жастар»',
    org: 'ГКП на ПХВ «Городская поликлиника №1»',
    address: 'город Уральск',
    region: 'Западно-Казахстанская область',
    position: [51.2152, 51.3789]
  },
  {
    id: 30,
    name: 'Молодежный центр здоровья «Демеу»',
    org: 'ГКП на ПХВ «Городская поликлиника №4»',
    address: 'город Уральск',
    region: 'Западно-Казахстанская область',
    position: [51.2206, 51.3923]
  },
  {
    id: 31,
    name: 'Молодежный центр здоровья «Қамқор»',
    org: 'ГКП на ПХВ «Городская поликлиника №6»',
    address: 'город Уральск',
    region: 'Западно-Казахстанская область',
    position: [51.2329, 51.3957]
  },
  
  // Караганская область
  {
    id: 32,
    name: 'Молодежный центр здоровья',
    org: 'ТОО «Студенттік емхана 1»',
    address: 'город Караганда, улица Университетская 28/3',
    region: 'Караганская область',
    position: [49.8026, 73.0997]
  },
  {
    id: 33,
    name: 'Молодежный центр здоровья «ДОС»',
    org: 'КГП «Поликлиника №3 города Караганды»',
    address: 'город Караганда, улица Шахтёров 78',
    region: 'Караганская область',
    position: [49.7982, 73.0854]
  },
  
  // Костанайская область
  {
    id: 34,
    name: 'Молодежный центр здоровья «Jastar MED»',
    org: 'ТОО «Костанайская железнодорожная больница»',
    address: 'город Костанай, улица Майлина, 81',
    region: 'Костанайская область',
    position: [53.2167, 63.6167]
  },
  
  // Кызылординская область
  {
    id: 35,
    name: 'Молодежный центр здоровья «Үміт»',
    org: 'КГП на ПХВ «Городская поликлиника №6»',
    address: 'город Кызылорда, Проспект Астана 1',
    region: 'Кызылординская область',
    position: [44.8426, 65.5029]
  },
  {
    id: 36,
    name: 'Молодежный центр здоровья «Шапагат»',
    org: 'КГП на ПХВ «Городская поликлиника №3»',
    address: 'город Кызылорда',
    region: 'Кызылординская область',
    position: [44.8489, 65.5082]
  },
  {
    id: 37,
    name: 'Областной центр здоровья молодежи',
    org: 'КГП на ПХВ «Центральная поликлиника»',
    address: 'город Кызылорда',
    region: 'Кызылординская область',
    position: [44.8457, 65.5057]
  },
  
  // Мангистауская область
  {
    id: 38,
    name: 'Молодежный центр здоровья «Жас толқын»',
    org: 'Актауская городская поликлиника №1',
    address: 'город Актау, 7-35а',
    region: 'Мангистауская область',
    position: [43.6563, 51.1596]
  },
  {
    id: 39,
    name: 'Молодежный центр здоровья «Ясин»',
    org: 'ТОО «Медицинский центр «Ясин»',
    address: 'город Актау, 19а-7/1',
    region: 'Мангистауская область',
    position: [43.6501, 51.1552]
  },
  {
    id: 40,
    name: 'Молодежный центр здоровья «Тұмар»',
    org: 'Актауская городская поликлиника №2',
    address: 'город Актау, 26-54',
    region: 'Мангистауская область',
    position: [43.6529, 51.1623]
  },
  {
    id: 41,
    name: 'Молодежный центр здоровья «Дарын»',
    org: 'Жанаозенская городская поликлиника №2',
    address: 'город Жанаозен, улица Сатпаева 3/7',
    region: 'Мангистауская область',
    position: [43.3412, 52.8623]
  },
  
  // Павлодарская область
  {
    id: 42,
    name: 'Молодежный центр здоровья',
    org: 'ТОО «Almaz Medical Group»',
    address: 'город Павлодар, улица генерала Дюсенова 4/3',
    region: 'Павлодарская область',
    position: [52.2957, 76.9579]
  },
  {
    id: 43,
    name: 'Молодежный центр здоровья «Болашак»',
    org: 'КГП на ПХВ «Поликлиника №3 города Экибастуз»',
    address: 'город Экибастуз, улица Машхур Жусуп 42',
    region: 'Павлодарская область',
    position: [51.7294, 75.3352]
  },
  {
    id: 44,
    name: 'Молодежный центр здоровья',
    org: 'КГП на ПХВ «Поликлиника №3 города Павлодара»',
    address: 'город Павлодар, улица Украинская 38/2 корпус 1, 3 этаж, кабинет 339',
    region: 'Павлодарская область',
    position: [52.2872, 76.9457]
  },
  
  // Северо-Казахстанская область
  {
    id: 45,
    name: 'Молодежный центр здоровья',
    org: 'КГП на ПХВ «Городская поликлиника №3»',
    address: 'город Петропавловск, улица Рахимова 27',
    region: 'Северо-Казахстанская область',
    position: [54.8667, 69.1500]
  },
  
  // Туркестанская область
  {
    id: 46,
    name: 'Молодежный центр здоровья «Саулық»',
    org: 'Туркестанская Городская поликлиника',
    address: 'город Туркестан, трасса Айналма тас жолы, 24',
    region: 'Туркестанская область',
    position: [43.3010, 68.2586]
  },
  {
    id: 47,
    name: 'Молодежный центр здоровья «Шаттық»',
    org: 'Ленгерская Городская поликлиника',
    address: 'город Ленгер, микрорайон Шанырак, улица Капал батыра, дом 2',
    region: 'Туркестанская область',
    position: [42.1882, 69.9089]
  },
  {
    id: 48,
    name: 'Молодежный центр здоровья «Алау»',
    org: 'Кентауская Городская поликлиника',
    address: 'город Кентау, улица Рыскулова 111',
    region: 'Туркестанская область',
    position: [43.5168, 68.5102]
  },
  
  // город Шымкент
  {
    id: 49,
    name: 'Молодежный центр здоровья «Сұңқар»',
    org: 'ГКП на ПХВ «Городская поликлиника №3»',
    address: 'город Шымкент, улица Рыскулова 111',
    region: 'город Шымкент',
    position: [42.3155, 69.5869]
  },
  {
    id: 50,
    name: 'Молодежный центр здоровья «Камея»',
    org: 'ТОО поликлиника «Kameya Pharm Group»',
    address: 'город Шымкент, микрорайон Восток, улица Жолан батыра 42/2',
    region: 'город Шымкент',
    position: [42.3201, 69.5923]
  },
  {
    id: 51,
    name: 'Молодежный центр здоровья «Болашақ»',
    org: 'ГКП на ПХВ «Городская поликлиника №13»',
    address: 'город Шымкент, улица Аскарова 26',
    region: 'город Шымкент',
    position: [42.3257, 69.5989]
  },
  {
    id: 52,
    name: 'Молодежный центр здоровья «Аль-Фараби»',
    org: 'ГКП на ПХВ «Городская поликлиника №6»',
    address: 'город Шымкент, микрорайон Самал-3, улица Аль-Фараби, 230',
    region: 'город Шымкент',
    position: [42.3102, 69.5806]
  },
  {
    id: 53,
    name: 'Молодежный центр здоровья «ДауМед»',
    org: 'ТОО поликлиника «ДауМед»',
    address: 'город Шымкент, микрорайон Асар, улица Ақкөпір 1/1',
    region: 'город Шымкент',
    position: [42.3306, 69.6052]
  },
  {
    id: 54,
    name: 'Молодежный центр здоровья «Жас Қыран»',
    org: 'ГКП на ПХВ «Городская поликлиника №7»',
    address: 'город Шымкент, микрорайон Онтустик, 8/1',
    region: 'город Шымкент',
    position: [42.3089, 69.5751]
  },
  {
    id: 55,
    name: 'Молодежный центр здоровья «Ер-Ана»',
    org: 'ТОО поликлиника «Ер-Ана»',
    address: 'город Шымкент, улица Акпан батыра 108',
    region: 'город Шымкент',
    position: [42.3223, 69.5957]
  },
  {
    id: 56,
    name: 'Молодежный центр здоровья «Жас толқын»',
    org: 'ТОО поликлиника «Дария Медикус»',
    address: 'город Шымкент, улица Көктерек 7/7',
    region: 'город Шымкент',
    position: [42.3279, 69.6023]
  },
  {
    id: 57,
    name: 'Молодежный центр здоровья «Жарқын болашақ»',
    org: 'ТОО поликлиника «14 Емдеу орталығы»',
    address: 'город Шымкент, улица Айтағы 21',
    region: 'город Шымкент',
    position: [42.3182, 69.5886]
  },
  
  // город Алматы
  {
    id: 58,
    name: 'Молодежный центр здоровья «Жас ұрпақ»',
    org: 'Городская поликлиника №4',
    address: 'город Алматы, Бостандыкский район, улица Торайгырова, дом 12а',
    region: 'город Алматы',
    position: [43.2579, 76.9454]
  },
  {
    id: 59,
    name: 'Молодежный центр здоровья «Жас Даурен»',
    org: 'Городская поликлиника №5',
    address: 'город Алматы, Алмалинский район, улица Макатаева 141',
    region: 'город Алматы',
    position: [43.2610, 76.9280]
  },
  {
    id: 60,
    name: 'Молодежный центр здоровья «AQ ZHOL»',
    org: 'Городская поликлиника №7',
    address: 'город Алматы, Бостандыкский район, улица Бухар Жырау 14',
    region: 'город Алматы',
    position: [43.2357, 76.9094]
  },
  {
    id: 61,
    name: 'Молодежный центр здоровья «Жас Канат»',
    org: 'Городская поликлиника №11',
    address: 'город Алматы, Бостандыкский район, улица Бухар Жырау 14',
    region: 'город Алматы',
    position: [43.2652, 76.9589]
  },
  {
    id: 62,
    name: 'Молодежный центр здоровья «Сұңқар»',
    org: 'Городская поликлиника №12',
    address: 'город Алматы, Бостандыкский район, улица Байсейтова, дом 12',
    region: 'город Алматы',
    position: [43.2686, 76.9623]
  },
  {
    id: 63,
    name: 'Молодежный центр здоровья «Жаркын болашак»',
    org: 'Городская поликлиника №16',
    address: 'город Алматы, Ауезовский район, 12 микрорайон, дом 19',
    region: 'город Алматы',
    position: [43.2457, 76.9252]
  },
  {
    id: 64,
    name: 'Молодежный центр здоровья «Самга»',
    org: 'Городская поликлиника №23',
    address: 'город Алматы, Алатауский район, улица Жалайыр 34',
    region: 'город Алматы',
    position: [43.2850, 76.8510]
  },
  {
    id: 65,
    name: 'Молодежный центр здоровья «Жас Канат»',
    org: 'Городская поликлиника №26',
    address: 'город Алматы, Наурызбайский район, улица Грозы 102',
    region: 'город Алматы',
    position: [43.2502, 76.9306]
  },
  {
    id: 66,
    name: 'Молодежный центр здоровья «Зерделі жас»',
    org: 'Городская поликлиника №29',
    address: 'город Алматы, Алатауский район, микрорайон Зердели 371/1',
    region: 'город Алматы',
    position: [43.2751, 76.9702]
  },
  {
    id: 67,
    name: 'Молодежный центр здоровья «Салауатты жастар»',
    org: 'Городская поликлиника №36',
    address: 'город Алматы, Наурызбайский район, улица Шугыла 340А',
    region: 'город Алматы',
    position: [43.2529, 76.9357]
  },
  {
    id: 68,
    name: 'Молодежный центр здоровья и специализированных программ',
    org: 'ГЦРЧ',
    address: 'город Алматы, Алмалинский район, улица Торекулова 73',
    region: 'город Алматы',
    position: [43.2557, 76.9402]
  },
  {
    id: 69,
    name: 'Молодежный центр здоровья «Кайнар»',
    org: 'ТОО «Медсервисхирургия»',
    address: 'город Алматы, Ауезовский район, 7 микрорайон, 3а',
    region: 'город Алматы',
    position: [43.2402, 76.9206]
  },
  {
    id: 70,
    name: 'Молодежный центр здоровья «Парасат»',
    org: 'Almaty Clinic',
    address: 'город Алматы, Бостандыкский район, улица Габдуллина 1',
    region: 'город Алматы',
    position: [43.2723, 76.9689]
  },
  {
    id: 71,
    name: 'Молодежный центр здоровья «Денсаулық кілті»',
    org: 'ПМСП Медеуского района',
    address: 'город Алматы, Медеуский район, улица Калдаякова №74',
    region: 'город Алматы',
    position: [43.2779, 76.9752]
  },
  
  // город Астана
  {
    id: 72,
    name: 'Молодежный центр здоровья «Алтын Арай»',
    org: 'ГКП на ПХВ «Городская поликлиника №2»',
    address: 'город Астана, улица Молдагулова 33',
    region: 'город Астана',
    position: [51.1690, 71.4490]
  },
  {
    id: 73,
    name: 'Молодежный центр здоровья «Жас Толқын»',
    org: 'ГКП на ПХВ «Городская поликлиника №3»',
    address: 'город Астана, улица Биржан сал 1',
    region: 'город Астана',
    position: [51.1692, 71.4492]
  },
  {
    id: 74,
    name: 'Молодежный центр здоровья «Рауан»',
    org: 'ГКП на ПХВ «Городская поликлиника №4»',
    address: 'город Астана, улица Шевченко 1',
    region: 'город Астана',
    position: [51.1693, 71.4493]
  },
  {
    id: 75,
    name: 'Молодежный центр здоровья «Жас Талап»',
    org: 'ГКП на ПХВ «Городская поликлиника №6»',
    address: 'город Астана, проспект Аманат, 3',
    region: 'город Астана',
    position: [51.1696, 71.4496]
  },
  {
    id: 76,
    name: 'Молодежный центр здоровья «Жастар»',
    org: 'ГКП на ПХВ «Городская поликлиника №9»',
    address: 'город Астана, улица Мангилик Ел 16/1',
    region: 'город Астана',
    position: [51.1757, 71.4552]
  },
  {
    id: 77,
    name: 'Молодежный центр здоровья',
    org: 'ТОО Astana Clinic',
    address: 'город Астана, улица Кенесары 52',
    region: 'город Астана',
    position: [51.1782, 71.4606]
  },
  {
    id: 78,
    name: 'Молодежный центр здоровья «Шуақ»',
    org: 'ГКП на ПХВ «Городская поликлиника №5»',
    address: 'город Астана, улица Акан сери 20',
    region: 'город Астана',
    position: [51.1695, 71.4495]
  },
  {
    id: 79,
    name: 'Молодежный центр здоровья «Сенім»',
    org: 'ГКП на ПХВ «Городская поликлиника №8»',
    address: 'город Астана, улица Манас 22/3',
    region: 'город Астана',
    position: [51.1698, 71.4498]
  },
  {
    id: 80,
    name: 'Молодежный центр здоровья',
    org: 'ТОО Поликлиника СITY',
    address: 'город Астана, улица Анет Баба 13/3',
    region: 'город Астана',
    position: [51.1862, 71.4752]
  },
  {
    id: 81,
    name: 'Молодежный центр здоровья «Салауатты жастар»',
    org: 'ТОО «Салауатты астана»',
    address: 'город Астана, улица Ч. Айтматова 27',
    region: 'город Астана',
    position: [51.1889, 71.4806]
  },
  {
    id: 82,
    name: 'Молодежный центр здоровья «Өзінді тап» РЦ ПМСП',
    org: 'Городская поликлиника №10',
    address: 'город Астана, улица Косшыгулы 8',
    region: 'город Астана',
    position: [51.1917, 71.4852]
  },
  
  // Область Улытау
  {
    id: 83,
    name: 'Молодежный центр здоровья Поликлиники города Жезказган',
    org: 'КГП на ПХВ «Поликлиника города Жезказган» УЗОҰ',
    address: 'город Жезказган, улица Омарова, 25',
    region: 'Область Улытау',
    position: [47.7833, 67.7128]
  },
  {
    id: 84,
    name: 'Молодежный центр здоровья «СенІм»',
    org: 'КГП на ПХВ «Поликлиника города Сатпаев» УЗОҰ',
    address: 'город Сатпаев, улица Абая, 5',
    region: 'Область Улытау',
    position: [47.9001, 67.5402]
  },
  
  // Дополнительные центры (обновленные данные)
  // Жамбылская область - Тараз
  {
    id: 85,
    name: 'Молодежный центр здоровья «Үміт»',
    org: 'ОКДМЦ "Садыхан"',
    address: 'город Тараз, улица Төле би 64',
    region: 'Жамбылская область',
    position: [42.9006, 71.3677]
  },
  
  // Жетісу облысы (Талдыкорган)
  {
    id: 86,
    name: 'Молодежный центр здоровья',
    org: 'Городская поликлиника №1',
    address: 'город Талдыкорган, улица Қабанбай батыр 66',
    region: 'Жетісу облысы',
    position: [45.0167, 78.3833]
  },
  {
    id: 87,
    name: 'Молодежный центр здоровья',
    org: 'Городская поликлиника №2',
    address: 'город Талдыкорган, улица Сулеева 68',
    region: 'Жетісу облысы',
    position: [45.0167, 78.3833]
  },
  
  // город Астана
  {
    id: 88,
    name: 'Молодежный центр здоровья «Сеним»',
    org: 'ГКП на ПХВ «Городская поликлиника №8»',
    address: 'город Астана, улица Сембинова 4/1',
    region: 'город Астана',
    position: [51.1698, 71.4498]
  }
];

export default function YouthHealthCentersMap({ useApi = false }) {
  // Состояния для переводов
  const [allRegionsText, setAllRegionsText] = useState('Все');
  const [mapTitle, setMapTitle] = useState('');
  const [loadingData, setLoadingData] = useState('');
  const [selectRegion, setSelectRegion] = useState('');
  const [centersInPoint, setCentersInPoint] = useState('');
  const [centersListTitle, setCentersListTitle] = useState('');
  const [inRegion, setInRegion] = useState('');
  const [shownFrom, setShownFrom] = useState('');
  const [of, setOf] = useState('');
  const [tableName, setTableName] = useState('');
  const [tableOrganization, setTableOrganization] = useState('');
  const [tableAddress, setTableAddress] = useState('');
  const [tableRegion, setTableRegion] = useState('');
  const [showAll, setShowAll] = useState('');
  const [hide, setHide] = useState('');
  const [loadError, setLoadError] = useState('');

  const [activeRegion, setActiveRegion] = useState('');
  const [allCenters, setAllCenters] = useState(youthHealthCenters);
  const [filteredCenters, setFilteredCenters] = useState(youthHealthCenters);
  const [showAllCenters, setShowAllCenters] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // Обновление переводов при смене языка
  useEffect(() => {
    const updateTranslations = () => {
      setAllRegionsText(t('directionsPages.centerPrevention.youthCentersMap.allRegions', 'Все'));
      setMapTitle(t('directionsPages.centerPrevention.youthCentersMap.mapTitle', 'Молодежные центры здоровья (МЦЗ) в Казахстане'));
      setLoadingData(t('directionsPages.centerPrevention.youthCentersMap.loadingData', 'Загрузка данных...'));
      setSelectRegion(t('directionsPages.centerPrevention.youthCentersMap.selectRegion', 'Выберите регион:'));
      setCentersInPoint(t('directionsPages.centerPrevention.youthCentersMap.centersInPoint', 'Центров в этой точке:'));
      setCentersListTitle(t('directionsPages.centerPrevention.youthCentersMap.centersListTitle', 'Список молодежных центров здоровья'));
      setInRegion(t('directionsPages.centerPrevention.youthCentersMap.inRegion', 'в регионе'));
      setShownFrom(t('directionsPages.centerPrevention.youthCentersMap.shownFrom', 'показано'));
      setOf(t('directionsPages.centerPrevention.youthCentersMap.of', 'из'));
      setTableName(t('directionsPages.centerPrevention.youthCentersMap.tableName', 'Название'));
      setTableOrganization(t('directionsPages.centerPrevention.youthCentersMap.tableOrganization', 'Организация'));
      setTableAddress(t('directionsPages.centerPrevention.youthCentersMap.tableAddress', 'Адрес'));
      setTableRegion(t('directionsPages.centerPrevention.youthCentersMap.tableRegion', 'Регион'));
      setShowAll(t('directionsPages.centerPrevention.youthCentersMap.showAll', 'Показать все'));
      setHide(t('directionsPages.centerPrevention.youthCentersMap.hide', 'Скрыть'));
      setLoadError(t('directionsPages.centerPrevention.youthCentersMap.loadError', 'Ошибка загрузки данных МЦЗ:'));
      // Устанавливаем активный регион при первой загрузке
      if (!activeRegion) {
        setActiveRegion(t('directionsPages.centerPrevention.youthCentersMap.allRegions', 'Все'));
      }
    };

    updateTranslations();
    window.addEventListener('languageChanged', updateTranslations);

    return () => {
      window.removeEventListener('languageChanged', updateTranslations);
    };
  }, []);

  // Обновление активного региона при смене языка
  useEffect(() => {
    if (activeRegion === allRegionsText || !activeRegion) {
      // Если выбран "Все", обновляем значение
      setActiveRegion(allRegionsText);
    }
  }, [allRegionsText]);

  // "Все" всегда на первом месте, остальные регионы отсортированы
  const regions = [allRegionsText, ...[...new Set(allCenters.map(center => center.region))].sort()];

  // Загрузка данных из API (если useApi = true)
  useEffect(() => {
    if (useApi) {
      setLoading(true);
      axios.get('/api/youth-health-centers')
        .then(response => {
          setAllCenters(response.data);
          setFilteredCenters(response.data);
          setLoading(false);
        })
        .catch(error => {
          const errorText = loadError || t('directionsPages.centerPrevention.youthCentersMap.loadError', 'Ошибка загрузки данных МЦЗ:');
          console.error(errorText, error);
          setLoading(false);
        });
    }
  }, [useApi, loadError]);

  // Фильтрация центров по выбранному региону
  useEffect(() => {
    if (activeRegion === allRegionsText || activeRegion === 'Все') {
      setFilteredCenters(allCenters);
    } else {
      setFilteredCenters(allCenters.filter(center => center.region === activeRegion));
    }
    // Сбрасываем состояние "показать все" при изменении региона
    setShowAllCenters(false);
  }, [activeRegion, allCenters, allRegionsText]);

  // Инициализация карты при монтировании компонента
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Создаем карту
      mapRef.current = L.map(mapContainerRef.current).setView([48.019573, 66.923684], 5);
      
      // Добавляем тайлы OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Возвращаем функцию очистки для unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  // Обновление маркеров при изменении фильтрации
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Удаляем существующие маркеры
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    
    // Группируем центры по координатам
    const groupedCenters = {};
    filteredCenters.forEach(center => {
      const key = `${center.position[0]},${center.position[1]}`;
      if (!groupedCenters[key]) {
        groupedCenters[key] = [];
      }
      groupedCenters[key].push(center);
    });
    
    // Добавляем маркеры для каждой группы координат
    Object.values(groupedCenters).forEach(centers => {
      const marker = L.marker(centers[0].position, { icon: customIcon }).addTo(map);
      
      // Создаем popup с информацией о всех центрах в этой точке
      let popupContent = '<div style="max-height: 400px; overflow-y: auto;">';
      
      if (centers.length > 1) {
        popupContent += `<p class="font-semibold text-blue-700 mb-3">${centersInPoint} ${centers.length}</p>`;
      }
      
      centers.forEach((center, index) => {
        popupContent += `
          <div class="${index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}">
            <h3 class="font-bold text-base">${center.name}</h3>
            <p class="text-sm mb-1 text-gray-700">${center.org}</p>
            <p class="text-sm text-gray-600">${center.address}</p>
            <p class="text-sm mt-2 font-semibold text-blue-600">${center.region}</p>
          </div>
        `;
      });
      
      popupContent += '</div>';
      
      marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: 'custom-popup'
      });
    });
    
    // Центрируем карту на выбранном регионе
    if (filteredCenters.length > 0) {
      if (activeRegion !== allRegionsText && activeRegion !== 'Все') {
        map.setView(filteredCenters[0].position, 10);
      } else {
        map.setView([48.019573, 66.923684], 5);
      }
    }
  }, [filteredCenters, activeRegion, allRegionsText, centersInPoint]);

  return (
    <div className="youth-health-centers-map">
      <div className="bg-blue-50 p-4 mb-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{mapTitle}</h2>
        
        {loading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
            {loadingData}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{selectRegion}</label>
          <select 
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            className="w-full md:w-80 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Контейнер карты с контролем высоты */}
      <div 
        ref={mapContainerRef} 
        className="map-container rounded-lg overflow-hidden" 
        style={{ height: "500px", width: "100%" }}
      ></div>

      {/* Таблица с информацией о центрах */}
      <div className="mt-8 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">
          {centersListTitle} {activeRegion !== allRegionsText && activeRegion !== 'Все' ? `${inRegion} "${activeRegion}"` : ''}
          {(activeRegion === allRegionsText || activeRegion === 'Все') && !showAllCenters && ` (${shownFrom} ${Math.min(15, filteredCenters.length)} ${of} ${filteredCenters.length})`}
        </h3>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">{tableName}</th>
              <th className="py-2 px-4 border-b text-left">{tableOrganization}</th>
              <th className="py-2 px-4 border-b text-left">{tableAddress}</th>
              <th className="py-2 px-4 border-b text-left">{tableRegion}</th>
            </tr>
          </thead>
          <tbody>
            {((activeRegion === allRegionsText || activeRegion === 'Все') && !showAllCenters 
              ? filteredCenters.slice(0, 15) 
              : filteredCenters
            ).map(center => (
              <tr key={center.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{center.name}</td>
                <td className="py-2 px-4 border-b">{center.org}</td>
                <td className="py-2 px-4 border-b">{center.address}</td>
                <td className="py-2 px-4 border-b">{center.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Кнопка "Показать все" */}
        {(activeRegion === allRegionsText || activeRegion === 'Все') && filteredCenters.length > 15 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllCenters(!showAllCenters)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              {showAllCenters ? hide : `${showAll} (${filteredCenters.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
