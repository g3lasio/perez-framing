import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityLanding from "@/components/CityLanding";
import { business } from "@/lib/site";
import { cities, cityBySlug, cityPhoto } from "@/lib/cities";
import { buildBusinessSchema } from "@/lib/structuredData";

type Params = { city: string };

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug(slug);
  if (!city) return {};

  const title = `Contratista de framing en ${city.name}, CA`;
  const description =
    `Framing estructural, ampliaciones y reframing en ${city.name}, condado de ${city.county}. ` +
    `CSLB #${business.license} Clase ${business.licenseClass}, seguro y workers' compensation ` +
    `vigentes, equipo de ${business.employeeCount} personas. Estimados gratis en fin de semana.`;

  return {
    title,
    description,
    alternates: { canonical: `/framing/${city.slug}` },
    // Declaring openGraph on a page replaces the layout's block wholesale, images
    // included — so every one of these has to name its own or the page shares with
    // no preview at all. Each city uses the photo it actually shows in its hero.
    openGraph: {
      title: `${title} | ${business.publicName}`,
      description,
      url: `/framing/${city.slug}`,
      images: [cityPhoto(city)],
    },
    twitter: { card: "summary_large_image", title, description, images: [cityPhoto(city)] },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params;
  const city = cityBySlug(slug);
  if (!city) notFound();

  // Nearest cities by priority, so the internal links point somewhere plausible
  // rather than always listing the same six.
  const others = cities
    .filter((entry) => entry.slug !== city.slug)
    .sort((a, b) => Math.abs(a.priority - city.priority) - Math.abs(b.priority - city.priority))
    .slice(0, 6);

  const business_schema = {
    ...buildBusinessSchema(),
    "@id": undefined,
    areaServed: {
      "@type": "City",
      name: city.name,
      addressRegion: "CA",
      addressCountry: "US",
    },
  };

  // The local Q&A is genuinely per-city, so it earns FAQPage markup rather than
  // repeating the same answers across ten URLs.
  const faq_schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faq.es.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business_schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq_schema) }}
      />
      <CityLanding city={city} others={others} />
    </>
  );
}
