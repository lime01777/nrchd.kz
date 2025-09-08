/**
 * SimpleFastTranslationService - Упрощенный быстрый сервис переводов
 * Работает только с базой данных, Google Translate отключен
 */

class SimpleFastTranslationService {
  constructor() {
    this.currentLanguage = 'ru';
    this.isTranslating = false;
  }

  /**
   * Быстрое переключение языка страницы
   * @param {string} targetLanguage - Целевой язык (en, kz, ru)
   */
  async translatePage(targetLanguage) {
    if (this.isTranslating || targetLanguage === this.currentLanguage) {
      return;
    }

    console.log(`[SimpleFastTranslationService] Переключение на язык: ${targetLanguage}`);
    this.isTranslating = true;

    try {
      // Используем существующий LanguageManager для совместимости
      if (window.LanguageManager) {
        await window.LanguageManager.switchLanguage(targetLanguage);
      } else {
        // Динамически импортируем LanguageManager если его нет
        const { default: LanguageManager } = await import('../Utils/LanguageManager.js');
        await LanguageManager.switchLanguage(targetLanguage);
      }
      
      this.currentLanguage = targetLanguage;
      console.log(`[SimpleFastTranslationService] Язык успешно переключен на: ${targetLanguage}`);
      
    } catch (error) {
      console.error('[SimpleFastTranslationService] Ошибка переключения языка:', error);
      throw error;
    } finally {
      this.isTranslating = false;
    }
  }

  /**
   * Получить текущий язык
   * @returns {string}
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Проверить, идет ли перевод
   * @returns {boolean}
   */
  isTranslating() {
    return this.isTranslating;
  }
}

// Создаем глобальный экземпляр сервиса
const SimpleFastTranslationService_Instance = new SimpleFastTranslationService();

// Экспортируем для использования в других модулях
export { SimpleFastTranslationService_Instance as TranslationService };
export default SimpleFastTranslationService_Instance;
