import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business, credentials, scheduling, serviceCities } from "@/lib/site";
import { cities, cityBySlug } from "@/lib/cities";
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
    `Framing estructural, ampliaciones y reframing en ${city.name} y el condado de ` +
    `${city.county}. CSLB #${business.license} Clase ${business.licenseClass}, seguro y ` +
    `workers' compensation vigentes, equipo de ${business.employeeCount} personas. Estimados gratis en fin de semana.`;

  return {
    title,
    description,
    alternates: { canonical: `/framing/${city.slug}` },
    openGraph: { title: `${title} | ${business.publicName}`, description, url: `/framing/${city.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params;
  const city = cityBySlug(slug);
  if (!city) notFound();

  const others = cities.filter((entry) => entry.slug !== city.slug).slice(0, 6);

  // Same business schema, narrowed to the city this page is about.
  const schema = {
    ...buildBusinessSchema(),
    "@id": undefined,
    areaServed: {
      "@type": "City",
      name: city.name,
      addressRegion: "CA",
      addressCountry: "US",
    },
  };

  return (
    <main className="legal-page city-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="legal-shell">
        <Link className="legal-back" href="/">
          ← {business.publicName}
        </Link>

        <p className="eyebrow">
          {city.name}, California · Condado de {city.county}
        </p>
        <h1>Contratista de framing en {city.name}</h1>
        <p className="legal-lead">
          Framing estructural, ampliaciones y reframing para propietarios, builders y
          contratistas generales en {city.name}. Con base en {business.city} y cobertura
          de aproximadamente {business.serviceRadiusMiles} millas.
        </p>

        <div className="city-actions">
          <a className="button button-copper" href={`tel:${business.phoneE164}`}>
            Llamar {business.phoneDisplay}
          </a>
          <Link className="button button-ghost" href="/#estimate">
            Solicitar estimado gratis
          </Link>
        </div>

        <section>
          <h2>Las casas de {city.name}</h2>
          <p>{city.es.stock}</p>
        </section>

        <section>
          <h2>En qué trabajamos aquí</h2>
          <p>{city.es.work}</p>
          <ul className="city-tags">
            {city.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Lo que conviene saber</h2>
          <p>{city.es.note}</p>
          <p>
            Los estimados son gratuitos y se hacen en persona. Se agendan en fin de semana
            con {scheduling.minLeadDays} a {scheduling.maxLeadDays} días de anticipación,
            porque entre semana el equipo está en obra. Los precios se dan únicamente en
            persona, después de revisar el sitio y el alcance.
          </p>
        </section>

        <section>
          <h2>Credenciales</h2>
          <ul className="credential-list">
            {credentials.es.map((item) => (
              <li key={item.key}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
          <a className="legal-source" href={business.cslbVerifyUrl} target="_blank" rel="noreferrer">
            Verificar licencia en CSLB ↗
          </a>
        </section>

        <section>
          <h2>Para builders y contratistas generales en {city.name}</h2>
          <p>
            Cuadrilla propia de {business.employeeCount} personas en nómina, seguro de
            responsabilidad civil y workers&rsquo; compensation vigentes, y elegibilidad para
            trabajo comercial, gubernamental y residencial. El paquete de cumplimiento —
            COI, certificado de workers&rsquo; comp, verificación de licencia y W-9 — está
            listo para enviarse cuando lo pidas.
          </p>
          <a
            className="button button-copper legal-cta"
            href={`mailto:${business.email}?subject=${encodeURIComponent(
              `Perez Rough Framing — bid set en ${city.name}`,
            )}`}
          >
            Enviar bid set para revisión
          </a>
        </section>

        <section>
          <h2>Otras ciudades que atendemos</h2>
          <ul className="city-links">
            {others.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/framing/${entry.slug}`}>Framing en {entry.name}</Link>
              </li>
            ))}
          </ul>
          <p className="city-radius">
            Cobertura general de aproximadamente {business.serviceRadiusMiles} millas
            alrededor de {business.city}, incluyendo {serviceCities.slice(0, -1).join(", ")} y{" "}
            {serviceCities[serviceCities.length - 1]}. La aceptación depende del proyecto,
            acceso, calendario y capacidad disponible.
          </p>
        </section>
      </div>
    </main>
  );
}
