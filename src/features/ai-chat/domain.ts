import type { EmailDomainMatch } from "./types";

const JP_THREE_LABEL_SLDS = new Set(["co", "ne", "or", "ac", "go", "ed", "lg", "gr"]);

const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.co.jp",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "docomo.ne.jp",
  "ezweb.ne.jp",
  "au.com",
  "softbank.ne.jp",
  "i.softbank.jp",
]);

function cleanHost(host: string) {
  return host.trim().toLowerCase().replace(/^www\./, "");
}

export function registrableDomainFromHost(host: string) {
  const clean = cleanHost(host);
  const labels = clean.split(".").filter(Boolean);
  if (labels.length <= 2) return clean;
  const tld = labels.at(-1);
  const sld = labels.at(-2);
  if (tld === "jp" && sld && JP_THREE_LABEL_SLDS.has(sld) && labels.length >= 3) {
    return labels.slice(-3).join(".");
  }
  return labels.slice(-2).join(".");
}

export function domainFromUrl(value: string) {
  try {
    return registrableDomainFromHost(new URL(value).hostname);
  } catch {
    try {
      return registrableDomainFromHost(new URL(`https://${value}`).hostname);
    } catch {
      return "";
    }
  }
}

export function domainFromEmail(email: string) {
  const domain = email.trim().toLowerCase().split("@")[1] || "";
  return domain ? registrableDomainFromHost(domain) : "";
}

export function emailDomainMatchFor(email: string, companyUrl: string): EmailDomainMatch {
  const emailDomain = domainFromEmail(email);
  if (!emailDomain) return "mismatch";
  if (FREEMAIL_DOMAINS.has(emailDomain)) return "freemail";
  const urlDomain = domainFromUrl(companyUrl);
  if (urlDomain && emailDomain === urlDomain) return "match";
  return "mismatch";
}

export function emailPlaceholderForCompany(companyUrl: string) {
  const domain = domainFromUrl(companyUrl);
  return domain ? `name@${domain}` : "name@company.co.jp";
}
