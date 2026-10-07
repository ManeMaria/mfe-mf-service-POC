import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation';

// host servido na raiz '/'
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/components/Header.jsx',
        './Sidebar': './src/components/Sidebar.jsx', // Componente compartilhado
      },
      // EXPERIMENTO DA POC: NÃO compartilhar React (ver nota no app1).
      // O host embute seu próprio React 18 nos componentes expostos.
      shared: [],
    }),
  ],
  // federation (@originjs) gera top-level await → precisa de target moderno
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    host: true,
    port: 5172,
  },
})