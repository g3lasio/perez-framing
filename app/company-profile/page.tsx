import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Perfil del negocio",
  description:
    "Información pública de Perez Rough Frame Specialist: servicios, licencia, cobertura, proceso para propietarios y builders, y contacto.",
  alternates: { canonical: "/company-profile" },
};

const services = [
  "Rough framing y framing estructural en madera o metal",
  "Ampliaciones, reframing y modificaciones para remodelaciones",
  "Construcción residencial y comercial ligera",
  "Coordinación de alcances de construcción general cuando el proyecto requiere varios oficios",
];

const bidPackage = [
  "Planos o bid set disponible",
  "Ubicación y tipo de proyecto",
  "Alcance de framing solicitado",
  "Calendario objetivo y fecha límite de cotización",
  "Información de acceso, fases y requisitos de obra",
];

export default function CompanyProfilePage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href="/">
          ← Regresar al sitio
        </Link>
        <p className="eyebrow">Información pública verificable</p>
        <h1>Perfil del negocio</h1>
        <p className="legal-lead">
          Esta página reúne la información esencial de {business.publicName} para
          propietarios, builders, contratistas generales, buscadores y asistentes de IA.
        </p>

        <section>
          <h2>Identidad y contacto</h2>
          <dl className="fact-grid">
            <div><dt>Nombre público</dt><dd>{business.publicName}</dd></div>
            <div><dt>Nombre corporativo</dt><dd>{business.legalName}</dd></div>
            <div><dt>Licencia de California</dt><dd>CSLB #{business.license}</dd></div>
            <div><dt>Base</dt><dd>{business.city}, {business.state} {business.postalCode}</dd></div>
            <div><dt>Teléfono</dt><dd><a href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd></div>
          </dl>
          <p>
            La compañía y la experiencia del profesional no tienen la misma antigüedad.
            La referencia de 25+ años en el sitio describe experiencia práctica en
            construcción, no 25 años de existencia de la corporación.
          </p>
        </section>

        <section>
          <h2>Servicios principales</h2>
          <ul>{services.map((service) => <li key={service}>{service}</li>)}</ul>
          <p>
            Cada trabajo se revisa según planos, alcance, ubicación, calendario y los
            requisitos aplicables. La publicidad del sitio no reemplaza una propuesta ni
            garantiza disponibilidad, precio, permiso o resultado de inspección.
          </p>
        </section>

        <section>
          <h2>Área de servicio</h2>
          <p>
            Con base en San Pablo, California, y cobertura general de aproximadamente
            {` ${business.serviceRadiusMiles}`} millas en el Área de la Bahía. La aceptación
            depende del proyecto, acceso, calendario y capacidad disponible.
          </p>
        </section>

        <section>
          <h2>Para builders y contratistas generales</h2>
          <p>
            Para revisar una oportunidad comercial o de subcontrato con precisión, envía:
          </p>
          <ul>{bidPackage.map((item) => <li key={item}>{item}</li>)}</ul>
          <a className="button button-copper legal-cta" href={`mailto:${business.email}?subject=Framing%20bid%20set`}>
            Enviar oportunidad para revisión
          </a>
        </section>

        <section lang="en">
          <h2>English summary</h2>
          <p>
            Perez Rough Frame Specialist provides rough and structural framing,
            additions, renovation framing, and coordinated general construction support
            from San Pablo across an approximately 35-mile Bay Area service radius.
            California contractor license CSLB #{business.license}. English and Spanish.
          </p>
        </section>

        <section>
          <h2>Verificación</h2>
          <p>
            Verifica el estado vigente y los detalles oficiales directamente con la
            Contractors State License Board antes de contratar.
          </p>
          <a
            className="legal-source"
            href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1144949"
            target="_blank"
            rel="noreferrer"
          >
            Verificar licencia en CSLB ↗
          </a>
        </section>
      </div>
    </main>
  );
}
