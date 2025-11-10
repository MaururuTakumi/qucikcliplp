import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Code, Globe, Sparkles, TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';

const ProductPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'サービス紹介 - インドエンジニア人材紹介とAIスクリーニング | Honkoma';
  }, []);

  const approaches = [
    {
      icon: <Users className="h-10 w-10" />,
      title: '現地ネットワーク × 学生コミュニティ',
      points: [
        'エンジニア学生団体との連携で、質の高い母集団を安定確保',
        'Redditの学生コミュニティで当社投稿が30,000インプレッション／日別15位到達',
        'オンラインに偏らずオフライン接点（勉強会・ミートアップ）も設計'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: 'Tierに依らないスキル評価',
      points: [
        'IITs等の大学名ではなく、実力ベースで評価',
        'コーディングテスト／ワークサンプル／設計レビューで多面的にチェック',
        '英語面接で業務コミュニケーション力も確認'
      ],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: 'フェアで適正なコスト設計',
      points: [
        '「安さ」ではなく、国際市場基準の適正水準でのご提案',
        '採用後の活躍と定着まで見据えた総コスト最適化（採用・オンボーディング・教育）',
        '長期的にフェアな条件で、Win-Winの関係を構築'
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    }
  ];

  const candidateFeatures = [
    { icon: <Code className="h-6 w-6" />, label: '専門性', description: 'アルゴリズム／OS／ネットワーク／DB／クラウド基盤' },
    { icon: <Award className="h-6 w-6" />, label: '実務経験', description: '在学中インターン（長期）やOSS貢献、受託開発の実績' },
    { icon: <Globe className="h-6 w-6" />, label: '言語', description: '英語ネイティブレベル（国際スタンダードでドキュメント運用可）' },
    { icon: <Sparkles className="h-6 w-6" />, label: '即戦力性', description: 'TypeScript／Python／Goなどプロダクション志向の技術選好' }
  ];

  const services = [
    {
      title: '人材紹介（新卒〜第二新卒中心）',
      description: 'スキル評価済みの候補者を職能別にご提案',
      features: ['英語業務可能', 'CS基礎完備', '実務経験あり'],
      icon: <Users className="h-8 w-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'AIスクリーニングツール',
      description: '応募殺到時の選考負荷を劇的削減',
      features: ['1クリックで優先順位付け', 'ATS/CSV連携', 'コピペ対策完備'],
      icon: <Sparkles className="h-8 w-8" />,
      color: 'bg-purple-500'
    },
    {
      title: '採用広報・ブランディング',
      description: '学生向けインタビュー記事／イベント共催',
      features: ['Redditコミュニティ告知', 'ミートアップ開催', '学生団体連携'],
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-green-500'
    }
  ];

  const candidateSamples = [
    {
      role: 'Backend／Go・クラウド基盤',
      description: '高トラフィックAPI最適化、GCP経験',
      skills: ['Go', 'GCP', 'Kubernetes', 'Redis'],
      experience: '在学中インターン2年'
    },
    {
      role: 'Frontend／TypeScript',
      description: 'デザインシステム運用、アクセシビリティ知見',
      skills: ['TypeScript', 'React', 'Next.js', 'Tailwind'],
      experience: 'OSSコントリビューター'
    },
    {
      role: 'Data／Python',
      description: 'ETL／特徴量設計、軽量MLOps',
      skills: ['Python', 'Pandas', 'Airflow', 'TensorFlow'],
      experience: 'Kaggle経験あり'
    }
  ];

  const faqs = [
    {
      q: '英語での業務遂行は大丈夫ですか？',
      a: '候補者は英語ネイティブレベルを前提としています。英語ドキュメント／Issue駆動での実務経験も確認済みです。'
    },
    {
      q: '大量応募での見落としが不安です',
      a: 'AIスクリーニングで優先度付けし、根拠も併記します。面接は人が判断する前提で、前段の負荷だけを削減します。'
    },
    {
      q: '「安価」という表現が気になります',
      a: '当社は「安さの追求」ではなく、フェアな国際報酬水準でのご提案を重視します。価値に見合う適正コストで、長期活躍を目指します。'
    },
    {
      q: '導入にはどのくらいの費用がかかりますか？',
      a: '人材紹介は成功報酬型（内定承諾時）を基本に個別設計いたします。AIスクリーニングツールはフリープラン（上限あり）と月額プランをご用意しています。'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            日本のプロダクト開発に、<br />
            世界級の若手エンジニアを。
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
            インドの優秀な新卒エンジニアが持つ、<strong className="text-yellow-200">CS基礎・実務経験・英語力</strong>を、<br />
            日本のものづくりに接続します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              まずは相談する
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#candidates"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              候補者サンプルを見る
            </a>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              当社のアプローチ（3つの土台）
            </h2>
            <p className="text-xl text-gray-600">
              現地ネットワーク、スキル評価、適正コスト設計の3つの柱で、真に活躍する人材をご紹介します。
            </p>
          </div>

          <div className="space-y-8">
            {approaches.map((approach, index) => (
              <div key={index} className={`${approach.bgColor} rounded-2xl p-8 md:p-12 border border-gray-200`}>
                <div className="flex items-start gap-6 mb-6">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${approach.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                    {approach.icon}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-white px-4 py-1 rounded-full text-sm font-semibold text-gray-700 mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{approach.title}</h3>
                  </div>
                </div>
                <ul className="space-y-3 ml-0 md:ml-22">
                  {approach.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate Pool Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              候補者プールの特徴
            </h2>
            <p className="text-xl text-gray-600">
              専門性、実務経験、言語力、即戦力性の4つの観点で厳選された人材
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {candidateFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.label}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Screening Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                採用課題への解決策
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AIスクリーニング
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">課題</h4>
                    <p className="text-gray-700">
                      「外国人向け求人を出した瞬間、<strong>大量応募</strong>で見切れない」
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">解決</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 応募集約（HP／LinkedIn／CSV）→ <strong>1クリックAIスクリーニング</strong></li>
                      <li>• 技術：<strong>Best / Enough / Not Bad</strong></li>
                      <li>• Culture Fit：<strong>スコア（0–100）</strong></li>
                      <li>• <strong>コード意図の口頭説明</strong>で生成AIコピペ対策</li>
                      <li>• 根拠の可視化（説明責任）で社内合意形成もスムーズ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">導入効果</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    スクリーニング時間 <strong className="ml-2">70–90%削減</strong>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    一次面接通過率の標準化、早期離職の低減
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">※数値は導入企業の実測に応じて更新</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">スクリーニング結果イメージ</h3>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-2 font-semibold text-gray-900">TypeScript</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Fit</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Raj Kumar</td>
                      <td className="py-3"><span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Best</span></td>
                      <td className="py-3"><span className="font-semibold text-green-600">95</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Priya Singh</td>
                      <td className="py-3"><span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Enough</span></td>
                      <td className="py-3"><span className="font-semibold text-blue-600">82</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Amit Patel</td>
                      <td className="py-3"><span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Not Bad</span></td>
                      <td className="py-3"><span className="font-semibold text-yellow-600">68</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              サービスラインナップ
            </h2>
            <p className="text-xl text-gray-600">
              人材紹介からAIツール、採用広報まで、トータルでサポート
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">価格・契約</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-primary-600 pl-6">
                <h4 className="font-bold text-gray-900 mb-2">人材紹介</h4>
                <p className="text-gray-700">成功報酬型（内定承諾時）を基本に個別設計</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-6">
                <h4 className="font-bold text-gray-900 mb-2">ツール</h4>
                <p className="text-gray-700">フリープラン（上限あり）／月額（上位プランはATS連携・SLA）</p>
              </div>
            </div>
            <div className="mt-6 bg-primary-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">適正コストの考え方</h4>
              <p className="text-gray-700">
                国際市場の報酬レンジと、貴社の役割設計（英語要否・責務範囲）を踏まえ、<strong>長期的にフェアな条件</strong>でご提案します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Samples Section */}
      <section id="candidates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              候補者サンプル
            </h2>
            <p className="text-xl text-gray-600">
              実際にご紹介可能な候補者の一例をご紹介します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {candidateSamples.map((candidate, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {candidate.role}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.description}</h3>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">スキル</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{candidate.experience}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">※詳細は面談時に個別プロファイルをご提示します</p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              候補者について相談する
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
            <p className="text-xl text-gray-600">
              サービスに関するよくある質問にお答えします
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-gray-700 ml-12 leading-relaxed">{faq.a}</p>
              </div>
            ))}
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
          <p className="text-xl text-white mb-8 leading-relaxed opacity-95">
            候補者サンプルのご提示や、AIスクリーニングのデモも可能です。<br />
            貴社の課題に合わせて、最適なご提案をさせていただきます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              相談する
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              会社について
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
