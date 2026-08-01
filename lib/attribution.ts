/**
 * First-touch campaign attribution.
 *
 * Leadprime reads `utm_*`, `gclid`, `fbclid`, and `msclkid` off the lead payload to
 * decide whether a lead came from Google Ads, Meta, Microsoft Ads, or an organic
 * visit. Those values only exist on the landing URL, which is usually not the URL
 * the visitor is on by the time they submit the form — so they are captured once,
 * on arrival, and kept for the rest of the session.
 *
 * First touch wins: if the visitor arrives from an ad and later returns through an
 * organic link in the same session, the ad still gets the credit.
 */

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>> & {
  page_url?: string;
  referrer?: string;
};

const STORAGE_KEY = "rfs-attribution";

/** Read whatever the session has already recorded. Safe to call at any time. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

/**
 * Record the campaign data for this session. Called once per page load so a visitor
 * who lands on an ad URL and then browses to another page keeps their attribution.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const stored = readAttribution();
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};

  for (const field of ATTRIBUTION_FIELDS) {
    const value = params.get(field)?.trim();
    if (value) fresh[field] = value.slice(0, 200);
  }

  const hasStoredCampaign = ATTRIBUTION_FIELDS.some((field) => stored[field]);
  const campaign = hasStoredCampaign ? stored : fresh;

  const attribution: Attribution = {
    ...campaign,
    // Landing page and referrer describe the first page of the session too, so they
    // are only written once alongside the campaign data.
    page_url: stored.page_url || window.location.href.slice(0, 500),
    referrer: stored.referrer || document.referrer.slice(0, 500) || undefined,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Private browsing or a storage quota error is not worth failing the page over.
  }

  return attribution;
}
