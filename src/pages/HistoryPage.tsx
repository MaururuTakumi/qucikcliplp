import React from 'react';
import { Calendar, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '沿革 | Honkoma';
  }, []);

  const timeline = [
    {
      year: '2024年',
      title: 'Quick Clip - 決済ソリューション',
      description: 'App Clipテクノロジーを活用したQRコード決済ソリューション「Quick Clip」の構想・開発。5秒で決済を完了させる革新的なシステムにチャレンジ。',
      link: '/history/quickclip',
      linkText: 'Quick Clipを見る',
      icon: '💳',
      color: 'blue'
    },
    {
      year: '2025年初',
      title: 'KizunaFinder - AI検索サービス',
      description: 'AIテクノロジーを活用したインフルエンサー検索サービス「KizunaFinder」へのピボット。1分で最適なインフルエンサーを発見できるプラットフォームの開発。',
      link: '/history/kizunafinder',
      linkText: 'KizunaFinderを見る',
      icon: '🔍',
      color: 'purple'
    },
    {
      year: '2025年3月',
      title: 'インド人材紹介事業へ',
      description: 'インドの次世代エンジニアを日本企業へ紹介する人材紹介事業へと進化。現地学生団体とのネットワークとAIスクリーニングツールで、スキルベースの人材マッチングを実現。',
      link: '/product',
      linkText: '現在の事業を見る',
      icon: '🌏',
      color: 'green'
    },
    {
      year: '2025年7月',
      title: '会社設立予定',
      description: '株式会社Honkomaを正式に設立し、本格的な事業展開を開始予定。',
      icon: '🏢',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string }> = {
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-600' },
      green: { bg: 'bg-green-600', text: 'text-green-600', badge: 'bg-green-100 text-green-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-gray-50 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Calendar className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            沿革
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            「本当に困っている人の力になる」という理念のもと、<br />
            私たちは常に課題と向き合い、進化し続けています。
          </p>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">私たちの歩み</h2>
            <p className="text-lg text-gray-600">
              テクノロジーで社会課題を解決する。その挑戦の軌跡をご紹介します。
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 via-green-200 to-orange-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const colors = getColorClasses(item.color);
                return (
                  <div key={index} className="relative flex items-start">
                    {/* Icon Circle */}
                    <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center relative z-10 text-white text-2xl`}>
                      {item.icon}
                    </div>

                    {/* Content Card */}
                    <div className="ml-6 flex-1 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center mb-3">
                        <span className={`text-sm font-semibold ${colors.badge} px-3 py-1 rounded-full`}>
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

                      {item.link && (
                        <Link
                          to={item.link}
                          className={`inline-flex items-center ${colors.text} hover:underline font-semibold group`}
                        >
                          {item.linkText}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            変わらぬ理念、進化する解決策
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Quick Clipでは「決済の煩わしさ」、KizunaFinderでは「インフルエンサー探しの困難さ」、<br />
            そして今、「日本のエンジニア不足とインドの若手人材の可能性」という課題に向き合っています。<br />
            <br />
            形は変わっても、私たちの核にあるのは常に同じです。<br />
            <span className="text-primary-600 font-semibold text-xl">
              「本当に困っている人の力になる」
            </span>
          </p>
          <div className="mt-12">
            <Link
              to="/about"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              会社概要を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
