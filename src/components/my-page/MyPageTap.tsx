import { NavLink } from 'react-router';
import { ROUTES } from '../../router/routes';
import { useLocation } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';

const MyPageTap = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = useMemo(
    () => [
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
        path: ROUTES.MY_PAGE.COMMENTS.ROOT,
        children: [
          {
            name: '리뷰 댓글',
            path: ROUTES.MY_PAGE.COMMENTS.REVIEW,
          },
          {
            name: 'Q&A 댓글',
            path: ROUTES.MY_PAGE.COMMENTS.QNA,
          },
        ],
      },
      {
        name: '보고 싶어요',
        path: ROUTES.MY_PAGE.LIKES,
      },
    ],
    [],
  );

  useEffect(() => {
    const newActiveIndex = tabs.findIndex((tab) => {
      if (tab.children) {
        return tab.children.some((child) => {
          const expectedPath = `/mypage/${tab.path}/${child.path}`;

          return location.pathname === expectedPath;
        });
      }

      const isChildPath = tabs.some((parentTab) => {
        if (parentTab.children) {
          return parentTab.children.some((child) => {
            const childPath = `/mypage/${parentTab.path}/${child.path}`;
            return location.pathname === childPath;
          });
        }

        return false;
      });

      if (!isChildPath) {
        return location.pathname.includes(tab.path);
      }

      return false;
    });

    setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
  }, [tabs, location.pathname]);

  return (
    <nav className="relative flex flex-col gap-1">
      <div
        className="absolute left-0 w-full h-[48px] bg-gray-6 rounded-lg transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateY(${activeIndex !== 4 ? activeIndex * 52 : (activeIndex + 2) * 52}px)`,
        }}
      />

      {tabs.map((tab) => (
        <Fragment key={tab.path}>
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `relative text-left px-4 py-3 rounded-lg transition-colors duration-300 ${
                isActive ? 'text-white font-bold' : 'text-white hover:bg-gray-6/50'
              }`
            }>
            {tab.name}
          </NavLink>

          {tab.children && (
            <div className="flex flex-col gap-1">
              {tab.children.map((child) => (
                <NavLink
                  key={`${tab.path}-${child.path}`}
                  to={`${tab.path}/${child.path}`}
                  className={({ isActive }) =>
                    `text-left px-4 py-3 pl-8 rounded-lg transition-colors duration-300 ${
                      isActive ? 'text-white font-bold' : 'text-white hover:bg-gray-6/50'
                    }`
                  }>
                  {child.name}
                </NavLink>
              ))}
            </div>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default MyPageTap;
