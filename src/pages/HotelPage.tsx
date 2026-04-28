import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  LineChart,
  Network,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from 'lucide-react';

const signalCards = [
  { label: '需要変化', value: 'Event', note: 'イベント・連休・周辺需要を注視' },
  { label: '競合料金', value: 'Rate', note: '比較対象施設の価格変化を確認' },
  { label: '対応管理', value: 'Action', note: '確認から対応完了までを記録' },
];

const problems = [
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: '需要が動く日を見逃しやすい',
    body: 'イベント、連休、曜日差、周辺施設の稼働など、料金判断に影響する変化が複数の情報源に散らばります。',
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    title: '競合の値動きに反応が遅れる',
    body: '比較対象施設の上げ下げや販売条件の変化に気づくまでに時間がかかり、会議時点で判断材料が古くなりがちです。',
  },
  {
    icon: <ClipboardCheck className="h-5 w-5" />,
    title: '判断後の対応が追いにくい',
    body: '誰が確認し、どの料金・在庫・販路対応を検討したかが残らず、収益会議の運用が属人化します。',
  },
];

const capabilities = [
  {
    icon: <BellRing className="h-5 w-5" />,
    title: '需要シグナル通知',
    body: 'イベント開催、連休、特定日程の市場変化をもとに、確認すべき日付と条件を通知します。',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: '競合料金インテリジェンス',
    body: '比較対象施設の価格差、上げ下げ、販売条件の変化を日別に整理し、料金見直しの材料にします。',
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: '料金機会の優先順位づけ',
    body: 'すべての数字を追うのではなく、対応を検討すべき日程・条件・競合変化に絞って提示します。',
  },
  {
    icon: <UsersRound className="h-5 w-5" />,
    title: '対応ワークフロー',
    body: '確認、共有、料金見直し、パリティ確認、対応完了までをチームで追える運用にします。',
  },
];

const workflows = [
  ['01', '変化を検知', 'イベント日程、競合料金、需要シグナルから、見るべき日付を抽出します。'],
  ['02', '担当者へ通知', 'GM、Revenue、宿泊販売、本部など、確認すべき人に必要な粒度で共有します。'],
  ['03', '対応を検討', '料金見直し、在庫配分、販売チャネル、パリティ確認の論点を整理します。'],
  ['04', '履歴を残す', '誰が確認し、何を判断したかを残し、次回の収益会議につなげます。'],
];

const roles = [
  ['GM / 宿泊支配人', '収益会議で見るべき変化と対応状況を短時間で把握します。'],
  ['Revenue Manager', '需要期・競合変化・料金機会を日次で確認し、対応優先度を決めます。'],
  ['宿泊販売 / OTA担当', '販売チャネル上の表示差分やパリティ確認を業務に組み込みます。'],
  ['本部Revenue / 営業企画', '複数施設の変化を同じ見方で確認し、施設間の判断基準を揃えます。'],
];

const trustItems = [
  '競合セットは商圏・価格帯・ブランドに合わせて設計',
  '外部市場データから始め、必要に応じて自館データ連携を拡張',
  '通知だけで終わらず、確認・共有・対応完了までを管理',
  '日本のホテル運営に合わせた導入支援と運用設計',
];

const faq = [
  {
    q: 'どのようなホテルに向いていますか？',
    a: '複数チャネルで販売しており、イベント需要、競合料金、料金パリティ、販売ペースを日常的に確認しているホテルに向いています。担当者任せにせず、チームで収益運用を回したい施設に適しています。',
  },
  {
    q: '競合ホテルの価格変化は確認できますか？',
    a: 'はい。取得可能な外部情報をもとに、対象日や条件に応じた競合料金の変化を確認できます。表示内容や取得範囲は、対象エリア、販売条件、比較対象施設の設定によって変わります。',
  },
  {
    q: 'イベント開催時の通知はできますか？',
    a: 'イベント日程、連休、周辺需要が高まりやすい日を注視対象として設定し、競合料金や販売条件の変化と合わせて通知する設計です。イベントデータの自動連携範囲は順次拡張予定です。',
  },
  {
    q: '自館の予約状況や販売ペースも見られますか？',
    a: '自館データの反映は、予約システム、PMS、サイトコントローラー等との連携範囲に応じて段階的に対応します。初期段階では外部市場シグナルや競合料金を中心に、収益判断に使う変化を整理します。',
  },
  {
    q: '料金の自動変更まで行いますか？',
    a: '初期段階では、料金変更の判断を支援する情報提示とワークフロー管理を中心に設計しています。外部システムへの自動反映は、施設ごとの運用方針と連携範囲に応じて検討します。',
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
      デモを依頼する
      <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const HotelPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'ホテル向けRevenue Intelligence | honkoma';

    const description =
      'HASIPは、需要シグナル・競合料金・対応ワークフローをつなぎ、ホテルの料金・在庫・販路判断を支援するRevenue Intelligence基盤です。';
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
            <SectionLabel>Revenue Intelligence for Hotels</SectionLabel>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              需要・競合・<span className="whitespace-nowrap">料金機会を、</span>
              <span className="whitespace-nowrap text-[#0462CB]">次の打ち手</span>
              につなぐ。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              HASIPは、イベント開催、周辺需要の変化、競合料金の動き、販売条件の差分を整理し、
              料金見直し・在庫配分・パリティ確認までを日々の収益運用に落とし込む、
              ホテル向けRevenue Intelligence基盤です。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ContactButton />
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-[#0462CB] px-7 py-4 text-sm font-semibold tracking-wide text-[#0462CB] transition-colors duration-300 hover:bg-white"
              >
                自館での活用を相談
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-xs text-muted sm:grid-cols-3">
              {['イベント需要アラート', '競合料金の変化検知', '対応ワークフロー'].map((item) => (
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
                alt="ホテル向けRevenue Intelligenceダッシュボードのサンプル"
                className="hidden w-full border border-[#E0E8F4] bg-white sm:block"
              />
              <div className="border border-[#E0E8F4] bg-[#F7FAFF] p-5 sm:hidden">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#0462CB]">
                  TODAY'S REVENUE ALERT
                </p>
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink">
                  今日は、04/27・05/03・05/04を確認。
                </h2>
                <div className="mt-5 space-y-3 text-sm text-muted">
                  <div className="flex items-start gap-3">
                    <BellRing className="mt-0.5 h-4 w-4 flex-none text-[#0462CB]" />
                    <span>競合料金の上昇をRevenue担当へ通知</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-[#0462CB]" />
                    <span>イベント日程の在庫配分をGMへ共有</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClipboardCheck className="mt-0.5 h-4 w-4 flex-none text-[#0462CB]" />
                    <span>販路確認と対応完了までを記録</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-px bg-[#C8D7EA] sm:grid-cols-3">
                {signalCards.map((item) => (
                  <div key={item.label} className="bg-[#F7FAFF] p-4">
                    <p className="text-[11px] font-semibold text-muted">{item.label}</p>
                    <p className="mt-2 text-xl font-bold text-[#003B86]">{item.value}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">{item.note}</p>
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
              市場は動いているのに、気づくタイミングが遅れている。
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-9">
            {problems.map((item) => (
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
              <SectionLabel>Capabilities</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
                収益判断に必要な変化を、対応できる形で可視化。
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                単なるレポートではなく、どの日付を見るべきか、どの競合変化に注意すべきか、
                誰が確認し、どう対応するかまでを業務に組み込みます。
              </p>
            </div>
            <div className="grid gap-px bg-subtle md:grid-cols-2 lg:col-span-8">
              {capabilities.map((item) => (
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

      <section className="border-b border-subtle bg-[#F6FAFF] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>Alerts & Workflow</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              需要の変化を、対応すべきタイミングで知らせる。
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              イベント開催、需要が高まりやすい日程、競合価格の変化、料金機会を検知し、
              確認すべき日付や条件をアラートとして提示します。
              通知だけで終わらせず、確認・共有・対応完了までをチームで管理します。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-7">
            {workflows.map(([num, title, body]) => (
              <div key={num} className="border border-[#C8D7EA] bg-white p-6">
                <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#0462CB]">{num}</div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-subtle py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>Teams</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              現場と本部の両方で、同じ判断基準を持つ。
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              HASIPはRevenue担当だけの画面ではなく、GM、宿泊販売、本部が同じ変化を見て、
              日次運用と収益会議の判断を揃えるための基盤です。
            </p>
            <div className="mt-8 space-y-3">
              {trustItems.map((item) => (
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

      <section className="border-b border-subtle bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <SectionLabel>Operational Fit</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink">
              小さく始め、運用に合わせて拡張する。
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-8">
            <div className="border border-[#C8D7EA] bg-[#F7FAFF] p-7">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-white text-[#0462CB]">
                <Network className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">初期導入</h3>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                競合セット、注視日程、通知先、会議フォーマットを決め、
                外部市場データを中心に収益判断の型を作ります。
              </p>
            </div>
            <div className="border border-subtle bg-cream p-7">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-white text-ink">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">拡張導入</h3>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                予約システム、PMS、サイトコントローラー等との連携範囲に応じて、
                自館データを用いた分析やアラートを段階的に広げます。
              </p>
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
              <SectionLabel>Book a Revenue Intelligence Demo</SectionLabel>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight md:text-5xl">
                貴館の収益運用で、どの変化を通知すべきか一緒に設計します。
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                導入前提ではなく、対象エリア、比較対象施設、イベント日程、会議フローを伺い、
                貴館で使えるアラートとレポートの形を短時間で確認します。
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              <ContactButton inverted />
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-white/30 px-7 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-white/10"
              >
                自館での活用を相談
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelPage;
