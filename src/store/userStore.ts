// Zustand 라이브러리에서 create 함수를 임포트하여 스토어를 생성합니다.
import { create } from 'zustand';
// Zustand의 미들웨어인 persist와 createJSONStorage를 임포트합니다.
// persist는 상태를 영구 저장소에 저장하고 복원하는 기능을 제공합니다.
// createJSONStorage는 스토리지 어댑터(예: localStorage, sessionStorage, custom storage)를 연결해줍니다.
import { persist, createJSONStorage } from 'zustand/middleware';
// 이전에 정의한 IndexedDB 기반의 커스텀 스토리지 어댑터를 임포트합니다.
import { idbStorage } from '../lib/idbStorage'; // 경로 확인: lib 폴더 아래에 idbStorage.ts가 있어야 합니다.

// 사용자 상태(State)의 타입을 정의하는 인터페이스입니다.
export interface UserState {
  id: number | null; // 사용자 ID (로그인 전에는 null)
  email: string | null; // 사용자 이메일 (로그인 전에는 null)
  nickname: string | null; // 사용자 닉네임 (로그인 전에는 null)
  headImage: string | null; // 사용자 프로필 이미지 URL (로그인 전에는 null)
  isLoggedIn: boolean; // 로그인 상태 여부
  // 사용자 정보를 업데이트하는 액션(함수) 타입 정의
  setUser: (user: { id: number; email: string; nickname: string; headImage: string | null }) => void;
  // 사용자 정보를 초기화(로그아웃)하는 액션(함수) 타입 정의
  clearUser: () => void;
}

// Zustand 스토어를 생성합니다. 제네릭으로 UserState 타입을 지정합니다.
export const useUserStore = create<UserState>()(
  // persist 미들웨어를 적용하여 상태를 영구 저장소에 저장합니다.
  persist(
    // set 함수를 인자로 받는 콜백 함수입니다. set 함수는 상태를 업데이트하는 데 사용됩니다.
    (set) => ({
      // --- 초기 상태 정의 ---
      id: null, // 초기 사용자 ID는 null
      email: null, // 초기 이메일은 null
      nickname: null, // 초기 닉네임은 null
      headImage: null, // 초기 프로필 이미지는 null
      isLoggedIn: false, // 초기 로그인 상태는 false

      // --- 액션(상태 변경 함수) 정의 ---

      /**
       * 사용자 정보를 업데이트하고 로그인 상태로 변경하는 액션입니다.
       * @param user - 로그인 시 서버 등에서 받아온 사용자 정보 객체
       */
      setUser: (user) =>
        set({
          // 전달받은 user 객체의 속성으로 상태를 업데이트합니다.
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          headImage: user.headImage,
          // 로그인 상태를 true로 변경합니다.
          isLoggedIn: true,
        }),

      /**
       * 사용자 정보를 초기화하고 로그아웃 상태로 변경하는 액션입니다.
       */
      clearUser: () =>
        set({
          // 모든 사용자 관련 상태를 초기값으로 되돌립니다.
          id: null,
          email: null,
          nickname: null,
          headImage: null,
          // 로그인 상태를 false로 변경합니다.
          isLoggedIn: false,
        }),
    }),
    // --- persist 미들웨어 설정 객체 ---
    {
      /**
       * 영구 저장소(여기서는 IndexedDB)에서 사용될 스토리지 키 이름입니다.
       * 이 이름으로 데이터가 저장되고 복원됩니다.
       */
      name: 'user-storage',

      /**
       * 사용할 스토리지 어댑터를 지정합니다.
       * createJSONStorage는 전달된 스토리지 어댑터(idbStorage)를 사용하기 전에
       * 상태를 자동으로 JSON 문자열로 직렬화하고, 불러올 때 다시 객체로 역직렬화합니다.
       * () => idbStorage 형태로 함수를 전달하여 스토리지 객체를 지연 로딩할 수 있습니다.
       */
      storage: createJSONStorage(() => idbStorage),

      // --- (선택적) 부분 저장 설정 ---
      /**
       * 저장할 상태의 특정 부분만 선택할 수 있습니다.
       * 주석 해제 시 아래 명시된 속성들만 IndexedDB에 저장됩니다.
       * 기본적으로는 모든 상태가 저장됩니다.
       */
      // partialize: (state) => ({
      //   id: state.id,
      //   email: state.email,
      //   nickname: state.nickname,
      //   headImage: state.headImage,
      //   isLoggedIn: state.isLoggedIn,
      // }),
    },
  ),
);
