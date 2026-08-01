import type { Metadata } from "next";
import Link from "next/link";
import { business, credentials, scheduling, serviceCities } from "@/lib/site";
import { businessSchemaJson } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Perfil del negocio",
  description:
    "Información pública de Perez Rough Framing: licencia CSLB #1144949 Clase B, seguro y workers' compensation vigentes, equipo de 11 personas, servicios, cobertura y contacto.",
  alternates: { canonical: "/company-profile" },
  // Without this the page inherits the layout's og:url and every share of this
  // page previews as the homepage.
  openGraph: {
    title: "Perfil del negocio | Perez Rough Framing",
    description:
      "Licencia CSLB #1144949 Clase B, seguro y workers' compensation vigentes, equipo de 11 personas, cobertura en el Área de la Bahía.",
    url: "/company-profile",
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: businessSchemaJson() }}
      />
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
            <div>
              <dt>Licencia de California</dt>
              <dd>
                CSLB #{business.license} — Clase {business.licenseClass},{" "}
                {business.licenseClassName}
              </dd>
            </div>
            <div><dt>Base</dt><dd>{business.city}, {business.state} {business.postalCode}</dd></div>
            <div><dt>Equipo</dt><dd>{business.employeeCount} personas en nómina</dd></div>
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
          <h2>Credenciales y cobertura</h2>
          <ul className="credential-list">
            {credentials.es.map((item) => (
              <li key={item.key}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
          <p>
            No publicamos números de póliza, montos de cobertura ni fechas de vencimiento.
            Enviamos los certificados de seguro y workers&rsquo; compensation directamente
            al contratista general o a la agencia que los solicite para un proyecto.
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
            {` ${business.serviceRadiusMiles}`} millas en el Área de la Bahía, incluyendo{" "}
            {serviceCities.slice(0, -1).join(", ")} y {serviceCities[serviceCities.length - 1]}.
            La aceptación depende del proyecto, acceso, calendario y capacidad disponible.
          </p>
        </section>

        <section>
          <h2>Estimados</h2>
          <p>
            Los estimados son gratuitos y se realizan en persona. Se agendan en fin de
            semana con {scheduling.minLeadDays} a {scheduling.maxLeadDays} días de
            anticipación, porque entre semana el equipo está en obra ejecutando trabajo.
          </p>
          <p>
            Los precios se entregan únicamente en persona, después de revisar el sitio y
            el alcance. Este sitio no publica precios, rangos, tarifas por pie cuadrado ni
            mínimos, y el asistente del sitio tampoco los proporciona.
          </p>
        </section>

        <section>
          <h2>Para builders y contratistas generales</h2>
          <p>
            Cuadrilla propia de {business.employeeCount} personas en nómina, seguro de
            responsabilidad civil y workers&rsquo; compensation vigentes, y elegibilidad
            para trabajo comercial, gubernamental y residencial.
          </p>
          <p>
            Para revisar una oportunidad comercial o de subcontrato con precisión, envía:
          </p>
          <ul>{bidPackage.map((item) => <li key={item}>{item}</li>)}</ul>
          <a
            className="button button-copper legal-cta"
            href={`mailto:${business.email}?subject=${encodeURIComponent("Perez Rough Framing — bid set para revisión")}`}
          >
            Enviar oportunidad para revisión
          </a>
        </section>

        <section lang="en">
          <h2>English summary</h2>
          <p>
            Perez Rough Framing provides rough and structural framing, additions,
            renovation framing, and coordinated general construction support from San
            Pablo across an approximately {business.serviceRadiusMiles}-mile Bay Area
            service radius. California contractor license CSLB #{business.license}, Class{" "}
            {business.licenseClass} {business.licenseClassName}. General liability
            insurance and workers&rsquo; compensation in force. Crew of{" "}
            {business.employeeCount} on payroll. Certified for commercial, government, and
            residential work. English and Spanish. Estimates are free, held in person on
            weekends, and scheduled {scheduling.minLeadDays}–{scheduling.maxLeadDays} days
            ahead. Pricing is provided in person only.
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
            href={business.cslbVerifyUrl}
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
