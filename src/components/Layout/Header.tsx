import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: '会社概要', href: '/about' },
    { name: 'サービス', href: '/product' },
    { name: 'メンバー', href: '/team' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-cream/90 backdrop-blur-sm border-b border-subtle sticky top-0 z-50">
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              className="h-24 w-auto"
              src="/honkoma-logo-transparent--1--2.png"
              alt="honkoma"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-[13px] tracking-wide transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-ink font-medium'
                    : 'text-warm hover:text-ink'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-subtle">
              <Link
                to="/contact"
                className="inline-flex items-center px-5 py-2 bg-ink text-cream text-[13px] font-medium tracking-wide hover:bg-ink/80 transition-colors duration-200"
              >
                ご相談はこちら
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-ink"
          >
            <span className="sr-only">メニュー</span>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-subtle py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm ${
                  isActive(item.href) ? 'text-ink font-medium' : 'text-warm'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-3">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-3 bg-ink text-cream text-sm font-medium"
              >
                ご相談はこちら
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
