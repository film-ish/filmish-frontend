import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Upload } from 'lucide-react';
import { signup, checkEmail, checkNickname } from '../../api/join/signupApi';

type FormState = {
  email: string;
  password: string;
  nickname: string;
  birth: string;
  image: File | null;
};

const SignUp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    nickname: '',
    birth: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [imageChecked, setImageChecked] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [checkImageError, setCheckImageError] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailCheckOnFocus = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) return;
    if (!emailRegex.test(formData.email)) {
      setEmailError('올바른 형식으로 입력해주세요.');
      return;
    }
    try {
      const response = await checkEmail(formData.email);
      console.log('이메일 중복 조회 결과:', response);

      if (response.data.message === '사용할 수 없는 이메일입니다.') {
        setEmailChecked(false);
        setEmailError('이미 사용 중인 이메일입니다.');
      } else {
        setEmailChecked(true);
        setEmailError('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      setEmailChecked(false);
      setEmailError('이메일 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNicknameCheckOnFocus = async () => {
    if (!formData.nickname) return;
    try {
      const response = await checkNickname(formData.nickname);
      console.log('닉네임 중복 조회 결과:', response);

      if (response.data.message === '사용할 수 없는 닉네임입니다.') {
        setNicknameChecked(false);
        setNicknameError('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameChecked(true);
        setNicknameError('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      setNicknameChecked(false);
      setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= 1024 * 1024; // 1MB

      if (!isValidType) {
        setCheckImageError('JPG/PNG/JPEG 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      const isValid = checkImageSize(file);
      if (!isValid) return;

      setFormData((prev) => ({
        ...prev,
        image: file, // Base64 형식의 이미지 데이터
      }));

      // 이미지 파일 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    // 파일 입력 클릭 트리거
    fileInputRef.current?.click();
  };

  const checkImageSize = (file: File): boolean => {
    const maxSizeBytes = 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setCheckImageError('이미지 크기는 1MB 이하로 업로드해주세요.');
      setImageChecked(false);
      return false;
    }

    setCheckImageError('');
    setImageChecked(true);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('nickname', formData.nickname);
    data.append('birth', formData.birth);

    if (formData.image) {
      data.append('image', formData.image);
    }

    if (emailChecked !== true || nicknameChecked !== true) {
      setError('이메일과 닉네임 중복 확인을 완료해주세요.');
      setLoading(false);
      return;
    }

    // TODO: 회원가입 로직 구현
    console.log('SignUp attempt:', data);
    try {
      // signup API 호출
      const response = await signup(data);
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">회원가입</h2>
          <p className="font-light text-center text-gray-400 text-sm">
            독립영화의 새로운 발견,
            <br />
            똑똑에 오신 걸 환영합니다.
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
                onBlur={handleEmailCheckOnFocus}
              />
              {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
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
                //onBlur={handleNicknameCheckOnFocus}
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
              {nicknameError && <div className="text-red-500 text-sm mt-1">{nicknameError}</div>}
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
                max={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                onFocus={handleNicknameCheckOnFocus}
                onBlur={handleNicknameCheckOnFocus}
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
                className="mt-1 flex flex-col items-center justify-center w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 border-dashed rounded-xl text-gray-400 cursor-pointer hover:bg-gray-700/30 transition-all duration-200">
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
            {checkImageError && <p className="text-sm text-rose-cloud mt-1">{checkImageError}</p>}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일 지원 (최대 1MB)</p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !emailChecked || !nicknameChecked}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-rose-cloud hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${loading || !emailChecked || !nicknameChecked ? 'opacity-70 cursor-not-allowed' : ''}`}>
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
              className="text-sm text-gray-400 font-light hover:text-white transition-colors">
              이미 계정이 있으신가요?{' '}
              <span className="font-medium underline text-rose-cloud hover:text-white">로그인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
