// axios 라이브러리를 임포트하여 HTTP 요청을 보냅니다.
import { apiClient } from '../instance/client';

// 로그인 API 함수 정의
// formData 객체를 인자로 받아 이메일과 비밀번호를 포함합니다.
const login = async (formData: { email: string; password: string }) => {
  // axios.post를 사용하여 '/api/login' 엔드포인트로 POST 요청을 보냅니다.
  // 요청 본문(body)에는 formData를 전달합니다.
  const response = await apiClient.post('/login', formData);
  // API 응답 객체에서 data 속성 (실제 서버 데이터)을 반환합니다.
  return response.data;
};

// login 함수를 외부에서 사용할 수 있도록 export 합니다.
export { login };
