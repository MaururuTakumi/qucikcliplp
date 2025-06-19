import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Target, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Honkoma | 本当に困っている人の力になる';
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: '革新的なテクノロジー',
      description: 'App Clipを活用した5秒決済システムで、ユーザー体験を革新します。'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Win-Win の関係',
      description: '売り手と買い手、双方にとって価値のあるソリューションを提供します。'
    },
    {
      icon: <Target className="h-8 w-8 text-primary-600" />,
      title: 'ユーザー体験重視',
      description: 'ユーザーの「体験」を起点にした購買体験の向上を目指します。'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: '信頼性とセキュリティ',
      description: '安全で信頼できる決済システムをお客様に提供いたします。'
    }
  ];

  const stats = [
    { label: '決済完了時間', value: '5秒', suffix: '' },
    { label: 'アプリダウンロード', value: '不要', suffix: '' },
    { label: 'ユーザー満足度', value: '99', suffix: '%' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 relative">
            {/* Left: Copy */}
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    本当に困っている人の
                  </span>
                  <br />
                  <span className="text-gray-900">力になる</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  ユーザーの「体験」を起点にした購買体験を豊かにして、<br />
                  売り手、買い手がWin-Winになる世界を目指します。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Quick Clipを見る
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  お問い合わせ
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary-600">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Demo GIF */}
            <div className="flex-1 max-w-xl flex justify-center md:justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                src="/assets/quickclip-demo.gif"
                alt="Quick Clip Demo - App Clipによる5秒決済の実演"
                className="rounded-2xl shadow-2xl w-full relative z-10 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              選ばれる理由
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              私たちが大切にしている価値観と、お客様に提供する価値をご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Clip Highlight Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ⚡ 主力サービス
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Quick Clip
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  App Clipを活用した革新的なQRコード決済ソリューション。<br />
                  アプリのダウンロード不要で、わずか5秒で決済が完了します。
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">アプリダウンロード不要</h4>
                    <p className="text-gray-600">App Clipテクノロジーで瞬時にアクセス</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">5秒で決済完了</h4>
                    <p className="text-gray-600">従来の決済プロセスを大幅に短縮</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">セキュア決済</h4>
                    <p className="text-gray-600">安全で信頼性の高い取引を保証</p>
                  </div>
                </div>
              </div>

              <Link
                to="/product"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 group"
              >
                詳細を見る
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-orange-600/10 rounded-3xl blur-3xl"></div>
              <img
                src="/----1.png"
                alt="Quick Clipモバイルアプリケーション"
                className="w-full max-w-md mx-auto relative z-10 rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            一緒に新しい購買体験を創造しませんか？
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            無償PoCのご相談から本格導入まで、お客様のニーズに合わせてサポートいたします。<br />
            まずはお気軽にお問い合わせください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              無償PoCを相談する
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              会社について詳しく
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;