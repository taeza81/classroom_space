import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 🌐 GitHub Pages 배포 시 저장소 이름(/classroom_space/) 자동 감지 및 로컬 개발 환경('./') 완벽 호환
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : './',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
