import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Upload } from 'lucide-react';
import { signup } from '../../api/join/signupApi';

const SignUp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    birth: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result // Base64 형식의 이미지 데이터
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    // 파일 입력 클릭 트리거
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: 회원가입 로직 구현
    console.log('SignUp attempt:', formData);
    try {
      // signup API 호출
      const response = await signup(formData);
      console.log('회원가입 성공:', response);
      
      // 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');

    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8 bg-gray-2/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="bg-rose-cloud p-3 rounded-full mb-4">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
            회원가입
          </h2>
          <p className="font-light text-center text-gray-400 text-sm">
            독립영화의 새로운 발견,<br />똑똑에 오신 걸 환영합니다.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* {error && (
            <div className="text-red-500 text-sm text-center bg-red-100/10 p-2 rounded-lg">
              {error}
            </div>
          )} */}
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                placeholder="닉네임을 입력해주세요"
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="birth" className="block text-sm font-medium text-gray-300 mb-1">
                생년월일
              </label>
              <input
                id="birth"
                name="birth"
                type="date"
                placeholder="생년월일을 입력해주세요"
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.birth}
                onChange={handleChange}
              />
            </div>

                        {/* 이미지 업로드 필드 수정 */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
                프로필 이미지
              </label>
              
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                id="image-file"
                name="image-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              
              {/* 이미지 업로드 UI */}
              <div 
                onClick={handleImageClick}
                className="mt-1 flex flex-col items-center justify-center w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 border-dashed rounded-xl text-gray-400 cursor-pointer hover:bg-gray-700/30 transition-all duration-200"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="프로필 미리보기" 
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
                      <p className="text-white text-sm">이미지 변경</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="text-sm text-center">이미지를 업로드하려면 클릭하세요</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일 지원</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-rose-cloud hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? '처리 중...' : '확인'}
            </button>
          </div>

          {/* <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-rose-cloud hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              확인
            </button>
          </div> */}

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-400 font-light hover:text-white transition-colors"
            >
              이미 계정이 있으신가요?{' '}
              <span className="font-medium underline text-rose-cloud hover:text-white">
                로그인
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
