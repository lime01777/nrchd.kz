import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
                        if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-chartjs';
                        if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-leaflet';
                        if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-tiptap';
                        if (id.includes('framer-motion')) return 'vendor-framer';
                        return 'vendor'; // all other vendors go here
                    }
                }
            }
        },
        chunkSizeWarningLimit: 600,
    }
});
