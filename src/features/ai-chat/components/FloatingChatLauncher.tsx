import React from "react";
import { m, useReducedMotion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { dur, ease } from "../../../design/tokens";
import { useAiChat } from "../ChatProvider";

const FLOAT_STYLE = `
.aifloat {
  --float-dur-fast: ${dur.fast}s;
  --float-loop: ${dur.hero * 3}s;
  --float-ease: cubic-bezier(${ease.soft.join(",")});
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 55;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 3rem;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-pill);
  border: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
  background: color-mix(in srgb, var(--surface-raised) 94%, transparent);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  box-shadow: 0 12px 36px -22px color-mix(in srgb, var(--ink-900) 70%, transparent);
  cursor: pointer;
  transition:
    border-color var(--float-dur-fast) var(--float-ease),
    color var(--float-dur-fast) var(--float-ease),
    transform var(--float-dur-fast) var(--float-ease);
}
.aifloat-dot {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--text-on-inverse);
}
.aifloat-text {
  display: grid;
  gap: 0.05rem;
  text-align: left;
}
.aifloat-main {
  font-size: 0.86rem;
  font-weight: 700;
}
.aifloat-sub {
  font-size: 0.72rem;
  color: var(--text-secondary);
}
@media (hover: hover) {
  .aifloat:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
  }
}
.aifloat:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--surface-base), 0 0 0 4px var(--focus-ring);
}
@media (max-width: 520px) {
  .aifloat {
    left: max(1rem, env(safe-area-inset-left));
    justify-content: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .aifloat {
    transition: none !important;
  }
}
`;

let styleInjected = false;

function useFloatingStyles() {
  React.useEffect(() => {
    if (styleInjected || typeof document === "undefined") return;
    const element = document.createElement("style");
    element.setAttribute("data-aifloat", "");
    element.textContent = FLOAT_STYLE;
    document.head.appendChild(element);
    styleInjected = true;
  }, []);
}

export function FloatingChatLauncher() {
  const { state, openChat } = useAiChat();
  const reduce = useReducedMotion();

  useFloatingStyles();

  if (state.isOpen) return null;

  return (
    <m.button
      className="aifloat"
      type="button"
      onClick={() => openChat({ source: "float" })}
      aria-label="AI活用診断を開く"
      initial={reduce ? undefined : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: dur.reveal, ease: ease.out }}
    >
      <span className="aifloat-dot" aria-hidden="true">
        <MessageSquareText size={17} />
      </span>
      <span className="aifloat-text">
        <span className="aifloat-main">AI活用診断</span>
        <span className="aifloat-sub">URLから3案を作成</span>
      </span>
    </m.button>
  );
}

export default FloatingChatLauncher;
