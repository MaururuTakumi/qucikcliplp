import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Bot, Zap, Users } from 'lucide-react';

function useScrollReveal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const { ref, isVisible } = useScrollReveal();
  React.useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      start = start || timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'honkoma | あなた専属のAI秘書、月5万円から';
  }, []);

  const services = [
    {
      num: '01',
      title: 'AI秘書派遣',
      description: '御社の業務に特化したAI秘書を設計・構築・運用。メール対応、口コミ分析、レポート生成、日程調整——月5万円から、あなた専属の秘書を。',
      gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
      Icon: Bot,
    },
    {
      num: '02',
      title: 'AI導入・業務自動化支援',
      description: '御社の業務フローを分析し、最適なAIソリューションを設計・実装。ルーティーンワークの自動化で生産性を向上させます。',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
      Icon: Zap,
    },
    {
      num: '03',
      title: 'AI顧問',
      description: 'AIの進化が速すぎてついていけない——そんな企業に、毎日AIを経営に活用しているプロが伴走。週次MTGで一緒に手を動かし、社内にAI人材を育てます。',
      gradient: 'bg-gradient-to-br from-purple-600 to-indigo-800',
      Icon: Users,
    },
  ];

  const agentExamples = [
    { title: 'AI秘書', desc: 'メール下書き、日程調整、社内外の進行管理を補助。' },
    { title: '口コミ分析エージェント', desc: 'レビュー収集から改善示唆まで週次でレポート化。' },
    { title: '営業支援エージェント', desc: '商談ログ整理、提案補助、次アクションの提示まで対応。' },
  ];

  const processSteps = [
    { step: '01', title: 'ヒアリング', desc: '現在の業務フロー・課題をお伺いし、自動化・AI導入の可能性を分析します。' },
    { step: '02', title: '提案', desc: '最適なソリューションと導入計画をご提案。費用対効果も明確にお伝えします。' },
    { step: '03', title: '実装', desc: 'アジャイルで開発・導入を進行。途中経過を共有しながら御社仕様に仕上げます。' },
    { step: '04', title: '運用支援', desc: '導入後の運用サポート・改善提案を継続。チームへの研修も実施します。' },
  ];

  const trustedByReveal = useScrollReveal();
  const trustBarReveal = useScrollReveal();
  const positioningReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const useCaseReveal = useScrollReveal();
  const processReveal = useScrollReveal();
  const caseStudiesReveal = useScrollReveal();
  const pricingReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const bottomCtaReveal = useScrollReveal();

  const serviceCardReveals = [useScrollReveal(), useScrollReveal(), useScrollReveal()];

  const scrollClass = (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div className="bg-cream">
      {/* ===== HERO ===== */}
      <section
        className="min-h-[90vh] flex items-center relative"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-3 opacity-0 animate-fade-up">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/60">
                AI Agent Dispatch
              </span>
            </div>

            <div className="lg:col-span-9">
              <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-up-delay-1">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-300 text-xs font-mono tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"></span>
                  上場企業含む 20社以上 への導入支援実績
                </span>
              </div>

              <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tight text-cream mb-8 opacity-0 animate-fade-up-delay-1">
                AIエージェントを、<br />
                御社に<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">派遣する。</span>
              </h1>

              <p className="text-lg md:text-xl text-cream/70 leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                口コミ分析、LINE返信補助、営業支援、AI秘書まで。<br className="hidden sm:block" />
                honkomaは御社専用のAIエージェントを設計し、<br className="hidden sm:block" />
                実装・運用まで一気通貫で支援します。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-delay-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-white text-base font-medium tracking-wide hover:bg-accent-hover transition-colors duration-300"
                >
                  まず無料で相談する
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center px-8 py-4 border border-cream/30 text-cream text-base font-medium tracking-wide hover:bg-cream/10 transition-all duration-300"
                >
                  サービス・料金を見る
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 h-px bg-cream/20 w-0 animate-draw-line"></div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <div
        ref={trustedByReveal.ref}
        className={`bg-cream py-8 border-b border-subtle ${scrollClass(trustedByReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center justify-center">
            <span className="font-mono text-xs text-warm tracking-widest uppercase">Trusted by</span>
            <div className="flex gap-12 items-center justify-center">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/clients/buysell-technologies.svg"
                  alt="BuySell Technologies"
                  className="h-6 opacity-60 hover:opacity-100 transition-opacity"
                />
                <span className="font-mono text-xs text-warm tracking-wide">東証グロース上場企業が採用</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TRUST BAR ===== */}
      <div
        ref={trustBarReveal.ref}
        className={`border-b border-subtle py-10 bg-cream ${scrollClass(trustBarReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-subtle text-center">
            {[
              { stat: '20社以上', label: '上場企業含む導入支援実績' },
              { stat: '最短2週間', label: '初期版のリリース目安' },
              { stat: '初回相談無料', label: '内容・規模問わず対応' },
            ].map((item, i) => (
              <div key={i} className="py-6 md:py-0 md:px-8">
                <div className="font-serif text-2xl font-bold text-ink mb-1">{item.stat}</div>
                <div className="font-mono text-xs text-warm tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== POSITIONING ===== */}
      <section
        ref={positioningReveal.ref}
        className={`py-28 border-b border-subtle ${scrollClass(positioningReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">What we do</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink mb-6">
                人を採る前に、<br />AIエージェントを1人増やす。
              </h2>
              <p className="text-warm text-lg leading-relaxed max-w-3xl mb-12">
                honkomaが提供するのは、単なるツール導入ではありません。
                御社の業務を把握し、週次レポート作成・問い合わせ整理・顧客対応補助まで担う
                「実務を持つAIエージェント」を設計・派遣するサービスです。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
                {agentExamples.map((item, i) => (
                  <div key={i} className="bg-cream p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-serif text-xl font-bold text-ink mb-3">{item.title}</h3>
                    <p className="text-warm text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section
        ref={servicesReveal.ref}
        className={`py-28 border-b border-subtle ${scrollClass(servicesReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink">
                AI秘書が、<br />御社の実務を回す
              </h2>
              <p className="mt-5 text-warm text-lg max-w-xl leading-relaxed">
                業務分析から導入・運用まで、ワンストップでサポート。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <div
                key={service.num}
                ref={serviceCardReveals[i].ref}
                className={`transition-all duration-700 ease-out ${serviceCardReveals[i].isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <Link
                  to="/product"
                  className={`group relative block overflow-hidden rounded-2xl ${service.gradient} p-8 md:p-10 min-h-[220px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* 右上の大きなあしらいアイコン */}
                  <div className="absolute -top-4 -right-4 opacity-10">
                    <service.Icon className="h-32 w-32 text-white" />
                  </div>

                  {/* コンテンツ */}
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <service.Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-mono text-sm text-white/50">{service.num}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center text-xs font-mono tracking-wide text-white/60 group-hover:text-white transition-colors">
                      詳しく見る
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED USE CASE ===== */}
      <section
        ref={useCaseReveal.ref}
        className={`py-28 border-b border-subtle bg-accent-light/20 ${scrollClass(useCaseReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Agent in Action</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink mt-4 mb-5">
                AI秘書の活用例：<br />週次口コミインサイトレポート
              </h2>
              <p className="text-warm text-base leading-relaxed mb-8">
                URLや見たい観点を送るだけ。
                honkoma側で口コミを収集・分析し、毎週「経営判断に使えるレポート」として納品します。
                これはAI秘書の代表的なユースケースのひとつです。
              </p>
              <Link
                to="/product#review-report"
                className="group inline-flex items-center px-7 py-3.5 bg-ink text-cream text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300"
              >
                詳細・料金を見る
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle">
                <div className="bg-cream p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">毎週の納品内容</span>
                  <ul className="mt-5 space-y-2.5 text-sm text-warm leading-relaxed">
                    {[
                      '今週の新規口コミまとめ',
                      '評価変動と頻出キーワード',
                      'ポジ/ネガ傾向の要約',
                      '競合比較と改善示唆',
                      '優先して対応すべき口コミ',
                      '次週のアクション提案',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">相性のいい業種</span>
                  <ul className="mt-5 space-y-2.5 text-sm text-warm leading-relaxed">
                    {[
                      'クリニック / 医療機関',
                      '飲食 / 店舗ビジネス',
                      '美容 / サロン',
                      'スクール / コーチング',
                      '人材 / 採用サービス',
                      '高単価商材の営業組織',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-ink text-cream p-8 mt-px hover:shadow-xl transition-all duration-300">
                <h3 className="font-serif text-xl font-bold mb-3">
                  ただの集計ではなく、意思決定レポート。
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed mb-4">
                  口コミを一覧化するだけでなく、「今何が起きているか」「何を直すべきか」まで整理して返す。
                  現場改善・CS・営業施策にそのまま使える形で納品します。
                </p>
                <div className="font-serif text-2xl font-bold">初期15万円 + 月3万円〜</div>
                <p className="text-cream/40 text-xs mt-1 font-mono">対象媒体数・競合比較・納品頻度で個別見積</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section
        ref={processReveal.ref}
        className={`py-28 border-b border-subtle ${scrollClass(processReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Process</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink">
                導入の流れ
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-subtle">
            {processSteps.map((item) => (
              <div key={item.step} className="bg-cream p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="text-5xl font-serif text-accent">{item.step}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-6 mb-3">{item.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section
        ref={caseStudiesReveal.ref}
        className={`py-28 border-b border-subtle ${scrollClass(caseStudiesReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Case Studies</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink mb-5">
                お客様の声
              </h2>
              <p className="text-warm text-lg leading-relaxed">
                AI秘書・業務自動化を導入いただいた企業様の声をご紹介します。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {[
              {
                industry: 'リユース・リサイクル事業',
                metric: '上場企業',
                badge: '工数大幅削減',
                quote: 'AIネイティブなhonkomaの皆さんのハンズオン研修のおかげで、経営幹部が率先してAIを活用する環境ができました。組織全体のAI活用が一気に加速しています。',
                role: '株式会社BuySell Technologies / 経営企画部門',
              },
              {
                industry: '医療クリニック',
                metric: '月40h削減',
                badge: '従業員10名規模',
                quote: '受付の電話が目に見えて減り、スタッフが患者対応に集中できるようになりました。',
                role: '代表取締役',
              },
              {
                industry: 'ITサービス',
                metric: '経理工数半減',
                badge: '従業員30名規模',
                quote: '月末の残業がほぼゼロに。経理チームが改善提案に時間を使えるようになりました。',
                role: '経営企画部 部長',
              },
            ].map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold tracking-wide text-accent bg-accent-light/40 rounded-full">
                    {item.metric}
                  </span>
                  <span className="inline-block px-2.5 py-1 text-xs font-mono tracking-wide text-warm bg-ink/5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">{item.industry}</span>
                <p className="font-serif text-lg text-ink mt-3 mb-4 leading-relaxed">
                  "{item.quote}"
                </p>
                <p className="text-warm text-sm font-medium">--- {item.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/case-studies"
              className="group inline-flex items-center px-8 py-4 border border-ink text-ink text-base font-medium tracking-wide hover:bg-ink hover:text-cream transition-all duration-300"
            >
              導入事例をもっと見る
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRICING HIGHLIGHT ===== */}
      <section
        ref={pricingReveal.ref}
        className={`py-24 bg-ink ${scrollClass(pricingReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-cream">
                目的に合わせた<br />料金プラン
              </h2>
              <p className="mt-5 text-cream/50 text-lg leading-relaxed">
                すべてのプランで初回相談は無料です。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream/10">
            {[
              { price: '月5万円〜', label: 'AI秘書派遣', desc: 'あなた専属のAI秘書を設計・構築・運用' },
              { price: '月30万円', label: 'スタンダード', desc: '初期セットアップ+継続的な保守運用' },
              { price: '月15万円', label: 'AI顧問', desc: '週次MTG・ロードマップ策定・社内AI人材育成' },
            ].map((plan, i) => (
              <div key={i} className="text-center py-12 md:py-16 px-8">
                <div className="font-serif text-4xl md:text-5xl font-bold text-cream mb-2">
                  {plan.price}
                </div>
                <div className="font-mono text-xs tracking-widest uppercase text-cream/40 mt-3">{plan.label}</div>
                <p className="text-cream/50 text-sm mt-3 leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/product"
              className="group inline-flex items-center px-8 py-4 border border-cream/20 text-cream text-sm font-medium tracking-wide hover:bg-cream hover:text-ink transition-all duration-500"
            >
              料金プラン詳細を見る
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section
        ref={faqReveal.ref}
        className={`py-28 border-b border-subtle ${scrollClass(faqReveal.isVisible)}`}
      >
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
              { q: 'どのような企業が対象ですか？', a: '業種・規模を問わず、繰り返し業務が多い企業様が対象です。2名体制のクリニックから100名規模の企業まで対応実績があります。' },
              { q: '最初にどのくらいの費用がかかりますか？', a: '初回相談は無料です。AI秘書は初期15万円+月額3万円〜、AI顧問は月額15万円、スタンダードプランは月額30万円〜でご提案しています。' },
              { q: 'AIの知識がない状態でも相談できますか？', a: 'もちろんです。御社の業務課題をお聞きした上で、最適なソリューションをわかりやすくご提案します。専門知識は一切不要です。' },
              { q: '導入までどのくらいかかりますか？', a: '最短2週間で初期版をリリースできます。スタンダードプランは1〜2ヶ月が目安です。' },
              { q: '効果が出なかった場合は？', a: '成果報酬型プランもご用意しています。まずご相談ください。' },
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

      {/* ===== BOTTOM CTA ===== */}
      <section
        ref={bottomCtaReveal.ref}
        className={`py-32 bg-ink ${scrollClass(bottomCtaReveal.isVisible)}`}
      >
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            まずは、お気軽に<br />ご相談ください。
          </h2>
          <p className="text-cream/50 text-lg mb-10 leading-relaxed">
            「何から始めたらいいかわからない」でも大丈夫。<br />
            御社の状況をお聞きした上で、最適なプランをご提案します。
          </p>

          <span className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-mono mb-6">
            今月の無料相談枠: 残りわずか
          </span>

          <div>
            <Link
              to="/contact"
              className="group inline-flex items-center px-10 py-5 border border-cream/20 text-cream text-lg font-serif font-medium hover:bg-cream hover:text-ink transition-all duration-500"
            >
              無料相談を申し込む
              <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="font-mono text-xs text-cream/30 mt-6 tracking-wide">
            平均相談→導入: 2週間
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
