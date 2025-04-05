import { Bell, Search } from 'lucide-react';
import ProfileImage from '../common/ProfileImage';
import { Link, useLocation } from 'react-router';
import NavItem from './NavItem';
import { ROUTES } from '../../router/routes';

const Header = () => {
  const location = useLocation();

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
    {
      pathname: 'ROUTES.INDIE_CINEMA',
      children: '독립영화관',
    },
  ];

  const userNavItems = [
    {
      pathname: 'ROUTES.SEARCH',
      children: <Search size={24} />,
    },
    {
      pathname: 'ROUTES.NOTIFICATION',
      children: <Bell size={24} />,
    },
    {
      pathname: 'ROUTES.MY_PAGE',
      children: <ProfileImage src="https://dummyimage.com/50x50/000/fff" />,
    },
  ];

  return (
    <nav
      className={
        'w-full py-3 fixed z-50 ' + (location.pathname.match(/^\/movies\/\d+/) ? 'bg-gray-8/85' : 'bg-gray-8/85')
      }>
      {/* className={'w-full py-3 fixed z-50'}> */}
      <div className="container mx-auto flex justify-between items-center">
        {/* 로고 */}
        <Link to={ROUTES.HOME} className="text-white text-2xl font-bold">
          똑똑
        </Link>

        {/* 장르별 추천, 평점별 영화, 영화인과의 대화, 독립영화관 */}
        <ul className="flex items-center">
          {commonNavItems.map((item) => (
            <NavItem key={item.children} pathname={item.pathname}>
              {item.children}
            </NavItem>
          ))}
        </ul>

        {/* 검색, 알림, 프로필 */}
        <ul className="flex items-center">
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
