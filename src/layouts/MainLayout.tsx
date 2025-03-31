import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-8 overflow-x-hidden">
      <div className="mx-[6.25%]">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;