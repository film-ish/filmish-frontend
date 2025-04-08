import { NavLink } from 'react-router';
import { ROUTES } from '../../router/routes';
import { useLocation } from 'react-router';

const MyPageTap = () => {
  const location = useLocation();
  const tabs = [
    {
      name: '평점 및 코멘트',
      path: ROUTES.MY_PAGE.RATINGS,
    },
    {
      name: '리뷰',
      path: ROUTES.MY_PAGE.REVIEWS,
    },
    {
      name: 'Q&A',
      path: ROUTES.MY_PAGE.QNA,
    },
    {
      name: '댓글',
      path: ROUTES.MY_PAGE.COMMENTS,
    },
    {
      name: '보고 싶어요',
      path: ROUTES.MY_PAGE.LIKES,
    },
  ];
  const activeIndex = tabs.findIndex((tab) => location.pathname.includes(tab.path));

  return (
    <nav className="relative flex flex-col gap-1">
      <div
        className="absolute left-0 w-full h-[48px] bg-gray-6 rounded-lg transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateY(${activeIndex * 52}px)`,
        }}
      />

      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `relative text-left px-4 py-3 rounded-lg transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-white hover:bg-gray-6/50'
            }`
          }>
          {tab.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default MyPageTap;
