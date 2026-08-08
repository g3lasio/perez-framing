"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import AssistantChat from "@/components/AssistantChat";
import { MobileActionBar, SiteFooter, SiteHeader, SiteTopBar } from "@/components/SiteChrome";
import { business, credentials, scheduling } from "@/lib/site";
import { chrome } from "@/lib/chromeCopy";
import { useLanguage } from "@/lib/useLanguage";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { cityPhoto, cityPhotos } from "@/lib/cities";
import type { City } from "@/lib/cities";

const copy = {
  es: {
    eyebrowSuffix: "California",
    lead: (city: string) =>
      `Framing estructural, ampliaciones y reframing para propietarios, builders y contratistas generales en ${city}.`,
    call: "Llamar",
    estimate: "Solicitar estimado gratis",
    stockTitle: (city: string) => `Las casas de ${city}`,
    stockEyebrow: "Con qué nos encontramos",
    workTitle: (city: string) => `En qué trabajamos en ${city}`,
    workEyebrow: "Alcances",
    trustEyebrow: "Antes de contratar",
    trustTitle: "Credenciales verificables",
    trustNote:
      "No publicamos números de póliza, montos ni fechas de renovación. Se envían directamente a quien los solicite para un proyecto.",
    verify: "Verificar en CSLB",
    scheduleEyebrow: "Cómo trabajamos",
    scheduleTitle: "Lo que conviene saber antes de llamar",
    scheduleBody: `Los estimados son gratuitos y se hacen en persona. Se agendan en fin de semana con ${scheduling.minLeadDays} a ${scheduling.maxLeadDays} días de anticipación, porque entre semana el equipo está en obra. Los precios se dan únicamente en persona, después de revisar el sitio y el alcance.`,
    faqEyebrow: "Preguntas de la zona",
    faqTitle: (city: string) => `Dudas comunes en ${city}`,
    buildersEyebrow: "Builders y contratistas generales",
    buildersTitle: (city: string) => `¿Necesitas un subcontrato de framing en ${city}?`,
    buildersBody: `Cuadrilla propia de ${business.employeeCount} personas en nómina, seguro de responsabilidad civil y workers’ compensation vigentes, y elegibilidad para trabajo comercial, gubernamental y residencial.`,
    buildersKit:
      "El paquete de cumplimiento — COI, certificado de workers’ comp, verificación de licencia CSLB y W-9 — está preparado y sale cuando lo pidas.",
    buildersCta: "Enviar bid set para revisión",
    ctaTitle: (city: string) => `Cuéntanos de tu proyecto en ${city}`,
    ctaBody: "Comparte algunos detalles y revisamos qué sigue. Sin costo y sin compromiso.",
    othersEyebrow: "Cobertura",
    othersTitle: "Otras ciudades que atendemos",
    othersNote: `Cobertura general de aproximadamente ${business.serviceRadiusMiles} millas alrededor de ${business.city}. La aceptación depende del proyecto, acceso, calendario y capacidad disponible.`,
    photoLabel: "Proyecto real • Área de la Bahía",
  },
  en: {
    eyebrowSuffix: "California",
    lead: (city: string) =>
      `Structural framing, additions and reframing for homeowners, builders and general contractors in ${city}.`,
    call: "Call",
    estimate: "Request a free estimate",
    stockTitle: (city: string) => `The homes of ${city}`,
    stockEyebrow: "What we meet on site",
    workTitle: (city: string) => `What we work on in ${city}`,
    workEyebrow: "Scopes",
    trustEyebrow: "Before you hire",
    trustTitle: "Credentials you can verify",
    trustNote:
      "We do not publish policy numbers, limits or renewal dates. They go directly to whoever requests them for a project.",
    verify: "Verify with CSLB",
    scheduleEyebrow: "How we work",
    scheduleTitle: "What to know before you call",
    scheduleBody: `Estimates are free and done in person. They are booked on weekends, ${scheduling.minLeadDays} to ${scheduling.maxLeadDays} days ahead, because during the week the crew is on site. Pricing is given in person only, after seeing the site and the scope.`,
    faqEyebrow: "Local questions",
    faqTitle: (city: string) => `Common questions in ${city}`,
    buildersEyebrow: "Builders and general contractors",
    buildersTitle: (city: string) => `Need a framing subcontractor in ${city}?`,
    buildersBody: `Our own ${business.employeeCount}-person crew on payroll, general liability and workers’ compensation in force, and eligibility for commercial, government and residential work.`,
    buildersKit:
      "The compliance package — COI, workers’ comp certificate, CSLB license verification and W-9 — is prepared and goes out on request.",
    buildersCta: "Send a bid set for review",
    ctaTitle: (city: string) => `Tell us about your project in ${city}`,
    ctaBody: "Share a few details and we'll review what comes next. Free, no obligation.",
    othersEyebrow: "Coverage",
    othersTitle: "Other cities we serve",
    othersNote: `General coverage of roughly ${business.serviceRadiusMiles} miles around ${business.city}. Acceptance depends on the project, access, schedule and available capacity.`,
    photoLabel: "Real project • Bay Area",
  },
};

export default function CityLanding({ city, others }: { city: City; others: City[] }) {
  const { lang, changeLanguage } = useLanguage();
  useScrollReveal();

  const t = copy[lang];
  const local = city[lang];
  const nav = chrome[lang];
  const hero = cityPhoto(city);
  const support = cityPhotos[city.priority % cityPhotos.length];

  return (
    <div className="site-shell">
      <SiteTopBar lang={lang} />
      <SiteHeader lang={lang} onChangeLang={changeLanguage} base="/" />

      <main id="main">
        <section className="city-hero">
          <div className="hero-grain" aria-hidden="true" />
          <div className="container city-hero-grid">
            <div className="city-hero-copy">
              <p className="eyebrow light">
                {city.name}, {t.eyebrowSuffix} · {city.county} County
              </p>
              <h1>
                {lang === "es" ? "Contratista de framing en" : "Framing contractor in"}{" "}
                <span>{city.name}</span>
              </h1>
              <p className="hero-body">{t.lead(city.name)}</p>

              <ul className="city-hero-facts">
                <li>
                  <Icon name="shield" size={17} />
                  CSLB #{business.license} · {lang === "es" ? "Clase" : "Class"}{" "}
                  {business.licenseClass}
                </li>
                <li>
                  <Icon name="check" size={17} strokeWidth={2.4} />
                  {lang === "es"
                    ? "Seguro y workers’ comp vigentes"
                    : "Insurance and workers’ comp in force"}
                </li>
                <li>
                  <Icon name="building" size={17} />
                  {business.employeeCount} {lang === "es" ? "personas en nómina" : "on payroll"}
                </li>
              </ul>

              <div className="hero-actions">
                <Link className="button button-copper" href="/#estimate">
                  {t.estimate}
                  <Icon name="arrow" size={19} />
                </Link>
                <a className="button button-ghost" href={`tel:${business.phoneE164}`}>
                  <Icon name="phone" size={18} />
                  {t.call} {business.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="city-hero-visual">
              <div className="hero-image-frame">
                <Image src={hero} alt="" width={768} height={1024} priority />
                <div className="hero-image-shade" />
                <div className="hero-image-label">
                  <span />
                  {t.photoLabel}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-reveal className="section city-stock">
          <div className="container city-split">
            <div>
              <p className="eyebrow">{t.stockEyebrow}</p>
              <h2 className="section-title">{t.stockTitle(city.name)}</h2>
              <p className="city-prose">{local.stock}</p>
              <p className="city-prose">{local.note}</p>
            </div>
            <div className="city-split-visual">
              <Image src={support} alt="" width={1024} height={768} />
            </div>
          </div>
        </section>

        <section data-reveal className="section city-work">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.workEyebrow}</p>
                <h2 className="section-title">{t.workTitle(city.name)}</h2>
              </div>
              <p>{local.work}</p>
            </div>
            <div className="city-scope-grid">
              {city.services.map((service, index) => (
                <article key={service}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{service}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal className="section credentials">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.trustEyebrow}</p>
                <h2 className="section-title">{t.trustTitle}</h2>
              </div>
              <p>{t.scheduleBody}</p>
            </div>
            <ul className="credential-grid">
              {credentials[lang].map((item) => (
                <li key={item.key}>
                  <span className="credential-check">
                    <Icon name="shield" size={20} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                    {"verify" in item && item.verify ? (
                      <a href={business.cslbVerifyUrl} target="_blank" rel="noreferrer">
                        {t.verify}
                        <Icon name="arrow" size={15} />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <p className="credential-note">{t.trustNote}</p>
          </div>
        </section>

        <section data-reveal className="section faq">
          <div className="container faq-grid">
            <div className="faq-intro">
              <p className="eyebrow">{t.faqEyebrow}</p>
              <h2 className="section-title">{t.faqTitle(city.name)}</h2>
              <a className="text-link" href={`tel:${business.phoneE164}`}>
                <Icon name="phone" size={18} />
                {business.phoneDisplay}
              </a>
            </div>
            <div className="faq-list">
              {city.faq[lang].map((item, index) => (
                <details key={item.q} open={index === 0}>
                  <summary>
                    {item.q}
                    <span>
                      <Icon name="chevron" size={19} />
                    </span>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal className="section builders" id="builders">
          <div className="container builders-grid">
            <div className="builders-copy">
              <p className="eyebrow light">{t.buildersEyebrow}</p>
              <h2 className="section-title light">{t.buildersTitle(city.name)}</h2>
              <p>{t.buildersBody}</p>
              <p>{t.buildersKit}</p>
              <div className="builders-actions">
                <a
                  className="button button-copper"
                  href={`mailto:${business.email}?subject=${encodeURIComponent(
                    `Perez Rough Framing — bid set en ${city.name}`,
                  )}`}
                >
                  {t.buildersCta}
                  <Icon name="arrow" size={19} />
                </a>
                <a className="button button-ghost" href={`tel:${business.phoneE164}`}>
                  <Icon name="phone" size={18} />
                  {t.call}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section data-reveal className="section city-cta" id="estimate">
          <div className="container city-cta-inner">
            <div>
              <h2 className="section-title">{t.ctaTitle(city.name)}</h2>
              <p>{t.ctaBody}</p>
            </div>
            <div className="hero-actions">
              <Link className="button button-copper" href="/#estimate">
                {t.estimate}
                <Icon name="arrow" size={19} />
              </Link>
              <a className="button button-ghost" href={`sms:${business.phoneE164}`}>
                <Icon name="message" size={18} />
                {nav.mobile.text}
              </a>
            </div>
          </div>
        </section>

        <section data-reveal className="section city-others">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.othersEyebrow}</p>
                <h2 className="section-title">{t.othersTitle}</h2>
              </div>
              <p>{t.othersNote}</p>
            </div>
            <div className="city-others-grid">
              {others.map((entry) => (
                <a key={entry.slug} href={`/framing/${entry.slug}`}>
                  <strong>{entry.name}</strong>
                  <small>{entry.county} County</small>
                  <Icon name="arrow" size={17} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} base="/" />
      <AssistantChat lang={lang} copy={nav.chat} phoneHref={business.phoneE164} />
      <MobileActionBar lang={lang} base="/" />
    </div>
  );
}
