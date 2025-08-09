import React, { useState, useRef, useEffect } from 'react';

/**
 * Простой редактор текста с базовым форматированием
 * Не использует устаревшие методы и хорошо работает с React 17+
 * 
 * @param {Object} props 
 * @param {string} props.value - текущее содержимое редактора
 * @param {Function} props.onChange - функция обратного вызова при изменении содержимого
 * @param {string} props.placeholder - текст-заполнитель
 * @param {string} props.className - дополнительные классы CSS
 * @returns {JSX.Element}
 */
const SimpleRichEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Введите текст...', 
  className = '',
  minHeight = '180px',
  rtl = false
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isRTL, setIsRTL] = useState(rtl);

  // Синхронизируем значение из props с содержимым редактора
  useEffect(() => {
    if (editorRef.current) {
      // Обновляем только если содержимое отличается
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Применяем форматирование к выделенному тексту
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    
    // Передаем изменения в родительский компонент
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    // Возвращаем фокус в редактор
    editorRef.current.focus();
  };

  // Обрабатываем изменения в редакторе
  const handleChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };



  // Обрабатываем ввод текста
  const handleInput = (e) => {
    // Вызываем стандартный обработчик изменений
    handleChange();
  };

  // Обрабатываем нажатие клавиш
  const handleKeyDown = (e) => {
    // Обрабатываем Enter для создания нового параграфа
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const paragraph = document.createElement('p');
      
      // Вставляем новый параграф
      range.deleteContents();
      range.insertNode(paragraph);
      
      // Перемещаем курсор в новый параграф
      const newRange = document.createRange();
      newRange.setStart(paragraph, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      // Вызываем обработчик изменений
      handleChange();
    }
  };

  return (
    <div className="simple-editor-container">
      {/* Панель инструментов */}
      <div className="simple-editor-toolbar flex gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Полужирный"
        >
          <strong>Ж</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Курсив"
        >
          <em>К</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Подчеркнутый"
        >
          <u>Ч</u>
        </button>
        <div className="mx-2 border-r border-gray-300"></div>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Маркированный список"
        >
          • Список
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Нумерованный список"
        >
          1. Список
        </button>
        <div className="mx-2 border-r border-gray-300"></div>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h2')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Заголовок"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h3')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Подзаголовок"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'p')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Параграф"
        >
          P
        </button>
        <div className="mx-2 border-r border-gray-300"></div>
        <button
          type="button"
          onClick={() => {
            setIsRTL(!isRTL);
            if (editorRef.current) {
              editorRef.current.classList.toggle('rtl');
              editorRef.current.setAttribute('dir', !isRTL ? 'rtl' : 'ltr');
            }
          }}
          className={`p-1 rounded ${isRTL ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
          title={isRTL ? 'Слева направо' : 'Справа налево'}
        >
          {isRTL ? 'LTR' : 'RTL'}
        </button>
      </div>

      {/* Поле редактора */}
      <div
        ref={editorRef}
        contentEditable
        className={`w-full p-3 bg-white border border-gray-300 rounded-b outline-none ${
          isFocused ? 'border-blue-400 ring-2 ring-blue-100' : ''
        } ${isRTL ? 'rtl' : ''} ${className}`}
        style={{ minHeight }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
        dir={isRTL ? 'rtl' : 'ltr'}
      />

      {/* Стили для поддержки плейсхолдера и RTL */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        
        [contenteditable] {
          text-align: left;
          direction: ltr;
        }
        
        [contenteditable].rtl {
          text-align: right;
          direction: rtl;
          unicode-bidi: bidi-override;
        }
        
        [contenteditable].rtl * {
          direction: rtl;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default SimpleRichEditor;
