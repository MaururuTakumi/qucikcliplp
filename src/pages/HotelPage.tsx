import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  DatabaseZap,
  Hotel,
  LineChart,
  LockKeyhole,
  Search,
  UsersRound,
} from 'lucide-react';

const metrics = [
  { label: '公開OTA観測', value: '579件', note: '価格と残室表示を時刻つきで蓄積' },
  { label: '残室表示の変化', value: '29件', note: '表示変化の兆候として確認' },
  { label: '公開価格レンジ', value: '¥3,960〜¥45,100 /人', note: '2名1室 / 1名あたり' },
];

const painPoints = [
  {
    icon: <Search className="h-5 w-5" />,
    title: '競合確認が属人的になりやすい',
    body: '担当者ごとに見るOTA、見る時刻、比較対象がずれ、価格会議の前提が揃いにくくなります。',
  },
  {
    icon: <Clock3 className="h-5 w-5" />,
    title: '表示が動いた時刻が残りにくい',
    body: '「いつ、どの宿泊日の表示が変わったか」を後から振り返れず、判断材料が会話に残りがちです。',
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: '会議前の資料化に時間がかかる',
    body: '自館と周辺ホテルを同じ形式で並べる作業に時間を使い、肝心の判断に集中しづらくなります。',
  },
];

const valueCards = [
  {
    icon: <LineChart className="h-5 w-5" />,
    title: '公開価格',
    body: 'OTA上の表示価格を宿泊日別に整理し、自館と比較対象施設を同じ条件で確認できます。',
  },
  {
    icon: <Hotel className="h-5 w-5" />,
    title: '残室表示',
    body: '観測時点の残室表示を記録し、日程ごとの表示変化を価格会議で扱いやすくします。',
  },
  {
    icon: <CalendarClock className="h-5 w-5" />,
    title: '観測時刻',
    body: 'いつ見た表示なのかを残すことで、会議前後の振り返りと認識合わせをしやすくします。',
  },
  {
    icon: <UsersRound className="h-5 w-5" />,
    title: '比較対象施設',
    body: 'エリア、価格帯、客層、運営方針に合わせて、確認すべき周辺ホテルを設計します。',
  },
];

const useCases = [
  '価格会議前の周辺ホテル確認',
  '週末・連休・イベント日前の表示変化チェック',
  '宿泊販売とRevenue担当の認識合わせ',
  '運営会社本部での複数施設モニタリング',
];

const roles = [
  ['GM / 宿泊支配人', '価格会議で使う判断材料を揃え、現場の説明負荷を下げます。'],
  ['Revenue Manager', '比較対象施設の公開価格・残室表示を同じ粒度で追いやすくします。'],
  ['宿泊販売 / OTA担当', 'OTA上でどう見えているかを販売施策の確認材料にできます。'],
  ['本部Revenue / 営業企画', '複数施設を共通フォーマットで確認し、施設間の見方を揃えます。'],
];

const steps = [
  ['01', '比較対象を決める', '貴館の商圏、価格帯、会議でよく名前が出る施設を起点にします。'],
  ['02', 'サンプルを確認する', '公開OTA表示のレポート例を15分で確認し、見方の違和感を潰します。'],
  ['03', '対象日とOTAを調整する', '週末、連休、イベント日など、現場が見たい日程へ寄せます。'],
  ['04', '2週間で検証する', '価格会議や販売判断に使える形式かを短期間で確認します。'],
];

const faq = [
  {
    q: 'どのようなデータを扱いますか？',
    a: '公開OTAページ上に表示される価格、残室表示、観測時刻などを扱います。PMS内部情報、予約者情報、実売上データは扱いません。',
  },
  {
    q: 'PMSとの連携は必要ですか？',
    a: '必須ではありません。公開OTAページの表示情報をもとにレポート化するため、PMS内部データに接続しない形で確認できます。',
  },
  {
    q: '実際の予約数や売上は分かりますか？',
    a: 'いいえ。HASIPは実予約数や実売上を扱うサービスではありません。公開OTA上で確認できる表示情報を、販売判断の参考にしやすい形で整理します。',
  },
  {
    q: '比較対象施設はどのように選びますか？',
    a: 'エリア、価格帯、客層、ブランド、販売上よく比較される施設などをもとに相談できます。初回は会議でよく名前が出る施設を起点にするのが現実的です。',
  },
  {
    q: '初回相談では何をしますか？',
    a: '貴館の対象エリア、比較したい施設、確認したい日程やOTAを伺い、サンプルレポートの見方や比較対象施設の選び方を15分程度で確認します。',
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs tracking-[0.22em] uppercase text-warm">
      {children}
    </span>
  );
}

function ContactButton({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      to="/contact"
      className={`group inline-flex items-center justify-center px-7 py-4 text-sm font-semibold tracking-wide transition-colors duration-300 ${
        inverted
          ? 'bg-white text-[#003B86] hover:bg-[#EAF3FF]'
          : 'bg-[#0462CB] text-white hover:bg-[#003B86]'
      } ${className}`}
    >
      貴館向けサンプルを15分だけ確認
      <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const HotelPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'ホテル向け公開OTA表示レポート | honkoma';

    const description =
      '公開OTAページの価格・残室表示・観測時刻を定点観測し、ホテルの価格会議や販売判断で見やすい形に整理するHASIPのホテル向けページです。';
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
    canonical.setAttribute('href', 'https://quickclip.honkoma.jp/hotel');
  }, []);

  return (
    <div className="bg-cream text-ink">
      <section className="relative overflow-hidden border-b border-subtle bg-[#F6FAFF]">
        <div className="absolute right-0 top-0 hidden h-full w-[34%] bg-[#EAF3FF] lg:block" />
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:px-8 lg:py-28">
          <div className="lg:col-span-7">
            <SectionLabel>Hotel Revenue Intelligence</SectionLabel>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              公開OTA上の価格・残室表示を、
              <span className="text-[#0462CB]">ホテルの販売判断</span>
              に使いやすく。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              HASIPは、公開OTAページに表示される価格・残室表示・観測時刻を定点観測し、
              価格会議や宿泊販売の確認に使いやすいレポートとして整理します。
              PMS内部情報や予約者情報、実売上データは扱いません。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ContactButton />
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-[#0462CB] px-7 py-4 text-sm font-semibold tracking-wide text-[#0462CB] transition-colors duration-300 hover:bg-white"
              >
                比較対象施設の選び方を相談
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs text-muted sm:grid-cols-3">
              {['2名1室 / 1名あたり', '公開OTA表示', 'PMS接続なし'].map((item) => (
                <div key={item} className="border border-[#C8D7EA] bg-white px-4 py-3 text-center font-semibold text-[#0462CB]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[#C8D7EA] bg-white p-4 shadow-[0_24px_60px_rgba(4,98,203,0.12)]">
              <img
                src="/assets/hotel/hasip-report-preview.png"
                alt="ホテル向け公開OTA表示レポートのサンプル"
                className="w-full border border-[#E0E8F4] bg-white"
              />
              <div className="grid grid-cols-1 gap-px bg-[#C8D7EA] sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="bg-[#F7FAFF] p-4">
                    <p className="text-[11px] font-semibold text-muted">{metric.label}</p>
                    <p className="mt-2 text-xl font-bold text-[#003B86]">{metric.value}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">{metric.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-3">
            <SectionLabel>Problem</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              競合確認は、毎日必要なのに残りにくい。
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-9">
            {painPoints.map((item) => (
              <div key={item.title} className="border border-subtle bg-white p-7">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-[#EAF3FF] text-[#0462CB]">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-subtle bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel>What HASIP organizes</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
                価格会議で見るべき情報を、同じ形式で揃える。
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                対象は公開OTAページの表示情報です。既存のPMS/RMSを置き換えるのではなく、
                外から見える市場の表示を会議で扱える形に整えます。
              </p>
            </div>
            <div className="grid gap-px bg-subtle md:grid-cols-2 lg:col-span-8">
              {valueCards.map((item) => (
                <div key={item.title} className="bg-cream p-7">
                  <div className="mb-4 flex items-center gap-3 text-[#0462CB]">
                    {item.icon}
                    <h3 className="font-serif text-xl font-bold text-ink">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>Use Cases</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              現場と本部の両方で、判断材料として使う。
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              レポートは単なる一覧ではなく、誰がどの会議で見るかを前提に設計します。
              施設単体の確認から、運営会社本部の横比較まで対応できます。
            </p>
            <div className="mt-8 space-y-3">
              {useCases.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#0462CB]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-px bg-[#C8D7EA]">
              {roles.map(([role, body]) => (
                <div key={role} className="grid gap-3 bg-white p-6 md:grid-cols-[220px_1fr] md:items-center">
                  <div className="font-serif text-lg font-bold text-[#003B86]">{role}</div>
                  <p className="text-sm leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle bg-[#F6FAFF] py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>Process</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">
              導入前に、貴館で使える見え方かを確認します。
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map(([num, title, body]) => (
              <div key={num} className="border border-[#C8D7EA] bg-white p-6">
                <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#0462CB]">{num}</div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-subtle bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <SectionLabel>Scope</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              扱うものと、扱わないものを明確にします。
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-8">
            <div className="border border-[#C8D7EA] bg-[#F7FAFF] p-7">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-white text-[#0462CB]">
                <DatabaseZap className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">扱うもの</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
                <li>公開OTA上の表示価格</li>
                <li>観測時点の残室表示</li>
                <li>宿泊日・施設・OTA・観測時刻</li>
                <li>比較対象施設との表示状況</li>
              </ul>
            </div>
            <div className="border border-subtle bg-cream p-7">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-white text-ink">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">扱わないもの</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
                <li>PMSやサイトコントローラー内部情報</li>
                <li>予約者情報・個人情報</li>
                <li>実予約数や実売上データ</li>
                <li>非公開ページや認証が必要な情報</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">
              よくある確認事項
            </h2>
          </div>
          <div className="space-y-px bg-subtle lg:col-span-8">
            {faq.map((item) => (
              <details key={item.q} className="group bg-white p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-bold text-ink">
                  {item.q}
                  <span className="text-[#0462CB] transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1F3A] py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <SectionLabel>Start with sample review</SectionLabel>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight md:text-5xl">
                まずは、貴館の販売判断に使える形かをご確認ください。
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                導入前提ではなく、対象OTA・比較対象施設・確認したい日程を伺い、
                サンプルの見方を短時間でご案内します。
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              <ContactButton inverted />
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-white/30 px-7 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-white/10"
              >
                比較対象施設の選び方を相談
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelPage;
