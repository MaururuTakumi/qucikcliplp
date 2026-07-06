/* =============================================================================
 * 導入事例データ（/case-studies 一覧 と /case-studies/:slug 記事で共用）
 *
 * 「一旦、箱をつくる」— 構造(カード→記事)を先に用意し、本文は取引先へのQ&A
 * 回収後に本物へ差し替える運用。実名掲載は許諾済みのみ(BuySell/貞栄会/慶洋)。
 *
 * 注意:
 *  - quote(お客様の声)は許諾済み・実在するもののみ。未回収の実名先は quote 省略
 *    (捏造しない)。回収後に追記する。
 *  - 匿名事例(anonymous)は監査#7対応で具体数値を伏せ、定性表現に統一。
 *  - 慶洋: 正式名称は「株式会社慶洋エンジニアリング」(keiyoeng.co.jp で確認済・京葉ではない)。
 * ========================================================================== */

export type CaseStudy = {
  slug: string;
  /** 実名(許諾済み)なら会社名、匿名なら業種ベースの通称。 */
  company: string;
  named: boolean;
  logo?: string;
  industry: string;
  tags: string[];
  /** カードとHeroの1行成果(定性・裏取り不要の表現に留める)。 */
  oneLiner: string;
  challenge: string;
  actions: string[];
  outcome: string;
  quote?: string;
  role?: string;
  /** 支援の主分類。記事末尾CTAの文脈差し込み・将来の絞り込みに使用
   *  (case-study-intake-form-design §2.2)。 */
  serviceType?: "ai" | "fde" | "product";
  /** 公開日(YYYY-MM)。件数増加後の並び順・行リストUIに使用。 */
  publishedAt?: string;
  /** 従業員規模の表示用文字列(例:「従業員11〜50名規模」)。匿名事例の本文・
   *  RAGマッチのため任意で保持。 */
  employeeRange?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "buysell",
    company: "株式会社BuySell Technologies",
    named: true,
    logo: "/assets/clients/buysell-technologies.svg",
    industry: "リユース（東証グロース上場）",
    tags: ["上場企業", "全社AI基盤", "経営層ハンズオン"],
    oneLiner: "「まず経営層が使う」文化を、全社に広げた。",
    challenge:
      "人事労務部門の業務負荷が高く、定型作業に現場が逼迫。経営層のAI活用も進んでおらず、全社的なDX推進に課題を抱えていた。",
    actions: [
      "人事労務領域の定型業務をAIで自動化し、逼迫していた現場の負荷を軽減。",
      "社長・役員クラスへのClaude Codeハンズオン研修を実施。経営幹部が自らAIを活用する体制を構築し、全社的なAI活用の起点をつくった。",
    ],
    outcome:
      "人事労務の定型作業を自動化し、経営幹部がClaude Codeを日常的に活用するように。「まず上が使う」文化が全社に波及し、AI Readyな組織への進化を加速させた。",
    quote:
      "AIネイティブなhonkomaの皆さんのおかげで、まず経営幹部が率先してAIを活用する環境ができました。Claude Codeのハンズオン研修を通じて、役員自身が業務にAIを使いこなせるようになったのは大きな変化です。人事労務の自動化と合わせて、組織全体のAI活用が一気に加速しました。",
    role: "株式会社BuySell Technologies / 経営企画部門",
  },
  {
    slug: "teieikai",
    company: "医療法人社団 貞栄会",
    named: true,
    industry: "医療（クリニック・訪問診療）",
    tags: ["医療", "全社DX", "データ基盤", "バックオフィス自動化"],
    oneLiner: "クリニックの現場を、まるごとAIネイティブへ。",
    challenge:
      "レセプト処理・内勤業務・日程調整といった定型業務が現場を圧迫。訪問診療のオペレーションを含め、業務データが分散し、AI活用の土台が整っていなかった。",
    actions: [
      "レセプト（診療報酬請求）業務の自動化。",
      "日常業務データをAIが読める共通のデータ収集・分析基盤として整備。",
      "現場の音声を扱う分析基盤の構築。",
      "バックオフィスの日程調整を自動化。",
      "内勤業務のヒアリングをもとに、マニュアル化・AIボットへの移行を推進。",
      "ChatGPT等のAI検索で強みが拾われるAIO対策。",
    ],
    outcome:
      "単発のツール導入ではなく、レセプト・内勤・データ基盤まで含めた全社的な伴走で、クリニックがAIを前提に動く体制づくりを進行中。",
    // quote: 取引先Q&A回収後に追記（未回収のため省略）
  },
  {
    slug: "keiyo",
    company: "株式会社慶洋エンジニアリング",
    named: true,
    industry: "電機メーカー（車載・家電）",
    tags: ["問い合わせ自動化", "AIエージェント", "マーケDX"],
    oneLiner: "複数媒体からの問い合わせを、エージェントが自動でさばく。",
    challenge:
      "LINEをはじめ複数の媒体から入る問い合わせ対応が属人化し、対応スピードと機会損失に課題があった。",
    actions: [
      "複数媒体からの問い合わせを受けるAIエージェントを構築し、対応を自動化。",
      "マーケティング数値の集計・可視化を自動化し、意思決定を支援。",
    ],
    outcome:
      "問い合わせ対応が大幅に高速化。属人化していた一次対応をエージェントが引き受け、担当者はより付加価値の高い業務に集中できるようになった。",
    // quote: 取引先Q&A回収後に追記（未回収のため省略）
  },
  {
    // AViC を匿名で掲載(許諾後に実名化可)。
    slug: "adagency-anon",
    company: "広告代理店（デジタルマーケティング）",
    named: false,
    industry: "広告代理店",
    tags: ["提案書自動化", "生産性向上", "案件数増"],
    oneLiner: "提案書づくりを自動化し、一人が抱えられる案件数を増やす。",
    challenge:
      "提案書類の作成に一件ごと時間がかかり、担当者が並行して抱えられる案件数の上限になっていた。",
    actions: [
      "提案書類の作成をAIで自動化し、ドラフトを即時に生成できる仕組みを構築。",
      "作成フローを標準化し、品質を保ちながら量をさばけるようにした。",
    ],
    outcome:
      "提案書作成の負荷が下がり、一人あたりが並行して抱えられる案件数を増やせるようになった。",
    // quote: 取引先Q&A回収後に追記（未回収のため省略）
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
