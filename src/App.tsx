// React Query의 핵심 클라이언트 및 프로바이더 임포트
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// React Query 상태를 지속시키기 위한 함수 임포트
import { persistQueryClient } from '@tanstack/react-query-persist-client';
// 직접 구현한 IndexedDB 기반의 퍼시스터 임포트
import { idbQueryPersister } from './lib/queryPersister';

// 라우팅 설정 파일 임포트
import AppRoutes from './router';
import ScrollToTop from './components/common/ScrollToTop';

// React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient({
  // 기본 옵션 설정
  defaultOptions: {
    queries: {
      // 가비지 컬렉션 시간 설정 (캐시된 데이터가 사용되지 않을 때 메모리에서 제거되기까지의 시간)
      // 예: 24시간 (밀리초 단위)
      gcTime: 1000 * 60 * 60 * 24,
      // 데이터가 오래된 것으로 간주되기까지의 시간 (이 시간 동안은 데이터를 다시 가져오지 않음)
      staleTime: 1000 * 60 * 60 * 24, // 24시간로 증가
      // 컴포넌트가 마운트될 때마다 데이터를 다시 가져올지 여부
      refetchOnMount: false, // 마운트 시 자동 리페치 비활성화
      // 창이 포커스될 때 데이터를 다시 가져올지 여부
      refetchOnWindowFocus: false, // 창 포커스 시 자동 리페치 비활성화
      // 오류 발생 시 재시도 횟수
      retry: 3,
      // 오류 발생 시 재시도 간격 (밀리초)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// persistQueryClient 함수를 호출하여 QueryClient의 상태 지속성 활성화
persistQueryClient({
  queryClient, // 상태를 지속시킬 QueryClient 인스턴스
  persister: idbQueryPersister, // 사용할 퍼시스터 (IndexedDB 기반 커스텀 퍼시스터)
  maxAge: 1000 * 60 * 60 * 24 * 7, // 캐시 데이터의 최대 유효 기간 (7일로 증가)
  buster: 'app-version-1.0.0', // 캐시 무효화를 위한 문자열 (버전 업데이트)
  // 오류 발생 시 캐시를 무시하고 새로 데이터를 가져오도록 설정
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      if (Array.isArray(query.queryKey) && query.queryKey[0] === 'recommendations') {
        return false;
      }
      // 오류가 있는 쿼리나 직렬화할 수 없는 데이터를 포함한 쿼리는 저장하지 않음
      try {
        // 직렬화 테스트 - 직렬화할 수 없는 데이터가 있으면 예외 발생
        JSON.stringify(query);
        return query.state.status !== 'error';
      } catch (e) {
        console.warn('직렬화할 수 없는 쿼리 무시:', query.queryKey);
        return false;
      }
    },
  },
});

// 메인 애플리케이션 컴포넌트
function App() {
  return (
    // QueryClientProvider를 사용하여 앱 전체에 QueryClient 인스턴스 제공
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      {/* 라우팅 컴포넌트 렌더링 */}
      <AppRoutes />
    </QueryClientProvider>
  );
}

// App 컴포넌트를 기본 export
export default App;
