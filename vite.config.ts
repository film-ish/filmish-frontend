import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // 백엔드 API 서버 주소 - EC2 서버 주소
        // 프론트엔드에서 '/api/...'로 시작하는 모든 요청은 이 서버로 프록시됩니다
        target: 'http://j12d207.p.ssafy.io:8080',

        // changeOrigin: true - 호스트 헤더를 타겟 URL의 호스트로 변경
        // CORS 이슈 방지를 위해 필요한 설정입니다
        changeOrigin: true,

        // 로컬 개발 시 백엔드를 로컬에서 실행하는 경우 아래 주소로 변경하세요:
        // target: 'http://localhost:8080',
      },
    },
  },
});
