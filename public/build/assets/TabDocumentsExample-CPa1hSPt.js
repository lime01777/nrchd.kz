import{q as d,j as e,Y as r}from"./app-Dx3ei2n2.js";import{T as m}from"./TabDocuments-DW0ZE1R9.js";import{L as o}from"./LayoutDirection-CiMvzFIE.js";import"./Footer-B_IDLqg1.js";import"./TranslationService-a8IgmIQt.js";import"./Hero-DM0d2GFz.js";function n(){const{translations:t}=d().props,i=(a,s="")=>(t==null?void 0:t[a])||s,l=[{title:"Исследования",years:[{year:"2023 год",documents:[{title:"Инструмент оценки результативности КИ",fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"},{title:i("document.title","Название документа"),fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"},{title:i("document.title","Название документа"),fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"},{title:i("document.title","Название документа"),fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"}]}]},{title:"Методические рекомендации",years:[{year:"2023 год",documents:[{title:"Алгоритм по определению приоритетов КИ",fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"},{title:i("document.title","Название документа"),fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"},{title:i("document.title","Название документа"),fileType:"pdf",fileSize:"24 KB",date:"27.03.2024",url:"#"}]},{year:"2022 год",documents:[{title:"Методические рекомендации по проведению клинических исследований",fileType:"pdf",fileSize:"1.2 MB",date:"15.08.2022",url:"#"},{title:"Стандарты этического комитета для клинических исследований",fileType:"doc",fileSize:"850 KB",date:"10.05.2022",url:"#"}]}]}];return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Пример TabDocuments",meta:[{name:"description",content:"Демонстрация работы вкладок с документами."}]}),e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800 mb-6",children:"Пример использования компонента TabDocuments"}),e.jsx("div",{className:"mb-8",children:e.jsx("p",{className:"text-gray-700 mb-4",children:"Этот компонент позволяет отображать документы в табличном формате с вкладками, группируя их по категориям и годам. Ниже представлен пример реализации компонента с тестовыми данными."})}),e.jsx("div",{className:"bg-white p-6 rounded-lg shadow-md",children:e.jsx(m,{tabs:l})}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Структура данных для компонента"}),e.jsx("pre",{className:"bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm",children:`const tabsData = [
  {
    title: "Название вкладки",
    years: [
      {
        year: "2023 год",
        documents: [
          {
            title: t('document.title', 'Название документа'),
            fileType: "pdf", // тип файла
            fileSize: "24 KB", // размер файла
            date: "27.03.2024", // дата
            url: "#" // ссылка на документ
          },
          // другие документы...
        ]
      },
      // другие годы...
    ]
  },
  // другие вкладки...
]`})]})]})]})}n.layout=t=>e.jsx(o,{h1:"Пример TabDocuments",img:"example",children:t});export{n as default};
