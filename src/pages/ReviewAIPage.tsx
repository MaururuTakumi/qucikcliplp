import React, { useState } from 'react';
import { ArrowRight, Clock, MessageSquareWarning, BarChart3, FileText, Star, CheckCircle, AlertCircle, Send, Search, Globe, Bot, Bell, TrendingUp, Mail } from 'lucide-react';

const ReviewAIPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    document.title = '口コミAI | honkoma';
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      facilityName: formData.get('facilityName') as string,
      facilityUrl: formData.get('facilityUrl') as string,
      inquiryType: '口コミAI無料診断',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxVMYEL9aJS124xpDj-bpynGYH_QbyEsb0yGqUznlTALT6OreAjCSS7oth4f7ETDciQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setSubmitStatus('success');
      e.currentTarget.reset();
      if (window.gtag) {
        window.gtag('event', 'form_submit', { event_category: 'engagement', event_label: 'review_ai_diagnosis' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('success');
      e.currentTarget.reset();
      if (window.gtag) {
        window.gtag('event', 'form_submit', { event_category: 'engagement', event_label: 'review_ai_diagnosis' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const problems = [
    { icon: <Clock className="h-5 w-5" />, text: '複数サイトの口コミチェックに毎日30分以上' },
    { icon: <MessageSquareWarning className="h-5 w-5" />, text: 'ネガティブな口コミへの返信が追いつかない' },
    { icon: <BarChart3 className="h-5 w-5" />, text: '競合ホテルとの評価差が気になるが分析できていない' },
    { icon: <FileText className="h-5 w-5" />, text: '四半期レポートに口コミデータを入れたいが工数が足りない' },
  ];

  const comparisonItems = [
    { label: '月額費用', honkoma: '5万円〜', competitor: '推定5〜30万円', manual: '0円(人件費別)' },
    { label: '対応サイト数', honkoma: '5+', competitor: '31', manual: '-' },
    { label: 'AI分析', honkoma: '◎ QSCA自動判定', competitor: '○ AI分析β版', manual: '×' },
    { label: '口コミ返信代行', honkoma: '◎ AI下書き+承認制', competitor: '△ ツール提供', manual: '× 手動' },
    { label: '競合分析', honkoma: '◎ 自動', competitor: '○ エンタープライズのみ', manual: '×' },
    { label: 'レポート配信', honkoma: '◎ 週次/月次自動配信', competitor: '△ ダッシュボード閲覧', manual: '×' },
    { label: '導入形態', honkoma: '全部おまかせ(AI秘書型)', competitor: 'SaaSツール(自分で操作)', manual: '-' },
    { label: '多言語対応', honkoma: '◎ 英/中/韓自動翻訳分析', competitor: '△ オプション', manual: '×' },
    { label: '初期費用', honkoma: '5〜10万円', competitor: '要問合せ', manual: '0円' },
    { label: '最適企業規模', honkoma: '1〜30店舗', competitor: '10〜500店舗', manual: '-' },
  ];

  const steps = [
    {
      num: '01',
      title: '口コミ自動収集',
      icon: <Search className="h-6 w-6" />,
      description: 'Booking.com、Googleマップ、TripAdvisor、Agoda、一休、じゃらんなど主要サイトから口コミを自動収集。手作業は一切不要です。',
      sites: ['Booking.com', 'Google', 'TripAdvisor', 'Agoda', '一休', 'じゃらん'],
    },
    {
      num: '02',
      title: 'AI分析',
      icon: <Bot className="h-6 w-6" />,
      description: 'AIが口コミを自動分類・分析。QSCA（品質・サービス・清潔さ・アメニティ）判定、競合比較、時系列トレンド、ネガティブアラートを生成します。',
      features: ['QSCA判定', '競合比較', '時系列トレンド', 'ネガティブアラート'],
    },
    {
      num: '03',
      title: 'レポート配信',
      icon: <Mail className="h-6 w-6" />,
      description: '週次・月次の分析レポートをLINE、Slack、メールでお届け。ダッシュボードにログインする手間もありません。',
      channels: ['LINE', 'Slack', 'メール'],
    },
  ];

  const plans = [
    {
      name: 'ライト',
      price: '月5万円',
      stores: '1〜3店舗',
      features: ['口コミ自動収集', '週次レポート', '返信下書き'],
      recommended: false,
    },
    {
      name: 'スタンダード',
      price: '月10万円',
      stores: '4〜10店舗',
      features: ['ライトの全機能', '競合分析', 'ネガティブアラート', 'GBP投稿代行'],
      recommended: true,
    },
    {
      name: 'プレミアム',
      price: '月15〜20万円',
      stores: '11〜30店舗',
      features: ['スタンダードの全機能', '月次コンサルティング', 'カスタム分析'],
      recommended: false,
    },
  ];

  return (
    <div className="bg-cream">
      {/* ===== HERO ===== */}
      <section className="min-h-[90vh] flex items-center relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-3 opacity-0 animate-fade-up">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                Review AI
              </span>
            </div>

            <div className="lg:col-span-9">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tight text-ink mb-8 opacity-0 animate-fade-up-delay-1">
                口コミを、<br />
                <span className="text-accent">売上</span>に変える。<br />
                AIが自動で。
              </h1>

              <p className="text-lg md:text-xl text-warm leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                Booking.com・Googleマップ・TripAdvisor——散らばる口コミを自動収集し、AI分析レポートをお届け。ツールを渡すのではなく、全部やります。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-delay-3">
                <a
                  href="#free-diagnosis"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-ink text-cream text-base font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                >
                  まずは無料で口コミ診断
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 h-px bg-subtle w-0 animate-draw-line"></div>
        </div>
      </section>

      {/* ===== 課題セクション ===== */}
      <section className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Problems</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                こんなお悩み、ありませんか？
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle lg:ml-[25%]">
            {problems.map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-10 flex items-start gap-4">
                <span className="text-accent flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="font-serif text-lg text-ink leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 競合比較表 ===== */}
      <section className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Comparison</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                他社サービスとの比較
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-4 px-4 text-left font-mono text-xs tracking-[0.2em] uppercase text-warm w-[20%]"></th>
                  <th className="py-4 px-4 text-left w-[30%] bg-accent-light border-x border-accent/20">
                    <div className="font-serif text-lg font-bold text-accent">honkoma口コミAI</div>
                    <div className="font-mono text-xs text-warm">AI秘書型</div>
                  </th>
                  <th className="py-4 px-4 text-left w-[25%]">
                    <div className="font-serif text-lg font-bold text-ink">口コミコム(A社)</div>
                    <div className="font-mono text-xs text-warm">SaaSツール</div>
                  </th>
                  <th className="py-4 px-4 text-left w-[25%]">
                    <div className="font-serif text-lg font-bold text-ink">手動運用</div>
                    <div className="font-mono text-xs text-warm">自社対応</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, i) => (
                  <tr key={i} className="border-b border-subtle">
                    <td className="py-4 px-4 font-mono text-xs tracking-wide text-warm">{item.label}</td>
                    <td className="py-4 px-4 text-sm text-ink font-medium bg-accent-light border-x border-accent/20">{item.honkoma}</td>
                    <td className="py-4 px-4 text-sm text-warm">{item.competitor}</td>
                    <td className="py-4 px-4 text-sm text-warm">{item.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-accent-light border border-accent/20 p-6">
            <p className="text-sm text-ink leading-relaxed">
              <span className="font-serif font-bold">honkomaはツールを渡すのではなく、全部やって報告だけお届けするAI秘書型サービスです。</span>
              <span className="text-warm">ダッシュボードにログインする必要はありません。レポートがLINE・Slack・メールで届きます。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== サービス内容 3ステップ ===== */}
      <section className="py-28 border-b border-subtle bg-accent-light/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">How it works</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                3ステップで完結
              </h2>
              <p className="mt-4 text-warm text-lg leading-relaxed">
                お客様がやることは「申し込むだけ」。あとは全部おまかせください。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {steps.map((step) => (
              <div key={step.num} className="bg-cream p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-4xl font-light text-subtle">{step.num}</span>
                  <span className="text-accent">{step.icon}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-warm text-sm leading-relaxed mb-6">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(step.sites || step.features || step.channels || []).map((tag, i) => (
                    <span key={i} className="font-mono text-xs px-2 py-1 border border-subtle text-warm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== レポートサンプル ===== */}
      <section className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Report Sample</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                月次レポートイメージ
              </h2>
              <p className="mt-4 text-warm text-lg leading-relaxed">
                実際にお届けするレポートのサンプルです。
              </p>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            <div className="bg-ink text-cream p-8 md:p-12">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Monthly Report — 2026年2月</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="font-mono text-xs text-cream/40 mb-2">総合スコア</div>
                  <div className="font-serif text-5xl font-bold text-cream">
                    8.4<span className="text-lg text-cream/40">/10</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    <span className="font-mono text-xs text-accent">前月比 +0.1</span>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-cream/40 mb-3">QSCA スコア</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Q (品質)', score: '8.7', trend: '▲', color: 'text-accent' },
                      { label: 'S (サービス)', score: '8.2', trend: '→', color: 'text-cream/50' },
                      { label: 'C (清潔さ)', score: '7.9', trend: '▼', color: 'text-red-400' },
                      { label: 'A (アメニティ)', score: '8.8', trend: '▲', color: 'text-accent' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-mono text-sm text-cream/60">{item.label}</span>
                        <span className="font-serif text-lg font-bold text-cream">
                          {item.score} <span className={`text-sm ${item.color}`}>{item.trend}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-cream/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-3 w-3 text-red-400" />
                    <span className="font-mono text-xs text-cream/40">注意ワード</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['チェックイン待ち', 'エアコン'].map((word, i) => (
                      <span key={i} className="font-mono text-xs px-2 py-1 border border-red-400/30 text-red-400">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-cream/40 mb-3">競合比較</div>
                  <div className="font-serif text-2xl font-bold text-cream">
                    エリア内3位<span className="text-sm text-cream/40">/8施設</span>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-cream/40 mb-3">改善提案</div>
                  <p className="text-sm text-cream/70 leading-relaxed">
                    チェックイン待ち時間の改善が最優先。15時台の混雑緩和策を検討推奨。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 料金プラン ===== */}
      <section className="py-28 bg-ink">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-cream">
                料金プラン
              </h2>
              <p className="mt-4 text-cream/50 text-lg leading-relaxed">
                初期費用: 5〜10万円（全プラン共通）
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 md:p-10 ${plan.recommended ? 'bg-accent-light/10 border border-accent/30' : 'bg-ink'}`}
              >
                {plan.recommended && (
                  <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent border border-accent px-2 py-1 mb-4">
                    推奨
                  </span>
                )}
                <h3 className="font-serif text-2xl font-bold text-cream mb-1">{plan.name}</h3>
                <div className="font-serif text-4xl font-bold text-cream mb-2">{plan.price}</div>
                <div className="font-mono text-xs text-cream/40 mb-6">{plan.stores}</div>

                <div className="border-t border-cream/10 pt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-cream/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-mono text-xs text-cream/30 tracking-wide">
              初期費用: 5〜10万円（対象サイト数・競合設定により変動）
            </p>
          </div>
        </div>
      </section>

      {/* ===== 無料診断CTA ===== */}
      <section id="free-diagnosis" className="py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Free Diagnosis</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink mt-4 mb-6">
                まずは無料で<br />口コミ診断してみませんか？
              </h2>
              <p className="text-warm text-lg leading-relaxed mb-8">
                ホテル名・施設名を教えていただくだけで、AIが口コミを自動分析。現状の評価・改善ポイント・競合との比較をレポートにまとめてお届けします。
              </p>

              <div className="border border-subtle p-8">
                <h3 className="font-serif text-lg font-bold text-ink mb-4">無料診断でわかること</h3>
                <ul className="space-y-3">
                  {[
                    '現在の口コミ評価スコア',
                    'QSCA分析（品質・サービス・清潔さ・アメニティ）',
                    '頻出キーワードとネガティブ傾向',
                    'エリア内の競合比較',
                    '優先改善ポイントの提案',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-warm text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-subtle p-8 md:p-12">
                <h3 className="font-serif text-2xl font-bold text-ink mb-2">無料口コミ診断フォーム</h3>
                <p className="text-warm text-sm mb-8">
                  必要事項をご記入の上、送信してください。3営業日以内に診断レポートをお届けします。
                </p>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="company" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                        会社名 <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text" id="company" name="company" required
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                        お名前 <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text" id="name" name="name" required
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      メールアドレス <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email" id="email" name="email" required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="facilityName" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      施設名 <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="facilityName" name="facilityName" required
                      placeholder="例: ホテル○○ 東京本店"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors placeholder:text-subtle"
                    />
                  </div>

                  <div>
                    <label htmlFor="facilityUrl" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      施設URL（任意）
                    </label>
                    <input
                      type="url" id="facilityUrl" name="facilityUrl"
                      placeholder="例: https://www.booking.com/hotel/..."
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors placeholder:text-subtle"
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 text-ink border border-subtle p-4">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="text-sm">お申し込みを受け付けました。3営業日以内に診断レポートをお届けします。</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-ink border border-accent p-4">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      <span className="text-sm">送信に失敗しました。時間をおいて再度お試しください。</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ink text-cream py-4 font-medium tracking-wide hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-cream/30 border-t-cream rounded-full"></div>
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        無料診断を申し込む
                      </>
                    )}
                  </button>

                  <p className="text-xs text-warm text-center">
                    送信いただいた個人情報は、当社の
                    <a href="/privacy" className="text-accent hover:underline">プライバシーポリシー</a>
                    に基づいて適切に管理いたします。
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewAIPage;
