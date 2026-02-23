import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Honkoma | AI導入・業務自動化・開発支援';
  }, []);

  const services = [
    {
      num: '01',
      title: 'ルーティーンワーク自動化',
      description: '日々の繰り返し業務をRPA・スクリプト・AIで自動化。人がやるべき仕事に集中できる環境を構築します。',
    },
    {
      num: '02',
      title: 'AI導入支援',
      description: '御社の業務フローを分析し、最適なAIソリューションを設計・実装。導入後の運用支援まで一気通貫でサポート。',
    },
    {
      num: '03',
      title: 'AIツール導入支援',
      description: 'Claude Code、OpenClawなど最新AIツールの選定から導入・活用研修まで。チーム全体の生産性を飛躍的に向上。',
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
                AIと自動化で、<br />
                ビジネスを<span className="text-accent">加速</span>。
              </h1>

              <p className="text-lg md:text-xl text-warm leading-relaxed max-w-2xl mb-12 opacity-0 animate-fade-up-delay-2">
                ルーティーンワークの自動化、AI導入支援、<br className="hidden sm:block" />
                Claude CodeやOpenClawなど最新AIツールの導入支援。<br className="hidden sm:block" />
                御社のDX推進を、構想から実装まで伴走します。
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
                  サービス詳細
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-20 h-px bg-subtle w-0 animate-draw-line"></div>
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
                3つの柱で、<br />御社のDXを推進
              </h2>
              <p className="mt-6 text-warm text-lg max-w-xl">
                業務分析から導入・運用まで、ワンストップでサポート。<br />
                御社に最適なAI活用戦略をご提案します。
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

      {/* ===== STATS ===== */}
      <section className="py-24 bg-ink">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {[
              { value: '80%', sub: '最大', label: '業務時間削減' },
              { value: '98%', sub: '', label: '導入後の満足度' },
              { value: '全業種', sub: '', label: '対応可能業種' },
            ].map((stat, i) => (
              <div key={i} className="text-center py-12 md:py-16">
                <div className="font-serif text-5xl md:text-6xl font-bold text-cream mb-2">
                  {stat.sub && <span className="text-lg font-mono font-normal text-cream/40 mr-1">{stat.sub}</span>}
                  {stat.value}
                </div>
                <div className="font-mono text-xs tracking-widest uppercase text-cream/40 mt-3">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI TOOLS ===== */}
      <section className="py-32 border-t border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Tools</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-ink">
                最新AIツールを、<br />御社の武器に。
              </h2>
              <p className="mt-6 text-warm text-lg max-w-xl">
                Claude Code、OpenClawをはじめ、急速に進化するAIツール。
                選定・導入・活用研修まで、御社のチームに合わせてサポートします。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-subtle">
            {/* Claude Code */}
            <div className="bg-ink p-10 md:p-14">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">AI Coding Tool</span>
              <h3 className="font-serif text-3xl font-bold text-cream mt-4 mb-5">Claude Code</h3>
              <p className="text-cream/50 leading-relaxed mb-8">
                Anthropic社のAIコーディングツール。コードの自動生成・レビュー・デバッグをAIがサポートし、開発速度を劇的に向上。
              </p>
              <ul className="space-y-3 font-mono text-sm text-cream/60">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  コード生成・リファクタリング
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  自然言語での開発指示
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  既存コードベースの理解・修正
                </li>
              </ul>
            </div>

            {/* OpenClaw */}
            <div className="bg-ink p-10 md:p-14">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">AI Automation Tool</span>
              <h3 className="font-serif text-3xl font-bold text-cream mt-4 mb-5">OpenClaw</h3>
              <p className="text-cream/50 leading-relaxed mb-8">
                業務プロセスをAIで自動化するツール。ノーコードで複雑なワークフローを構築し、チーム全体の生産性を向上。
              </p>
              <ul className="space-y-3 font-mono text-sm text-cream/60">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  ワークフロー自動化
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  AIエージェントの構築
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                  既存ツールとの連携
                </li>
              </ul>
            </div>
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
