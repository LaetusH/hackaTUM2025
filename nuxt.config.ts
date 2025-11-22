import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-11-22',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@vite-pwa/nuxt', '@nuxtjs/leaflet'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  pages: false,
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Tempute',
      short_name: 'Tempute',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/logo-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/logo-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/logo-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  },
  runtimeConfig: {
    orsApiKey: process.env.ORS_API_KEY,
    public: {
      orsApiKey: process.env.ORS_API_KEY || ''
    }
  }
})