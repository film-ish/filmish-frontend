import { NavLink, useLocation } from 'react-router';
import { ROUTES } from '../../router/routes';

interface TapItemProps {
  active: boolean;
  name: string;
  path: string;
}

const TapItem = ({ active, name, path }: TapItemProps) => {
  return (
    <li className={'mb-[-2px] w-[105px] flex justify-center' + (active ? ' text-white font-bold' : '')}>
      <NavLink className={'p-2'} to={path}>
        {name}
      </NavLink>
    </li>
  );
};

const MovieDetailTap = () => {
  const location = useLocation();

  const tabs = [
    {
      name: '영화 상세',
      path: '',
    },
    {
      name: '코멘트 보기',
      path: ROUTES.MOVIE_DETAIL.RATINGS,
    },
    {
      name: '리뷰 보기',
      path: ROUTES.MOVIE_DETAIL.REVIEWS.ROOT,
    },
  ];

  const activeTapIndex = tabs.findLastIndex((tab) => location.pathname.includes(tab.path));

  return (
    <nav className="relative">
      <ul className="flex mx-6 w-4/5 border-b-2 border-gray-4 text-gray-4">
        {tabs.map((tab, index) => (
          <TapItem key={tab.name} active={activeTapIndex === index} path={tab.path} name={tab.name} />
        ))}
      </ul>

      <div
        className="absolute h-[4px] w-[105px] mt-[-4px] bg-rose-cloud transition-all"
        style={{ left: `calc(1.5rem + ${105 * activeTapIndex}px)` }}
      />
    </nav>
  );
};

export default MovieDetailTap;
