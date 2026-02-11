import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

/**
 * Компонент CustomQuill с динамическим импортом ReactQuill для избежания проблем с findDOMNode
 */
const CustomQuill = (props) => {
  const [ReactQuill, setReactQuill] = useState(null);
  const editorRef = useRef(null);

  // Динамический импорт ReactQuill для избежания проблем во время рендеринга
  useEffect(() => {
    // Используем динамический импорт через import()
    import('react-quill').then((module) => {
      setReactQuill(() => module.default);
    }).catch(err => {
      console.error('Ошибка загрузки ReactQuill:', err);
    });
  }, []);

  // Показываем заглушку, пока компонент загружается
  if (!ReactQuill) {
    return (
      <div className="bg-gray-100 rounded-md p-3 min-h-[180px] flex items-center justify-center">
        <div className="text-gray-500">Загрузка редактора...</div>
      </div>
    );
  }

  return (
    <ReactQuill
      ref={editorRef}
      {...props}
    />
  );
};

export default CustomQuill;
