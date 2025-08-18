import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // слушаем все интерфейсы
    allowedHosts: [
      '.serveo.net', // разрешаем все субдомены serveo
      '.loclx.io',   // для LocalXpose
      '.trycloudflare.com' // для Cloudflare
    ],
    // Дополнительные настройки для WebSockets:
    hmr: {
      clientPort: 443 // важно для туннелей HTTPS
    }
  },
  preview: {
    host: true,
    port: 5173
  }
});