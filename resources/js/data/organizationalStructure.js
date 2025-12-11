// Данные организационной структуры ННЦРЗ
// Импортируем полные данные из отдельного файла

import { fullOrganizationalStructureData } from './fullOrganizationalStructure';
import translationService from '@/services/TranslationService';

export const organizationalStructureData = fullOrganizationalStructureData;

// Функция для получения перевода
const t = (key, fallback = '') => {
  return translationService.t(key, fallback);
};

// Данные руководства с переводами
export const leadershipData = [
  {
    name: t('aboutCentre.leadership.main.name'),
    position: t('aboutCentre.leadership.main.position'),
    photo: "img/leadership/1.jpg",
    contact: {
      email: "g.kulkaeva@nrchd.kz",
      phone: "+7 (7172) 648-951"
    },
    biography: t('aboutCentre.leadership.main.biography'),
    isMain: true
  },
  {
    name: t('aboutCentre.leadership.deputy1.name'),
    position: t('aboutCentre.leadership.deputy1.position'),
    photo: "img/leadership/3.jpg",
    contact: {
      email: "s.shaykhiev@nrchd.kz",
      phone: "+7 (7172) 648-951"
    }
  },
  {
    name: t('aboutCentre.leadership.deputy2.name'),
    position: t('aboutCentre.leadership.deputy2.position'),
    photo: "img/leadership/2.jpg",
    contact: {
      email: "s.karzhaubaeva@nrchd.kz",
      phone: "+7 (7172) 648-951"
    }
  },
  {
    name: t('aboutCentre.leadership.deputy3.name'),
    position: t('aboutCentre.leadership.deputy3.position'),
    photo: "img/leadership/4.jpg",
    contact: {
      email: "a.tabarov@nrchd.kz",
      phone: "+7 (7172) 648-951"
    }
  },
  {
    name: t('aboutCentre.leadership.director1.name'),
    position: t('aboutCentre.leadership.director1.position'),
    photo: "img/leadership/5.jpg",
    contact: {
      email: "a.topaeva@nrchd.kz",
      phone: "+7 (7172) 648-951"
    }
  },
  {
    name: t('aboutCentre.leadership.director2.name'),
    position: t('aboutCentre.leadership.director2.position'),
    photo: "img/leadership/6.jpg",
    contact: {
      email: "z.botagarina@nrchd.kz",
      phone: "+7 (7172) 648-951"
    }
  }
];
