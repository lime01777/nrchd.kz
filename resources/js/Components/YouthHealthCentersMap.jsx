import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Создаем кастомный маркер с использованием DivIcon
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color: #0078FF; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #FFF; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Данные о молодежных центрах здоровья
const youthHealthCenters = [
  {
    id: 1,
    name: 'МЦЗ «Самға»',
    org: 'КГП на ПХВ «Геологская поликлиника»',
    address: 'мкр Геолог, Трасса Атырау-Доссор Строение 49, город Атырау',
    region: 'Атырауская область',
    position: [47.118645, 51.920686] // координаты: широта, долгота
  },
  {
    id: 2,
    name: 'МЦЗ «Сенім»',
    org: 'КГП на ПХВ «Атырауская городская поликлиника № 7»',
    address: 'С.Бейбарыс строение 39, город Атырау',
    region: 'Атырауская область',
    position: [47.105791, 51.923853]
  },
  {
    id: 3,
    name: 'МЦЗ «Өмір қуаты»',
    org: 'ГКП на ПХВ «Городская многопрофильная больница г. Конаев»',
    address: 'г. Конаев ул. Абая 5а',
    region: 'Алматинская область',
    position: [43.898541, 77.366543]
  },
  {
    id: 4,
    name: 'МЦЗ «Жастар»',
    org: 'ГКП на ПХВ "Городская поликлиника №2"',
    address: 'г. Актобе',
    region: 'Актюбинская область',
    position: [50.300371, 57.151251]
  },
  {
    id: 5,
    name: 'МЦЗ «Жасдаурен»',
    org: 'ГКП на ПХВ "Городская поликлиника №6"',
    address: 'г. Актобе',
    region: 'Актюбинская область',
    position: [50.290511, 57.181994]
  },
  {
    id: 6,
    name: 'МЦЗ «Панацея»',
    org: 'ТОО "Клиника Панацея"',
    address: 'Акмолинская область г. Кокшетау Бауржан Момышулы 41',
    region: 'Акмолинская область',
    position: [53.281784, 69.397179]
  },
  {
    id: 7,
    name: 'МЦЗ «Жас Асыл»',
    org: 'КГП на ПХВ «Поликлиника №2 г. Семей» УЗ области Абай',
    address: 'г.Семей, ул.Байтурсынова, 27',
    region: 'Область Абай',
    position: [50.423536, 80.258175]
  },
  {
    id: 8,
    name: 'МЦЗ «Болашак»',
    org: 'КГП на ПХВ «Городская поликлиника №2 г.Усть-Каменогорска»',
    address: 'ул. Бурова, 61',
    region: 'ВКО',
    position: [49.952173, 82.629504]
  },
  {
    id: 9,
    name: 'МЦЗ «Жігер»',
    org: 'Januia medical center',
    address: 'город Тараз, Ул.Пушкина 41',
    region: 'Жамбылская область',
    position: [42.900634, 71.367729]
  },
  {
    id: 10,
    name: 'МЦЗ',
    org: 'ГКП на ПХВ "Городская поликлиника» г.Талдыкорган',
    address: 'г.Талдыкорган, ул. Кабанбай батыра, 66',
    region: 'Область Жетысу',
    position: [45.014628, 78.372484]
  },
  {
    id: 11,
    name: 'МЦЗ «Болашак»',
    org: 'ГКП на ПХВ "Городская поликлиника 5"',
    address: 'г. Уральск',
    region: 'ЗКО',
    position: [51.227821, 51.386247]
  },
  {
    id: 12,
    name: 'МЦЗ',
    org: 'ТОО "Студенттiк емхана 1"',
    address: 'г. Караганда, ул. Университетская ст.28/3',
    region: 'Караганская область',
    position: [49.802580, 73.099675]
  },
  {
    id: 13,
    name: 'Молодежный центр «Jastar MED»',
    org: 'ТОО «Костанайская железнодорожная больница»',
    address: 'г. Костанай, ул. Майлина, 81',
    region: 'Костанайская область',
    position: [53.230092, 63.628063]
  },
  {
    id: 14,
    name: 'МЦЗ «Үміт»',
    org: 'КГП на ПХВ «Городская поликлиника № 6»',
    address: 'г. Кызылорда',
    region: 'Кызылординская область',
    position: [44.842557, 65.502943]
  },
  {
    id: 15,
    name: 'МЦЗ «Жас толқын»',
    org: 'Актауская городская поликлиника №1',
    address: '7-35а',
    region: 'Мангистауская область',
    position: [43.656259, 51.159583]
  },
  {
    id: 16,
    name: 'МЦЗ «Болашак»',
    org: 'КГП на ПХВ «Поликлиника №3 г. Экибастуз»',
    address: 'Экибастуз, ул. Машхур Жусуп 42',
    region: 'Павлодарская область',
    position: [51.729412, 75.335173]
  },
  {
    id: 17,
    name: 'МЦЗ',
    org: 'КГП на ПХВ «Городская поликлиника №3»',
    address: 'Юбилейная 7А',
    region: 'СКО',
    position: [54.872192, 69.139994]
  },
  {
    id: 18,
    name: 'ТГП МЦЗ «Саулық»',
    org: 'Туркестанская Городская поликлиника',
    address: 'трасса Айналма тас жолы, 24',
    region: 'Туркестанская область',
    position: [43.300979, 68.258619]
  },
  {
    id: 19,
    name: 'МЦЗ «Сұңқар»',
    org: 'ГКП на ПХВ Городская поликлиника №3',
    address: 'г. Шымкент',
    region: 'г.Шымкент',
    position: [42.315514, 69.586926]
  },
  {
    id: 20,
    name: 'МЦЗ «Жас ұрпақ»',
    org: 'ГП №4',
    address: 'г. Алматы',
    region: 'Алматы',
    position: [43.257895, 76.945381]
  },
  {
    id: 21,
    name: 'МЦЗ «Алтын Арай»',
    org: 'ГКП на ПХВ «Городская поликлиника №2»',
    address: 'г. Астана',
    region: 'Астана',
    position: [51.162876, 71.436174]
  },
  {
    id: 22,
    name: 'МЦЗ Поликлиники г.Жезказган',
    org: 'КГП на ПХВ«Поликлиника г.Жезказган» УЗОҰ',
    address: 'г. Жезказган',
    region: 'Область Улытау',
    position: [47.783295, 67.712814]
  }
];

export default function YouthHealthCentersMap() {
  const [activeRegion, setActiveRegion] = useState('все');
  const [filteredCenters, setFilteredCenters] = useState(youthHealthCenters);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  const regions = ['все', ...new Set(youthHealthCenters.map(center => center.region))].sort();

  // Фильтрация центров по выбранному региону
  useEffect(() => {
    if (activeRegion === 'все') {
      setFilteredCenters(youthHealthCenters);
    } else {
      setFilteredCenters(youthHealthCenters.filter(center => center.region === activeRegion));
    }
  }, [activeRegion]);

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
    
    // Добавляем новые маркеры
    filteredCenters.forEach(center => {
      const marker = L.marker(center.position, { icon: customIcon }).addTo(map);
      
      // Создаем popup с информацией о центре
      const popupContent = `
        <div>
          <h3 class="font-bold">${center.name}</h3>
          <p class="text-sm mb-1">${center.org}</p>
          <p class="text-sm text-gray-600">${center.address}</p>
          <p class="text-sm mt-2 font-semibold text-blue-600">${center.region}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });
    
    // Центрируем карту на выбранном регионе
    if (filteredCenters.length > 0) {
      if (activeRegion !== 'все') {
        map.setView(filteredCenters[0].position, 10);
      } else {
        map.setView([48.019573, 66.923684], 5);
      }
    }
  }, [filteredCenters, activeRegion]);

  return (
    <div className="youth-health-centers-map">
      <div className="bg-blue-50 p-4 mb-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Молодежные центры здоровья (МЦЗ) в Казахстане</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Выберите регион:</label>
          <select 
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            className="w-full md:w-80 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <h3 className="text-lg font-semibold mb-3">Список молодежных центров здоровья {activeRegion !== 'все' ? `в регионе "${activeRegion}"` : ''}</h3>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Название</th>
              <th className="py-2 px-4 border-b text-left">Организация</th>
              <th className="py-2 px-4 border-b text-left">Адрес</th>
              <th className="py-2 px-4 border-b text-left">Регион</th>
            </tr>
          </thead>
          <tbody>
            {filteredCenters.map(center => (
              <tr key={center.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{center.name}</td>
                <td className="py-2 px-4 border-b">{center.org}</td>
                <td className="py-2 px-4 border-b">{center.address}</td>
                <td className="py-2 px-4 border-b">{center.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
