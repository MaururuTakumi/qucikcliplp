import React from 'react';
import { Smartphone, CreditCard, Package, QrCode, Zap, Store, Hotel, Scissors, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickClipArchivePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Quick Clip アーカイブ | Honkoma';
  }, []);

  const steps = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: '発見&スキャン',
      description: '商品や展示物のQRコードをスキャン',
      emoji: '📱'
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: '確認&決済',
      description: 'ワンタップで簡単に決済完了',
      emoji: '💳'
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: '自宅で受け取り',
      description: '商品は自宅に直接配送',
      emoji: '🚚'
    }
  ];

  const useCases = [
    {
      icon: <Hotel className="h-12 w-12" />,
      title: 'ホテル客室アメニティ',
      description: '試して気に入った瞬間にQRスキャン。手ぶらで帰宅できる新しい宿泊体験。',
      color: 'bg-blue-500'
    },
    {
      icon: <Scissors className="h-12 w-12" />,
      title: '美容院の店販シャンプー',
      description: '施術後に即購入。サロン在庫ゼロでリピート率向上。',
      color: 'bg-purple-500'
    },
    {
      icon: <Plane className="h-12 w-12" />,
      title: '空港ラウンジ限定ギフト',
      description: '待ち時間にスキャン→帰国後受け取り。免税品を並ばず購入可能。',
      color: 'bg-green-500'
    }
  ];

  const features = [
    {
      title: 'アプリダウンロード不要',
      description: 'QRコード/NFCタグをスキャンするだけで即座に起動',
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      title: 'ワンタップ決済',
      description: 'Apple Pay/Google Payで5秒で決済完了',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: '発見型コマース',
      description: '商品は後日自宅へ配送、手ぶらで快適な購買体験',
      icon: <Package className="h-6 w-6" />
    },
    {
      title: '在庫リスクゼロ',
      description: '販売者は実物の在庫を持たずに販売が可能',
      icon: <Store className="h-6 w-6" />
    }
  ];

  const technologies = [
    { name: 'SwiftUI', description: 'ネイティブなユーザーインターフェース' },
    { name: 'Core Location', description: '位置情報の活用' },
    { name: 'PassKit', description: 'Apple Payとの連携' },
    { name: 'RESTful API', description: 'スケーラブルなバックエンド設計' },
    { name: 'JWT認証', description: 'セキュアな認証システム' },
    { name: 'クラウドインフラ', description: '高可用性を実現' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold">アーカイブ / 2024年</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Quick Clip
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-light">
            "欲しい"を、その場でスマートに。
          </p>
          <p className="text-xl mb-8 text-blue-100">
            新しい『発見型コマース』体験
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Zap className="h-5 w-5 mr-2" />
            <span className="font-semibold">5秒で決済を完了させる革新的なシステム</span>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              App Clipテクノロジーを活用した<br />革新的なQRコード決済ソリューション
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quick Clipは、App Clipを活用してアプリダウンロード不要で即座に起動し、
              QRコードをスキャンするだけでワンタップ決済を実現。
              商品は後日自宅へ配送される、まったく新しい購買体験を提供します。
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              3ステップで完結する購買体験
            </h2>
            <p className="text-lg text-gray-600">
              複雑な操作は一切不要。わずか3ステップでお買い物が完了します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 text-4xl">
                    {step.emoji}
                  </div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-white rounded-xl px-8 py-4 shadow-lg">
              <p className="text-sm text-gray-500 mb-2">技術的フロー</p>
              <p className="text-gray-900 font-medium">
                QR/NFCをかざす → <span className="text-blue-600">App Clipが即起動</span> → Apple Payワンタップ決済 → 完了
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              導入シーン
            </h2>
            <p className="text-lg text-gray-600">
              様々な業界で、新しい購買体験を提供します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`${useCase.color} p-8 text-white flex items-center justify-center`}>
                  {useCase.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              技術仕様
            </h2>
            <p className="text-lg text-gray-300">
              セキュアでスケーラブルな技術スタック
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold mb-2">{tech.name}</h3>
                <p className="text-gray-300 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
              <p className="text-sm text-gray-300 mb-1">対応決済方法</p>
              <p className="font-semibold">Apple Pay / Google Pay / クレジットカード決済</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Notice Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              このプロジェクトについて
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Quick Clipは、2024年に開発したApp Clipテクノロジーを活用した決済ソリューションです。
              5秒で決済を完了させる革新的なシステムにチャレンジし、多くの学びを得ることができました。
              <br /><br />
              私たちは「本当に困っている人の力になる」という理念のもと、
              現在は新たな課題の解決に取り組んでいます。
            </p>
            <Link
              to="/history"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mr-4"
            >
              沿革を見る
            </Link>
            <Link
              to="/product"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              現在の事業を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickClipArchivePage;
