import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/profiles': {
        target: 'http://localhost:3000', // Backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
