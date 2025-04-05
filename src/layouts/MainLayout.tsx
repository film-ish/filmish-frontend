import { ReactNode } from 'react';
import Header from '../components/header/Header';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-8 overflow-x-hidden">
      <Header />
      <div className="mt-[3.75rem] mx-[6.25%]">{children}</div>
    </div>
  );
};

export default MainLayout;
