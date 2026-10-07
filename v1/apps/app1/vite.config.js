import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation';

// base '/app1/' porque o Nginx raiz serve este app sob /app1/
export default defineConfig({
  base: '/app1/',
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'app1',
      remotes: {
        host: 'http://localhost:8090/assets/remoteEntry.js', // URL do Remote (gateway na 8090)
      },
      // EXPERIMENTO DA POC: NÃO compartilhar React.
      // app1 (React 19) consome Header/Sidebar do host (React 18).
      // Sem `shared`, cada app carrega seu próprio React → esperamos
      // conflito ao renderizar componente de uma versão na árvore de outra
      // (React error #525). O objetivo é enfrentar e documentar esse cenário.
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
    port: 5173,
  },
})
