import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
