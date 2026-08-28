import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 🌐 GitLab Pages 및 상대 경로 배포 완벽 지원
  plugins: [
    tailwindcss(),
    react(),
  ],
})
