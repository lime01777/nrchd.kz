import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import translationService from '@/Services/TranslationService';

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

// Данные о молодежных центрах здоровья (актуальный список)
export const youthHealthCenters = [

  // ─── Акмолинская область ───────────────────────────────
  { id: 1, name: 'Городская поликлиника', org: 'ГКП на ПХВ «Городская поликлиника»', address: 'г. Кокшетау, ул. Сейфуллина 35', region: 'Акмолинская область', position: [53.2856, 69.3912] },
  { id: 2, name: 'МЦЗ «Панацея»', org: 'ТОО «Клиника Панацея»', address: 'г. Кокшетау, ул. Ауэзова 208А', region: 'Акмолинская область', position: [53.2818, 69.3972] },

  // ─── Актюбинская область ──────────────────────────────
  { id: 3, name: 'МЦЗ «Ювентус»', org: 'ГКП на ПХВ «Городская поликлиника №7»', address: 'г. Актобе, ул. Бокенбай батыра, 50А', region: 'Актюбинская область', position: [50.2836, 57.1669] },
  { id: 4, name: 'МЦЗ «Самғау»', org: 'НАО ЗКМУ им. М. Оспанова', address: 'г. Актобе, улица Маресьева, 74', region: 'Актюбинская область', position: [50.2975, 57.1457] },
  { id: 5, name: 'МЦЗ «Жастар»', org: 'ГКП на ПХВ «Городская поликлиника №2»', address: 'г. Актобе, ул. Ахтанова, 50а', region: 'Актюбинская область', position: [50.3004, 57.1513] },
  { id: 6, name: 'МЦЗ «Жасдәурен»', org: 'ГКП на ПХВ «Городская поликлиника №6»', address: 'г. Актобе, ул. Есет батыр, 85', region: 'Актюбинская область', position: [50.2905, 57.1820] },

  // ─── Алматинская область ──────────────────────────────
  { id: 7, name: 'МЦЗ «Өмір қуаты»', org: 'Карасайский район', address: 'г. Каскелен, ул. Абая 5а/1', region: 'Алматинская область', position: [43.1983, 76.6167] },

  // ─── Атырауская область ───────────────────────────────
  { id: 8, name: 'МЦЗ «Самға»', org: 'КГП на ПХВ «АГП №6»', address: 'г. Атырау, мкр. Геолог, Трасса Атырау-Доссор, стр. 49', region: 'Атырауская область', position: [47.1185, 51.9207] },
  { id: 9, name: 'МЦЗ «Сенім»', org: 'КГП на ПХВ «АГП №7»', address: 'г. Атырау, ул. С. Бейбарыс, стр. 39', region: 'Атырауская область', position: [47.1058, 51.9239] },

  // ─── Восточно-Казахстанская область ──────────────────
  { id: 10, name: 'МЦЗ', org: 'ТОО «Моя семейная амбулатория»', address: 'г. Усть-Каменогорск, ул. Грузинская 7', region: 'Восточно-Казахстанская область', position: [49.9781, 82.6112] },
  { id: 11, name: 'МЦЗ', org: 'ТОО «Вита-1»', address: 'г. Усть-Каменогорск, ул. Шакарима 156', region: 'Восточно-Казахстанская область', position: [49.9522, 82.6295] },
  { id: 12, name: 'МЦЗ «Болашак»', org: 'КГП на ПХВ «Городская поликлиника №2»', address: 'г. Усть-Каменогорск, ул. Бурова, 61', region: 'Восточно-Казахстанская область', position: [49.9521, 82.6295] },
  { id: 13, name: 'МЦЗ «Үміт»', org: 'КГП на ПХВ «Поликлиника №1»', address: 'г. Усть-Каменогорск, ул. Ауэзова 18', region: 'Восточно-Казахстанская область', position: [49.9499, 82.6206] },
  { id: 14, name: 'МЦЗ «Сенім»', org: 'ТОО «Ем алу плюс»', address: 'г. Усть-Каменогорск, ул. Б. Шаяхметова 1/3', region: 'Восточно-Казахстанская область', position: [49.9552, 82.6189] },
  { id: 15, name: 'МЦЗ «Денсаулык»', org: 'ТОО «ВА Денсаулык»', address: 'г. Усть-Каменогорск, ул. Бурова 53', region: 'Восточно-Казахстанская область', position: [49.9501, 82.6279] },

  // ─── Жамбылская область ───────────────────────────────
  { id: 16, name: 'МЦЗ «Жігер»', org: 'Januia medical center', address: 'г. Тараз, ул. Пушкина 41', region: 'Жамбылская область', position: [42.9006, 71.3677] },
  { id: 17, name: 'МЦЗ «Жан-нұр»', org: 'КГП на ПХВ «Городская поликлиника №2»', address: 'г. Тараз, мкр. Салтанат 27', region: 'Жамбылская область', position: [42.8951, 71.3612] },
  { id: 18, name: 'МЦЗ «Алмаз»', org: 'Almaz Medical Group', address: 'г. Тараз, массив Карасу 17б', region: 'Жамбылская область', position: [42.9035, 71.3729] },
  { id: 19, name: 'МЦЗ «Жастар»', org: 'ГКП на ПХВ «Городская поликлиника №5»', address: 'г. Тараз, ул. Рысбек батыр 13/А', region: 'Жамбылская область', position: [42.8988, 71.3689] },
  { id: 20, name: 'МЦЗ «Жан-Шуақ»', org: 'ТОО «Zhanshuak Medical Group»', address: 'г. Тараз, ул. Демьян Бедный 35', region: 'Жамбылская область', position: [42.9006, 71.3670] },
  { id: 21, name: 'МЦЗ «Мейірім»', org: 'Медицинский центр «Мейірім»', address: 'г. Тараз, ул. Байзақ батыр 227', region: 'Жамбылская область', position: [42.9057, 71.3752] },
  { id: 22, name: 'МЦЗ при ГП г. Шу', org: 'КГП на ПХВ «Городская поликлиника г. Шу»', address: 'г. Шу, ул. Сатпаева 155', region: 'Жамбылская область', position: [43.6001, 73.7609] },
  { id: 23, name: 'МЦЗ «Садыхан»', org: 'ОКДМЦ «Садыхан»', address: 'г. Тараз, ул. Төле би 64', region: 'Жамбылская область', position: [42.9060, 71.3660] },

  // ─── Западно-Казахстанская область ───────────────────
  { id: 24, name: 'МЦЗ «Жастар»', org: 'ГКП на ПХВ «Городская поликлиника №1»', address: 'г. Уральск, пр. Абая 37/1', region: 'Западно-Казахстанская область', position: [51.2152, 51.3789] },
  { id: 25, name: 'МЦЗ «Демеу»', org: 'ГКП на ПХВ «Городская поликлиника №4»', address: 'г. Уральск, ул. Капана Мусина 62', region: 'Западно-Казахстанская область', position: [51.2206, 51.3923] },
  { id: 26, name: 'МЦЗ «Қамқор»', org: 'ГКП на ПХВ «Городская поликлиника №6»', address: 'г. Уральск, ул. Монкеулы 116', region: 'Западно-Казахстанская область', position: [51.2329, 51.3957] },
  { id: 27, name: 'МЦЗ «Болашақ»', org: 'ГКП на ПХВ «Городская поликлиника №5»', address: 'г. Уральск, мкрн. Жана Орда 19С', region: 'Западно-Казахстанская область', position: [51.2278, 51.3862] },

  // ─── Карагандинская область ───────────────────────────
  { id: 28, name: 'МЦЗ', org: 'ТОО «Студенттік емхана 1»', address: 'г. Караганда, ул. Университетская, стр. 3', region: 'Карагандинская область', position: [49.8026, 73.0997] },
  { id: 29, name: 'МЦЗ «Ғибрат»', org: 'КГП на ПХВ «МБ г. Балхаш»', address: 'г. Балхаш, ул. Казбековой, 25', region: 'Карагандинская область', position: [46.8500, 74.9833] },
  { id: 30, name: 'МЦЗ «Мейрим»', org: 'КГП на ПХВ', address: 'г. Караганда, ул. Ипподромная 8', region: 'Карагандинская область', position: [49.7950, 73.0850] },
  { id: 31, name: 'МЦЗ «ДОС»', org: 'КГП «Поликлиника №3 г. Караганды»', address: 'г. Караганда, ул. Шахтёров 78', region: 'Карагандинская область', position: [49.7982, 73.0854] },
  { id: 32, name: 'МЦЗ', org: 'КГП на ПХВ «МБ г. Темиртау»', address: 'г. Темиртау, ул. Чайковская, 26/3', region: 'Карагандинская область', position: [50.0531, 72.9637] },

  // ─── Костанайская область ─────────────────────────────
  { id: 33, name: 'МЦЗ «Jastar MED»', org: 'ТОО «Костанайская ж/д больница»', address: 'г. Костанай, ул. Майлина 81', region: 'Костанайская область', position: [53.2167, 63.6167] },

  // ─── Кызылординская область ───────────────────────────
  { id: 34, name: 'МЦЗ «Үміт»', org: 'КГП на ПХВ «Городская поликлиника №6»', address: 'г. Кызылорда, пр. Астана 1', region: 'Кызылординская область', position: [44.8426, 65.5029] },

  // ─── Мангистауская область ────────────────────────────
  { id: 35, name: 'МЦЗ «Дарын»', org: 'ГКП на ПХВ «Жанаозенская ГП №2»', address: 'г. Жанаозен, ул. Сатпаева 3/7', region: 'Мангистауская область', position: [43.3412, 52.8623] },
  { id: 36, name: 'МЦЗ «Жас толқын»', org: 'АГП №1', address: 'г. Актау, 7-35а', region: 'Мангистауская область', position: [43.6563, 51.1596] },
  { id: 37, name: 'МЦЗ «Ясин»', org: 'ТОО «Медицинский центр «Ясин»', address: 'г. Актау, 19а-7/1', region: 'Мангистауская область', position: [43.6501, 51.1552] },
  { id: 38, name: 'МЦЗ «Тұмар»', org: 'АГП №2 г. Актау', address: 'г. Актау, 26-54', region: 'Мангистауская область', position: [43.6529, 51.1623] },

  // ─── Павлодарская область ─────────────────────────────
  { id: 39, name: 'МЦЗ', org: 'ТОО «Almaz Medical Group»', address: 'г. Павлодар, ул. Генерала Дюсенова 4/3', region: 'Павлодарская область', position: [52.2957, 76.9579] },
  { id: 40, name: 'МЦЗ «Болашак»', org: 'КГП на ПХВ «Поликлиника №3 г. Экибастуз»', address: 'г. Экибастуз, ул. Машхур Жусупа 42', region: 'Павлодарская область', position: [51.7294, 75.3352] },
  { id: 41, name: 'МЦЗ', org: 'КГП на ПХВ «Поликлиника №3 г. Павлодара»', address: 'г. Павлодар, ул. Украинская 38/2', region: 'Павлодарская область', position: [52.2872, 76.9457] },

  // ─── Северо-Казахстанская область ────────────────────
  { id: 42, name: 'МЦЗ', org: 'КГП на ПХВ «Городская поликлиника №3»', address: 'г. Петропавловск, ул. Рахимова 27', region: 'Северо-Казахстанская область', position: [54.8667, 69.1500] },

  // ─── Туркестанская область ────────────────────────────
  { id: 43, name: 'МЦЗ «Алау»', org: 'Кентауская городская поликлиника', address: 'г. Кентау, ул. Рыскулова 111', region: 'Туркестанская область', position: [43.5168, 68.5102] },
  { id: 44, name: 'МЦЗ «Шаттық»', org: 'Ленгерская городская поликлиника', address: 'г. Ленгер, ул. Капал батыра 2', region: 'Туркестанская область', position: [42.1882, 69.9089] },
  { id: 45, name: 'МЦЗ «Саулық»', org: 'Туркестанская городская поликлиника', address: 'г. Туркестан, ул. Жарылкапова 142б', region: 'Туркестанская область', position: [43.3010, 68.2586] },

  // ─── город Шымкент ────────────────────────────────────
  { id: 46, name: 'МЦЗ «Дау-Мед»', org: 'ТОО «Дау-Мед»', address: 'г. Шымкент, мкр. Мәншүк Мәметова 154/1А', region: 'город Шымкент', position: [42.3182, 69.5886] },
  { id: 47, name: 'МЦЗ «Жас Қыран»', org: 'ГКП на ПХВ «Городская поликлиника №7»', address: 'г. Шымкент, мкр. Онтүстік 8/1, 1 этаж', region: 'город Шымкент', position: [42.3089, 69.5751] },
  { id: 48, name: 'МЦЗ «Аль-Фараби»', org: 'ГКП на ПХВ «Городская поликлиника №6»', address: 'г. Шымкент, ул. Аль-Фараби 230', region: 'город Шымкент', position: [42.3102, 69.5806] },
  { id: 49, name: 'МЦЗ «Сұңқар»', org: 'ГКП на ПХВ «Городская поликлиника №3»', address: 'г. Шымкент, ул. Бәйтерекова 190', region: 'город Шымкент', position: [42.3155, 69.5869] },
  { id: 50, name: 'МЦЗ «Камея»', org: 'ТОО «КАМЕЯ Pharm Group»', address: 'г. Шымкент, ул. Жолан-батыр 42/2', region: 'город Шымкент', position: [42.3201, 69.5923] },
  { id: 51, name: 'МЦЗ «Болашақ»', org: 'ГКП на ПХВ «Городская поликлиника №13»', address: 'г. Шымкент, ул. Аскарова 26', region: 'город Шымкент', position: [42.3257, 69.5989] },
  { id: 52, name: 'МЦЗ «Дария Медикус»', org: 'ТОО «Дария Медикус»', address: 'г. Шымкент, мкр. Шаңырақ, ул. Куктерек 7/7', region: 'город Шымкент', position: [42.3279, 69.6023] },
  { id: 53, name: 'МЦЗ «Ер-Ана»', org: 'ТОО «Ер-Ана»', address: 'г. Шымкент, ул. Ақпан-батыр 108А', region: 'город Шымкент', position: [42.3223, 69.5957] },
  { id: 54, name: 'МЦЗ «14 емдеу орталығы»', org: 'ТОО «14 емдеу орталығы»', address: 'г. Шымкент, мкр. Ынтымақ, ул. Айтағы 21', region: 'город Шымкент', position: [42.3306, 69.6052] },

  // ─── город Алматы ─────────────────────────────────────
  { id: 55, name: 'МЦЗ «Жас ұрпақ»', org: 'КГП «Городская поликлиника №4»', address: 'г. Алматы, Орбита 3, д. 12', region: 'город Алматы', position: [43.2579, 76.9454] },
  { id: 56, name: 'МЦЗ «Жас Даурен»', org: 'КГП «Городская поликлиника №5»', address: 'г. Алматы, ул. Макатаева 141', region: 'город Алматы', position: [43.2610, 76.9280] },
  { id: 57, name: 'МЦЗ «Ак жол»', org: 'КГП «Городская поликлиника №7»', address: 'г. Алматы, Бухар жырау бульвар 14', region: 'город Алматы', position: [43.2357, 76.9094] },
  { id: 58, name: 'МЦЗ «Жас Канат»', org: 'КГП «Городская поликлиника №11»', address: 'г. Алматы, мкр. Айнабулак 3, д. 87', region: 'город Алматы', position: [43.2652, 76.9589] },
  { id: 59, name: 'МЦЗ «Жарқын Болашақ»', org: 'КГП «Городская поликлиника №16»', address: 'г. Алматы, 12-й микрорайон, д. 19', region: 'город Алматы', position: [43.2457, 76.9252] },
  { id: 60, name: 'МЦЗ «Дархан»', org: 'КГП «Городская поликлиника №26»', address: 'г. Алматы, ул. Грозы 102', region: 'город Алматы', position: [43.2502, 76.9306] },
  { id: 61, name: 'МЦЗ «Зерделі жас»', org: 'КГП «Городская поликлиника №29»', address: 'г. Алматы, мкр. Зердели 371/3', region: 'город Алматы', position: [43.2751, 76.9702] },
  { id: 62, name: 'МЦЗ «Салауатты жастар»', org: 'КГП «Городская поликлиника №36»', address: 'г. Алматы, мкр. Шугыла 340а', region: 'город Алматы', position: [43.2529, 76.9357] },
  { id: 63, name: 'МЦЗ «Жастар мен отбасы»', org: 'ГЦРЧ', address: 'г. Алматы, ул. Жибек жолы 124', region: 'город Алматы', position: [43.2557, 76.9402] },
  { id: 64, name: 'МЦЗ «Қайнар»', org: 'ТОО «Медсервисхирургия»', address: 'г. Алматы, 7-й микрорайон, 3а', region: 'город Алматы', position: [43.2402, 76.9206] },
  { id: 65, name: 'МЦЗ «Парасат»', org: 'ТОО «Almaty Clinic»', address: 'г. Алматы, ул. Габдуллина 1', region: 'город Алматы', position: [43.2723, 76.9689] },
  { id: 66, name: 'МЦЗ «Денсаулық кілті»', org: 'ПМСП Медеуского района', address: 'г. Алматы, ул. Калдаякова 74', region: 'город Алматы', position: [43.2779, 76.9752] },
  { id: 67, name: 'МЦЗ «Зерделі»', org: 'КГП «Городская поликлиника №12»', address: 'г. Алматы, ул. Байсейтова, д. 12', region: 'город Алматы', position: [43.2686, 76.9623] },
  { id: 68, name: 'МЦЗ «Самға»', org: 'КГП «Городская поликлиника №23»', address: 'г. Алматы, ул. Жалайыр 34', region: 'город Алматы', position: [43.2850, 76.8510] },

  // ─── город Астана ─────────────────────────────────────
  { id: 69, name: 'МЦЗ «Алтын Арай»', org: 'ГКП на ПХВ «Городская поликлиника №2»', address: 'г. Астана, ул. Молдагулова 33', region: 'город Астана', position: [51.1690, 71.4490] },
  { id: 70, name: 'МЦЗ «Жас Толқын»', org: 'ГКП на ПХВ «Городская поликлиника №3»', address: 'г. Астана, ул. Биржан сал 1', region: 'город Астана', position: [51.1692, 71.4492] },
  { id: 71, name: 'МЦЗ «Рауан»', org: 'ГКП на ПХВ «Городская поликлиника №4»', address: 'г. Астана, ул. Шевченко 1', region: 'город Астана', position: [51.1693, 71.4493] },
  { id: 72, name: 'МЦЗ «Жас Талап»', org: 'ГКП на ПХВ «Городская поликлиника №6»', address: 'г. Астана, пр. Аманат, 3', region: 'город Астана', position: [51.1696, 71.4496] },
  { id: 73, name: 'МЦЗ «Жастар»', org: 'ГКП на ПХВ «Городская поликлиника №9»', address: 'г. Астана, ул. Мангилик Ел 16/1', region: 'город Астана', position: [51.1757, 71.4552] },
  { id: 74, name: 'МЦЗ', org: 'ТОО «Astana Clinic»', address: 'г. Астана, ул. Кенесары 52', region: 'город Астана', position: [51.1782, 71.4606] },
  { id: 75, name: 'МЦЗ «Шуақ»', org: 'ГКП на ПХВ «Городская поликлиника №5»', address: 'г. Астана, ул. Акан сери 20', region: 'город Астана', position: [51.1695, 71.4495] },
  { id: 76, name: 'МЦЗ «Сенім»', org: 'ГКП на ПХВ «Городская поликлиника №8»', address: 'г. Астана, ул. Манас 22/3', region: 'город Астана', position: [51.1698, 71.4498] },
  { id: 77, name: 'МЦЗ', org: 'ТОО «Поликлиника CITY»', address: 'г. Астана, ул. Анет Баба 13/3', region: 'город Астана', position: [51.1862, 71.4752] },
  { id: 78, name: 'МЦЗ «Салауатты жастар»', org: 'ТОО «Салауатты астана»', address: 'г. Астана, ул. Ч. Айтматова 27', region: 'город Астана', position: [51.1889, 71.4806] },
  { id: 79, name: 'МЦЗ «Өзінді тап»', org: 'РЦ ПМСП «Городская поликлиника №10»', address: 'г. Астана, ул. Косшыгулы 8', region: 'город Астана', position: [51.1917, 71.4852] },

  // ─── Область Абай ─────────────────────────────────────
  { id: 80, name: 'МЦЗ «Жас Асыл»', org: 'КГП на ПХВ «Поликлиника №2 г. Семей»', address: 'г. Семей, ул. Байтурсынова 27', region: 'Область Абай', position: [50.4235, 80.2582] },
  { id: 81, name: 'МЦЗ «Жас Өмір»', org: 'КГП на ПХВ «Поликлиника №1 г. Семей»', address: 'г. Семей, ул. Қабанбай батыра 79', region: 'Область Абай', position: [50.4179, 80.2573] },
  { id: 82, name: 'МЦЗ «Салауат»', org: 'ТОО «Семейская ж/д больница»', address: 'г. Семей, ул. Засядко 91', region: 'Область Абай', position: [50.4162, 80.2619] },
  { id: 83, name: 'МЦЗ «Үміт»', org: 'КГП на ПХВ «МЦРБ Аягозского района»', address: 'г. Аягоз, ул. Рахимова 1а, 3 этаж', region: 'Область Абай', position: [47.9623, 80.4401] },

  // ─── Область Жетысу ───────────────────────────────────
  { id: 84, name: 'МЦЗ', org: 'ГКП на ПХВ «Городская поликлиника»', address: 'г. Талдыкорган', region: 'Область Жетысу', position: [45.0167, 78.3667] },

  // ─── Область Улытау ───────────────────────────────────
  { id: 85, name: 'МЦЗ', org: 'КГП на ПХВ «Поликлиника г. Жезказган»', address: 'г. Жезказган, ул. Омарова 25', region: 'Область Улытау', position: [47.7833, 67.7128] },
  { id: 86, name: 'МЦЗ', org: 'КГП на ПХВ «Поликлиника г. Сатпаев»', address: 'г. Сатпаев, ул. Абая 5, каб. 127', region: 'Область Улытау', position: [47.9001, 67.5402] },
  { id: 87, name: 'МЦЗ Жанааркинский р-н', org: 'Районная поликлиника', address: 'п. Жанаарка, ул. Акселеу Сейдимбек 39', region: 'Область Улытау', position: [48.3500, 67.5000] },
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
