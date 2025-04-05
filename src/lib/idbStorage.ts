// src/lib/idbStorage.ts
// idb 라이브러리에서 필요한 함수와 타입을 임포트합니다.
import { openDB, IDBPDatabase } from 'idb';
// Zustand 미들웨어에서 사용하는 스토리지 인터페이스 타입을 임포트합니다.
import { StateStorage } from 'zustand/middleware';

// IndexedDB 데이터베이스 이름 정의
const DB_NAME = 'zustand-db';
// 사용할 객체 저장소(테이블과 유사) 이름 정의
const STORE_NAME = 'zustand-store';
// 데이터베이스 버전 정의 (스키마 변경 시 버전 증가 필요)
const VERSION = 1;

// IndexedDB 인스턴스를 가져오는 비동기 함수
function getDB(): Promise<IDBPDatabase> {
  // openDB 함수를 사용하여 데이터베이스를 열거나 생성합니다.
  return openDB(DB_NAME, VERSION, {
    // upgrade 콜백은 DB가 처음 생성되거나 버전이 변경될 때 호출됩니다.
    upgrade(db) {
      // 지정된 이름의 객체 저장소가 존재하지 않으면 생성합니다.
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// Zustand의 persist 미들웨어가 요구하는 StateStorage 인터페이스를 구현한 객체
export const idbStorage: StateStorage = {
  // IndexedDB에서 데이터를 가져오는 메서드
  getItem: async (name: string): Promise<string | null> => {
    // DB 인스턴스를 가져옵니다.
    const db = await getDB();
    // 읽기 전용(readonly) 트랜잭션을 시작합니다.
    const tx = db.transaction(STORE_NAME, 'readonly');
    // 트랜잭션 내에서 객체 저장소를 가져옵니다.
    const store = tx.objectStore(STORE_NAME);
    // 주어진 이름(키)에 해당하는 값을 가져옵니다.
    const value = await store.get(name);
    // 트랜잭션 완료를 기다립니다.
    await tx.done;

    // Zustand의 persist 미들웨어는 문자열 형태의 값을 기대합니다.
    // IndexedDB는 객체를 직접 저장할 수 있으므로, 가져온 값이 존재하면 문자열로 변환합니다.
    // 값이 undefined일 경우 (즉, 저장된 값이 없을 경우) null을 반환해야 합니다 (StateStorage 타입 요구사항).
    return value ? JSON.stringify(value) : null;
  },
  // IndexedDB에 데이터를 저장하는 메서드
  setItem: async (name: string, value: string): Promise<void> => {
    // DB 인스턴스를 가져옵니다.
    const db = await getDB();
    // 읽기/쓰기(readwrite) 트랜잭션을 시작합니다.
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // 트랜잭션 내에서 객체 저장소를 가져옵니다.
    const store = tx.objectStore(STORE_NAME);

    // Zustand의 persist 미들웨어는 문자열 형태의 value를 전달합니다.
    // IndexedDB에는 일반적으로 객체 형태로 저장하는 것이 유리하므로, JSON.parse를 사용하여 객체로 변환합니다.
    // 변환된 객체를 주어진 이름(키)으로 저장(put)합니다. 키가 이미 존재하면 덮어씁니다.
    await store.put(JSON.parse(value), name);
    // 트랜잭션 완료를 기다립니다.
    await tx.done;
  },
  // IndexedDB에서 데이터를 삭제하는 메서드
  removeItem: async (name: string): Promise<void> => {
    // DB 인스턴스를 가져옵니다.
    const db = await getDB();
    // 읽기/쓰기(readwrite) 트랜잭션을 시작합니다.
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // 트랜잭션 내에서 객체 저장소를 가져옵니다.
    const store = tx.objectStore(STORE_NAME);
    // 주어진 이름(키)에 해당하는 값을 삭제합니다.
    await store.delete(name);
    // 트랜잭션 완료를 기다립니다.
    await tx.done;
  },
};