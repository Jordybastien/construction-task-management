import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg}'],
        globIgnores: ['**/img-*.png'],
        maximumFileSizeToCacheInBytes: 3000000
      },
      includeAssets: ['icon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Construction Task Manager',
        short_name: 'TaskManager',
        description: 'Offline-first construction project management',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    }),
    // Add bundle analyzer in analyze mode
    mode === 'analyze' && visualizer({
      filename: 'dist/bundle-analyzer.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/layouts': '/src/layouts',
      '@/hooks': '/src/hooks',
      '@/models': '/src/models',
      '@/utils': '/src/utils',
      '@/router': '/src/router',
      '@/lib': '/src/lib',
      '@/containers': '/src/containers',
    },
  },
}));
