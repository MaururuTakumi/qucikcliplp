import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { AiChatProvider } from '../../features/ai-chat/ChatProvider';
import { ChatDrawer } from '../../features/ai-chat/components/ChatDrawer';
import { FloatingChatLauncher } from '../../features/ai-chat/components/FloatingChatLauncher';
import { RouteAnalytics } from '../../features/analytics/RouteAnalytics';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  /* /ai は診断ページ自体がChatStageを内包するため、ドロワー/フローティングは出さない。 */
  const onAiPage = useLocation().pathname === '/ai';
  return (
    <AiChatProvider>
      <RouteAnalytics />
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      {!onAiPage && <FloatingChatLauncher />}
      {!onAiPage && <ChatDrawer />}
    </AiChatProvider>
  );
};

export default Layout;
