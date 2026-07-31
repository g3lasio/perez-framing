const fallbackSiteUrl = "https://rough-frame-specialist.g3lasio.chatgpt.site";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl
).replace(/\/$/, "");

export const business = {
  publicName: "Perez Rough Frame Specialist",
  legalName: "Perez Rough Frame Specialists Corp.",
  phoneDisplay: "(415) 419-4496",
  phoneE164: "+14154194496",
  email: "perez.hp450@gmail.com",
  license: "1144949",
  city: "San Pablo",
  state: "CA",
  postalCode: "94806",
  serviceRadiusMiles: 35,
} as const;
