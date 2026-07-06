import { useEffect, type ReactNode } from 'react';
import {
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
import { SectionShell } from '../components/Layout/SectionShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StaggerGrid } from '../components/ui/StaggerGrid';
import { Reveal } from '../components/motion/Reveal';
import { ArrowCTA } from '../components/ui/ArrowCTA';

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

const workflows: [string, string, string][] = [
  ['01', '変化を検知', 'イベント日程、競合料金、需要シグナルから、見るべき日付を抽出します。'],
  ['02', '担当者へ通知', 'GM、Revenue、宿泊販売、本部など、確認すべき人に必要な粒度で共有します。'],
  ['03', '対応を検討', '料金見直し、在庫配分、販売チャネル、パリティ確認の論点を整理します。'],
  ['04', '履歴を残す', '誰が確認し、何を判断したかを残し、次回の収益会議につなげます。'],
];

const roles: [string, string][] = [
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

const ANCHOR = { scrollMarginTop: '6rem' } as const;

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.6rem, 3vw, 2.25rem)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const HotelPage: React.FC = () => {
  useEffect(() => {
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
    canonical.setAttribute('href', 'https://ltdhonkoma.com/hotel');
  }, []);

  return (
    <div style={{ background: 'var(--surface-base)' }}>
      {/* ===== HERO ===== */}
      <SectionShell>
        <div style={{ display: 'grid', gap: 'clamp(2.5rem, 5vw, 4rem)', gridTemplateColumns: '1fr' }} className="hotel-hero-grid">
          <div>
            <SectionHeading
              enLabel="Revenue Intelligence for Hotels"
              title={['需要・競合・料金機会を、', '次の打ち手につなぐ。']}
              level={1}
            />
            <Reveal variant="fade">
              <p
                style={{
                  maxWidth: '52ch',
                  margin: '1.75rem 0 clamp(2rem, 4vw, 3rem)',
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                  lineHeight: 1.9,
                }}
              >
                HASIPは、イベント開催、周辺需要の変化、競合料金の動き、販売条件の差分を整理し、
                料金見直し・在庫配分・パリティ確認までを日々の収益運用に落とし込む、
                ホテル向けRevenue Intelligence基盤です。
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <ArrowCTA to="/contact" size="lg" variant="fill" withText="デモを依頼する" label="デモを依頼する" />
                <ArrowCTA to="/contact" variant="outline" withText="自館での活用を相談" label="自館での活用を相談" />
              </div>
              <div
                style={{
                  marginTop: '2.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.75rem',
                  maxWidth: '640px',
                }}
              >
                {['イベント需要アラート', '競合料金の変化検知', '対応ワークフロー'].map((item) => (
                  <div
                    key={item}
                    style={{
                      background: 'var(--surface-raised)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal variant="fadeUp">
              <div
                style={{
                  background: 'var(--surface-raised)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(1.25rem, 2vw, 1.5rem)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <img
                  src="/assets/hotel/hasip-report-preview.png"
                  alt="ホテル向けRevenue Intelligenceダッシュボードのサンプル"
                  className="hidden w-full sm:block"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                <div className="sm:hidden" style={{ padding: '0.25rem' }}>
                  <p
                    className="font-en"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                    }}
                  >
                    Today's Revenue Alert
                  </p>
                  <h2
                    style={{
                      marginTop: '0.75rem',
                      fontSize: 'clamp(1.4rem, 3vw, 1.7rem)',
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: 'var(--text-primary)',
                    }}
                  >
                    今日は、04/27・05/03・05/04を確認。
                  </h2>
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { icon: <BellRing className="h-4 w-4" />, text: '競合料金の上昇をRevenue担当へ通知' },
                      { icon: <CalendarDays className="h-4 w-4" />, text: 'イベント日程の在庫配分をGMへ共有' },
                      { icon: <ClipboardCheck className="h-4 w-4" />, text: '販路確認と対応完了までを記録' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-accent)', flex: 'none', marginTop: '0.15rem' }}>{row.icon}</span>
                        <span>{row.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  {signalCards.map((item) => (
                    <div key={item.label} style={{ background: 'var(--surface-base)', padding: '1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</p>
                      <p style={{ marginTop: '0.4rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{item.value}</p>
                      <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* ===== Problem ===== */}
      <SectionShell wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Problem" title="市場は動いているのに、気づくタイミングが遅れている。" level={2} />
        <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
            {problems.map((item) => (
              <Card key={item.title}>
                <div
                  style={{
                    marginBottom: '1.25rem',
                    display: 'inline-flex',
                    height: '2.5rem',
                    width: '2.5rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent-soft)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-secondary)', flex: 1 }}>
                  {item.body}
                </p>
              </Card>
            ))}
          </StaggerGrid>
        </div>
      </SectionShell>

      {/* ===== Capabilities ===== */}
      <SectionShell wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Capabilities" title="収益判断に必要な変化を、対応できる形で可視化。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: '52ch',
              margin: '1.5rem 0 clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.9,
            }}
          >
            単なるレポートではなく、どの日付を見るべきか、どの競合変化に注意すべきか、
            誰が確認し、どう対応するかまでを業務に組み込みます。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {capabilities.map((item) => (
            <Card key={item.title}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
                {item.icon}
                <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-secondary)', flex: 1 }}>{item.body}</p>
            </Card>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== Alerts & Workflow — inverse ===== */}
      <SectionShell theme="inverse" wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Alerts & Workflow" title="需要の変化を、対応すべきタイミングで知らせる。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: '56ch',
              margin: '1.5rem 0 clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.9,
            }}
          >
            イベント開催、需要が高まりやすい日程、競合価格の変化、料金機会を検知し、
            確認すべき日付や条件をアラートとして提示します。
            通知だけで終わらせず、確認・共有・対応完了までをチームで管理します。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
          {workflows.map(([num, title, body]) => (
            <div
              key={num}
              style={{
                background: 'var(--surface-raised)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <span className="font-en" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                {num}
              </span>
              <h3 style={{ marginTop: '0.75rem', fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>{body}</p>
            </div>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== Teams ===== */}
      <SectionShell wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Teams" title="現場と本部の両方で、同じ判断基準を持つ。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: '52ch',
              margin: '1.5rem 0 clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.9,
            }}
          >
            HASIPはRevenue担当だけの画面ではなく、GM、宿泊販売、本部が同じ変化を見て、
            日次運用と収益会議の判断を揃えるための基盤です。
          </p>
        </Reveal>
        <div style={{ display: 'grid', gap: 'clamp(2rem, 4vw, 3rem)', gridTemplateColumns: '1fr' }} className="hotel-teams-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {trustItems.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <CheckCircle2 className="h-5 w-5 flex-none" style={{ color: 'var(--color-accent)' }} />
                {item}
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'grid',
              gap: '1px',
              background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {roles.map(([role, body]) => (
              <div
                key={role}
                style={{
                  display: 'grid',
                  gap: '0.75rem',
                  background: 'var(--surface-raised)',
                  padding: '1.5rem',
                  gridTemplateColumns: '1fr',
                }}
                className="hotel-role-row"
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-accent)' }}>{role}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ===== Operational Fit ===== */}
      <SectionShell wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="Operational Fit" title="小さく始め、運用に合わせて拡張する。" level={2} />
        <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <StaggerGrid columns={{ base: 1, md: 2 }} gap="md">
            <Card>
              <div
                style={{
                  marginBottom: '1.25rem',
                  display: 'inline-flex',
                  height: '2.5rem',
                  width: '2.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                }}
              >
                <Network className="h-5 w-5" />
              </div>
              <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' }}>初期導入</h3>
              <p style={{ marginTop: '1.25rem', fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-secondary)', flex: 1 }}>
                競合セット、注視日程、通知先、会議フォーマットを決め、
                外部市場データを中心に収益判断の型を作ります。
              </p>
            </Card>
            <Card>
              <div
                style={{
                  marginBottom: '1.25rem',
                  display: 'inline-flex',
                  height: '2.5rem',
                  width: '2.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                }}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' }}>拡張導入</h3>
              <p style={{ marginTop: '1.25rem', fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-secondary)', flex: 1 }}>
                予約システム、PMS、サイトコントローラー等との連携範囲に応じて、
                自館データを用いた分析やアラートを段階的に広げます。
              </p>
            </Card>
          </StaggerGrid>
        </div>
      </SectionShell>

      {/* ===== FAQ ===== */}
      <SectionShell wedge="top" style={ANCHOR}>
        <SectionHeading enLabel="FAQ" title="よくある確認事項" level={2} />
        <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)', maxWidth: 820 }}>
          {faq.map((item, i) => (
            <Reveal key={item.q} variant="fadeUp">
              <details
                style={{
                  padding: '1.5rem 0',
                  borderTop: i === 0 ? 'none' : '1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)',
                }}
              >
                <summary
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    listStyle: 'none',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.q}
                  <span className="font-en" style={{ color: 'var(--color-accent)', flex: 'none' }}>＋</span>
                </summary>
                <p style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--text-secondary)' }}>
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* ===== CTA — inverse ===== */}
      <SectionShell theme="inverse" wedge="top" width="content" style={ANCHOR}>
        <div style={{ maxWidth: 760 }}>
          <SectionHeading enLabel="Book a Revenue Intelligence Demo" title="貴館の収益運用で、どの変化を通知すべきか一緒に設計します。" level={2} />
          <Reveal variant="fadeUp">
            <p
              style={{
                margin: '1.5rem 0 clamp(2rem, 4vw, 3rem)',
                color: 'var(--text-secondary)',
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.9,
                maxWidth: '48ch',
              }}
            >
              導入前提ではなく、対象エリア、比較対象施設、イベント日程、会議フローを伺い、
              貴館で使えるアラートとレポートの形を短時間で確認します。
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <ArrowCTA to="/contact" size="lg" variant="fill" withText="デモを依頼する" label="デモを依頼する" />
              <ArrowCTA to="/contact" variant="outline" withText="自館での活用を相談" label="自館での活用を相談" />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <style>{`
        @media (min-width: 1024px) {
          .hotel-hero-grid { grid-template-columns: 7fr 5fr; align-items: start; }
          .hotel-teams-grid { grid-template-columns: 5fr 7fr; }
          .hotel-role-row { grid-template-columns: 220px 1fr; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default HotelPage;
