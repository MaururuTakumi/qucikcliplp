/* =============================================================================
 * ChatDrawer — AI診断の右ドロワー(殻)。本体UIは ChatStage が描画する
 * (ChatStage は /ai インライン版と共有)。ここは overlay/panel/header/フォーカス
 * トラップ/スクロールロックに専念する。
 * ========================================================================== */

import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { dur, ease } from "../../../design/tokens";
import { useAiChat } from "../ChatProvider";
import { ChatStage, useChatStyles } from "./ChatStage";

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
}

export function ChatDrawer() {
  const { state, closeChat } = useAiChat();
  const panelRef = React.useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useChatStyles();

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!state.isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const first = panelRef.current ? getFocusable(panelRef.current)[0] : undefined;
      first?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeChat();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = getFocusable(panelRef.current);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousActive?.focus();
    };
  }, [closeChat, state.isOpen]);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <m.div
          className="aichat-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.fast, ease: ease.soft }}
          role="presentation"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) closeChat();
          }}
        >
          <m.aside
            ref={panelRef}
            className="aichat-panel"
            data-theme="inverse"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aichat-title"
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ duration: dur.base, ease: ease.inOut }}
          >
            <ChatStage onNavigate={closeChat} onClose={closeChat} />
          </m.aside>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default ChatDrawer;
