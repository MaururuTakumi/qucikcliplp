/// <reference types="vite/client" />

interface Window {
  __GA_ID__?: string;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
