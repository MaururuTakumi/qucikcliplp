import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, DollarSign, Globe, CheckCircle, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Honkoma | インドの次世代エンジニアを、日本の成長エンジンに';
  }, []);

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: '多面的な学生リーチ',
      description: '現地のエンジニア学生団体と連携。さらにReddit等の学生コミュニティで話題化し、認知×信頼×応募の質を同時に最大化。'
    },
    {
      icon: <Target className="h-8 w-8 text-primary-600" />,
      title: 'スキルで選ぶ人材プール',
      description: 'IITsの有無で線引きせず、コード・CS基礎・実務課題で評価。アルゴリズム／Web基盤／クラウド／データまで、職能別に可視化。'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary-600" />,
      title: '丁寧な"適正コスト"提案',
      description: '日本人新卒と比較して総コストを抑えつつ価値を最大化。買い叩きではなく、国際人材市場における適正水準でのご提案を徹底。'
    }
  ];

  const stats = [
    { label: 'Reddit日別インプレッション', value: '30,000', suffix: '' },
    { label: '日別注目度ランキング', value: '15', suffix: '位' },
    { label: 'AIスクリーニング削減率', value: '70-90', suffix: '%' }
  ];

  const services = [
    {
      icon: <Users className="h-6 w-6" />,
      title: '人材紹介',
      description: 'スキル評価済みの候補者を職能別にご提案（英語業務可）'
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'AIスクリーニング',
      description: '応募殺到時も1クリックで優先順位付け'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: '採用広報サポート',
      description: '学生向け記事／ミートアップ共催／Redditコミュニティ告知'
    }
  ];

  const highlights = [
    'スキルベースの一次スクリーニング',
    '応募殺到対応のAIスクリーニング',
    '英語実務対応（国際チームで即戦力）'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-gray-50 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 relative">
            {/* Left: Copy */}
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
                  インドの次世代エンジニアを、<br />
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    日本の成長エンジンに。
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  現地学生団体とのネットワークと、学生コミュニティでの高い認知度（Redditで<strong>30,000インプレッション／日別注目度15位</strong>）を背景に、<strong>大学のTierに依らないスキル評価</strong>で厳選。貴社の開発速度に直結する人材だけを。
                </p>
              </div>

              {/* Support Highlights */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {highlights.map((highlight, index) => (
                  <div key={index} className="inline-flex items-center bg-white px-4 py-2 rounded-full border border-primary-200 shadow-sm">
                    <CheckCircle className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  候補者を知る
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  まずは相談する
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary-600">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex-1 max-w-xl flex justify-center md:justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-green-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <Globe className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    世界級の若手エンジニア
                  </h3>
                  <p className="text-gray-600">
                    インドから日本へ
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">CS基礎</span>
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">実務経験</span>
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">英語ネイティブレベル</span>
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              当社が選ばれる理由
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              現地ネットワークとスキル評価、適正なコスト提案で、真に活躍する人材をご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
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

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              提供サービス
            </h2>
            <p className="text-xl text-gray-600">
              人材紹介からAIスクリーニング、採用広報まで、トータルでサポートします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/product"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              サービス詳細を見る
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                日本のプロダクト開発に、<br />
                世界級の若手エンジニアを。
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                インドの優秀な新卒エンジニアが持つ、<strong>CS基礎・実務経験・英語力</strong>を、<br />
                日本のものづくりに接続します。
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-2xl p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                外国人向けの求人を出すと、応募が"一気に"集まる。<br />
                その山から<strong>本当に戦力になる人</strong>を<strong>速く、丁寧に</strong>見極める仕組みを——<br />
                当社は提供します。
              </p>
              <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-primary-600 font-bold text-lg">
                  本当に困っている人の力になる
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ハイレベルな技術力を持つ外国人エンジニアの採用に<br />
            ご関心があれば、まずはご相談ください。
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            候補者サンプルのご提示や、AIスクリーニングのデモも可能です。<br />
            貴社の課題に合わせて、最適なご提案をさせていただきます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              まずは相談する
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              候補者サンプルを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
