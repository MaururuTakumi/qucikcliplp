import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { AiChatProvider } from '../../features/ai-chat/ChatProvider';
import { ChatDrawer } from '../../features/ai-chat/components/ChatDrawer';
import { FloatingChatLauncher } from '../../features/ai-chat/components/FloatingChatLauncher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AiChatProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <FloatingChatLauncher />
      <ChatDrawer />
    </AiChatProvider>
  );
};

export default Layout;
