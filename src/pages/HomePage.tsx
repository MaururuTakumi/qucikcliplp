import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'honkoma | あなた専属のAI秘書、月5万円から';
  }, []);

  const services = [
    {
      num: '01',
      title: 'AI秘書派遣',
      description: '御社の業務に特化したAI秘書を設計・構築・運用。メール対応、口コミ分析、レポート生成、日程調整——月5万円から、あなた専属の秘書を。',
    },
    {
      num: '02',
      title: 'AI導入・業務自動化支援',
      description: '御社の業務フローを分析し、最適なAIソリューションを設計・実装。ルーティーンワークの自動化で生産性を向上させます。',
    },
    {
      num: '03',
      title: '顧問・スポット相談',
      description: 'AI活用の戦略立案から技術選定まで。月額顧問契約またはスポットでの時間単位相談に対応します。',
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

  return (
    <div className="bg-cream">
      {/* ===== HERO ===== */}
      <section className="min-h-[90vh] flex items-center relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-3 opacity-0 animate-fade-up">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                AI Agent Dispatch
              </span>
            </div>

            <div className="lg:col-span-9">
              <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tight text-ink mb-8 opacity-0 animate-fade-up-delay-1">
                AIエージェントを、<br />
                御社に<span className="text-accent">派遣</span>する。
              </h1>

              <p className="text-lg md:text-xl text-warm leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                口コミ分析、LINE返信補助、営業支援、AI秘書まで。<br className="hidden sm:block" />
                honkomaは御社専用のAIエージェントを設計し、<br className="hidden sm:block" />
                実装・運用まで一気通貫で支援します。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up-delay-3">
                <a
                  href="https://cal.com/takumi-honkoma-mljb0f/honkoma-meeting?overlayCalendar=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-ink text-cream text-base font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                >
                  まず無料で相談する
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center px-8 py-4 border border-ink text-ink text-base font-medium tracking-wide hover:bg-ink hover:text-cream transition-all duration-300"
                >
                  サービス・料金を見る
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 h-px bg-subtle w-0 animate-draw-line"></div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-t border-b border-subtle py-10 bg-cream">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-subtle text-center">
            {[
              { stat: '最短2週間', label: '初期版のリリース目安' },
              { stat: '初回相談無料', label: '内容・規模問わず対応' },
              { stat: '実務を持つ設計', label: '単なるツール提案ではなく、運用まで伴走' },
            ].map((item, i) => (
              <div key={i} className="py-6 md:py-0 md:px-8">
                <div className="font-serif text-2xl font-bold text-ink mb-1">{item.stat}</div>
                <div className="font-mono text-xs text-warm tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POSITIONING ===== */}
      <section className="py-28 border-b border-subtle">
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
                  <div key={i} className="bg-cream p-8">
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
      <section className="py-28 border-b border-subtle">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {services.map((service) => (
              <Link
                to="/product"
                key={service.num}
                className="group bg-cream p-8 md:p-10 hover:bg-accent-light transition-colors duration-500"
              >
                <span className="font-mono text-sm text-warm">{service.num}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-4 mb-3">
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

      {/* ===== FEATURED USE CASE ===== */}
      <section className="py-28 border-b border-subtle bg-accent-light/20">
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
                <div className="bg-cream p-8">
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
                <div className="bg-cream p-8">
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
              <div className="bg-ink text-cream p-8 mt-px">
                <h3 className="font-serif text-xl font-bold mb-3">
                  ただの集計ではなく、意思決定レポート。
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed mb-4">
                  口コミを一覧化するだけでなく、「今何が起きているか」「何を直すべきか」まで整理して返す。
                  現場改善・CS・営業施策にそのまま使える形で納品します。
                </p>
                <div className="font-serif text-2xl font-bold">初期5万円 + 月1.5万円〜</div>
                <p className="text-cream/40 text-xs mt-1 font-mono">対象媒体数・競合比較・納品頻度で個別見積</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-28 border-b border-subtle">
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
              <div key={item.step} className="bg-cream p-8 md:p-10">
                <span className="font-mono text-4xl font-light text-subtle">{item.step}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-6 mb-3">{item.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="py-28 border-b border-subtle">
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
                company: 'A社 代表取締役様',
                industry: '医療クリニック',
                quote: '受付の電話が目に見えて減りました。スタッフが「余裕ができた」と言ってくれたのが一番嬉しかったですね。',
              },
              {
                company: 'B社 経営企画部 部長様',
                industry: 'ITサービス',
                quote: '月40時間の工数削減。経理チームが「この仕事、楽しくなった」と言い始めたんです。',
              },
              {
                company: 'C社 営業本部 本部長様',
                industry: 'コンサルティング',
                quote: '提案書作成が半分以下の時間に。営業チームの商談件数が1.5倍になりました。',
              },
            ].map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-10">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">{item.industry}</span>
                <p className="font-serif text-lg text-ink mt-4 mb-4 leading-relaxed">
                  "{item.quote}"
                </p>
                <p className="text-warm text-sm font-medium">--- {item.company}</p>
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
      <section className="py-24 bg-ink">
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
              { price: '月15万円〜', label: '顧問相談', desc: 'AI活用の戦略相談・技術アドバイス' },
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
      <section className="py-28 border-b border-subtle">
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
              { q: '最初にどのくらいの費用がかかりますか？', a: '初回相談は無料です。AI秘書は初期15万円+月額5万円〜、スタンダードプランは月額30万円〜でご提案しています。' },
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
      <section className="py-32 bg-ink">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            まずは、お気軽に<br />ご相談ください。
          </h2>
          <p className="text-cream/50 text-lg mb-12 leading-relaxed">
            「何から始めたらいいかわからない」でも大丈夫。<br />
            御社の状況をお聞きした上で、最適なプランをご提案します。
          </p>
          <a
            href="https://cal.com/takumi-honkoma-mljb0f/honkoma-meeting?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center px-10 py-5 border border-cream/20 text-cream text-lg font-serif font-medium hover:bg-cream hover:text-ink transition-all duration-500"
          >
            無料相談を申し込む
            <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="font-mono text-xs text-cream/30 mt-8 tracking-wide">
            初回相談は無料です。
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
