import { ReactNode, useState } from 'react';
import Header from '../components/header/Header';
import ChatBot from '../components/chat-bot/ChatBot';
import IconButton from '../components/common/IconButton';
import { Clapperboard } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useLocation } from 'react-router';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const user = useUserStore();
  const [showChatBot, setShowChatBot] = useState(false);
  const location = useLocation();

  // commercial 페이지에서는 헤더를 표시하지 않음
  const isCommercialPage = location.pathname === '/commercial';

  const isFullHeight = () => {
    if (location.pathname === '/commercial') return true;
    if (location.pathname.includes('/movie-talk/')) return true;
  };

  return (
    <div className="min-h-screen bg-gray-8 overflow-x-hidden">
      {!isCommercialPage && <Header />}

      {showChatBot && <ChatBot closeChatBot={() => setShowChatBot(false)} />}

      {user.isLoggedIn && (
        <IconButton
          className="fixed z-40 bottom-10 right-10 !bg-gray-6 shadow-gray-4 shadow"
          size={50}
          onClick={() => {
            setShowChatBot(true);
          }}>
          <Clapperboard />
        </IconButton>
      )}

      <div className={`${isFullHeight() ? '' : 'pt-[3.75rem]'} mx-[6.25%]`}>{children}</div>
    </div>
  );
};

export default MainLayout;
