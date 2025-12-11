import React, { useRef, useEffect } from 'react';
import './hero.css'; // Стили для геро-секции

function Hero({ 
  img, 
  h1, 
  useGif = false, 
  useVideo = false, // Новый параметр для видео
  overlay = true, 
  videoFormat = 'mp4', // Формат видео (по умолчанию mp4)
  branchFolder = null, // Папка филиала для использования изображений из BranchImg
  overlayColor = 'black' // Цвет overlay: 'black' или 'purple'
}) {
  // Создаем ref для доступа к видео-элементу
  const videoRef = useRef(null);

  // Маппинг между branchFolder и именами файлов изображений
  const branchImageMap = {
    'Abay': 'Abay.jpg',
    'Akmola': 'Akmola.jpg',
    'Aktobe': 'Aktobe.jpg',
    'Almaty': 'almaty.jpg',
    'AlmatyRegion': 'almaty.jpg',
    'Astana': 'Astana.jpeg',
    'Atyrau': 'Atyrau.png',
    'East': 'vko.jpg',
    'Karaganda': 'karaganda.jpg',
    'Kostanay': 'kostanay.jpg',
    'Kyzylorda': 'kyzylorda.jpg',
    'Mangistau': 'Aktau.jpeg',
    'North': 'sko.jpg',
    'Pavlodar': 'Pavlodar.jpg',
    'Shymkent': 'shymkent.jpeg',
    'Turkestan': 'turkestan.jpeg',
    'Ulytau': 'ulytau.jpg',
    'West': 'zko.jpeg',
    'Zhambyl': 'Taraz.jpg',
    'Zhetisu': 'zhetysu.jpeg'
  };

  // Определяем путь к медиа в зависимости от типа (видео, GIF или PNG)
  let mediaPath = '';
  
  // Если передан branchFolder, используем изображение из BranchImg
  if (branchFolder && branchImageMap[branchFolder]) {
    mediaPath = `/img/BranchImg/${branchImageMap[branchFolder]}`;
  } else if (useVideo) {
    mediaPath = `/img/HeroVideos/${img}.${videoFormat}`;
  } else if (useGif) {
    mediaPath = `/img/HeroGifs/${img}.gif`;
  } else {
    mediaPath = `/img/HeroImg/${img}.png`;
  }
  
  // Обработка видео - запуск и остановка при размонтировании
  useEffect(() => {
    // Если используется видео, настроим его
    if (useVideo && videoRef.current) {
      // Перезагрузим видео при каждом изменении источника
      videoRef.current.load();
      videoRef.current.play();
      
      // Функция для очистки ресурсов при размонтировании
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.src = '';
          videoRef.current.load();
        }
      };
    }
  }, [useVideo, mediaPath]);
  
  // Добавим стили для плавного зацикливания GIF и видео
  useEffect(() => {
    if (useGif || useVideo) {
      // Создаем стиль для плавного цикла, если его еще нет
      if (!document.getElementById('hero-media-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'hero-media-styles';
        styleElement.textContent = `
          .hero-gif-background {
            animation: hero-media-fade 0.1s ease-in-out infinite;
            transform-style: preserve-3d;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          .hero-video-background {
            object-fit: cover;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
          }
          
          @keyframes hero-media-fade {
            0%, 100% { opacity: 1; }
          }
        `;
        document.head.appendChild(styleElement);
      }
    }
    
    // Очистка при размонтировании
    return () => {
      // Здесь мы не удаляем стили, так как они могут понадобиться на других страницах
    };
  }, [useGif, useVideo]);
  
  // Всегда используем черный цвет для текста заголовка
  const textColorClass = 'text-gray-900';
  
  return (
    /* Main Hero */
    <section className="text-gray-600 body-font relative hero-section">
      <div className="container min-h-screen sm:h-screen my-auto mx-auto flex px-5 py-12 sm:py-24 md:flex-row flex-col items-center">
        <div className="w-full h-full min-h-[400px] sm:min-h-screen">
          {/* Фоновый медиа-контент (видео, GIF или изображение) */}
          {useVideo ? (
            <video 
              ref={videoRef}
              className="hero-video-background"
              autoPlay 
              muted 
              loop 
              playsInline
              poster={`/img/HeroImg/${img}.png`} // Постер на случай, если видео не загрузится
              preload="auto"
              key={mediaPath} // Добавляем ключ для обновления видео при изменении пути
              style={{
                willChange: 'transform',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
            >
              <source src={mediaPath} type={`video/${videoFormat}`} />
              Ваш браузер не поддерживает видеотег.
            </video>
          ) : (
            <img 
              className={`absolute inset-0 w-full h-full object-cover ${useGif ? 'hero-gif-background' : ''}`} 
              alt="hero background"
              src={mediaPath} 
              style={{
                willChange: 'opacity',
                imageRendering: 'high-quality',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
            />
          )}
          
          {/* Опциональный полупрозрачный оверлей для лучшей читаемости текста */}
          {/* Фиолетовый overlay для филиалов, черный для видео/GIF */}
          {overlay && (
            branchFolder ? (
              // Фиолетовый overlay для филиалов
              <div className="absolute inset-0 bg-purple-900 bg-opacity-40 z-0"></div>
            ) : (useGif || useVideo) ? (
              // Черный overlay для видео/GIF
              <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
            ) : null
          )}
          
          {/* Контентная часть */}
          <div className="relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className={`title-font text-4xl my-auto font-semibold ${textColorClass} text-shadow-lg`} data-translate>
              {h1}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;