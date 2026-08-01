import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Perez Rough Framing maneja solicitudes de estimado y datos de contacto.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
  // Without this the page inherits the layout's og:url and shares preview as the homepage.
  openGraph: {
    title: "Aviso de privacidad | Perez Rough Framing",
    description: "Cómo Perez Rough Framing maneja solicitudes de estimado y datos de contacto.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="legal-back" href="/">← Regresar al sitio</Link>
        <p className="eyebrow">Última actualización: 31 de julio de 2026</p>
        <h1>Aviso de privacidad</h1>
        <p className="legal-lead">
          Este aviso explica cómo {business.publicName} usa la información enviada por el
          formulario, teléfono, mensaje de texto o correo electrónico.
        </p>

        <section>
          <h2>Información recopilada</h2>
          <p>
            Podemos recibir nombre, teléfono, correo, ubicación del proyecto, tipo de
            trabajo, calendario, descripción, fotografías, planos, los mensajes escritos en
            el asistente del sitio y la información que la persona decida compartir.
            También podemos registrar cómo llegó la persona al sitio (por ejemplo, si vino
            de un anuncio) para saber qué canales funcionan.
          </p>
        </section>
        <section>
          <h2>Uso de la información</h2>
          <p>
            Se utiliza para revisar la solicitud, contactar al interesado, preparar una
            visita o propuesta, administrar seguimiento y mejorar la atención. No se vende
            información personal.
          </p>
        </section>
        <section>
          <h2>Proveedores</h2>
          <p>
            El sitio puede utilizar proveedores de alojamiento, correo, mensajería y
            Leadprime para transmitir y administrar solicitudes. Solo se comparte la
            información necesaria para prestar esos servicios.
          </p>
        </section>
        <section>
          <h2>Asistente del sitio</h2>
          <p>
            El asistente que aparece en el sitio funciona con Leadprime y responde con la
            información del negocio. Lo que se escribe en esa conversación se procesa en
            Leadprime y puede quedar guardado junto con la solicitud para dar seguimiento.
            Sus respuestas se generan automáticamente: el alcance, el precio y el calendario
            los confirma nuestro equipo. No compartas números de tarjeta, documentos de
            identidad ni otra información sensible por ese medio.
          </p>
        </section>
        <section>
          <h2>Mensajes y consentimiento</h2>
          <p>
            Al marcar la casilla del formulario, la persona acepta ser contactada acerca de
            su solicitud por teléfono, texto o email. Puede pedir que se detengan los
            mensajes en cualquier momento. Las tarifas normales del proveedor móvil pueden
            aplicar.
          </p>
        </section>
        <section>
          <h2>Seguridad y retención</h2>
          <p>
            Se aplican medidas razonables para proteger los datos, aunque ningún sistema es
            completamente infalible. La información se conserva solo el tiempo necesario
            para atender la solicitud, cumplir obligaciones y mantener registros legítimos.
          </p>
        </section>
        <section>
          <h2>Contacto</h2>
          <p>
            Para solicitar acceso, corrección o eliminación de información, escribe a
            {" "}<a href={`mailto:${business.email}`}>{business.email}</a> o llama al
            {" "}<a href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
