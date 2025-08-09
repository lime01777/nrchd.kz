import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Современный редактор контента с улучшенным UX
 * Легкий, быстрый и удобный в использовании
 */
export default function ModernContentEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Начните писать...', 
  className = '',
  minHeight = '300px'
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState(new Set());

  // Синхронизация значения
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Обновление активных форматов
  const updateActiveFormats = useCallback(() => {
    const formats = new Set();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    
    // Проверка заголовков
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }
      
      while (container && container !== editorRef.current) {
        const tagName = container.tagName;
        if (tagName === 'H1') formats.add('h1');
        else if (tagName === 'H2') formats.add('h2');
        else if (tagName === 'H3') formats.add('h3');
        container = container.parentNode;
      }
    }
    
    setActiveFormats(formats);
  }, []);

  // Применение форматирования
  const applyFormat = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    
    setTimeout(updateActiveFormats, 10);
    editorRef.current?.focus();
  }, [onChange, updateActiveFormats]);

  // Обработка изменений
  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // Обработка выделения
  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current) {
      updateActiveFormats();
    }
  }, [updateActiveFormats]);

  // Обработка клавиш
  const handleKeyDown = useCallback((e) => {
    // Ctrl/Cmd + клавиши для быстрого форматирования
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('underline');
          break;
      }
    }
  }, [applyFormat]);

  // Установка слушателей
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  // Кнопка форматирования
  const FormatButton = ({ command, icon, title, format, value = null }) => {
    const isActive = activeFormats.has(format);
    
    return (
      <button
        type="button"
        onClick={() => applyFormat(command, value)}
        className={`p-2 rounded-md transition-colors text-sm font-medium ${
          isActive 
            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
        }`}
        title={title}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className} ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
      {/* Панель инструментов */}
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Заголовки */}
          <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-300">
            <FormatButton
              command="formatBlock"
              value="h1"
              format="h1"
              title="Заголовок 1"
              icon={<span className="font-bold">H1</span>}
            />
            <FormatButton
              command="formatBlock"
              value="h2"
              format="h2"
              title="Заголовок 2"
              icon={<span className="font-bold">H2</span>}
            />
            <FormatButton
              command="formatBlock"
              value="h3"
              format="h3"
              title="Заголовок 3"
              icon={<span className="font-bold">H3</span>}
            />
          </div>

          {/* Основное форматирование */}
          <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-300">
            <FormatButton
              command="bold"
              format="bold"
              title="Жирный (Ctrl+B)"
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                </svg>
              }
            />
            <FormatButton
              command="italic"
              format="italic"
              title="Курсив (Ctrl+I)"
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
                </svg>
              }
            />
            <FormatButton
              command="underline"
              format="underline"
              title="Подчеркивание (Ctrl+U)"
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
                </svg>
              }
            />
          </div>

          {/* Списки */}
          <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-300">
            <FormatButton
              command="insertUnorderedList"
              format="ul"
              title="Маркированный список"
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
                </svg>
              }
            />
            <FormatButton
              command="insertOrderedList"
              format="ol"
              title="Нумерованный список"
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                </svg>
              }
            />
          </div>

          {/* Дополнительные команды */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => applyFormat('createLink', prompt('Введите URL:'))}
              className="p-2 rounded-md transition-colors text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Добавить ссылку"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => applyFormat('removeFormat')}
              className="p-2 rounded-md transition-colors text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Убрать форматирование"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Область редактирования */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onMouseUp={updateActiveFormats}
        className="p-4 modern-editor-content max-w-none focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />


    </div>
  );
}
