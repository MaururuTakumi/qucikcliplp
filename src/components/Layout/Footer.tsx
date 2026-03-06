import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/70">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Company */}
          <div className="md:col-span-5">
            <img
              className="h-20 w-auto filter brightness-0 invert mb-6"
              src="/honkoma-logo-transparent--1--2.png"
              alt="honkoma"
            />
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              AIと自動化の力で、<br />
              ビジネスを次のステージへ。
            </p>
            <p className="font-mono text-xs text-cream/40">
              株式会社honkoma
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs tracking-widest uppercase text-cream/40 mb-6">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: 'ホーム', href: '/' },
                { name: '会社概要', href: '/about' },
                { name: 'サービス', href: '/product' },
                { name: 'メンバー', href: '/team' },
                { name: 'お問い合わせ', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm hover:text-cream transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h3 className="font-mono text-xs tracking-widest uppercase text-cream/40 mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/product#standard" className="text-sm hover:text-cream transition-colors">スタンダードプラン</Link></li>
              <li><Link to="/product#enterprise" className="text-sm hover:text-cream transition-colors">エンタープライズ</Link></li>
              <li><Link to="/product#advisory" className="text-sm hover:text-cream transition-colors">顧問相談</Link></li>
              <li><Link to="/product#ai-agent" className="text-sm hover:text-cream transition-colors">AIエージェント派遣</Link></li>
            </ul>
            <div className="mt-8">
              <Link to="/privacy" className="text-xs text-cream/40 hover:text-cream/70 transition-colors">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-cream/30">
            &copy; {currentYear} honkoma Inc.
          </p>
          <p className="font-mono text-xs text-cream/30">
            AI導入・業務自動化・開発支援
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
