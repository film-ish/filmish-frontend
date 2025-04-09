import { ReactNode, useState } from 'react';
import Header from '../components/header/Header';
import ChatBot from '../components/chat-bot/ChatBot';
import IconButton from '../components/common/IconButton';
import { Clapperboard } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [showChatBot, setShowChatBot] = useState(false);
  const location = useLocation();
  
  // commercial 페이지에서는 헤더를 표시하지 않음
  const isCommercialPage = location.pathname === '/commercial';

  return (
    <div className="min-h-screen bg-gray-8 overflow-x-hidden">
      {!isCommercialPage && <Header />}

      {showChatBot && <ChatBot closeChatBot={() => setShowChatBot(false)} />}

      <IconButton
        className="fixed z-40 bottom-10 right-10 !bg-gray-6 shadow-gray-4 shadow"
        size={50}
        liked={false}
        onClick={() => {
          setShowChatBot(true);
        }}>
        <Clapperboard />
      </IconButton>

      <div className={`${isCommercialPage ? '' : 'mt-[3.75rem]'} mx-[6.25%]`}>{children}</div>
    </div>
  );
};

export default MainLayout;
