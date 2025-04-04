// React Query의 핵심 클라이언트 및 프로바이더 임포트
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// React Query 상태를 지속시키기 위한 함수 임포트
import { persistQueryClient } from '@tanstack/react-query-persist-client';
// 직접 구현한 IndexedDB 기반의 퍼시스터 임포트
import { idbQueryPersister } from './lib/queryPersister';

// 라우팅 설정 파일 임포트
import AppRoutes from './router';

// React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient({
  // 기본 옵션 설정
  defaultOptions: {
    queries: {
      // 가비지 컬렉션 시간 설정 (캐시된 데이터가 사용되지 않을 때 메모리에서 제거되기까지의 시간)
      // 예: 24시간 (밀리초 단위)
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

// persistQueryClient 함수를 호출하여 QueryClient의 상태 지속성 활성화
persistQueryClient({
  queryClient, // 상태를 지속시킬 QueryClient 인스턴스
  persister: idbQueryPersister, // 사용할 퍼시스터 (IndexedDB 기반 커스텀 퍼시스터)
  // maxAge: 1000 * 60 * 60 * 24, // 선택적: 캐시 데이터의 최대 유효 기간 (기본값은 gcTime)
  // buster: 'app-version-1',     // 선택적: 캐시 무효화를 위한 문자열 (앱 버전 변경 등)
});

// 메인 애플리케이션 컴포넌트
function App() {
  return (
    // QueryClientProvider를 사용하여 앱 전체에 QueryClient 인스턴스 제공
    <QueryClientProvider client={queryClient}>
      {/* 라우팅 컴포넌트 렌더링 */}
      <AppRoutes />
    </QueryClientProvider>
  );
}

// App 컴포넌트를 기본 export
export default App;
