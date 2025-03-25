import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;