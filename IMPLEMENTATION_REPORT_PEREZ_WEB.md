# Perez Rough Framing — Reporte de implementación web

## Fecha y hora UTC

**2026-08-01 04:44 UTC**

Rama: `claude/perez-framing-leadprime-webhook-6k4dbf` (rama designada por el entorno de
ejecución; ver «Problemas encontrados y resolución» → *Rama de entrega*).
Build de verificación: `NEXT_PUBLIC_SITE_URL=https://perez-framing-production.up.railway.app npm run build`
→ compilado sin errores. `npm run lint` y `npx tsc --noEmit` sin errores ni warnings.

---

## FASE 1 — Renombre global

### Búsqueda de variantes

```
$ grep -rniE "Frame Specialist|Specialists|Specialist Framing" \
    --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git .

./docs/BUSINESS_SOURCE_OF_TRUTH.md:35:| Legal entity name | Pending. The site renders no
corporate name and no corporate suffix. Previously published variants ("Perez Rough Frame
Specialists Corp.", "Perez Specialist Framing Corp") are retired and must not return. |
```

La única coincidencia restante es la entrada del documento interno de gobernanza que
**registra las variantes retiradas para que no regresen**. No es contenido renderizado.

Verificación sobre el **HTML servido** (no el código fuente):

```
$ curl -s <ruta> | grep -ciE "Frame Specialist|Specialists|Specialist Framing"
  /                      -> 0
  /company-profile       -> 0
  /privacy               -> 0
  /llms.txt              -> 0
  /llms-full.txt         -> 0
  /sitemap.xml           -> 0
  /robots.txt            -> 0
  /manifest.webmanifest  -> 0
```

Comprobación adicional automatizada en navegador: *«no retired name variant survives in the
rendered home page»* → PASS.

### Títulos y meta por ruta (HTML servido)

```
/
  <title>Perez Rough Framing | Contratista de framing en el Bay Area</title>
  <meta name="description" content="Framing estructural residencial y comercial, ampliaciones
    y renovaciones en San Pablo y el Área de la Bahía. CSLB #1144949. Atención en español e inglés."/>
  <meta property="og:site_name" content="Perez Rough Framing"/>
  <meta property="og:title" content="Perez Rough Framing"/>
  <meta name="twitter:title" content="Perez Rough Framing"/>
  <meta name="keywords" content="framing contractor San Pablo,rough framing Bay Area,
    structural framing,residential framing,commercial framing,home additions,Perez Rough Framing"/>

/company-profile
  <title>Perfil del negocio | Perez Rough Framing</title>
  <meta name="description" content="Información pública de Perez Rough Framing: licencia CSLB
    #1144949 Clase B, seguro y workers' compensation vigentes, equipo de 11 personas,
    servicios, cobertura y contacto."/>
  <meta property="og:title" content="Perfil del negocio | Perez Rough Framing"/>

/privacy
  <title>Aviso de privacidad | Perez Rough Framing</title>
  <meta name="description" content="Cómo Perez Rough Framing maneja solicitudes de estimado
    y datos de contacto."/>
  <meta property="og:title" content="Aviso de privacidad | Perez Rough Framing"/>
```

Marca en header y footer: `PEREZ` / `ROUGH FRAMING` (visible en las capturas de FASE 3).
`aria-label` del logo: `Perez Rough Framing home`. Copyright del footer:
`© 2026 Perez Rough Framing.`

### Asuntos de los `mailto:`

| Ubicación | Asunto anterior | Asunto actual |
|---|---|---|
| Sección builders (home) | `Framing bid set / Planos para cotizar` | `Perez Rough Framing — bid set para revisión` (ES) / `Perez Rough Framing — bid set for review` (EN) |
| `/company-profile` | `Framing bid set` | `Perez Rough Framing — bid set para revisión` |
| Fotos/planos (formulario) | — (nuevo) | `Fotos y planos para mi proyecto de framing` |

### Nombre corporativo

**No publicado.** Pendiente de confirmación, según instrucción.

- `business.legalName` fue **eliminado** de `lib/site.ts`, de modo que ningún componente
  puede renderizarlo por accidente.
- La fila «Nombre corporativo» se eliminó de `/company-profile`.
  Verificación automatizada: *«/company-profile no longer prints a corporate entity name»* → PASS.
- `legalName` se eliminó del JSON-LD.
  Verificación automatizada: *«JSON-LD publishes no legal entity name»* → PASS.
- `docs/BUSINESS_SOURCE_OF_TRUTH.md` gana una sección **«Pending confirmation — do not
  publish»** y `AGENTS.md` registra la regla para futuros contribuyentes y agentes.

---

## FASE 2 — Canonical y Open Graph

### HTML servido por ruta

```
/
  <link rel="canonical" href="https://perez-framing-production.up.railway.app"/>
  <meta property="og:url"    content="https://perez-framing-production.up.railway.app"/>
  <meta property="og:image"  content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>
  <meta name="twitter:image" content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>

/company-profile
  <link rel="canonical" href="https://perez-framing-production.up.railway.app/company-profile"/>
  <meta property="og:url"    content="https://perez-framing-production.up.railway.app/company-profile"/>
  <meta property="og:image"  content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>
  <meta name="twitter:image" content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>

/privacy
  <link rel="canonical" href="https://perez-framing-production.up.railway.app/privacy"/>
  <meta property="og:url"    content="https://perez-framing-production.up.railway.app/privacy"/>
  <meta property="og:image"  content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>
  <meta name="twitter:image" content="https://perez-framing-production.up.railway.app/assets/project-05.jpg"/>
```

**Defecto adicional corregido:** `og:url` era `/` en las tres rutas porque las páginas
heredaban el valor del layout. Cualquier enlace a `/company-profile` o `/privacy`
previsualizaba como la portada. Ahora cada ruta declara el suyo
(`app/company-profile/page.tsx`, `app/privacy/page.tsx`).

### Referencias a `chatgpt.site`

```
$ curl -s <ruta> | grep -c "chatgpt.site"
  /  0   /company-profile  0   /privacy  0   /sitemap.xml  0
  /robots.txt  0   /manifest.webmanifest  0   /llms.txt  0   /llms-full.txt  0
  TOTAL: 0
```

### `og:image` responde 200

```
$ curl -o /dev/null -w "%{http_code} %{content_type}" \
    https://<dominio>/assets/project-05.jpg
200 image/jpeg
```

### El build falla sin la variable

`lib/site.ts` lanza en tiempo de módulo. No hay valor por defecto: el fallback anterior
`https://rough-frame-specialist.g3lasio.chatgpt.site` fue eliminado.

```
$ npm run build          # sin NEXT_PUBLIC_SITE_URL

Error: NEXT_PUBLIC_SITE_URL is not set. Set it to the canonical production origin
(for example https://perezroughframing.com) in the deployment environment, or in
.env.local for local development. The build fails without it on purpose: canonical,
og:url, og:image and twitter:image are all derived from it.
    at module evaluation (.next/server/chunks/[root-of-the-server]__0531ln5._.js:1:1070)
```

Con la variable definida el build completa las 9 rutas sin errores.

> **Acción requerida antes del próximo deploy:** definir `NEXT_PUBLIC_SITE_URL` en Railway.
> Sin ella el build **falla por diseño**. La migración al dominio propio de Hugo es una sola
> edición de esa variable más un redeploy (los `NEXT_PUBLIC_*` se inyectan en build).

---

## FASE 3 — Credenciales

### Presente en `/` y en `/company-profile`

- **Home:** sección `#credentials` justo después del hero, antes de servicios y builders.
  Tratamiento de bloque de confianza: tarjetas con borde de acento en cobre, icono de escudo
  y jerarquía título/detalle. No es una lista al pie.
- **`/company-profile`:** sección «Credenciales y cobertura».

Verificaciones automatizadas (Playwright, build de producción):

```
PASS  home shows the credentials block with all five items
PASS  credentials name the Class B license
PASS  credentials state liability insurance
PASS  credentials state workers' compensation
PASS  credentials state commercial/government/residential
PASS  credentials state the 11-person crew
PASS  the CSLB verification link is preserved in the block
PASS  /company-profile shows the credentials block
```

Contenido renderizado (ES):

```
CON LICENCIA, SEGURO Y EQUIPO PROPIO
Las credenciales que un contratista general revisa primero.
Todo lo siguiente está vigente. Los certificados de seguro y workers' compensation se
envían directamente al GC o a la agencia que los solicite para un proyecto.

Licencia CSLB #1144949   · Clase B — General Building Contractor.  · Verificar en CSLB →
Seguro de responsabilidad civil · Cobertura vigente.
Workers' compensation    · Cobertura vigente para el equipo.
Trabajo comercial, gubernamental y residencial · Certificados para los tres tipos de proyecto.
Equipo de 11 personas    · Cuadrilla propia en nómina.

Publicamos que la cobertura está vigente. Los números de póliza, montos y fechas de
renovación se comparten directamente con quien los necesita.
```

### Capturas

| Vista | Archivo |
|---|---|
| Escritorio 1440px, home | `credentials-desktop.png` |
| Móvil 375px, home | `credentials-mobile.png` |
| Móvil 375px, `/company-profile` | `credentials-profile-mobile.png` |
| Escritorio, `/company-profile` | `credentials-profile.png` |

### Sin números de póliza

```
PASS  no policy numbers or coverage amounts anywhere on the profile
```

Patrón evaluado sobre el texto visible: `póliza #`, `policy #`, importes en dólares de tres
o más cifras, «millones». Cero coincidencias. El único número publicado es el de licencia
CSLB, que es público y verificable.

---

## FASE 4 — Para builders

Se conservó intacto el flujo «enviar planos / bid set». Se añadieron las tres señales de
capacidad **al principio** de la lista, de modo que un GC las lea antes del CTA:

```
01  Cuadrilla propia de 11 personas en nómina
02  Seguro de responsabilidad civil y workers' compensation vigentes
03  Elegibles para trabajo comercial y gubernamental
04  Alcances de framing en madera y metal
05  Revisión de planos y takeoffs
06  Trabajo residencial y comercial ligero
```

(El ítem «Disponibilidad de equipo por proyecto» se retiró: prometía disponibilidad, que la
guía de reclamaciones del repositorio prohíbe sin respaldo documental. Su función —demostrar
capacidad— la cumple mejor «cuadrilla propia de 11 personas en nómina», que es un hecho
confirmado.)

```
PASS  builders section states the 11-person payroll crew
PASS  builders section states insurance and workers' comp
PASS  builders section states commercial and government eligibility
PASS  the bid-set mailto uses the new name in its subject
```

### `mailto` verificado

```
mailto:perez.hp450@gmail.com?subject=Perez%20Rough%20Framing%20%E2%80%94%20bid%20set%20para%20revisi%C3%B3n
→ decodificado: "Perez Rough Framing — bid set para revisión"
```

Capturas: `builders-desktop.png`, `builders-mobile.png`.

---

## FASE 5 — Regla de los 25 años

### Todas las apariciones de «25», con su frase y clasificación

| # | Frase completa | Clasificación |
|---|---|---|
| 1 | EN hero: «Residential and commercial rough framing, additions, and structural renovations **backed by 25 years of hands-on experience**.» | permitida — atribuye al oficio |
| 2 | ES hero: «Framing estructural residencial y comercial, ampliaciones y renovaciones **respaldadas por 25 años de experiencia práctica**.» | permitida — atribuye al oficio |
| 3 | Hero, tarjeta: «**25+**» / «Years of hands-on experience» / «Años de experiencia práctica» | permitida — atribuye a la experiencia |
| 4 | Trust strip (hero): «25+ · Años de experiencia práctica» | permitida |
| 5 | EN about: «**More than 25 years of hands-on construction experience stand behind** the residential and commercial projects we take on across the Bay Area.» | permitida — **corregida**, ver abajo |
| 6 | ES about: «**Más de 25 años de experiencia práctica en construcción respaldan** los proyectos residenciales y comerciales que tomamos en el Área de la Bahía.» | permitida — **corregida**, ver abajo |
| 7 | `/company-profile`: «La referencia de **25+ años** en el sitio describe experiencia práctica en construcción, no **25 años** de existencia de la corporación.» | permitida — es la aclaración |
| 8 | `llms.txt`: «Professional experience statement: **25+ years** of hands-on construction experience; this is not a claim that the corporation has existed for **25 years**» | permitida |
| 9 | `llms.txt`: «The **25+ years** figure describes the owner's hands-on construction experience. The license and the corporation are 3 years old.» | permitida |
| 10 | `llms-full.txt`: «The website describes **25+ years** of hands-on construction experience. This refers to the owner's professional experience. The contractor license and the corporation are 3 years old.» | permitida |

### Violación encontrada y corregida

La sección «Nosotros» decía, en ambos idiomas:

- Antes (EN): `Perez Rough Framing brings more than 25 years of construction experience to residential and commercial projects across the Bay Area.`
- Antes (ES): `Perez Rough Framing aporta más de 25 años de experiencia en construcción a proyectos residenciales y comerciales del Área de la Bahía.`

El sujeto de la oración era **la compañía**, que «aporta 25 años de experiencia». Eso liga
los años a la empresa, no al profesional, y cae bajo la prohibición del brief. Reescrito para
que el sujeto sea la experiencia misma (ítems 5 y 6 de la tabla). No se publica un nombre
propio nuevo, ni un año de fundación.

Comprobación automatizada contra construcciones prohibidas (`sirviendo`, `serving`,
`en el mercado`, `in business`, `establecidos`, `established`, `desde 19xx/20xx`,
`since 19xx/20xx`, `fundad*`):

```
PASS  no '25' phrase attaches the years to the company
```

### Aclaración conservada — texto exacto

```
La compañía y la experiencia del profesional no tienen la misma antigüedad. La referencia
de 25+ años en el sitio describe experiencia práctica en construcción, no 25 años de
existencia de la corporación.
```

```
PASS  /company-profile keeps the 25-year clarification verbatim
```

Se **amplió** la regla en los archivos de gobernanza (`AGENTS.md`,
`docs/BUSINESS_SOURCE_OF_TRUTH.md`, `llms.txt`, `llms-full.txt`) con el dato nuevo: licencia
y corporación tienen **3 años**, y no puede inferirse ningún año de fundación.

---

## FASE 6 — Agendamiento

### Texto nuevo

| | |
|---|---|
| Antes | `El tiempo de respuesta depende de la disponibilidad de proyectos` |
| Ahora (ES) | `Los estimados se hacen en fin de semana y se agendan con 2 a 5 días de anticipación — entre semana el equipo está en obra.` |
| Ahora (EN) | `Estimates are held on weekends and booked 2 to 5 days ahead — during the week our crew is on site building.` |

También se actualizó la FAQ en ambos idiomas («¿Ofrecen estimados gratis?») y se añadió la
regla a `/company-profile`, `llms.txt` y `llms-full.txt`.

Captura: `scheduling-text.png`.

### Selector de fecha — pruebas de restricción

El formulario no tenía selector de fecha. Se añadió uno **opcional**
(`preferred_date`, «Día preferido para el estimado»), que es el único cambio al formulario;
el resto de campos y la carga de archivos quedan como estaban.

Reglas: solo sábado y domingo, mínimo 2 días de anticipación. Se validan **en el navegador
y otra vez en el servidor**, para que una petición que evite el navegador no pueda agendar
un martes.

**Prueba 1 — día entre semana rechazado**

```
navegador (2026-08-03, lunes)
  rechazado: true
  mensaje: "Los estimados se hacen sábado y domingo. Elige un día de fin de semana."

servidor  (POST /api/leads, preferred_date=2026-08-03)
  HTTP 400  { "ok": false, "code": "ESTIMATE_DATE_NOT_AVAILABLE" }
```

**Prueba 2 — fin de semana a menos de 2 días rechazado**

```
navegador (2026-08-01, sábado — a 0 días)
  rechazado: true
  mensaje: "Elige un día con al menos 2 días de anticipación para poder agendar la visita."

servidor  (POST /api/leads, preferred_date=2026-08-01)
  HTTP 400  { "ok": false, "code": "ESTIMATE_DATE_NOT_AVAILABLE" }
```

**Prueba 3 — fin de semana válido aceptado**

```
navegador (2026-08-08, sábado — a 7 días)
  rechazado: false

servidor  HTTP 201
  y la fecha llega a Leadprime dentro de las notas del lead:
  "Día preferido para el estimado: 2026-08-08 (fin de semana)"
```

**Prueba 4 — el campo es opcional**

```
POST sin preferred_date → HTTP 201
```

```
PASS  a weekday is rejected by the date rule
PASS  a weekend day inside the 2-day notice window is rejected
PASS  a valid weekend day beyond the notice window is accepted
PASS  servidor rechaza día entre semana (2026-08-03)
PASS  servidor rechaza fin de semana con <2 días (2026-08-01)
PASS  servidor acepta fin de semana válido (2026-08-08)
PASS  la fecha preferida llega a Leadprime en las notas
PASS  sin fecha preferida el envío sigue siendo válido
```

---

## FASE 7 — Precios

**Confirmación: cero precios, rangos, tarifas o mínimos publicados en cualquier ruta.**

Búsqueda sobre el **texto visible** de cada ruta (`document.body.innerText`), con patrones
para importes en dólares, cantidades con moneda, tarifas por pie cuadrado, «precio desde»,
«starting at» y «desde $»:

```
  /                 -> 0
  /company-profile  -> 0
  /privacy          -> 0
  TOTAL precios visibles publicados: 0
```

Campos del formulario de estimado:

```
["preferred_language","consent_text","website","full_name","phone","email",
 "project_location","project_type","timeline","project_details","preferred_date",
 "attachments","contact_consent"]

campos de presupuesto/rango: 0
```

El formulario **no** solicita presupuesto del cliente ni ofrece rangos como opción.

La política quedó además escrita como texto público en `/company-profile`, en la FAQ de
ambos idiomas, y en `llms.txt` / `llms-full.txt`, de modo que el agente de IA de LeadPrime
la lea desde la misma fuente:

> «Los precios se dan en persona, después de revisar el sitio y el alcance. No publicamos
> precios, rangos, tarifas por pie cuadrado ni mínimos en ningún lado, y el asistente del
> sitio tampoco cotiza.»

---

## FASE 8 — SEO y AEO

### 8.1 Structured data

`GeneralContractor` (subtipo de `LocalBusiness`) generado desde una sola fuente
(`lib/structuredData.ts`) y publicado en `/` y en `/company-profile`.

```json
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://perez-framing-production.up.railway.app/#business",
  "name": "Perez Rough Framing",
  "url": "https://perez-framing-production.up.railway.app",
  "image": "https://perez-framing-production.up.railway.app/assets/logo.png",
  "logo": "https://perez-framing-production.up.railway.app/assets/logo.png",
  "telephone": "+14154194496",
  "email": "perez.hp450@gmail.com",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 11 },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "San Pablo",
    "addressRegion": "CA",
    "postalCode": "94806",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 37.9621, "longitude": -122.3455 },
      "geoRadius": "56327" },
    { "@type": "City", "name": "Richmond",      "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "El Cerrito",    "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Berkeley",      "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Oakland",       "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Albany",        "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Pinole",        "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Hercules",      "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Vallejo",       "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Martinez",      "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Concord",       "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Walnut Creek",  "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "San Rafael",    "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "Alameda",       "addressRegion": "CA", "addressCountry": "US" },
    { "@type": "City", "name": "San Leandro",   "addressRegion": "CA", "addressCountry": "US" }
  ],
  "knowsLanguage": ["en", "es"],
  "identifier": {
    "@type": "PropertyValue",
    "name": "California contractor license",
    "value": "1144949"
  },
  "hasCredential": [{
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "California contractor license",
    "name": "CSLB License #1144949 — Class B, General Building Contractor",
    "identifier": "1144949",
    "recognizedBy": {
      "@type": "GovernmentOrganization",
      "name": "Contractors State License Board",
      "url": "https://www.cslb.ca.gov/"
    }
  }],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Framing and construction services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rough framing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural framing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wood framing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Metal framing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Room additions" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Remodel and reframing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential construction" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Light commercial construction" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "General construction coordination" } }
    ]
  },
  "sameAs": ["https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1144949"],
  "description": "Residential, commercial and government-eligible rough and structural framing, additions, remodel framing and coordinated construction in San Pablo and the surrounding Bay Area. CSLB #1144949, Class B General Building Contractor. Liability insurance and workers' compensation in force. Crew of 11."
}
```

Validación ejecutada — se extrajo el bloque del **HTML servido** y se parseó:

```
PASS  home publishes exactly one JSON-LD block
PASS  JSON-LD parses and is GeneralContractor      (JSON.parse sin errores)
PASS  JSON-LD carries numberOfEmployees            (11)
PASS  JSON-LD carries hasCredential for the Class B license
PASS  JSON-LD carries knowsLanguage en + es
PASS  JSON-LD carries a service catalog            (9 servicios)
PASS  JSON-LD names the service cities in areaServed  (14 ciudades)
PASS  JSON-LD publishes no legal entity name
PASS  JSON-LD uses the production origin
PASS  /company-profile publishes the same structured data
```

*Nota:* la validación se hizo localmente por parseo estricto y comprobación de cada campo
exigido. El Rich Results Test de Google no es accesible desde este entorno (política de
egreso); conviene ejecutarlo una vez el dominio esté publicado.

### 8.2 Ciudades del área de servicio

Publicadas como texto visible en la sección «Ubicados en San Pablo» del home, en la FAQ de
ambos idiomas, en `/company-profile`, en `llms.txt` y `llms-full.txt`, y en `areaServed`
del JSON-LD:

```
Richmond, El Cerrito, Berkeley, Oakland, Albany, Pinole, Hercules,
Vallejo, Martinez, Concord, Walnut Creek, San Rafael, Alameda, San Leandro
```

```
PASS  all 14 service cities are rendered
```

### 8.3 Prueba social

Sección `#reviews` construida y lista para poblar (`review-grid`, `review-card`, con
`blockquote` + `figcaption` para nombre y proyecto). Se llena desde `content.<lang>.reviews.items`.

Mientras esa lista esté vacía **la sección no se renderiza**: no hay encabezado huérfano, ni
tarjetas de ejemplo, ni testimonios inventados.

```
PASS  the reviews section renders nothing while there is no real content
```

Para publicar reseñas reales basta con añadir objetos `{ quote, name, project }` a
`reviews.items` en `app/page.tsx` (una entrada por idioma).

---

## FASE 9 — Limpieza

### Cero placeholders

```
$ curl -s <ruta> | grep -oiE 'muy pronto|coming soon|lorem ipsum|placeholder|TBD|próximamente' | wc -l
  /  0   /company-profile  0   /privacy  0   /llms.txt  0   /llms-full.txt  0
  TOTAL: 0
```

```
PASS  no 'Muy pronto' / 'Coming Soon' placeholder anywhere on the home page
```

El placeholder «Muy pronto» pertenecía al panel de chat flotante junto a la barra de acciones
móvil. No se eliminó dejando un hueco: **el chat quedó conectado** al Embed Kit de LeadPrime
de la cuenta de Hugo en el trabajo previo de esta misma rama, y el botón ahora dice
«Pregúntanos» / «Ask us».

### Email centralizado

Ya estaba centralizado en `lib/site.ts` (`business.email`) y así sigue. Se verificó que
**todas** las referencias pasan por esa constante — home, footer, `/company-profile`,
`/privacy`, los tres `mailto:` y el JSON-LD. Migrar a un correo del dominio es una sola
edición en `lib/site.ts`.

---

## PROBLEMAS ENCONTRADOS Y RESOLUCIÓN

**1. `og:url` idéntico en las tres rutas.** No estaba en el brief. Las páginas heredaban el
`og:url` del layout, así que compartir `/company-profile` o `/privacy` previsualizaba como la
portada. Corregido declarando `openGraph.url` por página.

**2. Conflicto: carga de archivos.** La sección 10 del brief pide **no tocar** la carga de
archivos del formulario. En el trabajo previo de esta misma rama yo la había **retirado**,
porque el webhook de leads de LeadPrime acepta solo JSON y la cuenta no tiene endpoint de
adjuntos ligado a la llave del webhook: los archivos seleccionados no llegaban a ningún lado.
*Decisión conservadora:* **restauré el selector de archivos** conforme a la instrucción
explícita del dueño, conservando además la ruta por email/texto y la validación de tipo y
tamaño (PDF/JPG/PNG, 10 MB) en navegador y servidor. Los nombres y tamaños de los archivos
adjuntos viajan en las notas del lead, para que Hugo sepa que existen y los pida.
**Limitación que persiste:** los archivos en sí no llegan al CRM. Cerrarlo requiere trabajo
del lado de LeadPrime (aceptar multipart en la llave del webhook, almacenar vía `s3Service`,
y mostrar los adjuntos en la vista del lead). Documentado en `docs/LEADPRIME_INTEGRATION.md`.

**3. Conflicto: guardas de reclamaciones.** `AGENTS.md` y `docs/BUSINESS_SOURCE_OF_TRUTH.md`
prohibían publicar seguro, certificaciones y tamaño de cuadrilla «sin respaldo documental
actual del negocio». El brief aporta ese respaldo como datos confirmados por el dueño.
*Resolución:* publiqué solo los hechos confirmados y **actualicé ambos documentos** para
registrar de dónde vienen y hasta dónde llegan — se puede decir que la cobertura está
vigente; no se pueden publicar límites, números de póliza, fechas de renovación, bonding ni
disponibilidad garantizada. La prohibición quedó reforzada, no debilitada.

**4. «Disponibilidad de equipo por proyecto» en la sección de builders.** Prometía
disponibilidad, que la guía prohíbe. Sustituido por «Cuadrilla propia de 11 personas en
nómina», que comunica capacidad con un hecho confirmado. Ver FASE 4.

**5. Violación de la regla de los 25 años ya existente en el sitio.** Ver FASE 5.

**6. `npm run build` fallaba en el backend de LeadPrime.** Al instalar dependencias, npm
resolvió TypeScript 6.0.2 pese al pin `^5.9.3`, y `tsconfig.json` usa
`moduleResolution: node10`, deprecado en TS 6. *Resolución conservadora:* compilé con la
versión que el repositorio fija (`npm install --no-save typescript@5.9.3`) en lugar de
modificar el `tsconfig` compartido. `package.json` y `package-lock.json` quedaron intactos.

**7. Rama de entrega.** El brief indica «sin branches nuevos» y el mensaje previo pedía
enviar a `main`. El entorno de ejecución impone la rama designada
`claude/perez-framing-leadprime-webhook-6k4dbf` y prohíbe empujar a otra. No se creó ninguna
rama nueva: todo el trabajo va a la rama designada, lista para fusionar a `main`.

**8. Verificación contra producción no fue posible.** La política de egreso de este entorno
bloquea `leadprime.chyrris.com`, así que no pude enviar un lead real a la cuenta de Hugo ni
abrir el Rich Results Test. La integración se verificó extremo a extremo contra el **código
real compilado del webhook de LeadPrime** (`backend/dist/routes/leads.js`) con la base de
datos simulada, comprobando el `INSERT` y sus parámetros. Queda pendiente un envío real de
humo tras el deploy.

---

## Cambios fuera del sitio: backend de LeadPrime

Corregidos en el mismo esfuerzo (repositorio `g3lasio/leadprime`, misma rama):

- El webhook de leads guardaba el mensaje del visitante **solo** en `ai_summary`, truncado a
  200 caracteres. Todo lo que excediera se perdía en silencio. Ahora el texto completo va a
  `leads.notes` y `ai_summary` conserva su vista previa.
- `timeline` se descartaba; ahora se guarda en su columna.
- El consentimiento del formulario no se registraba. Ahora escribe `has_sms_consent`,
  `consent_source`, `consent_date` y una fila en `lead_consent` con el texto exacto aceptado,
  la IP, el user-agent y la URL — evidencia para A2P 10DLC / TCPA.

`backend/dist/` fue recompilado y committeado, como exige el modelo de despliegue del repo.

---

## LISTO PARA REVISIÓN

**[x] SÍ — todas las fases completas con evidencia.**

Verificaciones ejecutadas sobre el build de producción:

| Suite | Resultado |
|---|---|
| Brief (navegador, escritorio + móvil 375px) | 38/38 PASS |
| Webhook extremo a extremo contra el código real de LeadPrime | 25/25 PASS |
| Rutas de fallo del webhook (sin configurar, llave inválida, reintento 5xx, firma HMAC) | 7/7 PASS |
| Asistente de chat (navegador) | 31/31 PASS |
| Regla de fecha en el servidor | 5/5 PASS |
| Auditoría de sitio completo (rutas, metadatos, consola) | 18/18 PASS |
| `npm run lint` · `npx tsc --noEmit` · `npm run build` | sin errores |

### Acciones requeridas antes del deploy

1. **`NEXT_PUBLIC_SITE_URL`** en Railway. El build **falla** sin ella, por diseño.
2. **`LEADPRIME_WEBHOOK_URL`** en Railway, para que el formulario entregue leads. No está en
   el repositorio a propósito: el repo es público y el endpoint no está autenticado.
3. **Lista de dominios permitidos** del token del widget, dentro de LeadPrime, apuntando al
   dominio de producción.
