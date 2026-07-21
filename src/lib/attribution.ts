const FIRST_TOUCH_KEY = "hk_first_touch";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export type FirstTouchAttribution = {
  referrer?: string;
  utm?: string;
  landingPath: string;
};

function currentLandingPath() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

function currentUtm() {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const entries: string[][] = [];
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) entries.push([key, value]);
  }
  return entries.length ? new URLSearchParams(entries).toString() : undefined;
}

function currentReferrer() {
  if (typeof document === "undefined") return undefined;
  return document.referrer || undefined;
}

function readStoredFirstTouch(): FirstTouchAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FirstTouchAttribution>;
    if (!parsed.landingPath) return null;
    return {
      referrer: parsed.referrer || undefined,
      utm: parsed.utm || undefined,
      landingPath: parsed.landingPath,
    };
  } catch {
    return null;
  }
}

export function firstTouchAttribution(): FirstTouchAttribution {
  const stored = readStoredFirstTouch();
  if (stored) return stored;

  const attribution: FirstTouchAttribution = {
    referrer: currentReferrer(),
    utm: currentUtm(),
    landingPath: currentLandingPath(),
  };
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
    } catch {
      // Attribution is helpful context, not a reason to block the funnel.
    }
  }
  return attribution;
}
