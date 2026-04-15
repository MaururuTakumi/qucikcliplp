import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Bot, Zap, Users, Layers3, UserX, Workflow, Sparkles, CheckCircle2 } from 'lucide-react';

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
      title: 'AI秘書派遣',
      description: '御社の業務に特化したAI秘書を設計・構築・運用。メール対応、口コミ分析、レポート生成、日程調整——月5万円から、あなた専属の秘書を。',
      borderColor: 'border-l-blue-500',
      badgeBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverColor: 'group-hover:text-blue-600',
      Icon: Bot,
    },
    {
      title: 'AI導入・業務自動化支援',
      description: '御社の業務フローを分析し、最適なAIソリューションを設計・実装。ルーティーンワークの自動化で生産性を向上させます。',
      borderColor: 'border-l-orange-500',
      badgeBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      hoverColor: 'group-hover:text-orange-600',
      Icon: Zap,
    },
    {
      title: 'AI顧問',
      description: 'AIの進化が速すぎてついていけない——そんな企業に、毎日AIを経営に活用しているプロが伴走。週次MTGで一緒に手を動かし、社内にAI人材を育てます。',
      borderColor: 'border-l-violet-500',
      badgeBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      hoverColor: 'group-hover:text-violet-600',
      Icon: Users,
    },
  ];

  const agentExamples = [
    { title: 'AI秘書', desc: 'メール下書き、日程調整、社内外の進行管理を補助。' },
    { title: '口コミ分析エージェント', desc: 'レビュー収集から改善示唆まで週次でレポート化。' },
    { title: '営業支援エージェント', desc: '商談ログ整理、提案補助、次アクションの提示まで対応。' },
  ];

  const processSteps = [
    { step: '01', title: '要件定義', desc: '「どこから着手すべきか」から対話を開始。業務棚卸しと優先順位づけを一緒に行います。' },
    { step: '02', title: '伴走設計', desc: 'キックオフから並走し、現場フローに合わせてAIエージェントの役割と運用導線を固めます。' },
    { step: '03', title: '構築・実装', desc: '御社専用のエージェントを実装。APIがない手作業や画面操作を含めて自動化対象を広げます。' },
    { step: '04', title: '自走化支援', desc: '導入して終わりではなく、社内にAI導入リーダーと運用ナレッジが残る状態まで支援します。' },
  ];

  const aaasPillars = [
    {
      title: 'SaaSを足す時代から、Agentを働かせる時代へ',
      desc: 'SaaSを増やすほど運用は複雑になります。これからは、AIエージェントが業務そのものを引き受ける AaaS の設計が競争力になります。',
    },
    {
      title: 'ツール導入ではなく、実務を持つ戦力を実装する',
      desc: 'honkomaがつくるのはダッシュボードではなく、問い合わせ整理、レポート作成、顧客対応補助まで担う実務レイヤーのAIです。',
    },
  ];

  const transformationCards = [
    {
      title: 'コストとツールの集約',
      before: ['SaaSごとに個別契約', '業務ごとに情報が分散', '固定費がじわじわ膨らむ'],
      after: ['Claude / AIエージェント中心に統合', '運用導線が一本化される', '少ない構成で回る状態へ'],
      Icon: Layers3,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: '採用難の解消',
      before: ['採りたい職種ほど採れない', '採用しても属人化しやすい', '教育コストが重い'],
      after: ['AIが定型業務を先に担う', '人は判断と接客に集中', '採用負担と教育負担を圧縮'],
      Icon: UserX,
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      title: '手作業の自動化',
      before: ['APIがないと手が出せない', '転記やコピペが残る', '画面確認の手作業が多い'],
      after: ['AIエージェントが画面操作まで代行', 'アナログ業務も自動化対象に', '現場の重い雑務が消える'],
      Icon: Workflow,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  const trustedByReveal = useScrollReveal();
  const trustBarReveal = useScrollReveal();
  const positioningReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const aaasReveal = useScrollReveal();
  const transformationReveal = useScrollReveal();
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
                key={service.title}
                ref={serviceCardReveals[i].ref}
                className={`transition-all duration-700 ease-out ${serviceCardReveals[i].isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <Link
                  to="/product"
                  className={`group relative block overflow-hidden rounded-xl bg-white border border-gray-200 border-l-4 ${service.borderColor} p-8 min-h-[220px] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
                >
                  {/* 右上の大きなあしらいアイコン */}
                  <div className="absolute -top-4 -right-4 opacity-[0.05]">
                    <service.Icon className={`w-28 h-28 ${service.iconColor}`} />
                  </div>

                  {/* コンテンツ */}
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className={`w-11 h-11 rounded-xl ${service.badgeBg} flex items-center justify-center mb-6`}>
                      <service.Icon className={`h-5 w-5 ${service.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-ink mb-3">
                        {service.title}
                      </h3>
                      <p className="text-warm text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>
                    <span className={`inline-flex items-center text-xs font-mono tracking-wide text-warm ${service.hoverColor} transition-colors`}>
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

      {/* ===== AaaS POSITIONING ===== */}
      <section
        ref={aaasReveal.ref}
        className={`py-28 border-b border-subtle bg-ink ${scrollClass(aaasReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Positioning</span>
            </div>
            <div className="lg:col-span-9">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-accent text-xs font-mono tracking-wide mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                New category
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-cream mb-6">
                <span className="text-cream/45 line-through">SaaS is dead.</span><br />
                これからは <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">Agent as a Service</span> の時代へ。
              </h2>
              <p className="text-cream/65 text-lg leading-relaxed max-w-3xl mb-10">
                ツールを増やして現場に覚えてもらう時代から、AIエージェントが実務そのものを持つ時代へ。
                honkomaは、SaaSを追加導入するのではなく、御社専用のAI戦力を実装する AaaS パートナーです。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream/10">
                {aaasPillars.map((item, i) => (
                  <div key={i} className="bg-ink p-8 md:p-10 hover:bg-cream/[0.03] transition-colors duration-300">
                    <h3 className="font-serif text-2xl font-bold text-cream mb-4">{item.title}</h3>
                    <p className="text-cream/60 leading-relaxed text-sm md:text-base">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BEFORE / AFTER ===== */}
      <section
        ref={transformationReveal.ref}
        className={`py-28 border-b border-subtle bg-accent-light/10 ${scrollClass(transformationReveal.isVisible)}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Before / After</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink mb-5">
                導入前と導入後で、<br />仕事の景色はここまで変わります。
              </h2>
              <p className="text-warm text-lg leading-relaxed max-w-3xl">
                AIを入れるだけではなく、コスト構造、採用戦略、現場の業務導線そのものを再設計する。
                それがAaaSとしてのhonkomaの役割です。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {transformationCards.map((card, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-subtle bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-8 border-b border-subtle">
                  <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-5`}>
                    <card.Icon className={`h-6 w-6 ${card.accent}`} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink">{card.title}</h3>
                </div>
                <div className="grid grid-cols-1 divide-y divide-subtle">
                  <div className="p-8 bg-stone-50/80">
                    <div className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-4">Before</div>
                    <ul className="space-y-3 text-sm text-warm leading-relaxed">
                      {card.before.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-warm/40 mt-2.5 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 bg-white">
                    <div className="flex items-center gap-2 text-accent mb-4">
                      <ArrowRight className="h-4 w-4" />
                      <span className="font-mono text-xs tracking-[0.2em] uppercase">After</span>
                    </div>
                    <ul className="space-y-3 text-sm text-ink leading-relaxed">
                      {card.after.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink mb-5">
                伴走しながら、社内に残る形で進めます。
              </h2>
              <p className="text-warm text-lg leading-relaxed max-w-3xl">
                「どこから始めればいいかわからない」企業ほど相性がいい進め方です。導入して終わりではなく、御社がAIを使いこなせる状態まで一緒に持っていきます。
              </p>
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
