import React from 'react';
import { Heart, Target, Eye, Building2, Calendar, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '会社概要 | Honkoma';
  }, []);

  const companyInfo = [
    { label: '商号', value: '株式会社Honkoma' },
    { label: '設立年月日', value: '2025年7月（予定）' },
    { label: '資本金', value: '50万円（予定）' },
    { label: '所在地', value: '(詳細は後日公開)' },
    { label: '事業内容', value: 'AIを活用したインフルエンサー検索サービスの開発・提供' },
    { label: '従業員数', value: '3名（創業メンバー）' }
  ];

  const timeline = [
    {
      year: '2025年3月',
      title: '構想開始',
      description: 'AIテクノロジーに着目し、KizunaFinderの構想をスタート'
    },
    {
      year: '2025年7月',
      title: '会社設立予定',
      description: '株式会社honkomaを設立し、本格的な事業開始'
    },
    {
      year: '2025年夏(予定)',
      title: 'MVP開発完了',
      description: 'KizunaFinderのMVP（最小実行可能製品）を完成予定'
    },
    {
      year: '2025年秋(予定)',
      title: 'パイロット導入',
      description: '複数の店舗でのパイロット導入を開始予定'
    },
    {
      year: '2025年冬(予定)',
      title: '本格展開',
      description: '全国展開に向けた本格的なサービス提供を開始予定'
    }
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
            私たちHonkomaは、テクノロジーの力で本当に困っている人の力になることを目指し、<br />
            新しい購買体験の創造に取り組んでいます。
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
                私たちは単なる利益追求ではなく、真に人々の課題を解決し、社会に価値を提供することを第一に考えています。
              </p>
            </div>

            {/* ミッション */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ミッション</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                Win-Winな購買体験の創造
              </p>
              <p className="text-gray-600 leading-relaxed">
                ユーザーの「体験」を起点にした購買体験を豊かにして、売り手、買い手がWin-Winになる世界を目指します。
              </p>
            </div>

            {/* ビジョン */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ビジョン</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                次世代コマースの標準を創る
              </p>
              <p className="text-gray-600 leading-relaxed">
                AIテクノロジーを活用した革新的なインフルエンサーマーケティング体験を通じて、デジタルマーケティングの新しいスタンダードを確立します。
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
                  現代の消費者は、より良い体験を求めています。しかし、従来の決済システムは複雑で時間がかかり、
                  ユーザーの購買意欲を削いでしまうことが少なくありません。
                </p>
                <p>
                  私たちHonkomaは、この課題をテクノロジーの力で解決したいと考えています。
                  AIを活用したKizunaFinderは、インフルエンサー検索の時間という障壁を取り除き、
                  わずか5秒で決済を完了させることができます。
                </p>
                <p>
                  これは単なる効率化ではありません。売り手にとっては機会損失の削減、
                  買い手にとってはストレスフリーな購買体験の実現。
                  双方にとって価値のあるソリューションを提供することで、
                  より豊かな商業生態系の構築に貢献したいと考えています。
                </p>
                <p className="font-semibold text-gray-900">
                  私たちと一緒に、新しい購買体験の未来を創造していきませんか。
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm text-gray-500">株式会社Honkoma</p>
                <p className="text-lg font-semibold text-gray-900">代表取締役CEO 林拓海</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">CEO 林拓海</p>
                  <p className="text-gray-500 text-xs">写真準備中</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-24">
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
                  <div key={index} className="flex flex-col sm:flex-row">
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

      {/* Business Overview Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">事業内容</h2>
            <p className="text-lg text-gray-600">App Clipテクノロジーを活用した革新的な決済ソリューション</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">KizunaFinder</h3>
              <p className="text-gray-600 mb-6">
                当社の主力サービスであるKizunaFinderは、AIテクノロジーを活用したインフルエンサー検索サービスです。
                あなたのブランドに最適なインフルエンサーを簡単な入力で瞬時に発見できます。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AIによる高精度マッチング</li>
                <li>• 1分で完了する高速検索プロセス</li>
                <li>• 多プラットフォーム対応</li>
                <li>• コスト効率最大化の新しいマーケティング手法</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ターゲット市場</h3>
              <p className="text-gray-600 mb-6">
                小売店舗から大型商業施設まで、幅広い業界での活用を想定しています。
                特に顧客体験の向上と効率化を重視する事業者様に最適なソリューションです。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 小売店・ポップアップストア</li>
                <li>• 飲食店・カフェ</li>
                <li>• 美容サロン・クリニック</li>
                <li>• ホテル・宿泊施設</li>
                <li>• イベント・展示会</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">沿革・今後の展望</h2>
            <p className="text-lg text-gray-600">創業から未来への歩み</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center relative z-10">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-6 min-h-12 flex flex-col justify-center">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;