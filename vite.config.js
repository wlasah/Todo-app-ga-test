import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/To-Do-List-App/',  // ✅ Make sure to add the trailing slash
});
