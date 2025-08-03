import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
