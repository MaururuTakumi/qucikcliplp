import React from "react";
import { ArrowCTA } from "../../../components/ui/ArrowCTA";
import { dur, ease } from "../../../design/tokens";
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
  body = "URLを入れるだけで、売上を伸ばす施策・コストを削る施策・現場に実装する一手を整理します。",
  compact = false,
}: AIStarterBandProps) {
  const { startAnalysis, state } = useAiChat();
  const [url, setUrl] = React.useState(state.companyUrl);

  useStarterStyles();

  React.useEffect(() => {
    if (!state.companyUrl) return;
    setUrl(state.companyUrl);
  }, [state.companyUrl]);

  const submit = () => {
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
        <form className="aistarter-form" onSubmit={onSubmit}>
          <input
            className="aistarter-input"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <ArrowCTA onClick={submit} size="md" variant="fill" withText="AIに聞いてみる" label="AIに聞いてみる" />
        </form>
      </div>
    </section>
  );
}

export default AIStarterBand;
