import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, BarChart3, ArrowRight, Check, X, Minus } from 'lucide-react';

type TabKey = 'ai-secretary' | 'automation' | 'review-ai';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'ai-secretary', label: 'AI秘書派遣', icon: <Bot className="h-5 w-5" /> },
  { key: 'automation', label: '業務自動化支援', icon: <Zap className="h-5 w-5" /> },
  { key: 'review-ai', label: '口コミAI', icon: <BarChart3 className="h-5 w-5" /> },
];

const tabContent: Record<TabKey, {
  oneLiner: string;
  problem: string;
  solution: string;
  includes: string[];
  pricing: string;
  cta: string;
  extraLink?: { label: string; to: string };
}> = {
  'ai-secretary': {
    oneLiner: 'あなた専属のAI秘書を、月5万円から',
    problem: 'メール対応、日程調整、レポート作成…毎日繰り返す業務に時間を奪われていませんか？',
    solution: 'honkomaのAI秘書が、御社の業務を学習し、実務レベルで対応します',
    includes: [
      'メール下書き・返信補助',
      '日程調整・カレンダー管理',
      '口コミ収集・分析レポート',
      '社内外の進行管理',
      '週次レポート作成',
    ],
    pricing: '初期セットアップ 15万円 + 月額5万円〜',
    cta: 'AI秘書について相談する',
  },
  automation: {
    oneLiner: '御社の業務フローをAIで再設計',
    problem: '手作業のコピペ、転記、チェック作業。人がやる必要のない業務に人件費をかけていませんか？',
    solution: '業務フローを分析し、最適なAI自動化ソリューションを設計・実装します',
    includes: [
      '業務フロー分析・可視化',
      'RPA・AIによる自動化設計',
      'データ連携・API構築',
      'チーム研修・運用マニュアル',
      '継続的な改善提案',
    ],
    pricing: '月額30万円〜（初期セットアップ込み）',
    cta: '業務自動化について相談する',
  },
  'review-ai': {
    oneLiner: '口コミ対応、もうあなたがやる必要はありません',
    problem: '複数サイトの口コミを毎日チェック、返信、分析…月30時間以上かかっていませんか？',
    solution: 'AIが口コミを自動収集・分析し、週次レポート+返信ドラフトまで自動生成します',
    includes: [
      'Booking.com/Google/食べログ等の口コミ自動収集',
      'ネガティブアラート即時通知',
      '返信ドラフト自動生成',
      '競合施設との比較分析',
      'QSCA月次レポート',
      '商品企画への示唆',
    ],
    pricing: '初期セットアップ 15万円 + 月額3万円〜',
    cta: '口コミAIについて相談する',
    extraLink: { label: '口コミAI詳細ページ', to: '/review-ai' },
  },
};

const comparisonRows = [
  {
    label: '初期コスト',
    honkoma: { icon: 'good', text: '15万〜' },
    saas: { icon: 'mid', text: '月10-30万' },
    consul: { icon: 'bad', text: '100万〜' },
    self: { icon: 'good', text: '0円' },
  },
  {
    label: '運用コスト',
    honkoma: { icon: 'good', text: '月5万〜' },
    saas: { icon: 'mid', text: '月10-30万' },
    consul: { icon: 'bad', text: '月50万〜' },
    self: { icon: 'bad', text: '人件費' },
  },
  {
    label: 'カスタマイズ',
    honkoma: { icon: 'best', text: '御社専用設計' },
    saas: { icon: 'bad', text: '既製品' },
    consul: { icon: 'good', text: '可能' },
    self: { icon: 'good', text: '自由' },
  },
  {
    label: '導入速度',
    honkoma: { icon: 'good', text: '最短2週間' },
    saas: { icon: 'good', text: '即日' },
    consul: { icon: 'bad', text: '2-3ヶ月' },
    self: { icon: 'bad', text: '数ヶ月' },
  },
  {
    label: '運用サポート',
    honkoma: { icon: 'best', text: '伴走型' },
    saas: { icon: 'mid', text: 'ヘルプのみ' },
    consul: { icon: 'good', text: '期間限定' },
    self: { icon: 'bad', text: 'なし' },
  },
  {
    label: 'AI活用度',
    honkoma: { icon: 'best', text: 'AI駆動' },
    saas: { icon: 'mid', text: '部分的' },
    consul: { icon: 'mid', text: '提案のみ' },
    self: { icon: 'bad', text: '自力' },
  },
];

function ComparisonIcon({ type }: { type: string }) {
  switch (type) {
    case 'best':
      return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent"><Check className="h-4 w-4" strokeWidth={3} /></span>;
    case 'good':
      return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600"><Check className="h-4 w-4" /></span>;
    case 'mid':
      return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600"><Minus className="h-4 w-4" /></span>;
    case 'bad':
      return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500"><X className="h-4 w-4" /></span>;
    default:
      return null;
  }
}

const ProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('ai-secretary');

  React.useEffect(() => {
    document.title = 'サービス・料金 | honkoma';
  }, []);

  const current = tabContent[activeTab];

  return (
    <div className="bg-cream">
      {/* ===== 1. HERO ===== */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services & Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6 leading-tight">
                御社の業務に、<br />
                <span className="text-accent">AIエージェント</span>を。
              </h1>
              <p className="text-warm text-xl leading-relaxed max-w-2xl mb-10">
                業務分析から設計・実装・運用まで。honkomaは御社専用のAIエージェントを設計し、実務を任せられるレベルまで仕上げます。
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center px-8 py-4 bg-accent text-white font-serif font-medium hover:bg-accent-hover transition-colors duration-300"
              >
                無料相談を申し込む
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. TRUST BAR ===== */}
      <section className="py-14 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { num: '20社以上', desc: '導入・商談実績' },
              { num: '最短2週間', desc: '初期版リリース' },
              { num: '初回無料', desc: '相談料' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-3xl md:text-4xl font-bold text-ink">{item.num}</div>
                <div className="font-mono text-xs text-warm mt-2 tracking-wide">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. SERVICE TABS ===== */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">サービス概要</h2>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="lg:ml-[25%] mb-12">
            <div className="flex overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 gap-0 border-b border-subtle">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-serif text-sm md:text-base whitespace-nowrap transition-all duration-300 border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-accent text-ink font-bold'
                      : 'border-transparent text-warm hover:text-ink'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:ml-[25%]" key={activeTab}>
            <div className="animate-fade-in">
              {/* One-liner */}
              <p className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8">
                {current.oneLiner}
              </p>

              {/* Problem / Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6 md:p-8">
                  <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-3">課題</h4>
                  <p className="text-ink leading-relaxed">{current.problem}</p>
                </div>
                <div className="bg-cream p-6 md:p-8">
                  <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-3">解決</h4>
                  <p className="text-ink leading-relaxed">{current.solution}</p>
                </div>
              </div>

              {/* Includes */}
              <div className="border-t border-subtle pt-8 mb-10">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">含まれるもの</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-ink text-cream p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-cream/50 mb-2">料金</h4>
                  <p className="font-serif text-xl md:text-2xl font-bold">{current.pricing}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center px-8 py-4 bg-accent text-white font-serif font-medium hover:bg-accent-hover transition-colors duration-300"
                >
                  {current.cta}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {current.extraLink && (
                  <Link
                    to={current.extraLink.to}
                    className="group inline-flex items-center px-8 py-4 border border-subtle text-ink font-serif font-medium hover:border-ink transition-colors duration-300"
                  >
                    {current.extraLink.label}
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. COMPARISON TABLE ===== */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Comparison</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">導入の比較</h2>
            </div>
          </div>

          <div className="lg:ml-[25%] overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="text-left font-mono text-xs tracking-wider uppercase p-4">項目</th>
                  <th className="text-center font-serif font-bold p-4 bg-accent text-white">honkoma</th>
                  <th className="text-center font-mono text-xs tracking-wider uppercase p-4">一般的なSaaS</th>
                  <th className="text-center font-mono text-xs tracking-wider uppercase p-4">コンサル会社</th>
                  <th className="text-center font-mono text-xs tracking-wider uppercase p-4">自社対応</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-subtle ${i % 2 === 0 ? 'bg-cream' : 'bg-accent-light/20'}`}>
                    <td className="p-4 font-serif font-bold text-ink">{row.label}</td>
                    <td className="p-4 text-center bg-accent-light/30">
                      <div className="flex flex-col items-center gap-1">
                        <ComparisonIcon type={row.honkoma.icon} />
                        <span className="text-xs text-ink font-medium">{row.honkoma.text}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <ComparisonIcon type={row.saas.icon} />
                        <span className="text-xs text-warm">{row.saas.text}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <ComparisonIcon type={row.consul.icon} />
                        <span className="text-xs text-warm">{row.consul.text}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <ComparisonIcon type={row.self.icon} />
                        <span className="text-xs text-warm">{row.self.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== 5. BEFORE → AFTER JOURNEY ===== */}
      <section className="py-24 md:py-32 bg-ink">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Journey</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream">Before → After</h2>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Step 1 */}
              <div className="relative p-8 border border-cream/10">
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40 mb-4">Step 1 — 導入前</div>
                <p className="font-serif text-lg text-cream leading-relaxed">
                  毎日の繰り返し業務に追われ、本来の仕事に集中できない
                </p>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-accent" />
                </div>
                <div className="flex md:hidden justify-center py-4">
                  <ArrowRight className="h-8 w-8 text-accent rotate-90" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative p-8 border border-accent/40 bg-accent/5">
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">Step 2 — honkoma導入</div>
                <p className="font-serif text-lg text-cream leading-relaxed">
                  AI秘書が実務を引き受け、御社のチームは判断と創造に集中
                </p>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-accent" />
                </div>
                <div className="flex md:hidden justify-center py-4">
                  <ArrowRight className="h-8 w-8 text-accent rotate-90" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 border border-cream/10">
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40 mb-4">Step 3 — 導入後</div>
                <p className="font-serif text-lg text-cream leading-relaxed">
                  月40時間の工数削減。売上に直結する業務に100%集中
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. ADDITIONAL PLANS ===== */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Additional Plans</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">追加プラン</h2>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle">
              {/* Advisory */}
              <div className="bg-cream p-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="font-serif text-2xl font-bold text-ink">顧問相談</h3>
                  <span className="font-serif text-xl text-accent font-bold">月15万円〜</span>
                </div>
                <p className="text-warm leading-relaxed mb-6">
                  AI活用の戦略相談・技術アドバイス。月2回のMTG+チャットサポート。
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center text-accent font-serif font-medium hover:text-accent-hover transition-colors"
                >
                  相談する
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Spot */}
              <div className="bg-cream p-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="font-serif text-2xl font-bold text-ink">スポット相談</h3>
                  <span className="font-serif text-xl text-accent font-bold">3.5〜5万円/時間</span>
                </div>
                <p className="text-warm leading-relaxed mb-6">
                  ピンポイントで相談したい方向け。時間単位でAI・自動化の専門家がお応えします。
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center text-accent font-serif font-medium hover:text-accent-hover transition-colors"
                >
                  相談する
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. FAQ ===== */}
      <section id="faq" className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">FAQ</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">よくあるご質問</h2>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            {[
              { q: 'AIの知識がない状態でも相談できますか？', a: 'もちろんです。専門知識は不要です。御社の業務課題をお聞きした上で、最適なソリューションをわかりやすくご提案いたします。' },
              { q: '小規模な企業でも依頼できますか？', a: 'はい。規模に関わらず対応しています。2名体制のクリニックから100名規模の企業まで実績があります。' },
              { q: 'どのプランが自社に合っているかわかりません。', a: '初回相談は無料ですので、まずはお気軽にご相談ください。御社の状況をお伺いした上で、最適なプランをご提案します。' },
              { q: '導入までどのくらいの期間がかかりますか？', a: 'AI秘書・スポット相談は最短2週間で稼働可能です。業務自動化支援は1〜2ヶ月が目安です。' },
              { q: 'AI秘書のAI利用料はどのくらいですか？', a: 'AI APIの使用量に応じた従量課金となります。利用規模にもよりますが、月数千円〜数万円程度が一般的です。毎月の利用状況をレポートでお知らせします。' },
            ].map((item, index) => (
              <div key={index} className="border-b border-subtle py-8">
                <h3 className="font-serif text-lg font-bold text-ink mb-3 flex items-start gap-4">
                  <span className="font-mono text-sm text-accent mt-0.5 flex-shrink-0">Q</span>
                  {item.q}
                </h3>
                <p className="text-warm leading-relaxed ml-8">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. BOTTOM CTA ===== */}
      <section className="py-32 bg-ink">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            まずは無料相談から。
          </h2>
          <p className="text-cream/50 text-lg mb-12 leading-relaxed">
            御社の課題に合わせて、最適なソリューションをご提案します。
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center px-10 py-5 border border-cream/20 text-cream text-lg font-serif font-medium hover:bg-cream hover:text-ink transition-all duration-500"
          >
            無料相談を申し込む
            <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="font-mono text-xs text-cream/30 mt-8 tracking-wide">
            初回相談は無料です。
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
