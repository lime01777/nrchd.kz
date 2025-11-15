/**
 * Удаление всех информационных блоков о переводе
 * Этот скрипт полностью блокирует отображение информации о прогрессе перевода
 * Google Translate отключен, используется только БД
 */

// Тексты, которые используются в информационных блоках
const blockTexts = [
  'Перевод страницы',
  'Инициализация сервиса перевода',
  'Инициализация перевода',
  'CSRF токен (перевод)',
  'Тестирование API перевода',
  'Поиск текстовых элементов для перевода',
  'Найдено текстовых элементов для перевода',
  'Прогресс перевода',
  'Перевод элемента'
];

// Создаем стиль для скрытия блоков
function createBlockerStyle() {
  const style = document.createElement('style');
  style.textContent = `
    /* Скрываем все информационные блоки о переводе */
    body > div:not(.container):not(.main-content):not([class*="component"]):not([id]),
    body > div:empty,
    body > div[style*="fixed"],
    body > div[style*="absolute"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      overflow: hidden !important;
      position: absolute !important;
      top: -9999px !important;
      pointer-events: none !important;
      z-index: -1000 !important;
    }
  `;
  document.head.appendChild(style);
}

// Функция для проверки, содержит ли элемент текст из списка блокировки
function containsBlockedText(element) {
  const text = (element.textContent || '').toLowerCase();
  return blockTexts.some(blockText => text.includes(blockText.toLowerCase()));
}

// Скрыть все существующие блоки
function hideExistingBlocks() {
  // Ищем все div на верхнем уровне body
  const topLevelDivs = document.querySelectorAll('body > div');
  
  topLevelDivs.forEach(div => {
    // Проверяем, содержит ли div запрещенный текст
    if (containsBlockedText(div)) {
      div.style.display = 'none';
      div.style.visibility = 'hidden';
      div.style.opacity = '0';
      div.style.height = '0';
      div.style.width = '0';
      div.style.overflow = 'hidden';
      div.style.position = 'absolute';
      div.style.top = '-9999px';
      div.style.zIndex = '-1000';
      div.style.pointerEvents = 'none';
    }
  });
}

// Создаем наблюдатель за DOM для автоматического скрытия новых блоков
function createObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // Проверяем только элементы, не текстовые узлы
          if (node.nodeType === 1) {
            // Если это div на верхнем уровне body
            if (node.tagName === 'DIV' && node.parentNode === document.body) {
              if (containsBlockedText(node)) {
                node.style.display = 'none';
                node.style.visibility = 'hidden';
                node.style.opacity = '0';
                node.style.height = '0';
                node.style.width = '0';
                node.style.overflow = 'hidden';
                node.style.position = 'absolute';
                node.style.top = '-9999px';
                node.style.zIndex = '-1000';
                node.style.pointerEvents = 'none';
              }
            }
          }
        });
      }
    });
  });
  
  // Наблюдаем за изменениями в body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Запускаем все функции блокировки
function runBlocker() {
  // Создаем стиль
  createBlockerStyle();
  
  // Блокируем существующие блоки
  hideExistingBlocks();
  
  // Создаем наблюдатель для новых блоков
  const observer = createObserver();
  
  // Запускаем повторно через 100мс и 500мс чтобы наверняка поймать все блоки
  setTimeout(hideExistingBlocks, 100);
  setTimeout(hideExistingBlocks, 500);
  
  // Запускаем каждые 2 секунды для абсолютной надежности
  setInterval(hideExistingBlocks, 2000);
}

// Запускаем блокировщик при загрузке документа
document.addEventListener('DOMContentLoaded', runBlocker);

// Запускаем также при полной загрузке страницы
window.addEventListener('load', runBlocker);

// Запускаем немедленно, если документ уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  runBlocker();
}
