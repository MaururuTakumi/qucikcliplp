import React, { useState } from 'react';
import {
  ArrowRight, Star, CheckCircle, AlertCircle, Send, Search, Bot, Bell,
  TrendingUp, Mail, Shield, BarChart3, Zap, Eye, Lightbulb, Clock,
} from 'lucide-react';

const ReviewAIPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    document.title = '口コミAIエージェント | honkoma';
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

  const achievements = [
    {
      metric: '8,000件以上',
      description: 'Booking.com・Googleマップ・TripAdvisorなど複数サイトから口コミを自動収集',
    },
    {
      metric: '6施設分',
      description: '口コミデータをAIが自動分析し、QSCA評価レポートを毎週配信',
    },
    {
      metric: '平均2分',
      description: 'ネガティブ口コミの検知から返信下書き生成まで完了',
    },
    {
      metric: '毎日30分 → 週1回',
      description: '導入前: 毎日30分以上の口コミチェック → 導入後: 週1回のレポート確認のみ',
    },
  ];

  const saasItems = [
    '自分でダッシュボードを見に行く（Pull型）',
    '分析結果を自分で読み解く',
    '返信文を自分で考えて書く',
    '投稿を自分で作成する',
    '判断と実行はすべて人間',
  ];

  const agentItems = [
    '必要な情報だけ届く（Push型）',
    'AIが根本原因まで特定して提案',
    '返信下書きが自動で届く（承認するだけ）',
    '投稿もAIが自動生成',
    '人間は「承認ボタン」を押すだけ',
  ];

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: '口コミ自動収集',
      description: 'Booking.com, Google, TripAdvisor, Agoda, 一休, じゃらんから24時間自動監視。新着口コミを見逃しません。',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'AI分析レポート',
      description: 'QSCA（品質・接客・清潔さ・雰囲気）を自動判定。週次/月次でLINE・Slackに配信します。',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'ネガティブアラート',
      description: '低評価口コミを即検知→原因分析→改善提案まで自動で通知。初動の遅れを防ぎます。',
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: '返信下書き自動生成',
      description: '過去の高評価返信パターンを学習。トーンも施設に合わせてパーソナライズ。承認するだけ。',
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: '競合モニタリング',
      description: 'エリア内の競合施設の口コミを自動追跡。「競合が朝食を改善した」等の変化を先回りで通知。',
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: '商品企画の示唆',
      description: '「"ワーケーション"関連口コミが3倍に。新プラン検討の余地あり」等、事業提案まで。',
    },
  ];

  const comparisonRows = [
    {
      label: '月額費用',
      honkoma: '5万円',
      compA: '推定10〜30万円',
      compB: '推定5〜20万円',
      manual: '0円(人件費別)',
      bold: false,
    },
    {
      label: '初期費用',
      honkoma: '15万円',
      compA: '要問合せ(推定20〜50万円)',
      compB: '要問合せ',
      manual: '0円',
      bold: false,
    },
    {
      label: '年間コスト目安',
      honkoma: '75万円',
      compA: '推定150〜400万円',
      compB: '推定80〜300万円',
      manual: '人件費年200万円〜',
      bold: true,
    },
    {
      label: '導入形態',
      honkoma: 'AIエージェント型(全自動)',
      compA: 'SaaSツール(自分で操作)',
      compB: 'SaaSツール(自分で操作)',
      manual: '手動',
      bold: false,
    },
    {
      label: '口コミ収集',
      honkoma: '全自動(24時間)',
      compA: '自動(API連携)',
      compB: '自動(API連携)',
      manual: '手動',
      bold: false,
    },
    {
      label: '分析',
      honkoma: 'AIが判断+提案まで',
      compA: 'ダッシュボード(読み解きは人間)',
      compB: 'ダッシュボード(読み解きは人間)',
      manual: '×',
      bold: false,
    },
    {
      label: '返信',
      honkoma: 'AI下書き自動生成',
      compA: 'テンプレート提供',
      compB: 'テンプレート提供',
      manual: '手動',
      bold: false,
    },
    {
      label: '競合分析',
      honkoma: '自動(変化を先回りで通知)',
      compA: 'エンタープライズプランのみ',
      compB: 'オプション',
      manual: '×',
      bold: false,
    },
    {
      label: 'レポート',
      honkoma: 'Push型(LINE/Slackに届く)',
      compA: 'Pull型(ログインして閲覧)',
      compB: 'Pull型(ログインして閲覧)',
      manual: '×',
      bold: false,
    },
    {
      label: '多言語',
      honkoma: '自動翻訳分析',
      compA: 'オプション',
      compB: '非対応',
      manual: '×',
      bold: false,
    },
    {
      label: '人的工数',
      honkoma: '承認ボタンのみ',
      compA: 'ダッシュボード操作+判断',
      compB: 'ダッシュボード操作+判断',
      manual: '全て手動',
      bold: false,
    },
  ];

  const setupIncludes = [
    'AIエージェントのパーソナライズ設定',
    '対象サイトの初期データ収集',
    '返信トーンの調整・学習',
    '競合施設の設定',
  ];

  const monthlyIncludes = [
    '口コミ自動収集（対象サイト全て）',
    'AI分析レポート（週次/月次）',
    '返信下書き自動生成',
    'ネガティブアラート',
    '競合モニタリング',
    'LINE/Slack/メール配信',
  ];

  return (
    <div className="bg-cream">
      {/* ===== 1. HERO ===== */}
      <section className="min-h-[90vh] flex items-center relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-3 opacity-0 animate-fade-up">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                Review AI Agent
              </span>
            </div>

            <div className="lg:col-span-9">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.1] tracking-tight text-ink mb-8 opacity-0 animate-fade-up-delay-1">
                口コミ対応、<br />
                もうあなたが<br className="sm:hidden" />
                やる必要は<span className="text-accent">ありません。</span>
              </h1>

              <p className="text-lg md:text-xl text-warm leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                AIエージェントが24時間365日、口コミの収集・分析・返信下書き・レポート作成をすべて自動で行います。あなたは"承認ボタン"を押すだけ。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-delay-3">
                <a
                  href="#free-diagnosis"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-ink text-cream text-base font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                >
                  まずは無料で診断する
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 h-px bg-subtle w-0 animate-draw-line"></div>
        </div>
      </section>

      {/* ===== 2. 導入実績 ===== */}
      <section className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Track Record</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                すでに導入済みの宿泊施設での実績
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle lg:ml-[25%]">
            {achievements.map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-10">
                <div className="font-serif text-3xl md:text-4xl font-bold text-accent mb-4">
                  {item.metric}
                </div>
                <p className="text-warm text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. SaaSとの違い ===== */}
      <section className="py-28 border-b border-subtle bg-accent-light/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Difference</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                SaaSツールは"道具を渡す"。<br />
                honkomaは<span className="text-accent">"全部やる"</span>。
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle lg:ml-[25%]">
            {/* 左: SaaS */}
            <div className="bg-cream p-8 md:p-10">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-4 w-4 text-warm" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                  従来のSaaSツール
                </span>
              </div>
              <ul className="space-y-4">
                {saasItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-warm/40 rounded-full flex-shrink-0 mt-2"></span>
                    <span className="text-warm text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 右: honkoma */}
            <div className="bg-accent-light p-8 md:p-10 border-l-2 border-accent">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                  honkoma口コミAIエージェント
                </span>
              </div>
              <ul className="space-y-4">
                {agentItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0 mt-2"></span>
                    <span className="text-ink text-sm leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. AIがやってくれること（6カード） ===== */}
      <section className="py-28 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Features</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">
                具体的にAIがやってくれること
              </h2>
              <p className="mt-4 text-warm text-lg leading-relaxed">
                あなたは承認ボタンを押すだけ。残りはすべてAIエージェントが実行します。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-subtle lg:ml-[25%]">
            {features.map((feature, i) => (
              <div key={i} className="bg-cream p-8 md:p-10">
                <span className="text-accent mb-4 block">{feature.icon}</span>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. 他社比較表 ===== */}
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
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-4 px-4 text-left font-mono text-xs tracking-[0.2em] uppercase text-warm w-[14%]">
                    項目
                  </th>
                  <th className="py-4 px-4 text-left w-[22%] bg-accent-light border-x border-accent/20">
                    <div className="font-serif text-lg font-bold text-accent">honkoma口コミAI</div>
                    <div className="font-mono text-xs text-warm">AIエージェント型</div>
                  </th>
                  <th className="py-4 px-4 text-left w-[22%]">
                    <div className="font-serif text-base font-bold text-ink">口コミ管理SaaS A社</div>
                    <div className="font-mono text-xs text-warm">SaaSツール</div>
                  </th>
                  <th className="py-4 px-4 text-left w-[22%]">
                    <div className="font-serif text-base font-bold text-ink">口コミ管理SaaS B社</div>
                    <div className="font-mono text-xs text-warm">SaaSツール</div>
                  </th>
                  <th className="py-4 px-4 text-left w-[20%]">
                    <div className="font-serif text-base font-bold text-ink">手動運用</div>
                    <div className="font-mono text-xs text-warm">自社対応</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-subtle ${row.bold ? 'bg-cream' : ''}`}>
                    <td className={`py-4 px-4 font-mono text-xs tracking-wide text-warm ${row.bold ? 'font-bold text-ink' : ''}`}>
                      {row.label}
                    </td>
                    <td className={`py-4 px-4 text-sm bg-accent-light border-x border-accent/20 ${row.bold ? 'font-serif font-bold text-accent text-lg' : 'text-ink font-medium'}`}>
                      {row.honkoma}
                    </td>
                    <td className={`py-4 px-4 text-sm ${row.bold ? 'font-bold text-ink' : 'text-warm'}`}>
                      {row.compA}
                    </td>
                    <td className={`py-4 px-4 text-sm ${row.bold ? 'font-bold text-ink' : 'text-warm'}`}>
                      {row.compB}
                    </td>
                    <td className={`py-4 px-4 text-sm ${row.bold ? 'font-bold text-ink' : 'text-warm'}`}>
                      {row.manual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 font-mono text-xs text-warm">
            ※他社料金は公開情報および見積もり実績に基づく推定値です
          </p>
        </div>
      </section>

      {/* ===== 6. 月次レポートサンプル ===== */}
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
                      { label: 'S (接客)', score: '8.2', trend: '→', color: 'text-cream/50' },
                      { label: 'C (清潔さ)', score: '7.9', trend: '▼', color: 'text-red-400' },
                      { label: 'A (雰囲気)', score: '8.8', trend: '▲', color: 'text-accent' },
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

      {/* ===== 7. 料金 ===== */}
      <section className="py-28 bg-ink">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-cream">
                料金
              </h2>
              <p className="mt-4 text-cream/50 text-lg leading-relaxed">
                シンプルに、これだけ。
              </p>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            <div className="border border-cream/10">
              {/* 初期セットアップ */}
              <div className="p-8 md:p-12 border-b border-cream/10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Initial Setup</span>
                    <h3 className="font-serif text-2xl font-bold text-cream mt-2">初期セットアップ</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-4xl md:text-5xl font-bold text-cream">
                      15<span className="text-2xl">万円</span>
                    </div>
                    <span className="font-mono text-xs text-cream/40">税別</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {setupIncludes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-cream/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 月額 */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Monthly</span>
                    <h3 className="font-serif text-2xl font-bold text-cream mt-2">月額</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-4xl md:text-5xl font-bold text-accent">
                      5<span className="text-2xl">万円</span>
                    </div>
                    <span className="font-mono text-xs text-cream/40">税別・使い放題</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {monthlyIncludes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-cream/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border border-accent/30 bg-accent-light/5 p-6">
              <p className="text-sm text-cream/70 leading-relaxed">
                <Shield className="h-4 w-4 text-accent inline mr-2 -mt-0.5" />
                他社で見積もりを取ると、同等の機能で<span className="text-cream font-bold">月15〜30万円</span>。honkomaは<span className="text-accent font-bold">月5万円</span>で全部やります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. 無料診断CTA ===== */}
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
                    'QSCA分析（品質・接客・清潔さ・雰囲気）',
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
