import { business, serviceCities, siteUrl } from "@/lib/site";

/**
 * GeneralContractor (a LocalBusiness subtype) describing the business for search
 * engines and AI assistants.
 *
 * `legalName` is deliberately absent: the corporate entity name is pending
 * confirmation from the owner, and publishing a guess in structured data is worse
 * than omitting it — it is exactly the kind of claim a public-contracting review
 * would check.
 */
export function buildBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteUrl}/#business`,
    name: business.publicName,
    url: siteUrl,
    image: `${siteUrl}/assets/logo.png`,
    logo: `${siteUrl}/assets/logo.png`,
    telephone: business.phoneE164,
    email: business.email,
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: business.employeeCount,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.postalCode,
      addressCountry: "US",
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 37.9621,
          longitude: -122.3455,
        },
        // 35 miles in meters.
        geoRadius: "56327",
      },
      ...serviceCities.map((city) => ({
        "@type": "City",
        name: city,
        addressRegion: "CA",
        addressCountry: "US",
      })),
    ],
    knowsLanguage: ["en", "es"],
    identifier: {
      "@type": "PropertyValue",
      name: "California contractor license",
      value: business.license,
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "California contractor license",
        name: `CSLB License #${business.license} — Class ${business.licenseClass}, ${business.licenseClassName}`,
        identifier: business.license,
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Contractors State License Board",
          url: "https://www.cslb.ca.gov/",
        },
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Framing and construction services",
      itemListElement: [
        "Rough framing",
        "Structural framing",
        "Wood framing",
        "Metal framing",
        "Room additions",
        "Remodel and reframing",
        "Residential construction",
        "Light commercial construction",
        "General construction coordination",
      ].map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
    sameAs: [business.cslbVerifyUrl],
    description:
      "Residential, commercial and government-eligible rough and structural framing, " +
      "additions, remodel framing and coordinated construction in San Pablo and the " +
      "surrounding Bay Area. CSLB #1144949, Class B General Building Contractor. " +
      "Liability insurance and workers' compensation in force. Crew of 11.",
  };
}

/** Serialized for a <script type="application/ld+json"> tag. */
export function businessSchemaJson() {
  return JSON.stringify(buildBusinessSchema());
}
