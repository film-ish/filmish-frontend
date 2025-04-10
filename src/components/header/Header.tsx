<<<<<<< Updated upstream
import { Bell, Search, X, LogOut, User } from 'lucide-react';
=======
import { Bell, Search, X } from 'lucide-react';
>>>>>>> Stashed changes
import ProfileImage from '../common/ProfileImage';
import { Link, useLocation, useNavigate } from 'react-router';
import NavItem from './NavItem';
import { ROUTES } from '../../router/routes';
import { useState, useRef, useEffect } from 'react';
<<<<<<< Updated upstream
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../api/logout/logoutApi';
=======
>>>>>>> Stashed changes

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< Updated upstream

  const user = useUserStore();
  const auth = useAuthStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);
=======
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
>>>>>>> Stashed changes

  // 검색창이 열릴 때 자동으로 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

<<<<<<< Updated upstream
  // 프로필 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

=======
>>>>>>> Stashed changes
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchKeyword('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setIsSearchOpen(false);
<<<<<<< Updated upstream
      navigate(`/search?keyword=${searchKeyword.trim()}`);
    }
  };

  const toggleProfileModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 시도
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      // API 호출 성공 여부와 관계없이 indexedDB 상태 초기화
      user.clearUser();
      auth.clearAuth();
      setIsProfileModalOpen(false);
      navigate(ROUTES.HOME); // 페이지 새로고침으로 상태 초기화
=======
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
>>>>>>> Stashed changes
    }
  };

  const commonNavItems = [
    {
      pathname: ROUTES.GENRE.ROOT,
      children: '장르별 추천',
    },
    {
      pathname: ROUTES.RATES,
      children: '평점별 영화',
    },
    {
      pathname: ROUTES.MOVIE_TALK,
      children: '영화인과의 대화',
    },
    // {
    //   pathname: 'ROUTES.INDIE_CINEMA',
    //   children: '독립영화관',
    // },
  ];

<<<<<<< Updated upstream
  const userNavItems = user.isLoggedIn
    ? [
        {
          pathname: '#',
          children: (
            <div className="relative">
              <div onClick={toggleProfileModal} className="cursor-pointer">
                <ProfileImage src={user.headImage} />
              </div>

              {isProfileModalOpen && (
                <div
                  ref={profileModalRef}
                  className="absolute right-0 mt-2 w-48 bg-gray-7 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setTimeout(() => {
                        navigate(ROUTES.MY_PAGE.ROOT);
                      }, 0);
                    }}
                    to={ROUTES.MY_PAGE.ROOT}
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-6">
                    <User className="w-4 h-4 mr-2" />
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-6">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ),
        },
      ]
    : [
        {
          pathname: ROUTES.LOGIN,
          children: '로그인',
        },
        {
          pathname: ROUTES.SIGN_UP,
          children: '회원가입',
        },
      ];
=======
  const userNavItems = [
    {
      pathname: 'ROUTES.MY_PAGE',
      children: <ProfileImage src="https://dummyimage.com/50x50/000/fff" />,
    },
  ];
>>>>>>> Stashed changes

  return (
    <nav
      className={
        'w-full py-3 px-20 fixed z-50 ' + (location.pathname.match(/^\/movies\/\d+/) ? 'bg-gray-8/85' : 'bg-gray-8/85')
      }>
      {/* className={'w-full py-3 fixed z-50'}> */}
      <div className="container flex justify-between items-center">
        {/* 로고 */}
        <Link to={ROUTES.HOME} className="text-white text-2xl font-bold">
          똑똑
        </Link>

<<<<<<< Updated upstream
        {/* 장르별 추천, 평점별 영화, 영화인과의 대화, 독립영화관 - 로그인한 사용자만 볼 수 있음 */}
        {user.isLoggedIn ? (
          <ul className="flex items-center gap-10 font-extralight">
            {commonNavItems.map((item) => (
              <NavItem key={item.children} pathname={item.pathname}>
                {item.children}
              </NavItem>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-sm">로그인하여 더 많은 기능을 이용하세요</div>
        )}

        {/* 검색, 알림, 프로필 */}
        <ul className="flex items-center">
          {/* 검색 아이콘 및 검색창 - 로그인한 사용자만 사용 가능 */}
          {user.isLoggedIn ? (
            <li className="relative mr-4 flex items-center justify-center w-10 h-10">
              <div
                className={`absolute right-0 flex items-center transition-all duration-300 ${isSearchOpen ? 'w-[200px]' : 'w-[30px]'}`}>
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center bg-gray-5 rounded-full overflow-hidden w-64">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="통합 검색..."
                      className="bg-transparent text-white py-2 px-4 w-full outline-none"
                    />
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="p-2 text-white hover:text-gray-300 transition-colors">
                      <X size={20} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-white hover:text-gray-300 transition-colors flex items-center justify-center">
                    <Search size={24} />
                  </button>
                )}
              </div>
            </li>
          ) : null}

          {/* 프로필 */}
          {userNavItems.map((item) =>
            user.isLoggedIn ? (
              <div key={item.pathname}>{item.children}</div>
            ) : (
              <NavItem key={item.pathname} pathname={item.pathname}>
                {item.children}
              </NavItem>
            ),
          )}
=======
        {/* 장르별 추천, 평점별 영화, 영화인과의 대화, 독립영화관 */}
        <ul className="flex items-center gap-10 font-extralight">
          {commonNavItems.map((item) => (
            <NavItem key={item.children} pathname={item.pathname}>
              {item.children}
            </NavItem>
          ))}
        </ul>

        {/* 검색, 알림, 프로필 */}
        <ul className="flex items-center">
          {/* 검색 아이콘 및 검색창 */}
          <li className="relative mr-4 flex items-center justify-center w-10 h-10">
            <div className="absolute right-0 flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center bg-gray-700 rounded-full overflow-hidden transition-all duration-300 ease-in-out w-64">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="영화 검색..."
                    className="bg-transparent text-white py-2 px-4 w-full outline-none"
                  />
                  <button 
                    type="button"
                    onClick={toggleSearch}
                    className="p-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={toggleSearch}
                  className="p-2 text-white hover:text-gray-300 transition-colors flex items-center justify-center"
                >
                  <Search size={24} />
                </button>
              )}
            </div>
          </li>
          
          {/* 프로필 */}
          {userNavItems.map((item) => (
            <NavItem key={item.pathname} pathname={item.pathname}>
              {item.children}
            </NavItem>
          ))}
>>>>>>> Stashed changes
        </ul>
      </div>
    </nav>
  );
};

export default Header;
