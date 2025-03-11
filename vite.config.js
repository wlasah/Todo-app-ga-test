import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Todo-app-ga-test/',  // ✅ Make sure to add the trailing slash
});
