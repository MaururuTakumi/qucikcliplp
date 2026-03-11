import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    company: 'A社',
    role: '代表取締役様',
    industry: '医療クリニック（従業員5名）',
    summary: '問い合わせ対応の自動化で、受付業務の負担が大幅に軽減',
    qa: [
      {
        q: '導入前はどんな状況でしたか？',
        a: '受付スタッフが電話対応に追われて、本来の業務に集中できない状態でした。患者さんからの問い合わせは同じ内容が多いのに、毎回手作業で対応していて。スタッフの残業も増えていて、正直限界を感じていました。AIで何かできるとは聞いていましたが、具体的に何をどうすればいいのかまったく分からなかったですね。',
      },
      {
        q: '導入してどう変わりましたか？',
        a: 'LINE経由の問い合わせをAIエージェントが一次対応してくれるようになって、受付の電話が目に見えて減りました。予約の誘導まで自動でやってくれるので、スタッフは目の前の患者さんに集中できるようになったんです。月30件ほど新規の予約がLINE経由で入るようになり、売上面でも手応えがあります。',
      },
      {
        q: '一番よかったことは？',
        a: 'スタッフが「余裕ができた」と言ってくれたことですね。業務量が減っただけでなく、患者さんへの対応の質も上がったと感じています。あと、導入前に「難しそう」と思っていたのが嘘みたいに、honkomaさんが全部セットアップしてくれたので、こちらはほとんど手を動かさなくてよかったです。',
      },
      {
        q: 'honkomaをどんな会社に勧めたいですか？',
        a: '「AIに興味はあるけど、何から始めればいいか分からない」という会社には本当におすすめです。特にクリニックや店舗型のビジネスで、問い合わせ対応に時間を取られている会社にはぴったりだと思います。',
      },
    ],
  },
  {
    id: 2,
    company: 'B社',
    role: '経営企画部 部長様',
    industry: 'ITサービス（従業員50名）',
    summary: '経費処理の自動化で月40時間の工数を削減し、経理チームの働き方が変わった',
    qa: [
      {
        q: '導入前はどんな状況でしたか？',
        a: '経費精算と請求書処理がすべて手作業で、経理担当者が毎月末に深夜まで残っている状態でした。ミスも多くて、差し戻しのやり取りにも時間がかかっていました。「この作業、なんとか自動化できないか」とずっと思っていたんですが、社内にはITに詳しい人間がおらず、手つかずのままでした。',
      },
      {
        q: '導入してどう変わりましたか？',
        a: '経費の自動分類と請求書の読み取りをAIが処理してくれるようになり、月40時間ほどの工数が削減されました。月末の残業がほぼなくなって、経理チーム全体の雰囲気が変わりましたね。データの正確性も上がって、差し戻しも激減しました。',
      },
      {
        q: '一番よかったことは？',
        a: '経理チームが「この仕事、楽しくなった」と言い始めたことです。単純作業から解放されて、分析や改善提案など、もっと頭を使う仕事に時間を使えるようになったんです。会社全体の生産性にも好影響が出ていると感じます。',
      },
      {
        q: 'honkomaをどんな会社に勧めたいですか？',
        a: 'バックオフィス業務が属人化していて、「この人がいないと回らない」という状態になっている会社ですね。あとは、社内にエンジニアがいなくても、honkomaさんが全部やってくれるので、非IT企業にもおすすめです。',
      },
    ],
  },
  {
    id: 3,
    company: 'C社',
    role: '営業本部 本部長様',
    industry: 'コンサルティング（従業員20名）',
    summary: '提案書作成の自動化で営業リードタイムが半減、商談に集中できる体制に',
    qa: [
      {
        q: '導入前はどんな状況でしたか？',
        a: '商談後の提案書作成に毎回2〜3日かかっていました。営業メンバーが「提案書づくりに時間を取られて、新規の商談に行けない」と言っていて、機会損失が気になっていました。テンプレートは用意していたんですが、結局カスタマイズに時間がかかるんですよね。',
      },
      {
        q: '導入してどう変わりましたか？',
        a: '商談のログを入力すると、AIがテンプレートに合わせて提案書のドラフトを自動生成してくれるようになりました。あとは確認と微調整だけ。提案書の作成時間が半分以下になって、その分を新規商談や既存顧客のフォローに充てられるようになりました。',
      },
      {
        q: '一番よかったことは？',
        a: '営業チームの行動量が目に見えて増えたことです。提案書に追われなくなった分、商談件数が1.5倍になりました。あと意外だったのが、AIが生成するドラフトの品質がかなり高くて、若手メンバーの提案書の質が底上げされたことですね。',
      },
      {
        q: 'honkomaをどんな会社に勧めたいですか？',
        a: '営業組織を持っている会社全般ですね。特に、提案書や報告書の作成に時間がかかっていて、「もっと顧客と向き合う時間がほしい」と思っている会社にはドンピシャだと思います。',
      },
    ],
  },
];

const CaseStudiesPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '導入事例 | honkoma';
  }, []);

  return (
    <div className="bg-cream">
      {/* ===== HERO ===== */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                Case Studies
              </span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-ink mb-6">
                お客様の声
              </h1>
              <p className="text-warm text-lg leading-relaxed max-w-2xl">
                honkomaのAI秘書・業務自動化支援を導入いただいた企業様に、
                導入前後の変化をお伺いしました。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      {caseStudies.map((cs, index) => (
        <section
          key={cs.id}
          className={`py-20 md:py-28 ${index < caseStudies.length - 1 ? 'border-b border-subtle' : ''}`}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            {/* Company Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className="lg:col-span-3">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                  Case {String(cs.id).padStart(2, '0')}
                </span>
              </div>
              <div className="lg:col-span-9">
                <div className="border-b border-subtle pb-8">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                    {cs.company} {cs.role}
                  </h2>
                  <p className="font-mono text-sm text-warm">{cs.industry}</p>
                  <p className="text-accent font-bold text-lg mt-4">{cs.summary}</p>
                </div>
              </div>
            </div>

            {/* Q&A */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-3" />
              <div className="lg:col-span-9">
                {cs.qa.map((item, i) => (
                  <div
                    key={i}
                    className={`${i < cs.qa.length - 1 ? 'border-b border-subtle' : ''} py-8`}
                  >
                    <h3 className="flex items-start gap-4 mb-4">
                      <span className="font-mono text-sm text-accent mt-0.5 flex-shrink-0 font-bold">
                        Q{i + 1}
                      </span>
                      <span className="font-serif text-lg font-bold text-ink">
                        {item.q}
                      </span>
                    </h3>
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-sm text-warm mt-0.5 flex-shrink-0 font-bold">
                        A
                      </span>
                      <p className="text-warm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-24 bg-ink">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream mb-6">
            御社でも、同じ変化を。
          </h2>
          <p className="text-cream/50 text-lg mb-12 leading-relaxed">
            「何から始めればいいか分からない」でも大丈夫。<br />
            まずは御社の状況をお聞かせください。
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

export default CaseStudiesPage;
