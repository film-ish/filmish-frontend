import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { signup, checkEmail, checkNickname } from '../../api/signup/signupApi';

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  birth: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    birth: '',
  });

  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 확인 검증
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordError(null);
      }
    }
    
    if (name === 'password') {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordError(null);
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('nickname', formData.nickname);
    data.append('birth', formData.birth);


    if (emailChecked !== true || nicknameChecked !== true) {
      setError('이메일과 닉네임 중복 확인을 완료해주세요.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
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
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
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
                onFocus={handleNicknameCheckOnFocus}
                onBlur={handleNicknameCheckOnFocus}
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
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !emailChecked || !nicknameChecked || formData.password !== formData.confirmPassword}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-rose-cloud hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${loading || !emailChecked || !nicknameChecked || formData.password !== formData.confirmPassword ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? '처리 중...' : '확인'}
            </button>
          </div>

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
