import { ReactNode, useState } from 'react';
import Header from '../components/header/Header';
import ChatBot from '../components/chat-bot/ChatBot';
import IconButton from '../components/common/IconButton';
import { Clapperboard } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className="min-h-screen bg-gray-8 overflow-x-hidden">
      <Header />

      {showChatBot && <ChatBot closeChatBot={() => setShowChatBot(false)} />}

      <IconButton
        className="fixed z-40 bottom-10 right-10 !bg-gray-6 shadow-gray-4 shadow"
        size={50}
        onClick={() => {
          setShowChatBot(true);
        }}>
        <Clapperboard />
      </IconButton>

      <div className="mt-[3.75rem] mx-[6.25%]">{children}</div>
    </div>
  );
};

export default MainLayout;
