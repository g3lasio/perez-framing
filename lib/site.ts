/**
 * Single source of truth for business facts, canonical URL, and credentials.
 *
 * Everything the site renders about the business comes from here so a change is
 * one edit, not a hunt through components.
 */

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!configuredSiteUrl) {
  // Deliberately fatal. A silent fallback is what previously shipped canonical,
  // og:url and og:image pointing at a prototype domain, which tells Google the
  // authoritative copy lives somewhere else and keeps this site out of the index.
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not set. Set it to the canonical production origin " +
      "(for example https://perezroughframing.com) in the deployment environment, " +
      "or in .env.local for local development. The build fails without it on purpose: " +
      "canonical, og:url, og:image and twitter:image are all derived from it.",
  );
}

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");

export const business = {
  /**
   * The only public name. There is no "Specialist" variant and no corporate suffix.
   * The legal entity name is pending confirmation from the owner and is intentionally
   * absent — nothing renders it until it is confirmed.
   */
  publicName: "Perez Rough Framing",
  phoneDisplay: "(415) 419-4496",
  phoneE164: "+14154194496",
  email: "perez.hp450@gmail.com",
  license: "1144949",
  licenseClass: "B",
  licenseClassName: "General Building Contractor",
  city: "San Pablo",
  state: "CA",
  postalCode: "94806",
  serviceRadiusMiles: 35,
  employeeCount: 11,
  cslbVerifyUrl:
    "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1144949",
} as const;

/**
 * Estimate visits happen on weekends because the crew is on site during the week.
 * Requests are scheduled 2 to 5 days ahead.
 */
export const scheduling = {
  minLeadDays: 2,
  maxLeadDays: 5,
  /** 0 = Sunday, 6 = Saturday. */
  allowedWeekdays: [0, 6] as const,
} as const;

/**
 * Named service-area cities. "35 miles" alone gives search engines nothing local
 * to match against.
 */
export const serviceCities = [
  "Richmond",
  "El Cerrito",
  "Berkeley",
  "Oakland",
  "Albany",
  "Pinole",
  "Hercules",
  "Vallejo",
  "Martinez",
  "Concord",
  "Walnut Creek",
  "San Rafael",
  "Alameda",
  "San Leandro",
] as const;

/**
 * Credentials confirmed by the business owner. Policy numbers, coverage amounts and
 * expiry dates are deliberately absent — only the existence of coverage is published.
 */
export const credentials = {
  es: [
    {
      key: "license",
      title: "Licencia CSLB #1144949",
      body: "Clase B — General Building Contractor.",
      verify: "Verificar en CSLB",
    },
    {
      key: "liability",
      title: "Seguro de responsabilidad civil",
      body: "Cobertura vigente.",
    },
    {
      key: "workers",
      title: "Workers' compensation",
      body: "Cobertura vigente para el equipo.",
    },
    {
      key: "certified",
      title: "Trabajo comercial, gubernamental y residencial",
      body: "Certificados para los tres tipos de proyecto.",
    },
    {
      key: "crew",
      title: "Equipo de 11 personas",
      body: "Cuadrilla propia en nómina.",
    },
  ],
  en: [
    {
      key: "license",
      title: "CSLB License #1144949",
      body: "Class B — General Building Contractor.",
      verify: "Verify with CSLB",
    },
    {
      key: "liability",
      title: "General liability insurance",
      body: "Coverage in force.",
    },
    {
      key: "workers",
      title: "Workers' compensation",
      body: "Coverage in force for the crew.",
    },
    {
      key: "certified",
      title: "Commercial, government and residential work",
      body: "Certified for all three project types.",
    },
    {
      key: "crew",
      title: "11-person crew",
      body: "Our own team on payroll.",
    },
  ],
} as const;
