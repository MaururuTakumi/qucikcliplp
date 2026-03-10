import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProductPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'サービス・料金 | honkoma';
  }, []);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Services & Pricing</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6">サービス・料金</h1>
              <p className="text-warm text-xl leading-relaxed max-w-2xl">
                御社の課題や規模に合わせて、最適なプランをお選びいただけます。<br />
                すべてのプランで初回相談は無料です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan 1: Standard */}
      <section id="standard" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">01</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  スタンダードプラン
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">月30万円</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                初期セットアップから継続的な保守運用まで、ワンストップで対応。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                御社の業務フローを分析し、AI導入・業務自動化の設計から実装までを一括サポート。
                導入後も継続的な保守・改善を行い、効果を最大化します。
                中小企業のDX推進に最適なプランです。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">初期セットアップ</h4>
                  <p className="text-warm text-sm leading-relaxed">業務分析・要件定義からAIソリューションの設計・実装まで。御社の環境に合わせて構築します。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">継続的な保守運用</h4>
                  <p className="text-warm text-sm leading-relaxed">導入後の運用サポート・改善提案・トラブル対応。安定稼働を継続的にサポートします。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">含まれるサービス</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['業務フロー分析', 'AI導入設計・実装', '自動化スクリプト開発', '導入後の保守運用', '月次レポート', 'チャット・メールサポート'].map((item, i) => (
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

      {/* Plan 2: Enterprise */}
      <section id="enterprise" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">02</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  エンタープライズ
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">月100〜200万円</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                大規模なAI導入・業務改革を、専任チームが伴走。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                全社的なAI導入や複数部門にまたがる業務自動化など、大規模プロジェクトに対応。
                専任チームが御社に深く入り込み、戦略策定から実装・運用まで一気通貫でサポートします。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">専任チームによる伴走</h4>
                  <p className="text-warm text-sm leading-relaxed">御社専属のプロジェクトチームを編成。深い業務理解に基づいた最適なソリューションを提供。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">全社規模の導入支援</h4>
                  <p className="text-warm text-sm leading-relaxed">複数部門へのAI導入、全社的な業務改革、社員向け研修まで包括的に対応。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">含まれるサービス</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['全社AI戦略策定', '複数部門の業務分析', 'カスタムAI開発', '社員向け研修', '専任PM配置', '優先サポート'].map((item, i) => (
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

      {/* Plan 3: Advisory */}
      <section id="advisory" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">03</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  顧問相談
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">月15万円</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                AI活用の戦略パートナーとして、継続的にアドバイス。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                AI導入の方向性に迷っている、社内にAIの専門家がいない。
                そんな企業に、月額顧問契約でAI活用の戦略立案・技術アドバイスを継続的に提供します。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">定期ミーティング</h4>
                  <p className="text-warm text-sm leading-relaxed">月次の定期ミーティングで、AI活用の進捗確認・新たな施策の提案を行います。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">随時相談対応</h4>
                  <p className="text-warm text-sm leading-relaxed">チャット・メールでいつでもAIに関する相談が可能。技術選定や導入判断をサポート。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">含まれるサービス</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['AI活用戦略の立案', '技術選定アドバイス', '月次定期ミーティング', 'チャット・メール相談', '業界トレンド情報提供', 'ツール選定サポート'].map((item, i) => (
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

      {/* Plan 4: Spot */}
      <section id="spot" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">04</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  スポット相談
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">3.5万円/時間</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                必要な時だけ、ピンポイントで専門家に相談。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                月額契約は不要だが、特定の課題についてプロに相談したい。
                そんなニーズに、時間単位でAI・自動化の専門家がお応えします。
              </p>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">こんな時にご利用ください</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['AI導入の可否判断', '技術的な課題の相談', 'ツール選定の相談', 'プロジェクト計画のレビュー', 'セキュリティ相談', '社内勉強会の講師'].map((item, i) => (
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

      {/* Plan 5: AI Agent */}
      <section id="ai-agent" className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">05</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  AIエージェント派遣
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">初期15万円+月5万円+AI利用料</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                御社専用のAIエージェントを開発・運用。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-2xl">
                御社の業務に特化したAIエージェントを開発し、継続的に運用します。
                カスタマーサポート、データ処理、ドキュメント作成など、
                様々な業務をAIエージェントが代行。人手不足の解消と業務効率化を実現します。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">初期開発</h4>
                  <p className="text-warm text-sm leading-relaxed">御社の業務に合わせたAIエージェントの設計・開発。初期費用15万円。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">月額運用</h4>
                  <p className="text-warm text-sm leading-relaxed">AIエージェントの保守・改善・運用サポート。月額5万円。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">AI利用料</h4>
                  <p className="text-warm text-sm leading-relaxed">AI APIの実際の使用量に応じた従量課金。利用状況を毎月レポート。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">AIエージェントの活用例</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['カスタマーサポート', 'データ入力・処理', 'ドキュメント自動作成', '社内FAQ対応', 'メール自動対応', 'レポート自動生成'].map((item, i) => (
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

      {/* Plan 6: Weekly Review Report */}
      <section id="review-report" className="py-32 border-b border-subtle bg-accent-light/30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-5xl font-light text-subtle">06</span>
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
                  週次口コミインサイトレポート
                </h2>
                <span className="font-serif text-2xl text-accent font-bold">月5万円〜</span>
              </div>
              <p className="font-serif text-xl text-accent mb-6">
                口コミを集めるだけで終わらせず、改善示唆まで毎週納品。
              </p>
              <p className="text-warm leading-relaxed text-lg mb-10 max-w-3xl">
                Googleマップや各種レビュー媒体、SNS上の顧客の声をhonkoma側で収集・整理し、
                毎週「経営判断に使えるレポート」として納品するサービスです。
                クライアント側でMac miniや自動化環境を持つ必要はなく、URLや見たい観点を共有いただければ運用可能です。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-subtle mb-10">
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">データ収集</h4>
                  <p className="text-warm text-sm leading-relaxed">口コミ媒体・競合・指定キーワードを継続ウォッチ。収集基盤はhonkoma側で保有します。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">週次レポート</h4>
                  <p className="text-warm text-sm leading-relaxed">新規口コミ、ポジ/ネガ傾向、頻出トピック、競合比較、次アクションを整理して納品します。</p>
                </div>
                <div className="bg-cream p-6">
                  <h4 className="font-serif font-bold text-ink mb-2">改善示唆</h4>
                  <p className="text-warm text-sm leading-relaxed">CS・店舗運営・営業導線の改善提案まで含め、単なる集計ではなく意思決定材料として使えます。</p>
                </div>
              </div>

              <div className="border-t border-subtle pt-8 mb-10">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">毎週の納品イメージ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    '今週の新規口コミまとめ',
                    '評価変動と頻出キーワード',
                    'ポジティブ/ネガティブ傾向',
                    '競合比較',
                    '優先対応が必要な口コミ',
                    '次週アクション提案',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                      <span className="text-sm text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-subtle pt-8">
                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-5">向いている企業</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['クリニック', '飲食店', '美容サロン', 'スクール', '人材会社', '店舗型サービス'].map((item, i) => (
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
              { q: 'どのプランが自社に合っているかわかりません。', a: '初回相談は無料ですので、まずはお気軽にご相談ください。御社の状況をお伺いした上で、最適なプランをご提案します。' },
              { q: '導入までどのくらいの期間がかかりますか？', a: 'スポット相談は即日対応可能です。スタンダードプランは1〜2週間、エンタープライズは1〜3ヶ月が目安です。' },
              { q: 'AIエージェント派遣のAI利用料はどのくらいですか？', a: 'AI APIの使用量に応じた従量課金となります。利用規模にもよりますが、月数千円〜数万円程度が一般的です。毎月の利用状況をレポートでお知らせします。' },
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
            御社の課題に合わせて、最適なプランをご提案します。
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
