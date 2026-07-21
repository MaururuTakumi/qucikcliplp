import React from "react";
import { Link } from "react-router-dom";
import { ArrowCTA } from "../../../components/ui/ArrowCTA";
import { dur, ease } from "../../../design/tokens";
import { normalizeCompanyUrl } from "../api/client";
import { useAiChat } from "../ChatProvider";
import type { ChatSource } from "../types";

type AIStarterBandProps = {
  source: ChatSource;
  title?: string;
  body?: string;
  compact?: boolean;
};

const BAND_STYLE = `
.aistarter {
  --starter-dur-fast: ${dur.fast}s;
  --starter-ease: cubic-bezier(${ease.soft.join(",")});
  background: var(--surface-base);
  color: var(--text-primary);
  border-block: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);
}
.aistarter-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.4rem, 3vw, 2.25rem) var(--space-gutter);
  display: grid;
  gap: 1.25rem;
  align-items: center;
}
.aistarter-copy {
  display: grid;
  gap: 0.4rem;
}
.aistarter-label {
  font-family: var(--font-en);
  font-size: 0.75rem;
  color: var(--color-accent);
}
.aistarter h2 {
  margin: 0;
  font-size: clamp(1.15rem, 2vw, 1.7rem);
  line-height: 1.55;
}
.aistarter p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.75;
  font-size: 0.94rem;
}
.aistarter-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.9rem;
  align-items: center;
}
.aistarter-input {
  min-height: 3.5rem;
  border: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  color: var(--text-primary);
  padding: 0 1rem;
  font: inherit;
  transition: border-color var(--starter-dur-fast) var(--starter-ease), box-shadow var(--starter-dur-fast) var(--starter-ease);
}
.aistarter-input:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus-ring) 28%, transparent);
}
.aistarter-input::placeholder {
  color: color-mix(in srgb, var(--text-primary) 42%, transparent);
}
.aistarter-input:disabled {
  opacity: 0.6;
  cursor: wait;
}
.aistarter-error {
  margin: 0.6rem 0 0;
  color: var(--color-accent-bright);
  font-size: 0.85rem;
  line-height: 1.5;
}
.aistarter-micro {
  margin: 0.55rem 0 0;
  color: color-mix(in srgb, var(--text-primary) 55%, transparent);
  font-size: 0.78rem;
  line-height: 1.65;
}
.aistarter-microlink {
  color: var(--color-accent);
}
@media (min-width: 900px) {
  .aistarter-inner {
    grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1fr);
  }
}
@media (max-width: 640px) {
  .aistarter-form {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .aistarter-input {
    transition: none !important;
  }
}
`;

let styleInjected = false;

function useStarterStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === "undefined") return;
    const element = document.createElement("style");
    element.setAttribute("data-aistarter", "");
    element.textContent = BAND_STYLE;
    document.head.appendChild(element);
    styleInjected = true;
  }, []);
}

export function AIStarterBand({
  source,
  title = "御社サイトから、AI活用案を3つ出します。",
  body = "URLを入れるだけ。売上を伸ばす・コストを削る・現場に実装する、の3軸で整理します。",
  compact = false,
}: AIStarterBandProps) {
  const { startAnalysis, state } = useAiChat();
  const [url, setUrl] = React.useState(state.companyUrl);
  const [error, setError] = React.useState<string | null>(null);

  useStarterStyles();

  React.useEffect(() => {
    if (!state.companyUrl) return;
    setUrl(state.companyUrl);
  }, [state.companyUrl]);

  const submit = () => {
    /* §E.1-1 バグ修正: 無効URLはドロワーを開かず、Band内にインラインで差し戻す
     * (旧: startAnalysisがleadFailをdispatchするだけ→ドロワー未開で無反応)。 */
    if (!normalizeCompanyUrl(url)) {
      setError("会社サイトのURLを入力してください。");
      return;
    }
    setError(null);
    void startAnalysis(source, url);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <section className="aistarter" aria-label="AI活用診断">
      <div
        className="aistarter-inner"
        style={compact ? { paddingBlock: "clamp(1.1rem, 2vw, 1.6rem)" } : undefined}
      >
        <div className="aistarter-copy">
          <span className="aistarter-label">Ask AI</span>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div>
          <form className="aistarter-form" onSubmit={onSubmit}>
            <input
              className="aistarter-input"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                if (error) setError(null);
              }}
              disabled={state.isBusy}
              aria-invalid={error ? true : undefined}
            />
            <ArrowCTA onClick={submit} size="md" variant="fill" withText="AIに聞いてみる" label="AIに聞いてみる" />
          </form>
          {error && (
            <p className="aistarter-error" role="alert">
              {error}
            </p>
          )}
          <p className="aistarter-micro">
            無料・約30秒。入力内容は途中でも品質向上のため保存されます（
            <Link to="/privacy" className="aistarter-microlink">
              プライバシーポリシー
            </Link>
            ）。
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIStarterBand;
