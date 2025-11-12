import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ⚡ Progressive Web App configuration
    VitePWA({
      registerType: 'autoUpdate', // met à jour automatiquement le service worker
      injectRegister: 'auto', // injecte automatiquement le code d’enregistrement du SW

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'Proxima',
        short_name: 'Proxima',
        description:
          'Application intelligente pour la géolocalisation du magasin le plus proche et la reconnaissance d’articles via image',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
      },

      // ⚙️ Configuration du service worker
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true, // ⚡ active immédiatement la nouvelle version du SW
      },

      // 🚧 Mode développement
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
});
