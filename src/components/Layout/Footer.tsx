import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: '会社概要', href: '/about' },
    { name: '事業紹介', href: '/product' },
    { name: '役員紹介', href: '/team' },
    { name: 'お問い合わせ', href: '/contact' },
    { name: 'プライバシーポリシー', href: '/privacy' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                className="h-32 w-auto filter brightness-0 invert"
                src="/honkoma-logo-transparent--1--2.png"
                alt="Honkoma"
              />
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              インドの次世代エンジニアと日本企業を結び、<br />
              双方にとって価値のある関係を築きます。
            </p>
            <div className="text-sm text-gray-400">
              <p>株式会社Honkoma</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">サイトマップ</h3>
            <ul className="space-y-2">
              {navigation.slice(0, 5).map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  お問い合わせフォーム
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">主なサービス</h4>
              <p className="text-sm text-gray-400">
                インド人材紹介<br />
                AIスクリーニングツール
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} 株式会社Honkoma. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                本当に困っている人の力になる
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;