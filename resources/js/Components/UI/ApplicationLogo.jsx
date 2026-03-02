export default function ApplicationLogo({ className = '', ...props }) {
    // Убираем классы размеров SVG (h-*, w-*, fill-current), чтобы текст рендерился правильно
    const cleanClass = className.replace(/\bh-\d+\b|\bw-\w+\b|\bw-\d+\b|\bfill-current\b/g, '').trim();

    return (
        <span {...props} className={`text-4xl font-extrabold tracking-tight text-blue-600 ${cleanClass}`.trim()}>
            ННЦРЗ
        </span>
    );
}

