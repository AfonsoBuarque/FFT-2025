import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'FaithFlow Tech',
        short_name: 'FaithFlow',
        description: 'Sistema de gestão para igrejas',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://i.postimg.cc/rzXZnTnS/logo-preto-2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://i.postimg.cc/rzXZnTnS/logo-preto-2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});