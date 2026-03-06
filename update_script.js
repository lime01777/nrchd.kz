const fs = require('fs');

const componentPath = '/home/lime/Документы/nrchd.kz/nrchd.kz/resources/js/Components/FolderChlank.jsx';
let componentCode = fs.readFileSync(componentPath, 'utf8');

componentCode = componentCode.replace(
  'colorsec = "bg-blue-600"\n}) {',
  'colorsec = "bg-blue-600",\n  subfolders = []\n}) {'
);

componentCode = componentCode.replace(
  'h-[250px]',
  'min-h-[250px]'
);

const subfoldersCode = `
          {description && (
            <p className="text-sm opacity-90 leading-relaxed">{description}</p>
          )}
          {subfolders && subfolders.length > 0 && (
            <div className="flex flex-col gap-2 mt-6">
              {subfolders.map((sf, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white bg-opacity-40 rounded-lg hover:bg-opacity-60 transition text-gray-900">
                  <svg className="w-6 h-6 text-emerald-700" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                  {sf.href ? (
                    <Link href={sf.href} className="text-sm font-medium w-full relative z-10">{sf.title}</Link>
                  ) : (
                    <span className="text-sm font-medium w-full">{sf.title}</span>
                  )}
                </div>
              ))}
            </div>
          )}
`;

componentCode = componentCode.replace(
  /\{\s*description && \(\s*<p className="text-sm opacity-90 leading-relaxed">\{description\}<\/p>\s*\)\s*\}/,
  subfoldersCode
);

const buttonsCode = `
        {(!subfolders || subfolders.length === 0) && (
          <div className="flex mt-4 justify-between">
            {href ? (
              <Link
                href={href}
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                {buttonText}
              </Link>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-black inline-flex items-center border-gray-900 border-[1px] rounded-xl p-3 hover:bg-white hover:bg-opacity-20 transition-colors">
                {buttonText}
              </a>
            )}
          </div>
        )}
`;

componentCode = componentCode.replace(
  /<div className="flex mt-4 justify-between">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  buttonsCode + '\n      </div>\n    </div>'
);

fs.writeFileSync(componentPath, componentCode);

console.log("Component updated");

const pagePath = '/home/lime/Документы/nrchd.kz/nrchd.kz/resources/js/Pages/Direction/CenterPrevention.jsx';
let pageCode = fs.readFileSync(pagePath, 'utf8');

const updatedTabsCode = `
            <FolderChlank color="bg-emerald-200" colorsec="bg-emerald-300" title={tab1Label} description={tab1Folder} subfolders={[
              { title: "Подпапка 1", href: "#" },
              { title: "Подпапка 2", href: "#" },
              { title: "Подпапка 3", href: "#" }
            ]} />
            <FolderChlank color="bg-emerald-200" colorsec="bg-emerald-300" title={tab2Label} description={tab2Folder} subfolders={[
              { title: "Подпапка 1", href: "#" },
              { title: "Подпапка 2", href: "#" },
              { title: "Подпапка 3", href: "#" }
            ]} />
            <FolderChlank color="bg-emerald-200" colorsec="bg-emerald-300" title={tab3Label} description={tab3Folder} subfolders={[
              { title: "Подпапка 1", href: "#" },
              { title: "Подпапка 2", href: "#" },
              { title: "Подпапка 3", href: "#" }
            ]} />
`;

pageCode = pageCode.replace(
  /<FolderChlank color="bg-emerald-200" colorsec="bg-emerald-300" title=\{tab1Label\} description=\{tab1Folder\} href="#" \/>[\s\S]*?<FolderChlank color="bg-emerald-200" colorsec="bg-emerald-300" title=\{tab3Label\} description=\{tab3Folder\} href="#" \/>/,
  updatedTabsCode.trim()
);

fs.writeFileSync(pagePath, pageCode);

console.log("Page updated");

