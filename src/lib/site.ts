// Single source of truth for facts that appear on more than one page.

export const DOWNLOAD_URL = "https://dub.sh/scholarmate-download";
export const APP_VERSION = "v7.0.0";
export const CONTACT_EMAIL = "princeaistudio@gmail.com";
export const INSTAGRAM_URL = "https://instagram.com/officialprinceaistudio";
export const INSTAGRAM_HANDLE = "@officialprinceaistudio";

// Pro plan prices in naira. The per-day figure is derived, never typed in by hand.
export const PRO_PLANS = [
  { id: "week", label: "1 week", days: 7, price: 700 },
  { id: "month", label: "1 month", days: 30, price: 2000 },
  { id: "quarter", label: "90 days", days: 90, price: 4000 },
] as const;

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const perDay = (price: number, days: number) => Math.round(price / days);

// localStorage keys shared by the landing page and the free tools.
export const TRY_TAB_KEY = "scholarmate:tryTab";
