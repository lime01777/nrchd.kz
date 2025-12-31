import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';
import FolderChlank from '@/Components/FolderChlank';
import AIServiceCatalog from '@/Components/AIServiceCatalog';
import translationService from '@/services/TranslationService';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return translationService.t(key, fallback);
};


export default function ElectronicHealth() {

  const [showFullText, setShowFullText] = useState(false);

  // Данные ИИ сервисов (все 83 сервиса из каталога mosmed.ai)
  // Поле image опционально - можно добавить путь к изображению сервиса
  // Например: image: '/img/ai-services/chestira.jpg'
  const aiServices = [
    {
      id: 1,
      name: 'Chest-IRA',
      slug: 'chestira',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "АЙРА Лабс"'
      // image: '/img/ai-services/chestira.jpg' // Опциональное поле для изображения
    },
    {
      id: 2,
      name: 'Третье мнение РГ',
      slug: 'tretemnenierentgenogrammyi',
      pathology: ['очаг затемнения'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "Платформа Третье Мнение"'
    },
    {
      id: 3,
      name: 'Цельс ММГ',
      slug: 'tsels-mmg',
      pathology: ['рак молочной железы'],
      modality: ['ММГ'],
      area: ['молочная железа'],
      status: 'active',
      company: 'ООО «Медицинские скрининг системы»'
    },
    {
      id: 4,
      name: 'Цельс ФЛГ',
      slug: 'tsels-flg',
      pathology: ['различные патологии легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО «Медицинские скрининг системы»'
    },
    {
      id: 5,
      name: 'Трио ДМ',
      slug: 'trio-dm',
      pathology: ['рак молочной железы'],
      modality: ['ММГ'],
      area: ['молочная железа'],
      status: 'active',
      company: 'АО «МТЛ»'
    },
    {
      id: 6,
      name: 'Care Mentor AI',
      slug: 'care-mentor-ai',
      pathology: ['различные патологии легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «КэреМенторЭйАй»'
    },
    {
      id: 7,
      name: 'Care Mentor AI',
      slug: 'care-mentor-ai-ct-covid-19',
      pathology: ['COVID-19'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «КэреМенторЭйАй»'
    },
    {
      id: 8,
      name: 'AI RADIOLOGY CXR РГ',
      slug: 'ai-radiology-cxr',
      pathology: ['различные патологии легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'АНО ВО «Университет Иннополис»'
    },
    {
      id: 9,
      name: 'RADLogics CT Nodules',
      slug: 'radlogs-ct-nodules',
      pathology: ['злокачественные новообразования легких'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО "Радлоджикс Рус"'
    },
    {
      id: 10,
      name: 'HealthVCF',
      slug: 'healthvcf',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «МИП "Биномикс-Рэй"»'
    },
    {
      id: 11,
      name: 'MAMMOLens',
      slug: 'mida',
      pathology: ['рак молочной железы'],
      modality: ['ММГ'],
      area: ['молочная железа'],
      status: 'inactive',
      company: 'ООО «АЙРИМ»'
    },
    {
      id: 12,
      name: 'Гамма Мультивокс Ковирус',
      slug: 'gamma-multivoks-kovirus',
      pathology: ['COVID-19'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «Гаммамед-Софт»'
    },
    {
      id: 13,
      name: 'Botkin.AI',
      slug: 'botkinai-kt-rl',
      pathology: ['злокачественные новообразования легких'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «Интеллоджик»'
    },
    {
      id: 14,
      name: 'Botkin КТ Covid',
      slug: 'botkinai-kt-covid-19',
      pathology: ['COVID-19'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «Интеллоджик»'
    },
    {
      id: 15,
      name: 'Программа автоматизированного анализа цифровых флюорограмм (ФЛГ)',
      slug: 'programma-avtomatizirovannogo-analiza-tsifrovih-flyuorogramm-flg',
      pathology: ['различные патологии легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО «ФтизисБиоМед»'
    },
    {
      id: 16,
      name: 'Программа автоматизированного анализа цифровых флюорограмм (РГ)',
      slug: 'programma-avtomatizirovannogo-analiza-tsifrovih-flyuorogramm-rg',
      pathology: ['различные патологии легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "ФтизисБиоМед"'
    },
    {
      id: 17,
      name: 'Цельс РГ',
      slug: 'celsus',
      pathology: ['очаг затемнения'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО «Медицинские скрининг системы»'
    },
    {
      id: 18,
      name: 'IMV MS',
      slug: 'imv-mscom',
      pathology: ['рассеянный склероз'],
      modality: ['МРТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО "ИМВИЖН"'
    },
    {
      id: 19,
      name: 'Третье мнение ФЛГ',
      slug: 'tretemnenierg',
      pathology: ['различные патологии легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "Платформа Третье Мнение"'
    },
    {
      id: 20,
      name: 'Care Mentor AI для определения продольного плоскостопия',
      slug: 'carementorai',
      pathology: ['артроз коленного сустава'],
      modality: ['РГ'],
      area: ['опорно-двигательный аппарат'],
      status: 'inactive',
      company: 'ООО "КэреМенторЭйАй"'
    },
    {
      id: 21,
      name: 'qXR V',
      slug: 'qxr',
      pathology: ['различные патологии легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО Честная Медицина (Россия)'
    },
    {
      id: 22,
      name: 'Цельс КС КТ ОГК',
      slug: 'tsels-kt-ogk-kompleksnii-servis',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "Медицинские скрининг системы"'
    },
    {
      id: 23,
      name: 'АИ Диагностик МРТ ПКОП',
      slug: 'ai-diagnostics',
      pathology: ['протрузии и грыжи межпозвоночных дисков, стеноз позвоночного канала'],
      modality: ['МРТ'],
      area: ['пояснично-крестцовый отдел позвоночника'],
      status: 'active',
      company: 'ООО "Интел Диагностик"'
    },
    {
      id: 24,
      name: 'CVisionRad - Knee Arthrosis',
      slug: 'cvl-chest-ct-knee',
      pathology: ['артроз коленного сустава'],
      modality: ['РГ'],
      area: ['опорно-двигательный аппарат'],
      status: 'active',
      company: 'ООО СиВижинЛаб'
    },
    {
      id: 25,
      name: 'Multivox ASPECTS CT ГМ',
      slug: 'multivox-aspects',
      pathology: ['внутричерепное кровоизлияние'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'Общество с ограниченной ответственностью «Гаммамед-Софт»'
    },
    {
      id: 26,
      name: 'АрхиМед Aivory Chest X',
      slug: 'arhimed-aivory-chest-x',
      pathology: ['различные патологии легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "АртВижн"'
    },
    {
      id: 27,
      name: 'Care Mentor AI для анализа рентгенограмм коленного сустава',
      slug: 'care-mentor-ai-dlya-analiza-rentgenogramm-kolennogo-sustava',
      pathology: ['артроз коленного сустава'],
      modality: ['РГ'],
      area: ['опорно-двигательный аппарат'],
      status: 'inactive',
      company: 'ООО «КэреМенторЭйАй»'
    },
    {
      id: 28,
      name: 'Care Mentor AI для анализа маммографических диагностических изображений',
      slug: 'care-mentor-ai-dlya-analiza-mammograficheskih-diagnosticheskih-izobrazhenii',
      pathology: ['рак молочной железы'],
      modality: ['ММГ'],
      area: ['молочная железа'],
      status: 'inactive',
      company: 'ООО «КэреМенторЭйАй»'
    },
    {
      id: 29,
      name: 'Care Mentor AI для анализа флюорографических изображений',
      slug: 'care-mentor-ai-dlya-analiza-flyuorograficheskih-izobrazhenii',
      pathology: ['различные патологии легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'inactive',
      company: 'ООО «КэреМенторЭйАй»'
    },
    {
      id: 30,
      name: 'AI RADIOLOGY CXR ФЛГ',
      slug: 'ai-radiology-cxr-flg',
      pathology: ['различные патологии легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'pending',
      company: 'АНО ВО «Университет Иннополис»'
    },
    {
      id: 31,
      name: 'Синапс Нейро. РГ Сколиоз',
      slug: 'sinaps-neiro-rg-skolioz',
      pathology: ['сколиоз'],
      modality: ['РГ'],
      area: ['опорно-двигательный аппарат'],
      status: 'inactive',
      company: 'ООО «Синапс Тех»'
    },
    {
      id: 32,
      name: 'Oxytech Spine XR Scoliosis',
      slug: 'oxytech-spine-xr-scoliosis',
      pathology: ['сколиоз'],
      modality: ['РГ'],
      area: ['позвоночник'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 33,
      name: 'Третье мнение ММГ',
      slug: 'trete-mnenie-mmg',
      pathology: ['рак молочной железы'],
      modality: ['ММГ'],
      area: ['молочная железа'],
      status: 'active',
      company: 'Общество с ограниченной ответственностью Платформа Третье Мнение'
    },
    {
      id: 34,
      name: 'IMV GLIOMAS',
      slug: 'imv-gliomas',
      pathology: ['интракраниальные новообразования'],
      modality: ['МРТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО "ИМВИЖН"'
    },
    {
      id: 35,
      name: 'NTechMed CT Brain',
      slug: 'ntechmed-ct-brain',
      pathology: ['внутричерепное кровоизлияние'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Интеллоджик"'
    },
    {
      id: 36,
      name: 'AI RADIOLOGY SXR',
      slug: 'ai-radiology-sxr',
      pathology: ['синусит'],
      modality: ['РГ'],
      area: ['голова'],
      status: 'inactive',
      company: 'АНО ВО «Университет Иннополис»'
    },
    {
      id: 37,
      name: 'Sciberia Head',
      slug: 'sciberiahead',
      pathology: ['внутричерепное кровоизлияние'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Сайберия"'
    },
    {
      id: 38,
      name: 'Цельс КС КТ ГМ',
      slug: 'tselsktgmishemiya',
      pathology: ['ишемический инсульт'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО "Медицинские скрининг системы"'
    },
    {
      id: 39,
      name: 'CVL - Chest CT Complex',
      slug: 'cvl-chest-ct-complex',
      pathology: ['свободная жидкость (выпот) в плевральных полостях (гидроторакс)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО СиВижинЛаб'
    },
    {
      id: 40,
      name: 'Третье мнение КТ ГМ',
      slug: 'trete-mnenie-kt-gm',
      pathology: ['внутричерепное кровоизлияние'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'Общество с ограниченной ответственностью Платформа Третье Мнение'
    },
    {
      id: 41,
      name: 'СберМедИИ КТ ГМ Комплекс',
      slug: 'sbermed-kt-gm-ishemiya',
      pathology: ['ишемический инсульт'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'pending',
      company: 'ООО "СберМедИИ"'
    },
    {
      id: 42,
      name: 'Esper.Scoliosis',
      slug: 'esperscoliosis',
      pathology: ['сколиоз'],
      modality: ['РГ'],
      area: ['позвоночник'],
      status: 'active',
      company: 'ООО "Эспер"'
    },
    {
      id: 43,
      name: 'Третье мнение КТ ОГК комплекс',
      slug: 'tretemnenie',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "ПТМ"'
    },
    {
      id: 44,
      name: 'Abdomen - IRA',
      slug: 'aira-labs-abdomen-ira',
      pathology: ['образования надпочечников'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'active',
      company: 'ООО "АЙРА Лабс"'
    },
    {
      id: 45,
      name: 'АИ Диагностик КТ ОГК комплекс',
      slug: 'ooointeldiagnostikchestctmulti',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы грудной клетки'],
      status: 'active',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 46,
      name: 'IMV МРТ ПКОП',
      slug: 'imv-mrt-pkop',
      pathology: ['протрузии и грыжи межпозвоночных дисков, стеноз позвоночного канала'],
      modality: ['МРТ'],
      area: ['пояснично-крестцовый отдел позвоночника'],
      status: 'active',
      company: 'ООО "ИМВИЖН"'
    },
    {
      id: 47,
      name: 'IMV SPINE МРТ ШОП',
      slug: 'imv-spine-mrt-shop',
      pathology: ['протрузии и грыжи межпозвоночных дисков, стеноз позвоночного канала'],
      modality: ['МРТ'],
      area: ['шейный отдел позвоночника'],
      status: 'active',
      company: 'ООО "ИМВИЖН"'
    },
    {
      id: 48,
      name: 'IMV PIRADS',
      slug: 'imv-pirads',
      pathology: ['рутинные измерения предстательной железы'],
      modality: ['МРТ'],
      area: ['органы малого таза'],
      status: 'active',
      company: 'ООО ИМВИЖН'
    },
    {
      id: 49,
      name: 'АИ Диагностик КТ ГМ',
      slug: 'aidiagnostikktgm',
      pathology: ['внутричерепное кровоизлияние'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 50,
      name: 'АИ Диагностик КТ ГМ морфометрия',
      slug: 'ai-diagnostik-kt-gm-morfometriya',
      pathology: ['морфометрия'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 51,
      name: 'АИ Диагностик КТ ОБП мочекаменная болезнь',
      slug: 'ktobpmochekamennayabolezn',
      pathology: ['мочекаменная болезнь'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 52,
      name: 'NtechMed MRI Brain',
      slug: 'ntechmed-mri-brain',
      pathology: ['рассеянный склероз'],
      modality: ['МРТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Айрим"'
    },
    {
      id: 53,
      name: 'NTechMed CT Brain Complex',
      slug: 'ntechmed-ct-brain-complex',
      pathology: ['ишемический инсульт'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО "Айрим"'
    },
    {
      id: 54,
      name: 'NTechMed Norm Brain CT',
      slug: 'ntechmed-norm-brain-ct',
      pathology: ['морфометрия'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'inactive',
      company: 'ООО "Айрим"'
    },
    {
      id: 55,
      name: 'VisionLabs Kidney Tumor Detector',
      slug: 'visionlabs-kidney-tumor-detector',
      pathology: ['образования почек'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО «ВижнЛабс»'
    },
    {
      id: 56,
      name: 'АИ Диагностик Почки Abd',
      slug: 'ai-diagnostik-pochki-abd',
      pathology: ['образования почек'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 57,
      name: 'АИ Диагностик Надпочечники Abd',
      slug: 'ai-diagnostik-nadpochechniki-abd',
      pathology: ['образования надпочечников'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 58,
      name: 'АИ Диагностик Аорта Abd',
      slug: 'ai-diagnostik-aorta-abd',
      pathology: ['аневризма брюшного отдела аорты с определением диаметра брюшной аорты'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 59,
      name: 'АИ Диагностик Остеопороз Abd',
      slug: 'ai-diagnostik-osteoporoz-abd',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'inactive',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 60,
      name: 'АИ Диагностик МРТ ГМ',
      slug: 'ai-diagnostik-mrt-gm',
      pathology: ['интракраниальные новообразования'],
      modality: ['МРТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО "Интел диагностик"'
    },
    {
      id: 61,
      name: 'Третье мнение КТ ГМ комплекс',
      slug: 'trete-mnenie-kt-gm-kompleks',
      pathology: ['ишемический инсульт'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'ООО  "Платформа Третье Мнение"'
    },
    {
      id: 62,
      name: 'АрхиМед Aivory AI Nose X',
      slug: 'arhimed-aivory-ai-nose-x',
      pathology: ['синусит'],
      modality: ['РГ'],
      area: ['голова'],
      status: 'active',
      company: 'ООО "АртВижн"'
    },
    {
      id: 63,
      name: 'Третье Мнение. КТ ГМ Морфометрия',
      slug: 'trete-mnenie-kt-gm-morfometriya',
      pathology: ['морфометрия'],
      modality: ['КТ'],
      area: ['головной мозг'],
      status: 'active',
      company: 'Общество с ограниченной ответственностью "Платформа Третье Мнение"'
    },
    {
      id: 64,
      name: 'FBM PesPlanus',
      slug: 'fbm-pesplanus',
      pathology: ['плоскостопие поперечное'],
      modality: ['РГ'],
      area: ['стопа'],
      status: 'active',
      company: 'ООО "ФтизисБиоМед"'
    },
    {
      id: 65,
      name: 'Oxytech Spine XR Spondylolisthesis',
      slug: 'oxytech-spine-xr-spondylolisthesis',
      pathology: ['спондилолистез'],
      modality: ['РГ'],
      area: ['позвоночник'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 66,
      name: 'Просвет. КТ ОБП. Автоматизация рутинных измерений. Почки',
      slug: 'prosvet-kt-obp-avtomatizatsiya-rutinnih-izmerenii-pochki',
      pathology: ['рутинные измерения почки'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 67,
      name: 'Просвет. КТ ОБП. Автоматизация рутинных измерений. Поджелудочная железа и селезенка',
      slug: 'prosvet-kt-obp-avtomatizatsiya-rutinnih-izmerenii-podzheludochnaya-zheleza-i-selezenka',
      pathology: ['рутинные измерения поджелудочной железы и селезенки'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 68,
      name: 'Просвет. КТ ОБП. Автоматизация рутинных измерений.  Печень',
      slug: 'prosvet-kt-obp-avtomatizatsiya-rutinnih-izmerenii-pechen',
      pathology: ['рутинные измерения печени'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 69,
      name: 'Просвет. КТ ОБП. Комплекс',
      slug: 'prosvet-kt-obp-kompleks',
      pathology: ['образования надпочечников'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 70,
      name: 'Просвет. РГ голеностопного сустава. Перелом',
      slug: 'prosvet-rg-golenostopnogo-sustava-perelom',
      pathology: ['перелом голеностопного сустава'],
      modality: ['РГ'],
      area: ['голеностопный сустав'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 71,
      name: 'Просвет. РГ кистей.  Костный возраст',
      slug: 'prosvet-rg-kistei-kostnii-vozrast',
      pathology: ['определение костного возраста'],
      modality: ['РГ'],
      area: ['кисть'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 72,
      name: 'Просвет. РГ коленного сустава',
      slug: 'prosvet-rg-kolennogo-sustava',
      pathology: ['артроз коленного сустава'],
      modality: ['РГ'],
      area: ['коленный сустав'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 73,
      name: 'Просвет. РГ лицевого черепа. Синусит',
      slug: 'prosvet-rg-litsevogo-cherepa-sinusit',
      pathology: ['синусит'],
      modality: ['РГ'],
      area: ['голова'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 74,
      name: 'Просвет. РГ лучезапястного сустава',
      slug: 'prosvet-rg-luchezapyastnogo-sustava',
      pathology: ['перелом лучезапястного сустава'],
      modality: ['РГ'],
      area: ['лучезапястный сустав'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 75,
      name: 'Просвет. РГ ОГК',
      slug: 'prosvet-rg-ogk',
      pathology: ['туберкулез легких'],
      modality: ['РГ'],
      area: ['органы грудной клетки'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 76,
      name: 'Просвет. РГ плечевого сустава',
      slug: 'prosvet-rg-plechevogo-sustava',
      pathology: ['перелом плечевого сустава'],
      modality: ['РГ'],
      area: ['плечевой сустав'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 77,
      name: 'Просвет. РГ позвоночника.  Компрессионные переломы',
      slug: 'prosvet-rg-pozvonochnika-kompressionnie-perelomi',
      pathology: ['компрессионный перелом тел позвонков (остеопороз)'],
      modality: ['РГ'],
      area: ['позвоночник'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 78,
      name: 'Просвет. РГ Стоп. Плоскостопие комплекс',
      slug: 'prosvet-rg-stop-ploskostopie-kompleks',
      pathology: ['плоскостопие поперечное'],
      modality: ['РГ'],
      area: ['стопа'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 79,
      name: 'Просвет. РГ тазобедренного сустава. Перелом',
      slug: 'prosvet-rg-tazobedrennogo-sustava-perelom',
      pathology: ['перелом тазобедренного сустава'],
      modality: ['РГ'],
      area: ['тазобедренный сустав'],
      status: 'active',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 80,
      name: 'Просвет. РГ тазобедренного сустава',
      slug: 'prosvet-rg-tazobedrennogo-sustava',
      pathology: ['артроз тазобедренного сустава'],
      modality: ['РГ'],
      area: ['тазобедренный сустав'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 81,
      name: 'Просвет. ФЛГ ОГК',
      slug: 'prosvet-flg-ogk',
      pathology: ['туберкулез легких'],
      modality: ['ФЛГ'],
      area: ['органы грудной клетки'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 82,
      name: 'Просвет. РГ тазобедренного сустава. Коксометрия',
      slug: 'prosvet-rg-tazobedrennogo-sustava-koksometriya',
      pathology: ['коксометрия'],
      modality: ['РГ'],
      area: ['тазобедренный сустав'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    },
    {
      id: 83,
      name: 'Просвет. КТ ОБП. Желчнокаменная болезнь',
      slug: 'prosvet-kt-obp-zhelchnokamennaya-bolezn',
      pathology: ['желчнокаменная болезнь (калькулезная форма)'],
      modality: ['КТ'],
      area: ['органы брюшной полости'],
      status: 'pending',
      company: 'ООО "Оксиджен Технолоджиес Рус"'
    }
  ];
  
  return (
    <>
    <Head title={t('directionsPages.electronicHealth.title', 'Цифровое здравоохранение')} />
    <section className="text-gray-600 body-font pb-8">
        <div className="container px-5 py-12 mx-auto">
            <div className='flex flex-wrap px-12 text-justify'>
                <div className="tracking-wide leading-relaxed">
                    <p className="mb-4">
                        {t('directionsPages.electronicHealth.intro')}
                    </p>
                    
                    <p className="mb-4">
                        <strong>{t('directionsPages.electronicHealth.mainTasks')}</strong>
                    </p>
                    <ul className='list-disc list-inside px-4 mb-4'>
                        <li>{t('directionsPages.electronicHealth.task1')}</li>
                        <li>{t('directionsPages.electronicHealth.task2')}</li>
                        <li>{t('directionsPages.electronicHealth.task3')}</li>
                        <li>{t('directionsPages.electronicHealth.task4')}</li>
                        <li>{t('directionsPages.electronicHealth.task5')}</li>
                    </ul>
                    
                    <p className="mb-4">
                        {t('directionsPages.electronicHealth.departments')}
                    </p>
                    <ul className='list-disc list-inside px-4 mb-4'>
                        <li>{t('directionsPages.electronicHealth.dept1')}</li>
                        <li>{t('directionsPages.electronicHealth.dept2')}</li>
                    </ul>
                    
                    {showFullText && (
                        <>
                            <p className="mb-4">
                                <strong>{t('directionsPages.electronicHealth.dept1Functions')}</strong>
                            </p>
                            <ul className='list-disc list-inside px-4 mb-4'>
                                <li>{t('directionsPages.electronicHealth.dept1Task1')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task2')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task3')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task4')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task5')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task6')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task7')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task8')}</li>
                                <li>{t('directionsPages.electronicHealth.dept1Task9')}</li>
                            </ul>

                            <p className="mb-4">
                                <strong>{t('directionsPages.electronicHealth.dept2Functions')}</strong>
                            </p>
                            <ul className='list-disc list-inside px-4 mb-4'>
                                <li>{t('directionsPages.electronicHealth.dept2Task1')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task2')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task3')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task4')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task5')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task6')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task7')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task8')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task9')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task10')}</li>
                                <li>{t('directionsPages.electronicHealth.dept2Task11')}</li>
                            </ul>

                            <p className="mb-4">
                                <strong>{t('directionsPages.electronicHealth.workPlan2024')}</strong>
                            </p>
                            <p className="mb-4">
                                {t('directionsPages.electronicHealth.workPlan2024Text')}
                            </p>
                            <ul className='list-disc list-inside px-4 mb-4'>
                                <li>{t('directionsPages.electronicHealth.standard1')}</li>
                                <li>{t('directionsPages.electronicHealth.standard2')}</li>
                                <li>{t('directionsPages.electronicHealth.standard3')}</li>
                                <li>{t('directionsPages.electronicHealth.standard4')}</li>
                            </ul>

                            <p className="mb-4">
                                <strong>{t('directionsPages.electronicHealth.mkb11Work')}</strong>
                            </p>
                            <ul className='list-disc list-inside px-4 mb-4'>
                                <li>{t('directionsPages.electronicHealth.mkb11Task1')}</li>
                                <li>{t('directionsPages.electronicHealth.mkb11Task2')}</li>
                                <li>{t('directionsPages.electronicHealth.mkb11Task3')}</li>
                                <li>{t('directionsPages.electronicHealth.mkb11Task4')}</li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setShowFullText(!showFullText)} 
                    className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 transition-all duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105"
                >
                    {showFullText ? t('directionsPages.electronicHealth.hide') : t('directionsPages.electronicHealth.readMore')}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`ml-2 transform transition-transform duration-300 ${showFullText ? 'rotate-45' : ''}`}
                    >
                        {showFullText ? (
                            <path d="M19 13H5v-2h14v2z" />
                        ) : (
                            <>
                                <rect x="11.5" y="5" width="1" height="14" />
                                <rect x="5" y="11.5" width="14" height="1" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </div>
    </section>
    
    {/* Каталог ИИ сервисов - скрыт */}
    <section className="hidden text-gray-600 body-font py-8">
        <div className="container mx-auto px-5">
            <AIServiceCatalog services={aiServices} />
        </div>
    </section>
    
    <section className="text-gray-600 body-font">
        <div className="container pt-8 mx-auto">
            <div className='flex flex-wrap'>
                <FolderChlank
                    color="bg-fuchsia-200"
                    colorsec="bg-fuchsia-300"
                    title={t('directionsPages.electronicHealth.subfolders.standards.title')} 
                    description={t('directionsPages.electronicHealth.subfolders.standards.description')}
                    href={route('electronic.health.standards')}
                />
                <FolderChlank 
                    color="bg-fuchsia-200"
                    colorsec="bg-fuchsia-300"
                    title={t('directionsPages.electronicHealth.subfolders.regulations.title')} 
                    description={t('directionsPages.electronicHealth.subfolders.regulations.description')}
                    href={route('electronic.health.regulations')}
                />
                <FolderChlank 
                    color="bg-fuchsia-200"
                    colorsec="bg-fuchsia-300"
                    title={t('directionsPages.electronicHealth.subfolders.mkb11.title')} 
                    description={t('directionsPages.electronicHealth.subfolders.mkb11.description')}
                    href={route('electronic.health.mkb11')}
                />
            </div>
        </div>
    </section>
    </>
  );
}

ElectronicHealth.layout = (page) => <LayoutDirection img="electronichealth" h1={t('directions.electronic_health', 'Цифровое здравоохранение')}>{page}</LayoutDirection>;
