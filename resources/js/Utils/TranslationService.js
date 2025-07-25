/**
 * TranslationService.js - Сервис для взаимодействия с API перевода
 */
import translationManager from './TranslationManager';

class TranslationService {
  constructor() {
    // Убедитесь, что используется полный URL с доменом, если сервер не на том же домене
    this.apiEndpoint = window.location.origin + '/api/translate';
    this.maxTextLength = 5000; // Максимальная длина текста для одного запроса
    this.activeRequests = 0;
    this.maxConcurrentRequests = 10; // Увеличиваем количество одновременных запросов
    
    // Лимит запросов в секунду для предотвращения блокировки
    this.requestsThrottle = 5; // Увеличиваем частоту запросов
    this.lastRequestTime = 0;
  }

  /**
   * Перевести текст через API
   */
  async translate(text, targetLang) {
    // Не переводим пустой текст или на дефолтный язык
    if (!text || text.trim() === '' || targetLang === 'ru') {
      return text;
    }
    
    // Проверить в кэше перед запросом API
    const cachedTranslation = translationManager.getTranslation(text, targetLang);
    if (cachedTranslation) {
      console.log(`[TranslationService] Using cached translation for text to ${targetLang}`);
      return cachedTranslation;
    }
    
    // Проверка на чрезмерное количество одновременных запросов
    if (this.activeRequests >= this.maxConcurrentRequests) {
      console.log('[TranslationService] Too many concurrent requests, waiting...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Уменьшаем время ожидания
    }
    
    // Проверка на частоту запросов (защита от блокировки API)
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < (1000 / this.requestsThrottle)) {
      await new Promise(resolve => setTimeout(resolve, (1000 / this.requestsThrottle) - timeSinceLastRequest));
    }
    
    this.activeRequests++;
    this.lastRequestTime = Date.now();
    const startTime = Date.now();
    
    try {
      console.log(`[TranslationService] Sending request to translate text to ${targetLang}`);
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang,
        }),
      });
      
      const duration = Date.now() - startTime;
      console.log(`[TranslationService] Response status from API: ${response.status}, took ${duration}ms`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Проверяем ответ API
      if (!data.success) {
        throw new Error(data.message || 'Translation failed');
      }
      
      // Сохраняем перевод в кэш
      translationManager.addTranslation(text, targetLang, data.translation);
      
      return data.translation;
    } catch (error) {
      console.error('[TranslationService] Translation error:', error);
      // В случае ошибки возвращаем исходный текст
      return text;
    } finally {
      this.activeRequests--;
    }
  }
  
  /**
   * Перевести HTML элемент
   */
  async translateElement(element, targetLang) {
    if (!element || !element.nodeType) return;
    
    // Пропустить элементы с атрибутом data-no-translate
    if (element.getAttribute && element.getAttribute('data-no-translate')) {
      return;
    }
    
    // Собираем все текстовые узлы
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Пропускаем пустые текстовые узлы и скрипты/стили
          const parentNode = node.parentNode;
          if (!node.textContent.trim() || 
              parentNode.nodeName === 'SCRIPT' ||
              parentNode.nodeName === 'STYLE' ||
              parentNode.nodeName === 'NOSCRIPT' ||
              parentNode.nodeName === 'TEXTAREA' ||
              parentNode.nodeName === 'INPUT' ||
              (parentNode.getAttribute && parentNode.getAttribute('data-no-translate'))) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }
    
    // Переводим каждый текстовый узел
    for (const node of textNodes) {
      const text = node.textContent.trim();
      if (text) {
        try {
          const translation = await this.translate(text, targetLang);
          if (translation && translation !== text) {
            node.textContent = node.textContent.replace(text, translation);
          }
        } catch (error) {
          console.error('[TranslationService] Error translating node:', error);
        }
      }
    }
    
    // Переводим атрибуты alt, title, placeholder
    if (element.hasAttributes && element.hasAttributes()) {
      const attributesToTranslate = ['alt', 'title', 'placeholder'];
      
      for (const attr of attributesToTranslate) {
        if (element.hasAttribute(attr)) {
          const attrText = element.getAttribute(attr);
          if (attrText && attrText.trim()) {
            try {
              const translation = await this.translate(attrText, targetLang);
              if (translation && translation !== attrText) {
                element.setAttribute(attr, translation);
              }
            } catch (error) {
              console.error(`[TranslationService] Error translating ${attr} attribute:`, error);
            }
          }
        }
      }
    }
  }
  
  /**
   * Перевести всю страницу
   */
  async translatePage(targetLang) {
    if (targetLang === 'ru') {
      console.log('[TranslationService] Target language is default, skipping translation');
      return true;
    }
    
    console.log(`[TranslationService] Translating page to ${targetLang}`);
    
    try {
      // Переводим body и все его содержимое
      await this.translateElement(document.body, targetLang);
      return true;
    } catch (error) {
      console.error('[TranslationService] Error translating page:', error);
      return false;
    }
  }
  
  /**
   * Ожидание снижения количества активных запросов
   */
  async waitForActiveRequestsToDecrease() {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (this.activeRequests < this.maxConcurrentRequests) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);
    });
  }
  
  /**
   * Ограничение частоты запросов
   */
  async throttleRequest() {
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTime;
    const minInterval = 1000 / this.requestsThrottle;
    
    if (timeElapsed < minInterval) {
      const waitTime = minInterval - timeElapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

const translationService = new TranslationService();
export default translationService;
