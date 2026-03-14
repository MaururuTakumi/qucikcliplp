import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    company: '株式会社BuySell Technologies',
    logo: '/assets/clients/buysell-technologies.svg',
    badges: ['東証グロース上場', 'リユース事業', '従業員1,500名+', '導入3ヶ月'],
    metrics: [
      { value: '大幅削減', label: '人事労務工数' },
      { value: '向上', label: '経営層AI活用率' },
      { value: '構築', label: '全社AI基盤' },
    ],
    before:
      '人事労務部門の業務負荷が高く、定型作業に現場が逼迫。経営層のAI活用も進んでおらず、全社的なDX推進に課題を抱えていた。',
    action:
      '(1) 人事労務領域の定型業務をAIで自動化し、逼迫していた現場の負荷を軽減。\n(2) 社長・役員クラスへのClaude Codeハンズオン研修を実施。経営幹部が自らAIを活用する体制を構築し、全社的なAI活用の起点を作った。',
    result:
      '人事労務の定型作業工数を大幅に削減。経営幹部がClaude Codeを日常的に活用するようになり、「まず上が使う」文化が全社に波及。AI Readyな組織への進化を加速させた。',
    quote:
      'AIネイティブなhonkomaの皆さんのおかげで、まず経営幹部が率先してAIを活用する環境ができました。Claude Codeのハンズオン研修を通じて、役員自身が業務にAIを使いこなせるようになったのは大きな変化です。人事労務の自動化と合わせて、組織全体のAI活用が一気に加速しました。',
    role: '株式会社BuySell Technologies / 経営企画部門',
  },
  {
    id: 2,
    badges: ['医療法人', 'クリニック運営', '従業員10名規模', '導入3ヶ月'],
    metrics: [
      { value: '月40h', label: '受付対応工数削減' },
      { value: '30件/月', label: 'LINE経由の新規予約' },
      { value: '↑', label: 'スタッフ満足度' },
    ],
    before:
      '電話・問い合わせ対応で受付が逼迫。患者対応と事務作業を兼務するスタッフの残業が常態化し、本来の業務に集中できない状態だった。',
    action:
      'LINE経由のAI問い合わせ整理・返信補助を導入。口コミ分析による改善示唆レポートも週次で自動生成する仕組みを構築。',
    result:
      '受付対応工数を月40時間削減。LINE経由で月30件の新規予約が入るようになり、スタッフが患者対応に集中できる環境を実現。',
    quote:
      '受付の電話が目に見えて減りました。スタッフが「余裕ができた」と言ってくれたのが一番嬉しかったですね。導入前は難しそうだと思っていましたが、honkomaさんが全部セットアップしてくれたので、こちらはほとんど手を動かさなくてよかったです。',
    role: '代表取締役',
  },
  {
    id: 3,
    badges: ['ITサービス', '経営企画部', '従業員30名規模', '導入2ヶ月'],
    metrics: [
      { value: '月40h', label: '工数削減' },
      { value: '残業ほぼゼロ', label: '月末の経理チーム' },
      { value: '↑', label: '管理部門の生産性' },
    ],
    before:
      '経費精算・請求書処理がすべて手作業。経理担当者が毎月末に深夜残業し、差し戻しのやり取りにも時間がかかっていた。バックオフィス業務が属人化していた。',
    action:
      '経費の自動分類と請求書読み取りをAIで処理。レポート作成・定型業務の自動化パイプラインを構築し、管理部門の生産性を底上げ。',
    result:
      '月40時間の工数削減を実現。月末の残業がほぼゼロになり、経理チームが分析・改善提案など付加価値の高い業務にシフト。',
    quote:
      '経理チームが「この仕事、楽しくなった」と言い始めたんです。単純作業から解放されて、もっと頭を使う仕事に時間を使えるようになりました。社内にエンジニアがいなくても、honkomaさんが全部やってくれるので安心でした。',
    role: '経営企画部 部長',
  },
  {
    id: 4,
    badges: ['営業組織', 'コンサルティング', '従業員20名規模', '導入1ヶ月'],
    metrics: [
      { value: '50%短縮', label: '提案書作成時間' },
      { value: '1.5倍', label: '商談件数' },
      { value: '↑', label: '若手の提案品質' },
    ],
    before:
      '商談後の提案書作成に毎回2〜3日。営業メンバーが提案書づくりに時間を取られ、新規の商談に行けない状態。テンプレートはあったがカスタマイズに時間がかかっていた。',
    action:
      '商談ログを入力するとAIがテンプレートに合わせて提案書のドラフトを自動生成する仕組みを導入。商談ログ整理・提案補助をAIで支援。',
    result:
      '提案書作成時間を半減。営業チームの行動量が増え、商談件数が1.5倍に。AIドラフトの品質が高く、若手メンバーの提案書の質も底上げされた。',
    quote:
      '提案書に追われなくなった分、商談件数が1.5倍になりました。意外だったのはAIが生成するドラフトの品質がかなり高くて、若手の提案書の質まで上がったことですね。',
    role: '営業本部 本部長',
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
                導入事例
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
            {/* Section Eyebrow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
              <div className="lg:col-span-3">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                  Case {String(cs.id).padStart(2, '0')}
                </span>
              </div>
              <div className="lg:col-span-9">
                {/* Company Logo */}
                {'logo' in cs && cs.logo && (
                  <div className="mb-4">
                    <img src={cs.logo} alt={('company' in cs && cs.company) || ''} className="h-8 object-contain" />
                  </div>
                )}
                {/* Proof Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cs.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1 text-xs font-mono tracking-wide text-warm bg-ink/5 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Block */}
            <div className="lg:ml-[25%]">
              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-px bg-subtle mb-px">
                {cs.metrics.map((m, i) => (
                  <div key={i} className="bg-accent-light/30 px-6 py-5 text-center">
                    <div className="font-serif text-2xl md:text-3xl font-bold text-ink">
                      {m.value}
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-warm tracking-wide mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Before / Action / Result */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle mb-px">
                <div className="bg-cream p-6 md:p-8">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">
                    Before
                  </span>
                  <p className="text-warm text-sm leading-relaxed mt-3">{cs.before}</p>
                </div>
                <div className="bg-cream p-6 md:p-8">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent font-bold">
                    Action
                  </span>
                  <p className="text-warm text-sm leading-relaxed mt-3">{cs.action}</p>
                </div>
                <div className="bg-cream p-6 md:p-8">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-ink font-bold">
                    Result
                  </span>
                  <p className="text-ink text-sm leading-relaxed mt-3 font-medium">{cs.result}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-ink p-6 md:p-8">
                <p className="font-serif text-base md:text-lg text-cream leading-relaxed mb-4">
                  "{cs.quote}"
                </p>
                <p className="font-mono text-xs text-cream/40 tracking-wide">
                  --- {cs.role}
                </p>
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
