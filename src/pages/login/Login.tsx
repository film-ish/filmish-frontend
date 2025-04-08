// React와 필요한 훅 (useState) 및 라이브러리 (navigate, lucide-react 아이콘) 임포트
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
// Zustand 사용자 스토어 훅 임포트
import { useUserStore } from '../../store/userStore';
import { login } from "../../api/login/loginApi.ts";
import { useAuthStore } from "../../store/authStore.ts";
import {isLikedCommercialMovies} from "../../api/commercial/commercialApi.ts";
// 상업 영화 좋아요 API 함수 임포트

// Login 컴포넌트 정의
const Login = () => {
  // 페이지 이동을 위한 navigate 함수 초기화
  const navigate = useNavigate();
  // Zustand 스토어에서 사용자 정보 업데이트 함수(setUser) 가져오기
  const { setUser } = useUserStore();
  const { setAccessToken } = useAuthStore();
  // 로그인 폼 데이터 (email, password)를 위한 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 입력 필드 변경 시 호출되는 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 이벤트가 발생한 요소의 name과 value 추출
    const { name, value } = e.target;
    // 이전 상태를 복사하고 변경된 필드의 값만 업데이트
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 시 호출되는 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const accessToken = response.headers?.access;
      console.log(accessToken);

      if (accessToken) {
        setAccessToken(accessToken);
      }

      setUser(response.data);

      // 상업 영화 좋아요 여부 확인
      try {
        const likedMoviesResponse = await isLikedCommercialMovies();
        console.log(likedMoviesResponse.data);
        // 좋아요한 상업 영화가 있으면 메인 페이지로, 없으면 상업 영화 페이지로 이동
        if (likedMoviesResponse) {
          navigate('/');
        } else {
          navigate('/commercial');
        }
      } catch (error) {
        console.error('좋아요 영화 확인 실패:', error);
        // 에러 발생 시 기본적으로 상업 영화 페이지로 이동
        navigate('/commercial');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
      <div className="-mt-[3.75rem] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-md w-full space-y-8 bg-gray-2/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl">
          {/* 로고 및 앱 제목 */}
          <div className="flex flex-col items-center">
            <div className="bg-rose-cloud p-3 rounded-full mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">Knock Knock</h2>
            <p className="text-center text-gray-400 text-sm">영화의 모든 순간을 함께하세요</p>
          </div>

          {/* 로그인 폼 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* 이메일 입력 필드 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  이메일
                </label>
                <input
                    id="email"
                    name="email" // handleChange에서 이 값을 키로 사용
                    type="email"
                    autoComplete="email"
                    required // 필수 입력 필드
                    placeholder="your@email.com"
                    className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.email} // 상태와 입력 값 바인딩
                    onChange={handleChange} // 변경 시 핸들러 연결
                />
              </div>
              {/* 비밀번호 입력 필드 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  비밀번호
                </label>
                <input
                    id="password"
                    name="password" // handleChange에서 이 값을 키로 사용
                    type="password"
                    autoComplete="current-password"
                    required // 필수 입력 필드
                    placeholder="••••••••"
                    className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.password} // 상태와 입력 값 바인딩
                    onChange={handleChange} // 변경 시 핸들러 연결
                />
              </div>
            </div>

            {/* 추가 옵션 (로그인 상태 유지, 비밀번호 찾기) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded-2xl bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <button
                    type="button" // 폼 제출 방지
                    className="font-light text-blue-400 hover:text-blue-300 transition-colors">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <div>
              <button
                  type="submit" // 폼 제출 트리거
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-rose-cloud hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]">
                로그인
              </button>
            </div>

            {/* 회원가입 버튼 */}
            <div className="text-center">
              <button
                  type="button" // 폼 제출 방지
                  onClick={() => navigate('/register')} // 회원가입 페이지로 이동
                  className="text-sm text-gray-400 font-light hover:text-white transition-colors">
                계정이 없으신가요?{' '}
                <span className="font-medium underline text-rose-cloud hover:text-white">회원가입</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

// Login 컴포넌트를 기본 export
export default Login;