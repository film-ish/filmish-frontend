import { NavLink } from 'react-router';

interface NavItemProps {
  pathname: string;
  children: React.ReactNode;
}

const NavItem = ({ pathname, children }: NavItemProps) => {
  return (
    <li className="mx-2">
      <NavLink
        to={pathname}
        className={({ isActive }) => {
          return 'text-white hover:text-gray-3 ' + (isActive ? 'font-bold' : '');
        }}>
        {children}
      </NavLink>
    </li>
  );
};

export default NavItem;
