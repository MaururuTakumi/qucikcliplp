import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: '会社概要', href: '/about' },
    { name: '沿革', href: '/history' },
    { name: '事業紹介', href: '/product' },
    { name: '役員紹介', href: '/team' },
    { name: 'ブログ', href: '/blog' },
    { name: 'お問い合わせ', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/blog') {
      return location.pathname.startsWith('/blog');
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-32 w-auto"
                src="/honkoma-logo-transparent--1--2.png"
                alt="Honkoma"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-2 border border-gray-300 rounded-lg overflow-hidden">
            <button
              className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white cursor-default"
            >
              JP
            </button>
            <a
              href="https://bmp-lp.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              EN
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">メニューを開く</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 px-2">
                <div className="flex items-center space-x-2 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="flex-1 px-4 py-3 text-base font-semibold bg-primary-600 text-white cursor-default text-center"
                  >
                    JP
                  </button>
                  <a
                    href="https://bmp-lp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-center"
                  >
                    EN
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;