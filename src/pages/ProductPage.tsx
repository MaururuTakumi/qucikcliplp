import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const ProductPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'サービス紹介 | Honkoma';
  }, []);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6">サービス紹介</h1>
              <p className="text-warm text-xl leading-relaxed max-w-2xl">
                業務自動化からAI導入、最新ツールの活用支援まで。<br />
                御社のビジネスを加速する3つのサービスをご提供します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service 1 */}
      <section id="automation" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">01</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                ルーティーンワーク自動化
              </h2>
              <p className="font-serif text-xl text-accent mb-6">
                繰り返し業務を撲滅。人がやるべき仕事に集中できる環境を。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                データ入力、レポート作成、メール対応、ファイル管理...。
                毎日繰り返される定型業務をRPA・スクリプト・AIで自動化。
                人件費削減だけでなく、ミスの排除・処理速度の向上を同時に実現します。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">作業時間を大幅削減</h4>
                  <p className="text-warm text-sm leading-relaxed">手動で数時間かかっていた作業を数分に短縮。空いた時間を本来の業務に活用。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">ヒューマンエラーを排除</h4>
                  <p className="text-warm text-sm leading-relaxed">自動化によりミスを根絶。データの正確性と業務品質を保証します。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">自動化できる業務例</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['データ入力・集計', 'レポート自動生成', 'メール自動振り分け', 'ファイル整理・管理', '請求書処理', 'スケジュール管理'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2 */}
      <section id="ai-consulting" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">02</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                AI導入支援
              </h2>
              <p className="font-serif text-xl text-accent mb-6">
                御社に最適なAI活用を、構想から実装まで伴走。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                「AIを導入したいが何から始めればいいかわからない」。
                そんな企業の声に応え、業務分析からAIソリューションの設計・実装、
                導入後の運用支援まで一気通貫でサポートします。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">業務分析・要件定義</h4>
                  <p className="text-warm text-sm leading-relaxed">現行の業務フローを徹底分析し、AI導入による効果が最大化するポイントを特定。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">導入後の運用支援</h4>
                  <p className="text-warm text-sm leading-relaxed">導入して終わりではなく、定着化・改善提案・チーム研修まで継続的にサポート。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">AI導入の活用領域</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['カスタマーサポート', 'ドキュメント処理', 'データ分析・予測', 'コンテンツ生成', '社内ナレッジ検索', '品質管理・検査'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 3 */}
      <section id="ai-tools" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">03</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                AIツール導入支援
              </h2>
              <p className="font-serif text-xl text-accent mb-6">
                最先端AIツールを、御社のチームの武器に。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                Claude Code、OpenClawをはじめ、急速に進化するAIツール。
                御社の業務に最適なツールの選定から導入、チーム全体への活用研修まで、
                包括的にサポートします。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink mb-10">
                <div className="bg-ink p-8">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">AI Coding</span>
                  <h4 className="font-serif text-xl font-bold text-cream mt-3 mb-2">Claude Code</h4>
                  <p className="text-cream/50 text-sm leading-relaxed">AIによるコード生成・レビュー・デバッグ。開発チームの生産性を劇的に向上。</p>
                </div>
                <div className="bg-ink p-8 border-l border-cream/10">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream/40">AI Automation</span>
                  <h4 className="font-serif text-xl font-bold text-cream mt-3 mb-2">OpenClaw</h4>
                  <p className="text-cream/50 text-sm leading-relaxed">業務ワークフローのAI自動化。ノーコードで複雑なプロセスを構築。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">サポート内容</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['ツール選定コンサルティング', '導入設計・セットアップ', 'チーム向け研修', '活用ワークショップ', 'カスタム設定・連携開発', '継続的な活用改善'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 border-b border-subtle">
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
              { q: 'AIの知識がない状態でも相談できますか？', a: 'もちろんです。専門知識は不要です。御社の業務課題をお聞かせいただければ、最適なソリューションをわかりやすくご提案いたします。' },
              { q: '小規模な企業でも依頼できますか？', a: 'はい。規模に関わらず対応しています。小規模だからこそ効果を実感しやすい自動化施策も多くあります。' },
              { q: '費用感を教えてください。', a: '案件の規模や内容によって異なります。まずは無料相談で御社の状況をお聞かせいただき、最適なプランと概算費用をご提示します。' },
              { q: '導入までどのくらいの期間がかかりますか？', a: '小規模な自動化であれば1〜2週間、AI導入を伴うプロジェクトは1〜3ヶ月が目安です。ヒアリング時に詳細なスケジュールをご提示します。' },
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

      {/* CTA */}
      <section className="py-32 bg-ink">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            まずは無料相談から。
          </h2>
          <p className="text-cream/50 text-lg mb-12">
            御社の課題に合わせて、最適なAI活用プランをご提案します。
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center px-10 py-5 border border-cream/20 text-cream text-lg font-serif font-medium hover:bg-cream hover:text-ink transition-all duration-500"
          >
            無料相談を申し込む
            <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
