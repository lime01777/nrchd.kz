/**
 * Simplified translation utility 
 * Uses Google Translate API through Laravel backend
 */

// Show debugging info on page
const DEBUG = true;

/**
 * Translate the page to the specified language
 * @param {string} targetLang - Target language code (en, ru, kz)
 */
export const translatePage = async (targetLang) => {
  // Create visual feedback
  const debugElement = document.createElement('div');
  debugElement.style.position = 'fixed';
  debugElement.style.top = '0';
  debugElement.style.left = '0';
  debugElement.style.width = '100%';
  debugElement.style.zIndex = '9999';
  debugElement.style.background = 'rgba(0,0,0,0.8)';
  debugElement.style.color = 'white';
  debugElement.style.padding = '15px';
  debugElement.style.fontSize = '16px';
  debugElement.style.textAlign = 'center';
  debugElement.innerHTML = `<h3>Перевод страницы на ${targetLang}</h3><div id="debug-status">Инициализация...</div>`;
  document.body.appendChild(debugElement);
  
  const updateStatus = (message) => {
    const status = document.getElementById('debug-status');
    if (status) {
      status.innerHTML += `<br>${message}`;
    }
    console.log('[Translator]', message);
  };
  
  try {
    // Get CSRF token
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      updateStatus('❌ ОШИБКА: CSRF токен не найден!');
      return;
    }
    
    updateStatus(`✓ CSRF токен найден`);
    updateStatus(`Тестирование API перевода...`);
    
    // Test API first
    const testResponse = await fetch('/api/test-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({
        source: 'ru',
        target: targetLang,
        text: 'Тестовый перевод'
      })
    });
    
    const testData = await testResponse.json();
    
    if (!testData.success) {
      updateStatus(`❌ ОШИБКА API: ${testData.message || 'Неизвестная ошибка'}`);
      updateStatus(`Детали API: ${JSON.stringify(testData)}`);
      return;
    }
    
    updateStatus(`✓ API перевода работает! Тестовый перевод: "${testData.translation}"`);
    updateStatus(`Поиск текстовых элементов на странице...`);
    
    // Get all text nodes
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty nodes
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          
          // Skip nodes in our debug element
          if (debugElement.contains(node)) return NodeFilter.FILTER_REJECT;
          
          // Skip script, style tags
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    // Collect all nodes
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim().length > 2) {
        textNodes.push(walker.currentNode);
      }
    }
    
    updateStatus(`Найдено ${textNodes.length} текстовых элементов для перевода`);
    
    // Simple sequential translation of each node to avoid overwhelming API
    let translatedCount = 0;
    
    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      const originalText = node.textContent.trim();
      
      if (originalText.length < 2) continue;
      
      try {
        updateStatus(`Перевод элемента ${i+1}/${textNodes.length}`);
        
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            text: originalText,
            source: 'ru',
            target: targetLang
          })
        });
        
        const result = await response.json();
        
        if (result.success && result.translation) {
          node.textContent = node.textContent.replace(originalText, result.translation);
          translatedCount++;
        } else {
          updateStatus(`⚠️ Ошибка перевода элемента: ${result.message || 'Неизвестная ошибка'}`);
        }
      } catch (error) {
        updateStatus(`⚠️ Ошибка при переводе элемента ${i+1}: ${error.message}`);
      }
      
      // Update every 5 elements
      if (i % 5 === 0) {
        updateStatus(`Прогресс: ${i+1}/${textNodes.length} (${Math.round((i+1)/textNodes.length*100)}%)`);
      }
    }
    
    // Save language preference
    localStorage.setItem('preferredLanguage', targetLang);
    
    updateStatus(`✅ Перевод завершен! Переведено ${translatedCount} из ${textNodes.length} элементов`);
    
    // Update active language button style
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const langCode = btn.getAttribute('data-lang');
      if (langCode === targetLang) {
        btn.style.backgroundColor = '#3b82f6';
        btn.style.color = 'white';
      } else {
        btn.style.backgroundColor = 'white';
        btn.style.color = '#3b82f6';
      }
    });
    
  } catch (error) {
    updateStatus(`❌ КРИТИЧЕСКАЯ ОШИБКА: ${error.message}`);
  }
  
  // Keep debug element visible for a longer time
  setTimeout(() => {
    document.body.removeChild(debugElement);
  }, 8000);
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
  // Set initial language button styles based on localStorage
  const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
  const buttons = document.querySelectorAll('.lang-btn');
  
  buttons.forEach(btn => {
    const langCode = btn.getAttribute('data-lang');
    if (langCode === currentLang) {
      btn.style.backgroundColor = '#3b82f6';
      btn.style.color = 'white';
    } else {
      btn.style.backgroundColor = 'white';
      btn.style.color = '#3b82f6';
    }
  });
  
  console.log('[Translator] Simplified translation system initialized');
});
