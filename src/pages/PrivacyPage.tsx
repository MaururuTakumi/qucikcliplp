import React from 'react';
import { SectionShell } from '../components/Layout/SectionShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/motion/Reveal';

const PrivacyPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'プライバシーポリシー | honkoma';
  }, []);

  const lastUpdated = '2024年4月1日';

  /** 中立サーフェスの情報ボックス（旧: 青/緑/琥珀/紫/橙のカラフルボックスを統一）。 */
  const boxStyle: React.CSSProperties = {
    background: 'var(--surface-raised)',
    borderRadius: 'var(--radius-lg)',
    padding: 'clamp(1.5rem, 3vw, 2rem)',
  };

  const bodyText: React.CSSProperties = {
    color: 'var(--text-secondary)',
    lineHeight: 1.95,
    fontFamily: 'var(--font-jp)',
  };

  const sectionNumber = (en: string) => (
    <span
      className="font-en"
      style={{
        fontSize: '0.85rem',
        color: 'var(--color-accent)',
        fontWeight: 700,
        letterSpacing: '0.04em',
      }}
    >
      {en}
    </span>
  );

  const sectionTitle = (title: string) => (
    <h2
      style={{
        fontSize: 'var(--fs-h3)',
        fontWeight: 700,
        margin: '0.5rem 0 1.25rem',
        color: 'var(--text-primary)',
      }}
    >
      {title}
    </h2>
  );

  return (
    <div style={{ background: 'var(--surface-base)' }}>
      {/* Hero */}
      <SectionShell>
        <SectionHeading enLabel="Privacy Policy" title="プライバシーポリシー" level={1} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: '56ch',
              margin: '1.75rem 0 0',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
              lineHeight: 2,
            }}
          >
            株式会社honkomaは、お客様の個人情報の保護を重要な責務と考え、
            以下の方針に基づいて個人情報を適切に取り扱います。
          </p>
          <p
            className="font-en"
            style={{
              marginTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            最終更新日：{lastUpdated}
          </p>
        </Reveal>
      </SectionShell>

      {/* Main Content */}
      <SectionShell wedge="top">
        <div>
          {/* 1. 基本方針 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('01')}
            {sectionTitle('基本方針')}
            <div style={boxStyle}>
              <p style={{ ...bodyText, margin: 0 }}>
                株式会社honkoma（以下「当社」といいます。）は、当社が提供するサービスをご利用いただくお客様（以下「利用者」といいます。）の個人情報を適切に保護することが、当社の社会的責務であると考えております。当社は、個人情報の保護に関する法律、関連する政令・省令・ガイドライン等を遵守し、利用者の個人情報を適切に取り扱います。
              </p>
            </div>
          </div>

          {/* 2. 個人情報の定義 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('02')}
            {sectionTitle('個人情報の定義')}
            <p style={bodyText}>
              本プライバシーポリシーにおいて「個人情報」とは、個人情報の保護に関する法律第2条第1項に定義される個人情報、すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む。）をいいます。
            </p>
          </div>

          {/* 3. 個人情報の収集 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('03')}
            {sectionTitle('個人情報の収集')}
            <p style={{ ...bodyText, marginBottom: '1rem' }}>
              当社は、以下の方法により個人情報を収集することがあります。
            </p>
            <ul style={{ ...bodyText, paddingLeft: '1.25rem', margin: 0 }}>
              <li>お問い合わせフォームからのご入力</li>
              <li>AI活用診断で、解析完了後に入力いただくメールアドレスと同意情報</li>
              <li>サービス利用時のご登録</li>
              <li>アンケート調査へのご回答</li>
              <li>イベント・セミナーへのご参加</li>
              <li>名刺交換等の営業活動</li>
              <li>Cookie等の技術を使用した自動的な情報収集</li>
            </ul>
          </div>

          {/* 4. 収集する個人情報の項目 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('04')}
            {sectionTitle('収集する個人情報の項目')}
            <p style={{ ...bodyText, marginBottom: '1.25rem' }}>
              当社が収集する個人情報の項目は以下のとおりです。
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div style={boxStyle}>
                <h4
                  style={{
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  基本情報
                </h4>
                <ul style={{ ...bodyText, fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0 }}>
                  <li>氏名</li>
                  <li>会社名・部署名</li>
                  <li>役職</li>
                  <li>メールアドレス</li>
                  <li>AI活用診断の診断コード、対象サイトURL、会社ドメインとの照合結果</li>
                  <li>電話番号</li>
                  <li>住所</li>
                </ul>
              </div>
              <div style={boxStyle}>
                <h4
                  style={{
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  サービス利用情報
                </h4>
                <ul style={{ ...bodyText, fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0 }}>
                  <li>IPアドレス</li>
                  <li>ブラウザの種類・バージョン</li>
                  <li>アクセス日時</li>
                  <li>利用端末情報</li>
                  <li>Cookie情報</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. 個人情報の利用目的 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('05')}
            {sectionTitle('個人情報の利用目的')}
            <p style={{ ...bodyText, marginBottom: '1rem' }}>
              当社は、収集した個人情報を以下の目的で利用いたします。
            </p>
            <ul style={{ ...bodyText, paddingLeft: '1.25rem', margin: 0 }}>
              <li>お問い合わせへの対応</li>
              <li>サービスの提供・改善</li>
              <li>AI活用診断の結果送付、診断内容の引き継ぎ、対象企業との関係確認</li>
              <li>営業活動・マーケティング活動</li>
              <li>セミナー・イベント等のご案内</li>
              <li>統計情報の作成（個人を特定できない形式）</li>
              <li>法令に基づく対応</li>
              <li>その他、利用者との契約履行に必要な業務</li>
            </ul>
          </div>

          {/* AI活用診断の取得情報 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('06')}
            {sectionTitle('AI活用診断で取得する情報')}
            <div style={boxStyle}>
              <p style={{ ...bodyText, margin: 0 }}>
                AI活用診断では、会社サイトの解析が完了した後に、結果送付先としてメールアドレスとプライバシーポリシーへの同意を取得します。入力されたメールアドレスは、診断対象サイトのドメインとの照合、診断結果の送付、お問い合わせ対応のために利用します。診断コード、対象サイトURL、入力された課題、照合結果、流入経路は、品質改善と対応履歴のため保存します。AI活用診断で取得した連絡先情報は、法令上または対応継続上必要な場合を除き、取得日から90日を目安に見直します。
              </p>
            </div>
          </div>

          {/* 6. 個人情報の第三者提供 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('07')}
            {sectionTitle('個人情報の第三者提供')}
            <p style={{ ...bodyText, marginBottom: '1rem' }}>
              当社は、以下の場合を除き、利用者の同意なく個人情報を第三者に提供することはありません。
            </p>
            <ul style={{ ...bodyText, paddingLeft: '1.25rem', margin: 0 }}>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              <li>利用者の同意がある場合</li>
            </ul>
          </div>

          {/* 7. 個人情報の管理 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('08')}
            {sectionTitle('個人情報の管理')}
            <div style={boxStyle}>
              <p style={{ ...bodyText, margin: 0 }}>
                当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。また、個人情報を取り扱う従業員に対して必要かつ適切な監督を行います。
              </p>
            </div>
          </div>

          {/* 8. Cookie等の取り扱い */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('09')}
            {sectionTitle('Cookie等の取り扱い')}
            <p style={{ ...bodyText, marginBottom: '1.25rem' }}>
              当社のウェブサイトでは、サービスの改善やユーザー体験の向上のため、Cookie及び類似の技術を使用することがあります。
            </p>
            <div style={boxStyle}>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)',
                }}
              >
                Cookieの利用目的
              </h4>
              <ul style={{ ...bodyText, fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0 }}>
                <li>ウェブサイトの利用状況の分析</li>
                <li>ユーザーの利便性向上</li>
                <li>広告配信の最適化</li>
                <li>アクセス解析</li>
              </ul>
            </div>
          </div>

          {/* 9. 個人情報の開示・訂正・削除 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('10')}
            {sectionTitle('個人情報の開示・訂正・削除等')}
            <p style={{ ...bodyText, marginBottom: '1.25rem' }}>
              利用者は、当社が保有する自己の個人情報について、以下の権利を有します。
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <div style={boxStyle}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  開示請求
                </h4>
                <p style={{ ...bodyText, fontSize: '0.9rem', margin: 0 }}>
                  保有している個人情報の開示を請求できます
                </p>
              </div>
              <div style={boxStyle}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  訂正・追加・削除
                </h4>
                <p style={{ ...bodyText, fontSize: '0.9rem', margin: 0 }}>
                  個人情報の訂正・追加・削除を請求できます
                </p>
              </div>
              <div style={boxStyle}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  利用停止
                </h4>
                <p style={{ ...bodyText, fontSize: '0.9rem', margin: 0 }}>
                  個人情報の利用停止を請求できます
                </p>
              </div>
              <div style={boxStyle}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  第三者提供停止
                </h4>
                <p style={{ ...bodyText, fontSize: '0.9rem', margin: 0 }}>
                  第三者への提供停止を請求できます
                </p>
              </div>
            </div>
          </div>

          {/* 10. お問い合わせ窓口 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('11')}
            {sectionTitle('お問い合わせ窓口')}
            <div style={boxStyle}>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)',
                }}
              >
                個人情報に関するお問い合わせ
              </h4>
              <p style={{ ...bodyText, marginBottom: '1rem' }}>
                個人情報の取り扱いに関するご質問、開示・訂正・削除等のご請求は、以下の窓口までお問い合わせください。
              </p>
              <div style={{ ...bodyText, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>会社名：</strong>株式会社honkoma
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>電話番号：</strong>080-8526-6978
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>メール：</strong>quickclip@ltdhonkoma.com
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>受付時間：</strong>平日 9:00-18:00（土日祝日を除く）
                </p>
              </div>
            </div>
          </div>

          {/* 11. プライバシーポリシーの変更 */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {sectionNumber('12')}
            {sectionTitle('プライバシーポリシーの変更')}
            <div style={boxStyle}>
              <p style={{ ...bodyText, margin: 0 }}>
                当社は、法令の変更や事業内容の変更等に伴い、本プライバシーポリシーを変更する場合があります。変更後のプライバシーポリシーは、当社ウェブサイトに掲載した時点で効力を生じるものとします。重要な変更については、ウェブサイト上での告知またはその他の適切な方法により、利用者にお知らせいたします。
              </p>
            </div>
          </div>

          {/* 施行日 */}
          <div
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)',
              paddingTop: 'clamp(2rem, 4vw, 2.5rem)',
              textAlign: 'center',
            }}
          >
            <p style={{ ...bodyText, marginBottom: '0.5rem' }}>
              本プライバシーポリシーは、{lastUpdated}から施行いたします。
            </p>
            <p style={{ ...bodyText, fontSize: '0.85rem' }}>株式会社honkoma</p>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

export default PrivacyPage;
