import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'honkoma | AI導入・業務自動化・開発支援';
  }, []);

  const services = [
    {
      num: '01',
      title: 'AI導入・業務自動化支援',
      description: '御社の業務フローを分析し、最適なAIソリューションを設計・実装。ルーティーンワークの自動化で生産性を向上させます。',
    },
    {
      num: '02',
      title: 'AIエージェント派遣',
      description: '御社の業務に特化したAIエージェントを開発・提供。人手不足の解消と業務効率化を同時に実現します。',
    },
    {
      num: '03',
      title: '顧問・スポット相談',
      description: 'AI活用の戦略立案から技術相談まで。月額顧問契約またはスポットでの時間単位相談に対応します。',
    },
  ];

  const useCases = [
    'データ入力・集計の自動化',
    'レポート・報告書の自動生成',
    '顧客対応のAIチャットボット構築',
    'コードレビュー・開発の効率化',
    'ドキュメント管理・検索の最適化',
    '社内ナレッジのAI活用',
  ];

  const productHighlights = [
    'Googleマップや各種媒体の口コミを週次で収集',
    'ポジティブ/ネガティブ傾向と頻出キーワードを整理',
    '競合比較・改善示唆・次アクションまでレポート化',
    'Mac miniや実行環境はhonkoma側で保有・運用',
  ];

  return (
    <div className="bg-cream">
      {/* ===== HERO ===== */}
      <section className="min-h-[90vh] flex items-center relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Left: Label */}
            <div className="lg:col-span-3 opacity-0 animate-fade-up">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                AI × Automation
              </span>
            </div>

            {/* Right: Main content */}
            <div className="lg:col-span-9">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tight text-ink mb-8 opacity-0 animate-fade-up-delay-1">
                AIエージェントを、<br />
                御社に<span className="text-accent">派遣</span>する。
              </h1>

              <p className="text-lg md:text-xl text-warm leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                口コミ分析、LINE返信補助、営業支援、AI秘書まで。<br className="hidden sm:block" />
                honkomaは御社専用のAIエージェントを設計し、実装・運用まで一気通貫で支援します。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-delay-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-ink text-cream text-base font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                >
                  AI導入・開発のご相談はこちら
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center px-8 py-4 border border-ink text-ink text-base font-medium tracking-wide hover:bg-ink hover:text-cream transition-all duration-300"
                >
                  サービス・料金
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-20 h-px bg-subtle w-0 animate-draw-line"></div>
        </div>
      </section>

      {/* ===== AGENT POSITIONING ===== */}
      <section className="py-24 border-t border-subtle bg-accent-light/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Why honkoma</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-ink mb-6">
                人を採る前に、AIエージェントを1人増やす。
              </h2>
              <p className="text-warm text-lg leading-relaxed max-w-3xl mb-10">
                honkomaが提供するのは、単なるツール導入ではありません。
                御社の業務を持ち、毎週のレポート作成・問い合わせ整理・顧客対応補助まで担う
                「実務を持つAIエージェント」を派遣するサービスです。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
                {[
                  { title: 'AI秘書', desc: 'メール下書き、日程調整、社内外の進行管理を補助。' },
                  { title: '口コミ分析エージェント', desc: 'レビュー収集から改善示唆まで週次でレポート化。' },
                  { title: '営業支援エージェント', desc: '商談ログ整理、提案補助、次アクションの提示まで対応。' },
                ].map((item, i) => (
                  <div key={i} className="bg-cream p-8">
                    <h3 className="font-serif text-2xl font-bold text-ink mb-3">{item.title}</h3>
                    <p className="text-warm text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink">
                AIエージェント派遣を軸に、<br />御社の実務を前に進める
              </h2>
              <p className="mt-6 text-warm text-lg max-w-xl">
                業務分析から導入・運用まで、ワンストップでサポート。<br />
                御社に必要なAIエージェントを設計し、実務に入るところまで伴走します。
              </p>
            </div>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {services.map((service) => (
              <Link
                to="/product"
                key={service.num}
                className="group bg-cream p-8 md:p-10 hover:bg-accent-light transition-colors duration-500"
              >
                <span className="font-mono text-sm text-warm">{service.num}</span>
                <h3 className="font-serif text-2xl font-bold text-ink mt-4 mb-4">
                  {service.title}
                </h3>
                <p className="text-warm text-sm leading-relaxed mb-8">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-xs font-mono tracking-wide text-accent group-hover:text-accent-hover transition-colors">
                  詳しく見る
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Use Cases</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink mt-4 mb-8">
                こんな業務、<br />
                自動化できます。
              </h2>
              <p className="text-warm text-lg leading-relaxed mb-10">
                「この作業、毎回手動でやるのか...」<br />
                そんな業務こそ、AIと自動化の出番です。
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center px-8 py-4 bg-ink text-cream text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300"
              >
                無料相談する
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="border-t border-subtle">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-5 border-b border-subtle group hover:pl-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-warm w-6">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-ink font-medium">{useCase}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-warm opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT LP ===== */}
      <section className="py-32 border-t border-subtle bg-accent-light/30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Agent Use Case</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink mt-4 mb-6">
                AIエージェント派遣の一例、<br />週次口コミインサイトレポート
              </h2>
              <p className="text-warm text-lg leading-relaxed mb-8">
                クライアントはURLや見たい観点を送るだけ。
                honkoma側で口コミを収集・整理し、毎週「経営判断に使えるレポート」として納品します。
                これはAIエージェント派遣の具体的な活用例のひとつです。
              </p>
              <div className="space-y-4 mb-10">
                {productHighlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                    <span className="text-ink text-sm md:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/product#review-report"
                className="group inline-flex items-center px-8 py-4 bg-ink text-cream text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300"
              >
                プロダクト詳細を見る
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle mb-8">
                <div className="bg-cream p-8 md:p-10">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">What you get</span>
                  <h3 className="font-serif text-2xl font-bold text-ink mt-4 mb-4">毎週納品される内容</h3>
                  <div className="space-y-3 text-warm text-sm leading-relaxed">
                    <p>・今週の新規口コミまとめ</p>
                    <p>・評価変動と頻出キーワード</p>
                    <p>・ポジ/ネガ傾向の要約</p>
                    <p>・競合比較と改善示唆</p>
                    <p>・優先して対応すべき口コミ</p>
                    <p>・次週のアクション提案</p>
                  </div>
                </div>
                <div className="bg-cream p-8 md:p-10">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">For teams like</span>
                  <h3 className="font-serif text-2xl font-bold text-ink mt-4 mb-4">相性のいい業種</h3>
                  <div className="space-y-3 text-warm text-sm leading-relaxed">
                    <p>・クリニック / 医療機関</p>
                    <p>・飲食 / 店舗ビジネス</p>
                    <p>・美容 / サロン</p>
                    <p>・スクール / コーチング</p>
                    <p>・人材 / 採用サービス</p>
                    <p>・高単価商材の営業組織</p>
                  </div>
                </div>
              </div>

              <div className="bg-ink text-cream p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                  <div className="md:col-span-2">
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Positioning</span>
                    <h3 className="font-serif text-3xl font-bold mt-3 mb-4">ただの集計ではなく、意思決定レポート。</h3>
                    <p className="text-cream/70 leading-relaxed">
                      口コミを一覧化するだけでなく、「今何が起きているか」「何を直すべきか」まで整理して返すことで、
                      現場改善・CS・営業施策にそのまま使える状態で納品します。
                    </p>
                  </div>
                  <div>
                    <div className="font-serif text-4xl font-bold">初期5万円 + 月1.5万円〜</div>
                    <p className="text-cream/50 text-sm mt-2">対象媒体数・競合比較・納品頻度で個別見積</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Case Studies</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink">
                導入事例
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {[
              {
                industry: '医療クリニック',
                project: 'LINE問い合わせ自動化',
                result: '月30名の新規患者獲得に貢献',
              },
              {
                industry: 'IT企業',
                project: '経費申請・請求書処理の自動化',
                result: '月40時間の工数削減',
              },
              {
                industry: 'コンサルティング会社',
                project: '提案書自動生成',
                result: '営業リードタイム50%短縮',
              },
            ].map((caseItem, i) => (
              <div key={i} className="bg-cream p-8 md:p-10">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">{caseItem.industry}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-4 mb-3">{caseItem.project}</h3>
                <p className="text-accent font-bold text-lg">{caseItem.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING HIGHLIGHT ===== */}
      <section className="py-24 bg-ink">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-cream">
                目的に合わせた<br />料金プラン
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {[
              { price: '月15万円〜', label: '顧問相談', desc: 'AI活用の戦略相談・技術アドバイス' },
              { price: '月30万円', label: 'スタンダード', desc: '初期セットアップ+継続的な保守運用' },
              { price: '3.5万円/時間', label: 'スポット', desc: '必要な時だけ、時間単位でご相談' },
            ].map((plan, i) => (
              <div key={i} className="text-center py-12 md:py-16">
                <div className="font-serif text-4xl md:text-5xl font-bold text-cream mb-2">
                  {plan.price}
                </div>
                <div className="font-mono text-xs tracking-widest uppercase text-cream/40 mt-3">{plan.label}</div>
                <p className="text-cream/50 text-sm mt-3">{plan.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
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

      {/* ===== PROCESS ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
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
            {[
              { step: '01', title: 'ヒアリング', desc: '現在の業務フロー・課題をお伺いし、自動化・AI導入の可能性を分析します。' },
              { step: '02', title: '提案', desc: '最適なソリューションと導入計画をご提案。費用対効果も明確にお伝えします。' },
              { step: '03', title: '実装', desc: 'アジャイルで開発・導入を進行。途中経過を共有しながら、御社に最適な形に仕上げます。' },
              { step: '04', title: '運用支援', desc: '導入後の運用サポート・改善提案を継続。チームへの研修も実施します。' },
            ].map((item) => (
              <div key={item.step} className="bg-cream p-8 md:p-10">
                <span className="font-mono text-4xl font-light text-subtle">{item.step}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-6 mb-3">{item.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">FAQ</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">よくあるご質問</h2>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            {[
              { q: 'どのような企業が対象ですか？', a: '業種問わず、繰り返し業務が多い企業様すべてが対象です。' },
              { q: '最初にどのくらいの費用がかかりますか？', a: 'まず無料相談でお話をお聞きします。導入プランは月額30万円〜でご提案しています。' },
              { q: '効果が出なかった場合は？', a: '成果報酬型プランもご用意しています。' },
              { q: '小規模な会社でも対応できますか？', a: '2名体制のクリニックから100名規模まで対応実績があります。' },
              { q: '導入までどのくらいかかりますか？', a: '最短2週間で初期版をリリースできます。' },
            ].map((item, index) => (
              <div key={index} className="border-b border-subtle py-8">
                <h3 className="font-serif text-lg font-bold text-ink mb-3 flex items-start gap-4">
                  <span className="font-mono text-sm text-accent mt-0.5">Q</span>
                  {item.q}
                </h3>
                <p className="text-warm leading-relaxed ml-8">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-32 bg-ink">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            まずは、お気軽に<br />ご相談ください。
          </h2>
          <p className="text-cream/50 text-lg mb-12 leading-relaxed">
            「何から始めたらいいかわからない」でも大丈夫。<br />
            御社の状況をお聞きした上で、最適なプランをご提案します。
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

export default HomePage;
