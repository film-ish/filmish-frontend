import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="max-w-[1680px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;