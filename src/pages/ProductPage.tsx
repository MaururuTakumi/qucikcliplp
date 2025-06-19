import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const ProductPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Quick Clip - App Clipで5秒決済を実現 | Honkoma';
  }, []);

  // Challenge cards data
  const challengeCards = [
    {
      id: 1,
      iconSrc: "/---icon--cart-.png",
      iconBgColor: "bg-[#1e3a8a33]",
      title: ["いろんな商品を展示したいけど、", "在庫リスクやスペースが", "ネック"],
      description: ["本当に売りたい商品を、", "在庫リスクで諦めていませんか？"],
    },
    {
      id: 2,
      iconSrc: "/chatgpt------2025-5-25--1.png",
      iconBgColor: "bg-[#8a811e33]",
      title: ['お客様の"欲しい!"という', "気持ちをその場で", "売上に繋げたいが..."],
      description: ["お客様の熱意を、", "持ち帰りの手間で", "逃していませんか？"],
    },
    {
      id: 3,
      iconSrc: "/---icon--credit-card-.png",
      iconBgColor: "bg-[#558a1e33]",
      title: ["イベントや催事で、", "持ち帰りの手間が", "購入の障壁に"],
      description: ["限定品や大型商品も、", "スマート販売しませんか？"],
    },
  ];

  // Feature steps data
  const featureSteps = [
    {
      id: 1,
      title: "発見&スキャン",
      description: "商品や展示物のQRコードをスキャン",
      icon: "📱",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      id: 2,
      title: "確認&決済",
      description: "ワンタップで簡単に決済完了",
      icon: "💳",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      id: 3,
      title: "自宅で受け取り",
      description: "商品は自宅に直接配送",
      icon: "🚚",
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
      title: "手ぶらで快適な購買体験",
      description: "商品を持ち歩く必要がなく、観光や買い物がより快適に。",
    },
    {
      id: 2,
      icon: "/---icon--credit-card--1.png",
      iconBg: "bg-[#fecfae33]",
      title: "簡単・スピーディーな瞬間購入",
      description: "アプリ不要でQRコードをスキャンするだけの簡単決済。",
    },
  ];

  const facilityBenefits = [
    {
      id: 1,
      icon: "/-------2025-5-25--2.png",
      iconBg: "bg-[#b3fdf866]",
      title: "在庫リスクゼロで新たな収益機会",
      description: "実物の在庫を持たずに販売が可能で、スペースを有効活用。",
    },
    {
      id: 2,
      icon: "/-------2025-5-25--21-17-56--2.png",
      iconBg: "bg-[#fecfae33]",
      title: "簡単オペレーションで売上向上",
      description: "QRコードを設置するだけで、新たな収益チャネルを構築。",
    },
  ];

  // FAQ data
  const faqData = [
    {
      question: 'App Clipとは何ですか？',
      answer: 'App Clipは、アプリをダウンロードすることなく、QRコードやNFCタグをスキャンするだけでアプリの一部機能にアクセスできるAppleの技術です。'
    },
    {
      question: '導入にはどのくらいの費用がかかりますか？',
      answer: '導入費用はお客様の要件により異なります。まずは無償PoCからご相談いただけますので、お気軽にお問い合わせください。'
    },
    {
      question: 'どのような決済方法に対応していますか？',
      answer: 'Apple Pay、Google Pay、クレジットカード決済に対応しています。セキュアで安全な決済を提供いたします。'
    },
    {
      question: '商品の配送はどのように行われますか？',
      answer: '決済完了後、お客様が指定された住所に商品を配送いたします。配送方法や期間は商品により異なります。'
    }
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
                <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ⚡ App Clip Technology
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    Quick Clip
                  </span>
                </h1>
                
                <p className="text-3xl sm:text-4xl leading-snug font-medium">
                  <span className="font-semibold text-primary-700">"欲しい"</span> を、その場で<br className="md:hidden" />
                  スマートに。<br />
                  新しい <span className="font-semibold text-orange-600">『発見型コマース』</span> 体験を。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  無償PoCを相談する
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  詳細を見る
                </a>
              </div>

              <div className="inline-flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ⚡ 5秒で購入完了
                </span>
                <span className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  📱 アプリダウンロード不要
                </span>
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

      {/* Challenge Section */}
      <section className="relative flex flex-col w-full items-center justify-end gap-5 px-4 py-16 md:py-24 bg-[#f2f1f1] overflow-hidden">
        <div className="w-full py-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 leading-snug mb-4">
            こんな"もったいない"、
            <br className="md:hidden" />
            見過ごしてませんか？
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            従来の販売方法では、お客様の購買意欲と実際の購入の間に多くの障壁があります
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
            Quick Clipが、その"もったいない"を解消します！
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            店頭や展示商品に設置されたQR/NFCコードをスマートフォンでスキャンするだけ。<br />
            アプリ不要で即座に商品詳細ページへアクセス、Apple Pay/Google Payでワンタップ決済。<br />
            商品は後日ご自宅へ配送される、新しい発見型コマースです。
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent mb-6">
              たった3ステップの簡単フロー
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              誰でも簡単に、わずか数秒で完了する革新的な購買体験
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
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-900 transition-colors duration-300">
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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
              導入フローは <span className="text-primary-600 font-bold">3ステップ</span> だけ
            </h2>
          </div>

          <div className="flex items-start justify-between max-w-7xl mx-auto overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory px-6">
            <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img src="/assets/steps/scan.png" alt="QRをスキャンするiPhone" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
              <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
            </div>
            <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img src="/assets/steps/appclip.png" alt="App Clipカード" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
              <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
            </div>
            <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img src="/assets/steps/pay.png" alt="Apple Payシート" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
              <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
            </div>
            <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img src="/assets/steps/success.png" alt="購入完了" className="h-72 md:h-80 lg:h-[310px] xl:h-[330px] w-[270px] object-contain object-top relative z-10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 text-lg md:text-xl font-medium">
              QR / NFC をかざす → App Clip が即起動 → Apple Pay ワンタップ決済 → 完了
            </p>
            <p className="text-sm text-gray-500">※ 画像を横スクロールしてご覧ください</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quick Clipがもたらすメリット
            </h2>
            <p className="text-xl text-gray-600">
              お客様と施設様、双方にとっての価値を提供します
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Benefits */}
            <div className="bg-white rounded-[30px] p-8">
              <h3 className="font-bold text-gray-900 text-2xl text-center mb-8">
                お客様にとってのメリット
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
                施設様にとってのメリット
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent mb-4">
              導入シーンはいろいろ
            </h2>
            <p className="text-xl text-gray-600">
              様々な業界・シーンでご活用いただけます
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="/assets/usecase/hotel.jpg"
                alt="ホテル客室アメニティ"
                className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
                <h3 className="font-bold mb-3 text-lg text-primary-900">ホテル客室アメニティ</h3>
                <p className="text-sm text-gray-600 flex-grow">
                  試して気に入った瞬間にQRスキャン。手ぶらで帰宅できる新しい宿泊体験。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="/assets/usecase/salon.jpg"
                alt="美容院の店販シャンプー"
                className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
                <h3 className="font-bold mb-3 text-lg text-primary-900">美容院の店販シャンプー</h3>
                <p className="text-sm text-gray-600 flex-grow">
                  施術後に即購入。サロン在庫ゼロでリピート率向上。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="/assets/usecase/lounge.jpg"
                alt="空港ラウンジ限定ギフト"
                className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
                <h3 className="font-bold mb-3 text-lg text-primary-900">空港ラウンジ限定ギフト</h3>
                <p className="text-sm text-gray-600 flex-grow">
                  待ち時間にスキャン→帰国後受け取り。免税品を並ばず購入可能。
                </p>
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
              Quick Clipについてのご質問にお答えします
            </p>
          </div>

          <div className="space-y-8">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5">
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Quick Clipで新しい購買体験を始めませんか？
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

export default ProductPage;