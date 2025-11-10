import React from 'react';
import { Heart, Target, Eye, Building2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                日本のプロダクト開発に、世界級の若手エンジニアを
              </p>
              <p className="text-gray-600 leading-relaxed">
                インドの優秀な新卒エンジニアが持つ、CS基礎・実務経験・英語力を、日本のものづくりに接続します。
              </p>
            </div>

            {/* ビジョン */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ビジョン</h2>
              <p className="text-lg text-primary-600 font-semibold mb-3">
                国際人材市場で、フェアな価値交換を実現する
              </p>
              <p className="text-gray-600 leading-relaxed">
                適正なコスト設計とスキルベースの評価で、日本企業とグローバル人材の双方が長期的にWin-Winとなる関係を構築します。
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
                  日本のIT業界は、深刻なエンジニア不足に直面しています。
                  一方で、インドでは世界級のCS教育を受けた優秀な若手エンジニアが、
                  国際的なキャリア機会を求めています。
                </p>
                <p>
                  私たちHonkomaは、この両者を適切にマッチングすることで、
                  双方にとって価値のある関係を築きたいと考えています。
                  重要なのは、大学のブランドではなく、実際のスキルと実務経験です。
                </p>
                <p>
                  現地の学生団体との連携、Redditでの高い認知度、そしてAIを活用したスクリーニングツール。
                  これらを組み合わせることで、「本当に戦力になる人材」を「速く、丁寧に」見極める仕組みを構築しました。
                </p>
                <p>
                  また、私たちは「安さ」を追求するのではなく、国際市場における適正なコスト設計を重視しています。
                  長期的にフェアな関係を築くことこそが、真のWin-Winにつながると信じているからです。
                </p>
                <p className="font-semibold text-gray-900">
                  日本のものづくりに、世界級のエンジニアを。私たちと一緒に、新しい未来を創造していきませんか。
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
            <p className="text-lg text-gray-600">インド人材紹介とAIスクリーニングツールで、日本企業の成長を支援</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">インドエンジニア人材紹介</h3>
              <p className="text-gray-600 mb-6">
                現地学生団体とのネットワークとスキルベースの評価で、日本企業に最適なエンジニアをご紹介します。
                IITsなどの大学ブランドではなく、実際のスキルと実務経験を重視しています。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• CS基礎・実務経験・英語力を兼ね備えた人材</li>
                <li>• スキルベースの多面的評価（コード・設計・面接）</li>
                <li>• 適正なコスト設計で長期的なWin-Win関係を構築</li>
                <li>• 現地学生団体連携とReddit認知度（30,000imp/日）</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AIスクリーニングツール</h3>
              <p className="text-gray-600 mb-6">
                外国人向け求人での大量応募に対応するAIスクリーニングツールを提供。
                1クリックで優先順位付けし、選考負荷を70-90%削減します。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 技術スキル評価（Best / Enough / Not Bad）</li>
                <li>• Culture Fitスコア（0-100）で可視化</li>
                <li>• コード意図の口頭説明で生成AIコピペ対策</li>
                <li>• ATS/CSV連携でシームレスな導入</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Link Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-2xl p-12">
            <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">沿革</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Quick Clipから始まり、KizunaFinderを経て、現在のインド人材紹介事業へ。<br />
              「本当に困っている人の力になる」という理念のもと、私たちは常に進化を続けています。
            </p>
            <Link
              to="/history"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              沿革を見る
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;