import { FileTextIcon, MailIcon, Menu } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AppShowcaseSection = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Data for action items
  const actionItems = [
    {
      id: 0,
      icon: <FileTextIcon className="w-6 h-6" />,
      text: "ユースケース",
      alt: "Use cases",
      href: "#usecase",
    },
    {
      id: 1,
      icon: <MailIcon className="w-6 h-6" />,
      text: "お問い合わせ",
      alt: "Contact us",
      href: "#contact",
    },
    {
      id: 2,
      icon: <FileTextIcon className="w-6 h-6" />,
      text: "資料請求",
      alt: "Request documents",
      href: "#contact",
    },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-4 md:py-5 transition-all duration-300" role="banner">
      <div className="section-container w-full flex items-center justify-between mx-auto px-6 max-w-7xl">
        <a href="#top" className="flex-shrink-0" aria-label="Quick Clipホームページへ戻る">
          <img
            className="h-16 md:h-20 object-contain hover:scale-105 transition-transform duration-300"
            alt="Honkoma Quick Clipロゴ - App Clipによる5秒決済ソリューション"
            src="/honkoma-logo-transparent--1--2.png"
            width="256"
            height="128"
          />
        </a>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="メインナビゲーション">
          {actionItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href)}
              className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg hover:bg-primary-50"
              aria-label={`${item.text}セクションへ移動`}
            >
              <span className="text-primary-600" aria-hidden="true">{item.icon}</span>
              <span>{item.text}</span>
            </button>
          ))}
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden"
              role="navigation"
              aria-label="モバイルナビゲーション"
            >
              <div className="container py-4">
                {actionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center gap-3 w-full p-4 text-base font-medium hover:bg-gray-50 transition-colors"
                    aria-label={`${item.text}セクションへ移動`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};