// Скрипт для обновления страниц филиалов
const fs = require('fs');
const path = require('path');

const branchesDir = path.join(__dirname, 'resources', 'js', 'Pages', 'Branches');

// Получаем список всех файлов филиалов
const branchFiles = fs.readdirSync(branchesDir)
  .filter(file => file.endsWith('.jsx') && file !== 'BranchTemplate.jsx' && file !== 'BranchPageTemplate.jsx');

branchFiles.forEach(file => {
  const filePath = path.join(branchesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Пропускаем файлы, которые уже обновлены (содержат LayoutBranch)
  if (content.includes('import LayoutBranch from')) {
    console.log(`Файл ${file} уже обновлен`);
    return;
  }
  
  // Меняем импорты
  content = content.replace(
    /import BranchTemplate from '.\/BranchTemplate';/g, 
    "import LayoutBranch from '@/Layouts/LayoutBranch';"
  );
  
  // Извлекаем имя компонента
  const componentName = path.basename(file, '.jsx');
  
  // Извлекаем branchFolder (используется в пути BranchTemplate)
  const branchFolderMatch = content.match(/branchFolder=['"]([^'"]+)['"]/);
  const branchFolder = branchFolderMatch ? branchFolderMatch[1] : componentName;
  
  // Меняем структуру компонента
  content = content.replace(
    /return \(\s*<BranchTemplate[^>]*\s*title=\{([^}]+)\}\s*description=\{([^}]+)\}\s*branchFolder=['"]([^'"]+)['"]\s*leaders=\{([^}]+)\}\s*\/>\s*\);/s,
    `return (
        <>
            <Head title={$1} />
            <section className="text-gray-600 body-font pb-8">
                <div className="container px-5 py-12 mx-auto">
                    <div className="flex flex-wrap px-12 text-justify">
                        <p className="mb-4 tracking-wide text-gray-700 leading-relaxed">
                            {$2}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

${componentName}.layout = (page) => <LayoutBranch 
    img={'branch'}
    h1={$1} 
    description={$2}
    branchFolder="$3"
    leaders={$4}
>{page}</LayoutBranch>`
  );
  
  // Сохраняем обновленный файл
  fs.writeFileSync(filePath, content);
  console.log(`Обновлен файл: ${file}`);
});

console.log('Завершено обновление страниц филиалов');
