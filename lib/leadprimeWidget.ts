/**
 * Leadprime Embed Kit configuration (browser side).
 *
 * The widget token is a public credential by design — the official Embed Kit ships
 * it in the page source of every site that uses it. It is not a secret, and the
 * real boundary is the per-token domain allow-list configured in the Leadprime
 * account (Website → Widget → allowed domains) plus Leadprime's own rate limits.
 *
 * The site talks to the same public endpoints the official `embed.js` calls, so
 * the assistant keeps the business's own Leadprime identity, knowledge base, and
 * lead-capture behavior while wearing this site's interface.
 */

const DEFAULT_API_BASE = "https://leadprime.chyrris.com";
const DEFAULT_WIDGET_TOKEN = "lp_wid_156f26383f482d9a4b3baf857c0c34563121b3ed";

export const widgetToken =
  process.env.NEXT_PUBLIC_LEADPRIME_WIDGET_TOKEN?.trim() || DEFAULT_WIDGET_TOKEN;

const apiBase = (
  process.env.NEXT_PUBLIC_LEADPRIME_API_BASE?.trim() || DEFAULT_API_BASE
).replace(/\/$/, "");

export const widgetApi = {
  config: `${apiBase}/api/widget/config`,
  chat: `${apiBase}/api/widget/chat`,
  lead: `${apiBase}/api/widget/lead`,
} as const;

/** Branding and consent settings the business manages inside Leadprime. */
export type WidgetConfig = {
  agentName?: string;
  businessName?: string;
  greeting?: string;
  /** Agent avatar set in the Leadprime account. Takes precedence over the site mark. */
  avatarUrl?: string;
  /** Business logo set in the Leadprime account. Used when no avatar is set. */
  logoUrl?: string;
  requireConsent?: boolean;
  consentText?: string;
};

export type ChatReply = {
  reply: string;
  sessionId?: string;
  leadId?: string;
};
