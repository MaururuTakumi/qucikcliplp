/* =============================================================================
 * TeamPage — メンバー。Rebuilt on the design system (SectionShell / SectionHeading
 * / StaggerGrid / Reveal / ArrowCTA), same corporate face as the home page.
 *
 * Identity: NOT "2名体制". honkoma is a young, AI-native crew centered on
 * University of Tokyo / Institute of Science Tokyo members who chase the frontier
 * every day — an "AI mafia". Facts stay compliant (10名体制, no unverified
 * lead-time claims).
 * ========================================================================== */

import { useEffect, type ReactNode } from "react";
import { Twitter, Linkedin, Mail } from "lucide-react";
import { SectionShell } from "../components/Layout/SectionShell";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaggerGrid } from "../components/ui/StaggerGrid";
import { Reveal } from "../components/motion/Reveal";
import { ArrowCTA } from "../components/ui/ArrowCTA";

const members = [
  {
    name: "林 拓海",
    nameEn: "Takumi Hayashi",
    role: "代表取締役 CEO",
    image: "/team/hayashi_img.jpg",
    bio: "西大和学園高等学校を経て東京大学へ進学、農学部に在籍。東京大学運動会硬式野球部での挫折経験を原点に、自らの手で未来を切り拓く起業を決意する。就職活動ではマッキンゼー・アンド・カンパニーの内定を獲得するも、AI時代の変化の速さに胸を躍らせ、内定を辞退して起業の道を突き進んだ。在学中に株式会社honkomaを創業。X（旧Twitter）では7,400人を超えるフォロワーへ、日々AIの最先端を発信し続けている。",
    social: {
      x: "https://x.com/moriyorihayash1?s=21&t=PxD9VDUOatoEBmRjBGZnQw",
      mail: "quickclip@ltdhonkoma.com",
    },
  },
  {
    name: "中島 幸祐",
    nameEn: "Kosuke Nakajima",
    role: "共同創業者 / エンジニア",
    image: "/team/nakajima_img.jpg",
    bio: "2022年に東京大学へ進学し、経済学部に在籍。部活動を通じてPythonとTypeScriptを独学で習得し、プログラミングの世界に魅了される。在学中にスタートアップ2社でエンジニアインターンを経験し、実践的な開発スキルを磨く。Claude CodeやOpenClawを駆使した最新の開発手法に精通し、AIツールの深い知見でhonkomaの実装を牽引する。",
    social: {
      x: "https://x.com/knbaseballstd",
      linkedin: "https://www.linkedin.com/in/kosuke-nakajima-05a115352",
      mail: "quickclip@ltdhonkoma.com",
    },
  },
];

const traits = [
  {
    icon: "🎯",
    title: "代表が、直接動く",
    desc: "大企業のたらい回しはない。相談から運用まで、当事者が責任を持って伴走する。",
  },
  {
    icon: "⚡",
    title: "設計から実装まで一気通貫",
    desc: "伝言ゲームなし。要件を聞いたその人が、そのまま設計し、実装まで作り切る。",
  },
  {
    icon: "🚀",
    title: "意思決定が、速い",
    desc: "大企業なら数ヶ月かかる判断も、その場で。若い組織のスピードで現場を動かす。",
  },
];

const techStack = [
  "Claude Code", "OpenClaw", "Python", "TypeScript", "React", "Node.js",
  "Notion API", "freee API", "Playwright", "LINE WORKS API", "Google Apps Script", "Cloudflare",
];

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        height: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        width: 40,
        height: 40,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        border: "1px solid color-mix(in srgb, var(--text-primary) 15%, transparent)",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </a>
  );
}

const TeamPage = () => {
  useEffect(() => {
    document.title = "メンバー | honkoma";
  }, []);

  return (
    <div style={{ background: "var(--surface-base)" }}>
      {/* ===== HERO ===== */}
      <SectionShell>
        <SectionHeading enLabel="Team" title="若き、AIマフィア。" level={1} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "46ch",
              margin: "1.5rem 0 0",
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
              lineHeight: 1.9,
            }}
          >
            東京大学・東京工業大学を中心に、若くて、常に最先端を追い続ける。
            honkomaは、そんなAIネイティブなメンバーが集う10名体制のチームです。
          </p>
        </Reveal>
      </SectionShell>

      {/* ===== MEMBERS ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="Founders" title="創業メンバー。" level={2} />
        <div style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)", display: "grid", gap: "clamp(3rem, 6vw, 5rem)" }}>
          {members.map((m) => (
            <Reveal key={m.name} variant="fadeUp">
              <div className="member-row">
                <div className="member-photo">
                  <img src={m.image} alt={m.name} />
                </div>
                <div className="member-info">
                  <span
                    className="font-en"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    {m.role}
                  </span>
                  <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: 700, margin: "0.5rem 0 0.25rem", color: "var(--text-primary)" }}>
                    {m.name}
                  </h3>
                  <p className="font-en" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.5rem" }}>
                    {m.nameEn}
                  </p>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 2, fontSize: "1rem" }}>{m.bio}</p>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
                    {m.social.x && (
                      <SocialIcon href={m.social.x} label="X (Twitter)">
                        <Twitter size={16} />
                      </SocialIcon>
                    )}
                    {"linkedin" in m.social && m.social.linkedin && (
                      <SocialIcon href={m.social.linkedin} label="LinkedIn">
                        <Linkedin size={16} />
                      </SocialIcon>
                    )}
                    {m.social.mail && (
                      <SocialIcon href={`mailto:${m.social.mail}`} label="Email">
                        <Mail size={16} />
                      </SocialIcon>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* ===== HOW WE WORK ===== */}
      <SectionShell theme="inverse" wedge="top">
        <SectionHeading enLabel="How We Work" title="現場に、最先端を。" level={2} />
        <Reveal variant="fade">
          <p
            style={{
              maxWidth: "46ch",
              margin: "1.5rem 0 clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              lineHeight: 1.9,
            }}
          >
            少数精鋭だからこそのスピードと一貫性。最先端のAIを、当たり前の道具として現場に持ち込む。
          </p>
        </Reveal>
        <StaggerGrid columns={{ base: 1, md: 3 }} gap="md">
          {traits.map((t) => (
            <Card key={t.title}>
              <span style={{ fontSize: "1.75rem" }}>{t.icon}</span>
              <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: 700, margin: "1rem 0 0.75rem", color: "var(--text-primary)" }}>
                {t.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.85 }}>{t.desc}</p>
            </Card>
          ))}
        </StaggerGrid>
      </SectionShell>

      {/* ===== TECH STACK ===== */}
      <SectionShell wedge="top">
        <SectionHeading enLabel="Stack" title="使う道具。" level={2} />
        <Reveal variant="fadeUp">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "clamp(2rem, 4vw, 3rem)" }}>
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-en"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </SectionShell>

      {/* ===== CTA ===== */}
      <SectionShell theme="inverse" wedge="top" width="content">
        <div style={{ maxWidth: 720 }}>
          <SectionHeading enLabel="Join / Contact" title="一緒に、時代をつくる。" level={2} />
          <Reveal variant="fadeUp">
            <p
              style={{
                margin: "1.5rem 0 clamp(2rem, 4vw, 3rem)",
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.9,
                maxWidth: "42ch",
              }}
            >
              AI導入のご相談も、仲間としての参加も。まずは気軽に話しましょう。
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <ArrowCTA to="/contact" size="lg" variant="fill" withText="相談する" label="相談する" />
              <ArrowCTA to="/about" variant="ghost" withText="会社概要" label="会社概要" />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* scoped member layout */}
      <style>{`
        .member-row { display: grid; grid-template-columns: 1fr; gap: clamp(1.5rem, 4vw, 3rem); align-items: start; }
        .member-photo { width: 100%; max-width: 320px; aspect-ratio: 3 / 4; overflow: hidden; border-radius: var(--radius-lg); }
        .member-photo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: filter 0.6s cubic-bezier(0.16,1,0.3,1); }
        .member-row:hover .member-photo img { filter: grayscale(0); }
        @media (min-width: 768px) {
          .member-row { grid-template-columns: 320px 1fr; gap: clamp(2.5rem, 5vw, 4rem); }
        }
      `}</style>
    </div>
  );
};

export default TeamPage;
