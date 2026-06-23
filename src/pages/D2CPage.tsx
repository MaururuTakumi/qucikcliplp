import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  LineChart,
  MailCheck,
  MessageSquareText,
  PackageCheck,
  Repeat2,
  ShoppingCart,
  Sparkles,
  Target,
} from 'lucide-react';

const supportAreas = [
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    title: 'EC / LP改善',
    body: '商品ページ、LP、フォーム導線、購入前FAQを見直し、CVR改善につながる仮説を素早く検証します。',
  },
  {
    icon: <MessageSquareText className="h-5 w-5" />,
    title: 'LINE・メールCRM',
    body: '初回購入後のステップ配信、離脱フォロー、休眠掘り起こしまで、顧客接点をAIで運用しやすくします。',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: '広告・SNSクリエイティブ',
    body: '訴求軸、UGC風構成、記事LP、ショート動画台本など、量産と改善サイクルを設計します。',
  },
  {
    icon: <PackageCheck className="h-5 w-5" />,
    title: '受注・CS・バックオフィス',
    body: '問い合わせ返信、レビュー分析、在庫・出荷まわりの確認など、運用負荷の高い定型業務を整理します。',
  },
];

const d2cProblems = [
  '広告費が上がり、勝ち訴求を見つけるまでの検証コストが重い',
  'LINE・メール・CRM施策が属人化し、改善が止まりやすい',
  '問い合わせ・レビュー対応に時間を取られ、商品改善に集中できない',
  'データはあるのに、次に何を変えるべきかの意思決定が遅い',
];

const workflow = [
  ['01', '現状診断', 'LP・EC導線・広告訴求・CRM・CSの現状を棚卸しし、改善インパクトが大きい順に並べます。'],
  ['02', 'AI運用設計', '問い合わせ対応、レビュー分析、訴求案作成、CRM配信案など、AIに任せる業務を具体化します。'],
  ['03', '実装・検証', '小さく実装し、CVR・購入率・LTV・対応工数などの数字を見ながら改善します。'],
  ['04', '自走化', '社内メンバーがAIを使って改善を回せるように、プロンプト・運用手順・チェック観点を残します。'],
];

const proofCards = [
  { value: '多数', label: 'D2C事業者の支援実績', note: 'ブランド立ち上げから運用改善まで対応' },
  { value: 'LP / CRM / CS', label: '売上導線を横断', note: '部分最適ではなく購入前後をまとめて改善' },
  { value: 'AI実装まで', label: '提案で終わらない', note: '現場で使う仕組みとして落とし込み' },
];

const useCases = [
  {
    title: '購入前の不安を減らす',
    body: '商品ページ、FAQ、チャット導線、レビュー訴求を整理し、購入前に迷う理由を潰します。',
  },
  {
    title: '既存顧客のLTVを伸ばす',
    body: '購入履歴や問い合わせ内容に合わせて、LINE・メールの配信テーマとタイミングを設計します。',
  },
  {
    title: '改善ネタを毎週出す',
    body: 'レビュー、広告コメント、問い合わせをAIで整理し、商品改善・LP改善・訴求改善の材料にします。',
  },
];

function ContactButton({ children = 'D2C支援を相談する', inverted = false }: { children?: string; inverted?: boolean }) {
  return (
    <Link
      to="/contact"
      className={`group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-colors duration-300 ${
        inverted
          ? 'border border-cream/20 text-cream hover:bg-cream hover:text-ink'
          : 'bg-ink text-cream hover:bg-ink/80'
      }`}
    >
      {children}
      <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const D2CPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'D2C事業者向けAI導入・運用改善支援 | honkoma';

    const description =
      'honkomaはD2C事業者の支援を多数行っています。LP改善、CRM、広告・SNSクリエイティブ、CS自動化まで、AIを活用して売上導線と運用を改善します。';
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    setMeta('description', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://ltdhonkoma.com/d2c');
  }, []);

  return (
    <div className="bg-cream text-ink">
      <section className="relative overflow-hidden border-b border-subtle bg-[#FFF7ED]">
        <div className="absolute right-0 top-0 hidden h-full w-[34%] bg-[#FFE8C7] lg:block" />
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:px-8 lg:py-28">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">
              AI Growth Partner for D2C
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              D2C事業者の
              <span className="block text-[#D97706]">売上導線と運用を</span>
              <span className="block">AIで伸ばす。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              honkomaはD2C事業者の支援を多数行っています。LP改善、CRM、広告・SNSクリエイティブ、
              問い合わせ対応、レビュー分析まで、売上に近い業務をAIで回る状態に整えます。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ContactButton />
              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center border border-[#D97706] px-8 py-4 text-sm font-semibold tracking-wide text-[#B45309] transition-colors duration-300 hover:bg-white"
              >
                導入事例を見る
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[#F3C47B] bg-white p-5 shadow-[0_24px_60px_rgba(217,119,6,0.12)]">
              <div className="border border-[#F8D9A8] bg-[#FFFBF4] p-6">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#D97706]">
                  WEEKLY GROWTH BOARD
                </p>
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink">
                  今週見るべき改善テーマを、AIが整理。
                </h2>
                <div className="mt-6 space-y-3 text-sm text-muted">
                  {[
                    ['LP', 'ファーストビューの訴求を3案テスト'],
                    ['CRM', '2回目購入前のLINE配信を改善'],
                    ['CS', '問い合わせ上位5件をFAQへ反映'],
                  ].map(([label, text]) => (
                    <div key={label} className="flex items-start gap-3 rounded-sm bg-white p-3">
                      <span className="mt-0.5 inline-flex h-7 w-10 items-center justify-center bg-[#FFF0D8] font-mono text-[11px] font-bold text-[#D97706]">
                        {label}
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-px bg-subtle px-6 lg:grid-cols-3 lg:px-8">
          {proofCards.map((card) => (
            <div key={card.label} className="bg-cream px-6 py-8 text-center md:py-10">
              <div className="font-serif text-3xl font-bold text-ink md:text-4xl">{card.value}</div>
              <div className="mt-2 font-mono text-xs tracking-[0.18em] text-warm">{card.label}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{card.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">Problems</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl font-bold leading-tight text-ink md:text-5xl">
                D2Cの伸び悩みは、<br />売上導線のどこかで起きている。
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-px bg-subtle md:grid-cols-2">
                {d2cProblems.map((problem) => (
                  <div key={problem} className="bg-cream p-6 md:p-8">
                    <CheckCircle2 className="mb-4 h-5 w-5 text-[#D97706]" />
                    <p className="text-sm leading-relaxed text-muted md:text-base">{problem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-subtle bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">Support Area</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl font-bold leading-tight text-ink md:text-5xl">
                LP・CRM・広告・CSまで、<br />一気通貫で支援。
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-px bg-subtle md:grid-cols-2">
                {supportAreas.map((area) => (
                  <div key={area.title} className="bg-white p-7 md:p-8">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center bg-[#FFF0D8] text-[#D97706]">
                      {area.icon}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink">{area.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{area.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">Use Cases</span>
            </div>
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {useCases.map((item, index) => (
                  <div key={item.title} className="border border-subtle bg-cream p-6">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center bg-ink text-cream">
                      {[<Target className="h-5 w-5" />, <Repeat2 className="h-5 w-5" />, <BarChart3 className="h-5 w-5" />][index]}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-subtle bg-[#FFF7ED] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">Workflow</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl font-bold leading-tight text-ink md:text-5xl">
                まずは小さく、数字に近いところから。
              </h2>
              <div className="mt-10 space-y-px bg-subtle">
                {workflow.map(([step, title, body]) => (
                  <div key={step} className="grid grid-cols-1 bg-[#FFF7ED] p-6 md:grid-cols-[96px_1fr] md:p-8">
                    <div className="font-mono text-sm font-bold text-[#D97706]">{step}</div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24">
        <div className="mx-auto max-w-[820px] px-6 text-center lg:px-8">
          <p className="font-mono text-xs tracking-[0.22em] text-cream/40">D2C Growth Support</p>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-cream md:text-5xl">
            売上改善と運用改善を、同時に進める。
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cream/55 md:text-lg">
            「LPを直したい」「LINEを改善したい」「CSを軽くしたい」など、入口は何でも大丈夫です。
            現状を聞いた上で、最短で効果が出やすい打ち手から一緒に進めます。
          </p>
          <div className="mt-10">
            <ContactButton inverted>無料相談を申し込む</ContactButton>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-cream/40">
            <span className="inline-flex items-center gap-2"><Bot className="h-4 w-4" />AI導入</span>
            <span className="inline-flex items-center gap-2"><LineChart className="h-4 w-4" />CVR改善</span>
            <span className="inline-flex items-center gap-2"><MailCheck className="h-4 w-4" />CRM運用</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default D2CPage;
