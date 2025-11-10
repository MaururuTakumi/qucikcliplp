import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const KizunaFinderArchivePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'KizunaFinder アーカイブ | Honkoma';
  }, []);

  // Challenge cards data
  const challengeCards = [
    {
      id: 1,
      iconSrc: "/---icon--cart-.png",
      iconBgColor: "bg-[#1e3a8a33]",
      title: ["自社の製品を宣伝する", "インフルエンサーを探したいけど", "どこから始めればいい？"],
      description: ["適切なインフルエンサーを見つけるのに", "時間がかかりすぎていませんか？"],
    },
    {
      id: 2,
      iconSrc: "/chatgpt------2025-5-25--1.png",
      iconBgColor: "bg-[#8a811e33]",
      title: ["費用対効果の高い", "インフルエンサーマーケティングが", "したいが..."],
      description: ["マッチング精度が低くて", "期待した成果が出ない経験", "ありませんか？"],
    },
    {
      id: 3,
      iconSrc: "/---icon--credit-card-.png",
      iconBgColor: "bg-[#558a1e33]",
      title: ["多数のプラットフォームから", "最適なインフルエンサーを", "探すのが大変"],
      description: ["YouTube、TikTok、Instagramなど", "効率的に探せたら良いのに..."],
    },
  ];

  // Feature steps data
  const featureSteps = [
    {
      id: 1,
      title: "要件入力",
      description: "依頼したいインフルエンサーのイメージ、登録者数の範囲を入力",
      icon: "📝",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      id: 2,
      title: "AI分析",
      description: "AIが最適なインフルエンサーを1分で分析・選定",
      icon: "🤖",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      id: 3,
      title: "リスト提供",
      description: "写真付きで適切なインフルエンサーリストを提供",
      icon: "📋",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

  // Benefits data
  const customerBenefits = [
    {
      id: 1,
      icon: "/vector.svg",
      iconBg: "bg-[#b3fdf866]",
      title: "高精度なAIマッチング",
      description: "AIがあなたの製品に最適なインフルエンサーを精度高くマッチング。",
    },
    {
      id: 2,
      icon: "/---icon--credit-card--1.png",
      iconBg: "bg-[#fecfae33]",
      title: "短時間で効率的な検索",
      description: "今まで数日かかっていたインフルエンサー検索を1分で完了。",
    },
  ];

  const facilityBenefits = [
    {
      id: 1,
      icon: "/-------2025-5-25--2.png",
      iconBg: "bg-[#b3fdf866]",
      title: "適切なインフルエンサー発見",
      description: "自分では見つけられなかった適切なインフルエンサーをAIが発見。",
    },
    {
      id: 2,
      icon: "/-------2025-5-25--21-17-56--2.png",
      iconBg: "bg-[#fecfae33]",
      title: "幅広いプラットフォーム対応",
      description: "YouTube、TikTok、Instagram、Xなど多数のプラットフォームから検索。",
    },
  ];

  // FAQ data
  const faqData = [
    {
      question: '導入にはどのくらいの費用がかかりますか？',
      answer: '現在、KizunaFinderは登録から2週間の間無料でご利用いただけます。将来的に有料プランを導入する可能性がありますが、詳細は追ってお知らせいたします。'
    },
  ];

  return (
    <div className="bg-white">
      {/* Archive Notice Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm md:text-base">
            <strong>アーカイブ:</strong> KizunaFinderは2025年初に開発されたAIインフルエンサー検索サービスです。現在は新しい事業へとピボットしています。
            <Link to="/product" className="ml-2 underline font-semibold hover:text-purple-100">
              現在の事業を見る →
            </Link>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 relative">
            {/* Left: Copy */}
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  AIが最適なインフルエンサーを1分で発見
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
                    KizunaFinder
                  </span>
                </h1>

                <p className="text-3xl sm:text-4xl leading-snug font-medium">
                  自社の製品を宣伝するインフルエンサーを探さないといけないけど、<br />
                  どこから始めればいいかわからない...<br />
                  <span className="font-semibold text-orange-600">そんなお悩み、ありませんか？</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🎯 YouTube 対応
                </span>
                <span className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🔄 TikTok (Coming Soon...)
                </span>
                <span className="inline-flex items-center bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">
                  📷 Instagram (Coming Soon...)
                </span>
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🐦 X (Coming Soon...)
                </span>
              </div>
            </div>

            {/* Right: Demo GIF */}
            <div className="flex-1 max-w-xl flex justify-center md:justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                src="/assets/kizuna/kzfinder_demo_horz.png"
                alt="KizunaFinder Demo - AIによるインフルエンサー検索"
                className="rounded-2xl shadow-2xl w-full relative z-10 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="relative flex flex-col w-full items-center justify-end gap-5 px-4 py-16 md:py-24 bg-[#f2f1f1] overflow-hidden">
        <div className="w-full py-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 leading-snug mb-4">
            こんな"もったいない"、
            <br className="md:hidden" />
            見過ごしてませんか？
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            インフルエンサーマーケティングには多くの課題があります
          </p>
        </div>

        <div className="group/scroll relative w-full lg:max-w-screen-xl lg:mx-auto">
          <div className="flex lg:grid lg:grid-cols-3 w-full overflow-x-auto lg:overflow-visible gap-4 md:gap-6 scroll-snap-x scroll-snap-mandatory touch-pan-x scroll-smooth scrollbar-hide pb-6 lg:pb-0">
            {challengeCards.map((card) => (
              <Card
                key={card.id}
                className="flex-shrink-0 lg:flex-shrink lg:w-full min-w-[calc(100vw-2rem)] sm:min-w-[60%] md:min-w-[45%] lg:min-w-0 max-w-[480px] scroll-snap-start bg-white rounded-[30px] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 md:p-8 flex flex-col gap-6 min-h-[260px] sm:min-h-[240px] lg:min-h-0">
                  <div className={`relative w-full max-w-[200px] mx-auto h-[70px] ${card.iconBgColor} flex items-center justify-center rounded-lg`}>
                    <img
                      className="w-[78px] h-[58px] object-contain"
                      alt="Challenge icon"
                      src={card.iconSrc}
                    />
                  </div>

                  <h3 className="font-bold text-black text-lg md:text-xl text-center leading-relaxed">
                    {card.title.map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < card.title.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>

                  <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                    {card.description.map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < card.description.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            KizunaFinderが、その"もったいない"を解消します！
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            依頼したいインフルエンサーのイメージ、登録者数の範囲を入力するだけで<br />
            適切なインフルエンサーをAIが1分でリストアップ！！<br />
            写真付きで適切なインフルエンサーを検索できます。
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent mb-6">
              たった3ステップの簡単フロー
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              誰でも簡単に、AIで1分で最適なインフルエンサーを発見
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {featureSteps.map((step, index) => (
              <article
                key={step.id}
                className={`group relative bg-gradient-to-br ${step.bgGradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className={`text-lg font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.id}
                  </span>
                </div>

                <div className="flex justify-center mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 relative`}>
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    <span className="text-3xl relative z-10">{step.icon}</span>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="px-4 py-32 md:py-40 text-center space-y-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
              使い方は <span className="text-purple-600 font-bold">簡単</span> です
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="relative max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-2xl blur-xl"></div>
              <img
                src="/assets/kizuna/kzfinder_demo_horz.png"
                alt="KizunaFinderの使い方デモ"
                className="w-full relative z-10 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 text-lg md:text-xl font-medium">
              要件入力 → AIが分析 → 最適インフルエンサーリスト提供 → 完了
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              KizunaFinderがもたらすメリット
            </h2>
            <p className="text-xl text-gray-600">
              マーケティング担当者とインフルエンサー、双方にとっての価値を提供します
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Benefits */}
            <div className="bg-white rounded-[30px] p-8">
              <h3 className="font-bold text-gray-900 text-2xl text-center mb-8">
                マーケティング担当者のメリット
              </h3>
              <div className="space-y-6">
                {customerBenefits.map((benefit) => (
                  <Card key={benefit.id} className="rounded-[30px] overflow-hidden bg-gray-50 border-0 shadow-sm">
                    <CardContent className="flex items-start gap-6 p-6">
                      <div className={`w-[63px] h-[63px] flex items-center justify-center ${benefit.iconBg} rounded-lg`}>
                        <img className="w-[40px] h-[40px]" alt="Benefit icon" src={benefit.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-xl mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Facility Benefits */}
            <div className="bg-white rounded-[30px] p-8">
              <h3 className="font-bold text-gray-900 text-2xl text-center mb-8">
                インフルエンサーのメリット
              </h3>
              <div className="space-y-6">
                {facilityBenefits.map((benefit) => (
                  <Card key={benefit.id} className="rounded-[30px] overflow-hidden bg-gray-50 border-0 shadow-sm">
                    <CardContent className="flex items-start gap-6 p-6">
                      <div className={`w-[63px] h-[63px] flex items-center justify-center ${benefit.iconBg} rounded-lg`}>
                        <img className="w-[40px] h-[40px] object-cover" alt="Benefit icon" src={benefit.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-xl mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              よくあるご質問
            </h2>
            <p className="text-xl text-gray-600">
              KizunaFinderについてのご質問にお答えします
            </p>
          </div>

          <div className="space-y-8">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-12">
                  {faq.answer}
                </p>
              </div>
            ))}
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
              KizunaFinderは、2025年初に開発したAIを活用したインフルエンサー検索サービスです。
              1分で最適なインフルエンサーを発見できるプラットフォームの構築にチャレンジし、
              AIマッチング技術の可能性を追求しました。
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

export default KizunaFinderArchivePage;
