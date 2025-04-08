import { Bell, Search, X } from 'lucide-react';
import ProfileImage from '../common/ProfileImage';
import { Link, useLocation, useNavigate } from 'react-router';
import NavItem from './NavItem';
import { ROUTES } from '../../router/routes';
import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useUserStore();

  console.log(user);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 검색창이 열릴 때 자동으로 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const commonNavItems = [
    {
      pathname: ROUTES.GENRE.ROOT,
      children: '장르별 추천',
    },
    {
      pathname: 'ROUTES.MOVIE_RATING',
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

  const userNavItems = user.isLoggedIn
    ? [
        {
          pathname: ROUTES.MY_PAGE.ROOT,
          children: <ProfileImage src={user.headImage} />,
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
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-gray-700 rounded-full overflow-hidden transition-all duration-300 ease-in-out w-64">
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

          {/* 프로필 */}
          {userNavItems.map((item) => (
            <NavItem key={item.pathname} pathname={item.pathname}>
              {item.children}
            </NavItem>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
