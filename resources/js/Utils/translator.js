/**
 * Translation utility for the website
 * Uses Google Translate API through our backend
 */

// Debug mode - set to false and disable translator completely
const DEBUG = false;
const DISABLE_TRANSLATION = true;

// Helper function for debugging
function log(...args) {
  if (DEBUG) {
    console.log('[Translator]', ...args);
  }
}

// Cache for translated elements to avoid re-translating the same content
const translationCache = {
  en: new Map(),
  kz: new Map(),
  ru: new Map()
};

// Get CSRF token for API requests
function getCSRFToken() {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  if (!token && DEBUG) {
    console.warn('CSRF token not found!');
  }
  return token;
}

/**
 * Translate the entire page to the target language
 * 
 * @param {string} targetLang - Target language code (en, kz, ru)
 */
export const translatePage = async (targetLang) => {
  if (DISABLE_TRANSLATION) {
    return;
  }
  // Get current language from localStorage or use default
  const currentLang = localStorage.getItem('preferredLanguage') || 'ru';
  
  // If already in the target language, do nothing
  if (currentLang === targetLang) {
    log('Already in target language:', targetLang);
    return;
  }
  
  log(`Translating page from ${currentLang} to ${targetLang}`);
  
  // Add loading indicator
  document.body.classList.add('translating');
  
  // Add visual feedback for debugging
  const indicator = document.createElement('div');
  indicator.textContent = `Translating to ${targetLang}...`;
  indicator.style.position = 'fixed';
  indicator.style.top = '10px';
  indicator.style.right = '10px';
  indicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
  indicator.style.color = 'white';
  indicator.style.padding = '10px';
  indicator.style.borderRadius = '5px';
  indicator.style.zIndex = '9999';
  document.body.appendChild(indicator);
  
  try {
    // First test the API connection
    const testResponse = await fetch('/api/test-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCSRFToken()
      },
      body: JSON.stringify({
        source: currentLang,
        target: targetLang,
        text: 'Test translation'
      })
    });
    
    const testResult = await testResponse.json();
    log('Test translation result:', testResult);
    
    if (!testResult.success) {
      console.error('Translation API test failed:', testResult.message);
      alert(`Translation API error: ${testResult.message || 'Unknown error'}`);
      document.body.classList.remove('translating');
      document.body.removeChild(indicator);
      return;
    }
    
    // Get all text nodes that should be translated
    const textNodes = getTextNodesToTranslate();
    log(`Found ${textNodes.length} text nodes to translate`);
    
    // Update indicator with progress info
    indicator.textContent = `Found ${textNodes.length} elements to translate`;

    
    // Batch processing to avoid overwhelming the API
    const batchSize = 5;
    let translatedCount = 0;
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      indicator.textContent = `Translating ${translatedCount}/${textNodes.length}...`;
      
      // Process each batch in parallel
      await Promise.all(batch.map(async (node) => {
        try {
          const originalText = node.textContent.trim();
          
          // Skip if too short
          if (originalText.length < 2) return;
          
          // Use cached translation if available
          if (translationCache[targetLang].has(originalText)) {
            node.textContent = node.textContent.replace(originalText, translationCache[targetLang].get(originalText));
            translatedCount++;
            return;
          }
          
          // Call translation API
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': getCSRFToken()
            },
            body: JSON.stringify({
              text: originalText,
              source: currentLang,
              target: targetLang
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.translation) {
              // Cache result for future use
              translationCache[targetLang].set(originalText, result.translation);
              
              // Replace text in node
              node.textContent = node.textContent.replace(originalText, result.translation);
              translatedCount++;
            }
          }
        } catch (error) {
          console.error('Error translating node:', error);
        }
      }));
      
      log(`Translated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textNodes.length / batchSize)}`);
    }
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', targetLang);
    
    // Update visual feedback
    indicator.textContent = `Translation complete! (${translatedCount}/${textNodes.length})`;
    log(`Translation complete to ${targetLang}, translated ${translatedCount} elements`);
    
    // Update language button active state
    updateLanguageButtonStyles(targetLang);
    
    // Remove indicator after a delay
    setTimeout(() => {
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator);
      }
    }, 2000);
  } catch (error) {
    console.error('Translation error:', error);
    alert(`Translation error: ${error.message}`);
  } finally {
    // Hide loading indicator
    document.body.classList.remove('translating');
  }
}

/**
 * Get all text nodes in the document that should be translated
 * @returns {Array} Array of text nodes to translate
 */
function getTextNodesToTranslate() {
  const results = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip if parent is one of these elements
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        const tagName = parent.tagName.toLowerCase();
        if (
          // Skip script and style tags
          tagName === 'script' || 
          tagName === 'style' || 
          // Skip code elements
          tagName === 'code' || 
          tagName === 'pre' ||
          // Skip elements marked with data-no-translate
          parent.closest('[data-no-translate]') ||
          // Skip language buttons
          parent.closest('.lang-btn') ||
          // Skip elements with .no-translate class
          parent.classList.contains('no-translate') ||
          // Skip form elements
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          tagName === 'option' ||
          // Skip navigation and links
          tagName === 'a' ||
          parent.closest('nav')
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip empty nodes
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip purely numeric content or very short content
        if (/^[\d\s,.\-+:]*$/.test(node.textContent.trim()) || 
            node.textContent.trim().length < 3) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  while (node = walker.nextNode()) {
    results.push(node);
  }
  
  log(`Found ${results.length} text nodes to translate`);
  return results;
}



/**
 * Update language buttons to show which one is active
 * @param {string} activeLanguage - The currently active language code (en, ru, kz) 
 */
function updateLanguageButtonStyles(activeLanguage) {
  // Find all language buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Update their styles based on active language
  langButtons.forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    if (lang === activeLanguage) {
      btn.classList.add('active');
      btn.style.backgroundColor = '#3b82f6'; // Blue background for active button
      btn.style.color = 'white';
    } else {
      btn.classList.remove('active');
      btn.style.backgroundColor = 'transparent';
      btn.style.color = 'black';
    }
  });
}

/**
 * Initialize the translation system when the page loads
 * This will highlight the correct language button
 */
export function initTranslation() {
  // Get user's preferred language from localStorage or default to Russian
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ru';
  
  // Apply styles to language buttons
  updateLanguageButtonStyles(preferredLanguage);
  
  log(`Translation system initialized with language: ${preferredLanguage}`);
}

// Set up the translation system when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initTranslation();
  log('Translation system ready');
});

// Add a CSS style for the loading indicator
if (typeof document !== 'undefined' && !document.getElementById('translation-styles')) {
  const style = document.createElement('style');
  style.id = 'translation-styles';
  style.innerHTML = `
    body.translating::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(to right, #3b82f6, #93c5fd, #3b82f6);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      z-index: 9999;
    }
    @keyframes loading {
      0% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .lang-btn.active {
      background-color: #3b82f6;
      color: white;
    }
  `;
  document.head.appendChild(style);
}
