// idb 라이브러리에서 필요한 함수와 타입을 임포트합니다.
import { openDB, IDBPDatabase } from 'idb';
// React Query Persist Client에서 사용하는 타입들을 임포트합니다.
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

// IndexedDB 데이터베이스 이름 정의 (Zustand와 분리하거나 공유 가능)
const DB_NAME = 'react-query-db';
// React Query 캐시를 저장할 객체 저장소 이름 정의
const STORE_NAME = 'query-cache';
// 데이터베이스 버전 정의
const VERSION = 1;
// IndexedDB 내에서 캐시 데이터를 식별하기 위한 고정된 키
const CACHE_KEY = 'reactQueryCache';

// React Query용 IndexedDB 인스턴스를 가져오는 비동기 함수
function getQueryDB(): Promise<IDBPDatabase> {
  // openDB 함수를 사용하여 데이터베이스를 열거나 생성합니다.
  return openDB(DB_NAME, VERSION, {
    // upgrade 콜백: DB가 처음 생성되거나 버전 변경 시 호출
    upgrade(db) {
      // query-cache 객체 저장소가 없으면 생성
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// React Query의 Persister 인터페이스를 구현한 객체
export const idbQueryPersister: Persister = {
  // React Query 클라이언트 상태(캐시)를 IndexedDB에 저장하는 메서드
  persistClient: async (client: PersistedClient): Promise<void> => {
    // DB 인스턴스 가져오기
    const db = await getQueryDB();
    // 읽기/쓰기 트랜잭션 시작
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // 객체 저장소 가져오기
    const store = tx.objectStore(STORE_NAME);

    // Promise 객체를 필터링하는 함수
    const removePromises = (obj: unknown): unknown => {
      if (obj === null || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map((item) => removePromises(item));
      }

      const result: Record<string, unknown> = {};
      for (const key in obj) {
        if (obj[key] instanceof Promise) {
          // Promise 객체는 제외
          continue;
        }
        result[key] = removePromises(obj[key]);
      }
      return result;
    };

    // Promise 객체를 제거한 클라이언트 상태 생성
    const sanitizedClient = {
      ...client,
      clientState: {
        ...client.clientState,
        queries: removePromises(client.clientState.queries),
        mutations: removePromises(client.clientState.mutations),
      },
    };

    // PersistedClient 객체 전체를 미리 정의된 CACHE_KEY를 사용하여 저장
    await store.put(sanitizedClient, CACHE_KEY);
    // 트랜잭션 완료 기다리기
    await tx.done;
    // console.log('React Query client persisted to IDB'); // 디버깅용 로그
  },
  // IndexedDB에서 저장된 React Query 클라이언트 상태를 복원하는 메서드
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    // DB 인스턴스 가져오기
    const db = await getQueryDB();
    // 읽기 전용 트랜잭션 시작
    const tx = db.transaction(STORE_NAME, 'readonly');
    // 객체 저장소 가져오기
    const store = tx.objectStore(STORE_NAME);
    // CACHE_KEY를 사용하여 저장된 값 가져오기
    const value = await store.get(CACHE_KEY);
    // 트랜잭션 완료 기다리기
    await tx.done;
    // console.log('React Query client restored from IDB:', value); // 디버깅용 로그
    // 가져온 값을 PersistedClient 타입 또는 undefined로 반환 (타입 단언 사용)
    return value as PersistedClient | undefined;
  },
  // IndexedDB에서 저장된 React Query 클라이언트 상태를 삭제하는 메서드
  removeClient: async (): Promise<void> => {
    // DB 인스턴스 가져오기
    const db = await getQueryDB();
    // 읽기/쓰기 트랜잭션 시작
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // 객체 저장소 가져오기
    const store = tx.objectStore(STORE_NAME);
    // CACHE_KEY에 해당하는 값 삭제
    await store.delete(CACHE_KEY);
    // 트랜잭션 완료 기다리기
    await tx.done;
    // console.log('React Query client removed from IDB'); // 디버깅용 로그
  },
};
