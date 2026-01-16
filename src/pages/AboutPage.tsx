import React from 'react';
import { Heart, Target, Eye, Building2, Smartphone } from 'lucide-react';

const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '会社概要 | Honkoma';
  }, []);

  const companyInfo = [
    { label: '商号', value: '株式会社Honkoma' },
    { label: '設立年月日', value: '2025年7月' },
    { label: '事業内容', value: '学習支援マッチングプラットフォーム「アカスタ」の運営、生活支援マッチングプラットフォーム「Helperly」の運営' },
    { label: '従業員数', value: '3名（創業メンバー）' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-gray-50 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            会社概要
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            私たちHonkomaは、テクノロジーの力で「本当に困っている人の力になる」ことを目指し、<br />
            教育と生活の領域で新しい価値創造に取り組んでいます。
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 企業理念 */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">企業理念</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                本当に困っている人の力になる
              </p>
              <p className="text-gray-600 leading-relaxed">
                利益追求よりも先に、まず人々の切実な課題を解決すること。それが私たちの原点であり、全ての事業活動の指針です。
              </p>
            </div>

            {/* ミッション */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ミッション</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                必要な支援を、必要な人へ届け切る
              </p>
              <p className="text-gray-600 leading-relaxed">
                テクノロジーを活用して情報の非対称性を解消し、既存の仕組みでは手の届かなかったニーズに対して、最適なソリューションを提供します。
              </p>
            </div>

            {/* ビジョン */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ビジョン</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                国境を越えた課題解決のプラットフォームへ
              </p>
              <p className="text-gray-600 leading-relaxed">
                日本、フィリピン、そして世界へ。場所にとらわれず、人々が互いに助け合える仕組みを構築し、社会全体の幸福度を底上げします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">代表者メッセージ</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  私たちの周りには、解決されぬまま放置されている「困りごと」がたくさんあります。
                  「勉強が遅れていて不安だけど、塾に行く余裕も時間もない」
                  「仕事が忙しくて家事が回らない、でも頼れる人が近くにいない」
                </p>
                <p>
                  こうした切実な声に耳を傾け、ITの力で解決策を提示したい。
                  そんな想いで立ち上げたのが、株式会社Honkomaです。
                </p>
                <p>
                  日本では、スポット型家庭教師マッチング「アカスタ」を通じて、教育の機会格差是正に挑みます。
                  フィリピンでは、生活支援プラットフォーム「Helperly」を通じて、人々の暮らしにゆとりを提供します。
                </p>
                <p>
                  私たちは、単なるマッチングサービスの提供者ではありません。
                  「誰かの役に立ちたい」という人と、「助けを必要としている」人をつなぐ、信頼の架け橋でありたいと考えています。
                </p>
                <p className="font-semibold text-gray-900">
                  本当に困っている人の力になる。この理念を胸に、私たちは挑戦し続けます。
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm text-gray-500">株式会社Honkoma</p>
                <p className="text-lg font-semibold text-gray-900">代表取締役CEO 林拓海</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/team/hayashi_img.jpg"
                  alt="CEO 林拓海"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Overview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">事業内容</h2>
            <p className="text-lg text-gray-600">教育と生活、2つの軸で事業を展開しています。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                  <Smartphone className="h-5 w-5" />
                </span>
                Akasta (アカスタ)
              </h3>
              <p className="text-gray-600 mb-6">
                中学受験生と東大生講師をつなぐスポット家庭教師マッチングサービス。
                従来の「高額・固定」な家庭教師とは異なり、1回単位で気軽に利用できるのが特徴です。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 入会金・解約金なしの完全スポット利用</li>
                <li>• 厳選された優秀な大学生講師陣</li>
                <li>• アプリで完結する予約・決済・授業管理</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-8 shadow-sm border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white p-2 rounded-lg mr-3">
                  <Smartphone className="h-5 w-5" />
                </span>
                Helperly (ヘルパリー)
              </h3>
              <p className="text-gray-600 mb-6">
                フィリピン・セブ島における生活支援プラットフォーム。
                清掃、洗濯、ベビーシッターなどのサービスを、アプリを通じてオンデマンドで利用可能です。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 清掃、家事代行、ベビーシッターに対応</li>
                <li>• 現地居住者・長期滞在者向けサポート</li>
                <li>• 信頼できるワーカーによる高品質なサービス</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">会社情報</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <div className="flex items-center text-white">
                <Building2 className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold">株式会社Honkoma</h3>
              </div>
            </div>
            <div className="p-8">
              <dl className="space-y-6">
                {companyInfo.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <dt className="text-sm font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">
                      {item.label}
                    </dt>
                    <dd className="text-sm text-gray-600 sm:flex-1">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;