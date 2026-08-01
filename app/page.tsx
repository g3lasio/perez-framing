"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AssistantChat from "@/components/AssistantChat";
import Icon, { type IconName } from "@/components/Icon";
import { business, credentials, serviceCities } from "@/lib/site";
import { buildBusinessSchema } from "@/lib/structuredData";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import {
  estimateDateBounds,
  validateEstimateDate,
  type EstimateDateError,
} from "@/lib/scheduling";

type Lang = "en" | "es";

const phoneDisplay = business.phoneDisplay;
const phoneHref = business.phoneE164;
const email = business.email;

// Kept in step with the limits enforced in app/api/leads/route.ts.
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const content = {
  en: {
    topbar: {
      service: "Serving San Pablo + 35 miles",
      spanish: "Se habla español",
      license: "CSLB #1144949",
    },
    nav: {
      work: "Our Work",
      services: "Services",
      builders: "For Builders",
      process: "Process",
      about: "About",
      estimate: "Free Estimate",
      menu: "Open navigation",
    },
    hero: {
      eyebrow: "Bay Area Framing Contractor",
      titleA: "Framing built right.",
      titleB: "From plans to structure.",
      body: "Residential and commercial rough framing, additions, and structural renovations backed by 25 years of hands-on experience.",
      estimate: "Request a Free Estimate",
      call: "Call",
      scroll: "Explore our work",
      photoLabel: "Real project • Bay Area",
      years: "25+",
      yearsLabel: "Years of hands-on experience",
      licenseLabel: "Licensed",
      licenseValue: "CSLB #1144949",
      coverageLabel: "Local",
      coverageValue: "35-mile service area",
    },
    reviews: {
      eyebrow: "What clients say",
      title: "Reviews from completed projects.",
      // Populated only from real, attributable reviews. The section stays hidden
      // while this list is empty — no placeholder or sample testimonials.
      items: [] as readonly { quote: string; name: string; project: string }[],
    },
    trust: {
      eyebrow: "Licensed, insured, and staffed",
      title: "The credentials a general contractor checks first.",
      body: "Everything below is current. Certificates of insurance and workers' compensation go straight to the GC or agency that requests them for a project.",
      verify: "Verify with CSLB",
      note: "We publish that coverage is in force. Policy numbers, limits, and renewal dates are shared directly with the party that needs them.",
    },
    intro: {
      eyebrow: "The structure behind the finish",
      title: "Your project deserves more than a general promise.",
      body: "We bring framing expertise, clear communication, and dependable execution to every stage—from reviewing the plans to the final walkthrough.",
      items: [
        "Residential & commercial",
        "Free on-site estimates",
        "California licensed contractor",
        "English & Spanish",
      ],
    },
    services: {
      eyebrow: "What we build",
      title: "Framing first. Full-project capability when you need it.",
      body: "Our strongest work begins with the structure. We can also coordinate the related construction work needed to move your project forward.",
      cards: [
        {
          icon: "ruler" as IconName,
          number: "01",
          title: "Rough & Structural Framing",
          body: "Wood and metal framing for new construction, structural walls, roof systems, and custom layouts.",
          tags: ["Wood framing", "Metal framing", "Structural"],
        },
        {
          icon: "home" as IconName,
          number: "02",
          title: "Additions & Remodel Framing",
          body: "Structural modifications, room additions, openings, and reframing for kitchens, baths, and whole-home renovations.",
          tags: ["Additions", "Reframing", "Remodels"],
        },
        {
          icon: "building" as IconName,
          number: "03",
          title: "Residential & Commercial",
          body: "Reliable framing support for homeowners, builders, property managers, and light-commercial projects.",
          tags: ["Homes", "Commercial", "Subcontracting"],
        },
        {
          icon: "wrench" as IconName,
          number: "04",
          title: "General Construction Support",
          body: "Coordinated construction work for additions and renovations when the project scope calls for multiple trades.",
          tags: ["Renovation", "Coordination", "Project scope"],
        },
      ],
      cta: "Discuss Your Project",
    },
    builders: {
      eyebrow: "Builders & general contractors",
      title: "A framing partner who answers before the bid is due.",
      body: "Send the bid set, project location, target schedule, and framing scope. We review fit, availability, and next steps without wasting your estimating window.",
      items: [
        "11-person crew on our own payroll",
        "General liability and workers' compensation in force",
        "Eligible for commercial and government work",
        "Wood and metal framing scopes",
        "Plan and takeoff review",
        "Residential and light-commercial work",
      ],
      primary: "Send a bid set",
      secondary: "Call about availability",
      note: "For builders, GCs, developers, and property teams in the Bay Area.",
      subject: "Perez Rough Framing — bid set for review",
    },
    work: {
      eyebrow: "Selected work",
      title: "Real projects. Visible progress.",
      body: "No stock-photo promises here. These are projects from the field, shown from structure and renovation through completion.",
      view: "View project",
      close: "Close project image",
      projects: [
        {
          image: "/assets/project-05.jpg",
          title: "Structural Addition",
          detail: "Framing in progress",
          alt: "Residential structural addition with exposed wood framing",
        },
        {
          image: "/assets/project-02.jpg",
          title: "Interior Reconfiguration",
          detail: "Openings & structural framing",
          alt: "Interior renovation with new structural openings",
        },
        {
          image: "/assets/project-04.jpg",
          title: "Site Preparation",
          detail: "Layout & structural supports",
          alt: "Residential hillside project during site preparation",
        },
        {
          image: "/assets/project-03.jpg",
          title: "Exterior Addition",
          detail: "Weatherproofing stage",
          alt: "Residential exterior addition in weatherproofing stage",
        },
        {
          image: "/assets/project-06.jpg",
          title: "Exterior Transformation",
          detail: "Completed renovation",
          alt: "Completed gray residential exterior renovation",
        },
        {
          image: "/assets/project-01.jpg",
          title: "Whole-Home Exterior",
          detail: "Completed project",
          alt: "Completed white residential exterior project",
        },
      ],
    },
    compare: {
      eyebrow: "Before & after",
      title: "Drag to reveal the transformation.",
      body: "A real exterior renovation, from active construction to the completed finish.",
      before: "In progress",
      after: "Completed",
      label: "Move the slider to compare project progress",
    },
    process: {
      eyebrow: "A straightforward process",
      title: "Know what happens next.",
      body: "Good construction starts with clear expectations. We keep the process simple and communication direct.",
      steps: [
        {
          number: "01",
          title: "Tell us about the project",
          body: "Call, text, or send your plans and project details.",
        },
        {
          number: "02",
          title: "Schedule a free estimate",
          body: "We review the site, scope, access, and structural needs.",
        },
        {
          number: "03",
          title: "Receive a clear proposal",
          body: "You get a defined scope, price, and expected schedule.",
        },
        {
          number: "04",
          title: "Build with confidence",
          body: "Our crew completes the work and walks the project with you.",
        },
      ],
    },
    about: {
      eyebrow: "Built on experience",
      title: "Hands-on craftsmanship. Honest communication.",
      bodyA:
        "More than 25 years of hands-on construction experience stand behind the residential and commercial projects we take on across the Bay Area.",
      bodyB:
        "We believe the strongest client relationships are built the same way as a strong frame: with accuracy, consistency, and nothing hidden.",
      quote:
        "The work behind the walls should be built with the same care as the finish everyone sees.",
      credentialTitle: "California licensed contractor.",
      credentialBody:
        "California contractor license #1144949. Verify current license details directly with the CSLB.",
      verify: "Verify CSLB License",
      areaTitle: "Based in San Pablo",
      areaBody:
        "Serving residential and commercial projects within approximately 35 miles.",
      map: "Open service area map",
    },
    faq: {
      eyebrow: "Common questions",
      title: "Answers before we get started.",
      items: [
        {
          q: "What kind of framing work do you handle?",
          a: "We handle wood and metal framing, residential and commercial framing, structural framing, custom installations, additions, and framing modifications for remodels.",
        },
        {
          q: "Do you provide free estimates?",
          a: "Yes. Estimates are free and done in person. We schedule them on weekends, 2 to 5 days ahead, because our crew is on site during the week. Send photos, plans, and key details first and we will come prepared.",
        },
        {
          q: "What areas do you serve?",
          a: "We are based in San Pablo, California and generally serve projects within a 35-mile radius across the surrounding Bay Area, including Richmond, El Cerrito, Berkeley, Oakland, Albany, Pinole, Hercules, Vallejo, Martinez, Concord, Walnut Creek, San Rafael, Alameda, and San Leandro.",
        },
        {
          q: "Are you licensed and insured?",
          a: "Yes. CSLB license #1144949, Class B General Building Contractor, with general liability insurance and workers' compensation in force. We are certified for commercial, government, and residential work, and we send certificates directly to the general contractor or agency that requests them.",
        },
        {
          q: "How do you handle pricing?",
          a: "Pricing is given in person, after we have seen the site and the scope. We do not publish prices, ranges, square-foot rates, or minimums anywhere, and our site assistant does not quote either.",
        },
        {
          q: "Can you help beyond framing?",
          a: "Depending on the contract and project scope, we can coordinate related construction work when an addition or renovation requires multiple trades.",
        },
        {
          q: "Do you work in Spanish?",
          a: "Yes. Our team can discuss your estimate and project in English or Spanish.",
        },
      ],
    },
    estimate: {
      eyebrow: "Start your project",
      title: "Tell us what you’re planning.",
      body: "Share a few details now. We’ll review your project and help you identify the best next step.",
      callLabel: "Prefer to talk now?",
      callAction: `Call ${phoneDisplay}`,
      textAction: "Send a text",
      emailAction: "Send an email",
      hours: "Estimates are held on weekends and booked 2 to 5 days ahead — during the week our crew is on site building.",
      form: {
        name: "Full name",
        phone: "Phone number",
        email: "Email address",
        city: "Project city or ZIP",
        service: "Project type",
        select: "Choose one",
        options: [
          "Rough / structural framing",
          "Addition or remodel framing",
          "Residential construction",
          "Commercial construction",
          "Kitchen or bathroom remodel",
          "Coordinated multi-trade renovation",
          "Other",
        ],
        timeline: "Ideal start",
        timelineOptions: [
          "As soon as possible",
          "Within 30 days",
          "1–3 months",
          "3+ months",
          "Still planning",
        ],
        message: "Tell us about the project",
        messagePlaceholder:
          "Scope, approximate size, plans available, and anything else we should know…",
        preferredDate: "Preferred estimate day",
        preferredDateHint:
          "Weekends only, at least 2 days out. Leave it blank and we'll propose a day.",
        preferredDateWeekday: "Estimates are held on Saturdays and Sundays. Please choose a weekend day.",
        preferredDateTooSoon: "Please choose a day at least 2 days from now so we can schedule the visit.",
        preferredDateInvalid: "Please choose a valid date.",
        photos: "Photos or plans",
        photosHint: "PDF, JPG or PNG • up to 10 MB each",
        photosTooLarge: "Each file must be 10 MB or smaller. Please choose smaller files.",
        photosWrongType: "Only PDF, JPG, and PNG files can be attached.",
        photosNote:
          "Attachments help us prepare, and you can also send them by email or text.",
        photosEmail: "Email the files",
        photosText: "Text the files",
        photosSubject: "Photos and plans for my framing project",
        consent:
          "I agree to be contacted about this request by phone, text, or email.",
        submit: "Request My Free Estimate",
        sending: "Sending…",
        pendingTitle: "Online requests are being connected.",
        pendingBody:
          "Your information was not sent. For immediate service, please call or text us now.",
        successTitle: "Your request was received.",
        successBody: "Thank you. Our team will follow up with you shortly.",
        errorTitle: "We couldn’t send your request.",
        errorBody: "Please call or text us and we’ll help you directly.",
      },
    },
    footer: {
      body: "Structural expertise for framing, additions, and renovations throughout the Bay Area.",
      contact: "Contact",
      links: "Explore",
      location: "San Pablo, CA 94806",
      rights: "All rights reserved.",
      ownership: "A business-owned website.",
      profile: "Business profile",
      privacy: "Privacy",
    },
    chat: {
      label: "Business assistant",
      title: "Ask Perez",
      status: "Online",
      trigger: "Ask us",
      intro:
        "Ask about framing services, our service area, estimates, or how to prepare your project. For anything the assistant can't confirm, call or text us.",
      chips: [
        "Do you serve my city?",
        "What plans should I send?",
        "Can I request an estimate?",
      ],
      placeholder: "Type your question…",
      send: "Send message",
      close: "Close business assistant",
      open: "Open business assistant",
      error:
        "We couldn't get an answer just now. Please try again, or call us and we'll help you directly.",
      busy: "That's a lot of messages at once. Give it a moment and try again.",
      unavailable:
        "The assistant isn't available right now. Call or text us and we'll help you directly.",
      offline: "Call or text",
      disclaimer:
        "Answers are generated by our assistant. Scope, pricing, and schedule are confirmed by our team.",
      callAction: "Call us",
      textAction: "Text us",
      powered: "Leadprime",
    },
    mobile: {
      call: "Call",
      text: "Text",
      quote: "Free Estimate",
    },
  },
  es: {
    topbar: {
      service: "San Pablo y 35 millas alrededor",
      spanish: "Hablamos español",
      license: "CSLB #1144949",
    },
    nav: {
      work: "Proyectos",
      services: "Servicios",
      builders: "Para builders",
      process: "Proceso",
      about: "Nosotros",
      estimate: "Estimado gratis",
      menu: "Abrir navegación",
    },
    hero: {
      eyebrow: "Contratista de framing en el Área de la Bahía",
      titleA: "Framing bien hecho.",
      titleB: "Del plano a la estructura.",
      body: "Framing estructural residencial y comercial, ampliaciones y renovaciones respaldadas por 25 años de experiencia práctica.",
      estimate: "Solicita un estimado gratis",
      call: "Llamar",
      scroll: "Conoce nuestro trabajo",
      photoLabel: "Proyecto real • Área de la Bahía",
      years: "25+",
      yearsLabel: "Años de experiencia práctica",
      licenseLabel: "Licencia",
      licenseValue: "CSLB #1144949",
      coverageLabel: "Local",
      coverageValue: "Cobertura de 35 millas",
    },
    reviews: {
      eyebrow: "Lo que dicen los clientes",
      title: "Reseñas de proyectos terminados.",
      // Solo se llena con reseñas reales y atribuibles. La sección permanece
      // oculta mientras esta lista esté vacía: nada de testimonios de relleno.
      items: [] as readonly { quote: string; name: string; project: string }[],
    },
    trust: {
      eyebrow: "Con licencia, seguro y equipo propio",
      title: "Las credenciales que un contratista general revisa primero.",
      body: "Todo lo siguiente está vigente. Los certificados de seguro y workers’ compensation se envían directamente al GC o a la agencia que los solicite para un proyecto.",
      verify: "Verificar en CSLB",
      note: "Publicamos que la cobertura está vigente. Los números de póliza, montos y fechas de renovación se comparten directamente con quien los necesita.",
    },
    intro: {
      eyebrow: "La estructura detrás del acabado",
      title: "Tu proyecto merece más que una promesa general.",
      body: "Aportamos experiencia en framing, comunicación clara y ejecución confiable en cada etapa, desde revisar los planos hasta el recorrido final.",
      items: [
        "Residencial y comercial",
        "Estimados gratis en sitio",
        "Contratista con licencia en California",
        "Inglés y español",
      ],
    },
    services: {
      eyebrow: "Lo que construimos",
      title: "Framing primero. Capacidad completa cuando la necesitas.",
      body: "Nuestro trabajo más fuerte comienza con la estructura. También podemos coordinar los trabajos relacionados para mantener tu proyecto avanzando.",
      cards: [
        {
          icon: "ruler" as IconName,
          number: "01",
          title: "Framing estructural",
          body: "Framing de madera y metal para construcción nueva, muros estructurales, techos y diseños personalizados.",
          tags: ["Madera", "Metal", "Estructural"],
        },
        {
          icon: "home" as IconName,
          number: "02",
          title: "Ampliaciones y remodelación",
          body: "Modificaciones estructurales, ampliaciones, aperturas y reframing para cocinas, baños y renovaciones completas.",
          tags: ["Ampliaciones", "Reframing", "Remodelación"],
        },
        {
          icon: "building" as IconName,
          number: "03",
          title: "Residencial y comercial",
          body: "Apoyo confiable para dueños de casa, constructores, property managers y proyectos comerciales ligeros.",
          tags: ["Casas", "Comercial", "Subcontratos"],
        },
        {
          icon: "wrench" as IconName,
          number: "04",
          title: "Apoyo de construcción general",
          body: "Trabajo coordinado para ampliaciones y renovaciones cuando el alcance del proyecto requiere varios oficios.",
          tags: ["Renovación", "Coordinación", "Alcance"],
        },
      ],
      cta: "Platícanos de tu proyecto",
    },
    builders: {
      eyebrow: "Builders y contratistas generales",
      title: "Un equipo de framing que responde antes de que cierre la licitación.",
      body: "Envíanos los planos, la ubicación, el calendario objetivo y el alcance de framing. Revisamos compatibilidad, disponibilidad y próximos pasos sin hacerte perder tiempo de estimación.",
      items: [
        "Cuadrilla propia de 11 personas en nómina",
        "Seguro de responsabilidad civil y workers’ compensation vigentes",
        "Elegibles para trabajo comercial y gubernamental",
        "Alcances de framing en madera y metal",
        "Revisión de planos y takeoffs",
        "Trabajo residencial y comercial ligero",
      ],
      primary: "Enviar planos para cotizar",
      secondary: "Llamar por disponibilidad",
      note: "Para builders, GCs, desarrolladores y equipos de propiedades en el Área de la Bahía.",
      subject: "Perez Rough Framing — bid set para revisión",
    },
    work: {
      eyebrow: "Trabajos seleccionados",
      title: "Proyectos reales. Progreso visible.",
      body: "Aquí no hay promesas con fotos de stock. Estos proyectos muestran el trabajo desde la estructura y renovación hasta su terminación.",
      view: "Ver proyecto",
      close: "Cerrar imagen del proyecto",
      projects: [
        {
          image: "/assets/project-05.jpg",
          title: "Ampliación estructural",
          detail: "Framing en proceso",
          alt: "Ampliación residencial con framing de madera expuesto",
        },
        {
          image: "/assets/project-02.jpg",
          title: "Reconfiguración interior",
          detail: "Aperturas y framing estructural",
          alt: "Renovación interior con nuevas aperturas estructurales",
        },
        {
          image: "/assets/project-04.jpg",
          title: "Preparación del sitio",
          detail: "Trazo y soportes estructurales",
          alt: "Proyecto residencial en preparación de sitio",
        },
        {
          image: "/assets/project-03.jpg",
          title: "Ampliación exterior",
          detail: "Etapa de impermeabilización",
          alt: "Ampliación residencial en etapa de impermeabilización",
        },
        {
          image: "/assets/project-06.jpg",
          title: "Transformación exterior",
          detail: "Renovación terminada",
          alt: "Renovación exterior residencial terminada en color gris",
        },
        {
          image: "/assets/project-01.jpg",
          title: "Exterior de residencia",
          detail: "Proyecto terminado",
          alt: "Proyecto residencial exterior terminado en color blanco",
        },
      ],
    },
    compare: {
      eyebrow: "Antes y después",
      title: "Desliza para ver la transformación.",
      body: "Una renovación exterior real, desde la construcción activa hasta el acabado final.",
      before: "En proceso",
      after: "Terminado",
      label: "Mueve el control para comparar el progreso del proyecto",
    },
    process: {
      eyebrow: "Un proceso sencillo",
      title: "Siempre sabrás qué sigue.",
      body: "Una buena construcción comienza con expectativas claras. Mantenemos el proceso sencillo y la comunicación directa.",
      steps: [
        {
          number: "01",
          title: "Cuéntanos del proyecto",
          body: "Llama, manda texto o comparte tus planos y detalles.",
        },
        {
          number: "02",
          title: "Agenda un estimado gratis",
          body: "Revisamos el sitio, alcance, acceso y necesidades estructurales.",
        },
        {
          number: "03",
          title: "Recibe una propuesta clara",
          body: "Obtienes un alcance definido, precio y tiempo estimado.",
        },
        {
          number: "04",
          title: "Construye con confianza",
          body: "Nuestro equipo termina el trabajo y lo revisa contigo.",
        },
      ],
    },
    about: {
      eyebrow: "Construido con experiencia",
      title: "Trabajo práctico. Comunicación honesta.",
      bodyA:
        "Más de 25 años de experiencia práctica en construcción respaldan los proyectos residenciales y comerciales que tomamos en el Área de la Bahía.",
      bodyB:
        "Creemos que las mejores relaciones con nuestros clientes se construyen igual que un buen frame: con precisión, consistencia y nada oculto.",
      quote:
        "El trabajo que queda detrás de las paredes merece el mismo cuidado que el acabado que todos pueden ver.",
      credentialTitle: "Contratista con licencia en California.",
      credentialBody:
        "Licencia de contratista de California #1144949. Verifica los datos actuales directamente con CSLB.",
      verify: "Verificar licencia CSLB",
      areaTitle: "Ubicados en San Pablo",
      areaBody:
        "Atendemos proyectos residenciales y comerciales aproximadamente a 35 millas alrededor.",
      map: "Abrir mapa del área",
    },
    faq: {
      eyebrow: "Preguntas comunes",
      title: "Respuestas antes de comenzar.",
      items: [
        {
          q: "¿Qué tipo de framing realizan?",
          a: "Realizamos framing de madera y metal, residencial y comercial, framing estructural, instalaciones personalizadas, ampliaciones y modificaciones para remodelaciones.",
        },
        {
          q: "¿Ofrecen estimados gratis?",
          a: "Sí. Los estimados son gratuitos y se hacen en persona. Los agendamos en fin de semana, con 2 a 5 días de anticipación, porque entre semana el equipo está en obra. Manda fotos, planos y los detalles importantes y llegamos preparados.",
        },
        {
          q: "¿Qué ciudades atienden?",
          a: "Estamos en San Pablo, California y generalmente atendemos proyectos dentro de un radio de 35 millas en el Área de la Bahía, incluyendo Richmond, El Cerrito, Berkeley, Oakland, Albany, Pinole, Hercules, Vallejo, Martinez, Concord, Walnut Creek, San Rafael, Alameda y San Leandro.",
        },
        {
          q: "¿Tienen licencia y seguro?",
          a: "Sí. Licencia CSLB #1144949, Clase B General Building Contractor, con seguro de responsabilidad civil y workers’ compensation vigentes. Estamos certificados para trabajo comercial, gubernamental y residencial, y enviamos los certificados directamente al contratista general o a la agencia que los solicite.",
        },
        {
          q: "¿Cómo manejan los precios?",
          a: "Los precios se dan en persona, después de revisar el sitio y el alcance. No publicamos precios, rangos, tarifas por pie cuadrado ni mínimos en ningún lado, y el asistente del sitio tampoco cotiza.",
        },
        {
          q: "¿Pueden ayudar con algo más que framing?",
          a: "Dependiendo del contrato y alcance, podemos coordinar trabajos relacionados cuando una ampliación o renovación requiere varios oficios.",
        },
        {
          q: "¿Trabajan en español?",
          a: "Sí. Podemos atender tu estimado y explicar tu proyecto completamente en español.",
        },
      ],
    },
    estimate: {
      eyebrow: "Comienza tu proyecto",
      title: "Cuéntanos qué estás planeando.",
      body: "Comparte algunos detalles. Revisaremos tu proyecto y te ayudaremos a identificar el siguiente paso.",
      callLabel: "¿Prefieres hablar ahora?",
      callAction: `Llama al ${phoneDisplay}`,
      textAction: "Mandar texto",
      emailAction: "Enviar email",
      hours: "Los estimados se hacen en fin de semana y se agendan con 2 a 5 días de anticipación — entre semana el equipo está en obra.",
      form: {
        name: "Nombre completo",
        phone: "Número de teléfono",
        email: "Correo electrónico",
        city: "Ciudad o código postal",
        service: "Tipo de proyecto",
        select: "Selecciona uno",
        options: [
          "Framing estructural",
          "Ampliación o framing para remodelación",
          "Construcción residencial",
          "Construcción comercial",
          "Remodelación de cocina o baño",
          "Renovación coordinada con varios oficios",
          "Otro",
        ],
        timeline: "Cuándo deseas comenzar",
        timelineOptions: [
          "Lo antes posible",
          "Dentro de 30 días",
          "1–3 meses",
          "Más de 3 meses",
          "Aún estoy planeando",
        ],
        message: "Platícanos sobre el proyecto",
        messagePlaceholder:
          "Alcance, medidas aproximadas, si tienes planos y cualquier otro detalle…",
        preferredDate: "Día preferido para el estimado",
        preferredDateHint:
          "Solo fines de semana, con al menos 2 días de anticipación. Si lo dejas vacío, te proponemos un día.",
        preferredDateWeekday: "Los estimados se hacen sábado y domingo. Elige un día de fin de semana.",
        preferredDateTooSoon: "Elige un día con al menos 2 días de anticipación para poder agendar la visita.",
        preferredDateInvalid: "Elige una fecha válida.",
        photos: "Fotos o planos",
        photosHint: "PDF, JPG o PNG • hasta 10 MB por archivo",
        photosTooLarge: "Cada archivo debe pesar 10 MB o menos. Elige archivos más pequeños.",
        photosWrongType: "Solo se pueden adjuntar archivos PDF, JPG y PNG.",
        photosNote:
          "Los archivos nos ayudan a prepararnos, y también puedes enviarlos por email o texto.",
        photosEmail: "Enviar por email",
        photosText: "Enviar por texto",
        photosSubject: "Fotos y planos para mi proyecto de framing",
        consent:
          "Acepto que me contacten sobre esta solicitud por llamada, texto o email.",
        submit: "Solicitar mi estimado gratis",
        sending: "Enviando…",
        pendingTitle: "Las solicitudes en línea se están conectando.",
        pendingBody:
          "Tu información no fue enviada. Para servicio inmediato, llámanos o manda un texto.",
        successTitle: "Recibimos tu solicitud.",
        successBody: "Gracias. Nuestro equipo se comunicará contigo muy pronto.",
        errorTitle: "No pudimos enviar tu solicitud.",
        errorBody: "Llámanos o manda un texto y te ayudaremos directamente.",
      },
    },
    footer: {
      body: "Experiencia estructural para framing, ampliaciones y renovaciones en el Área de la Bahía.",
      contact: "Contacto",
      links: "Explora",
      location: "San Pablo, CA 94806",
      rights: "Todos los derechos reservados.",
      ownership: "Un sitio propiedad del negocio.",
      profile: "Perfil del negocio",
      privacy: "Privacidad",
    },
    chat: {
      label: "Asistente del negocio",
      title: "Pregunta a Perez",
      status: "En línea",
      trigger: "Pregúntanos",
      intro:
        "Pregunta sobre servicios de framing, área de cobertura, estimados o cómo preparar tu proyecto. Si el asistente no puede confirmar algo, llámanos o mándanos un texto.",
      chips: [
        "¿Trabajan en mi ciudad?",
        "¿Qué planos debo enviar?",
        "¿Puedo pedir un estimado?",
      ],
      placeholder: "Escribe tu pregunta…",
      send: "Enviar mensaje",
      close: "Cerrar asistente del negocio",
      open: "Abrir asistente del negocio",
      error:
        "No pudimos obtener una respuesta en este momento. Intenta de nuevo o llámanos y te ayudamos directamente.",
      busy: "Son muchos mensajes seguidos. Espera un momento e intenta de nuevo.",
      unavailable:
        "El asistente no está disponible en este momento. Llámanos o mándanos un texto y te atendemos directo.",
      offline: "Llámanos o escríbenos",
      disclaimer:
        "Las respuestas las genera nuestro asistente. El alcance, precio y calendario los confirma nuestro equipo.",
      callAction: "Llamar",
      textAction: "Mandar texto",
      powered: "Leadprime",
    },
    mobile: {
      call: "Llamar",
      text: "Texto",
      quote: "Estimado gratis",
    },
  },
} as const;

function LanguageToggle({
  lang,
  onChange,
  compact = false,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
  compact?: boolean;
}) {
  return (
    <div className={`language-toggle${compact ? " compact" : ""}`} aria-label="Language selector">
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        aria-pressed={lang === "en"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "es" ? "active" : ""}
        aria-pressed={lang === "es"}
        onClick={() => onChange("es")}
      >
        ES
      </button>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<"size" | "type" | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [dateError, setDateError] = useState<EstimateDateError | null>(null);
  const [comparePosition, setComparePosition] = useState(52);
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "pending" | "success" | "error"
  >("idle");
  const t = content[lang];
  // Bounds are computed once per render pass rather than at module load, so a tab
  // left open overnight still offers valid days.
  const dateBounds = estimateDateBounds();
  const dateMessage =
    dateError === "weekday"
      ? t.estimate.form.preferredDateWeekday
      : dateError === "too-soon"
        ? t.estimate.form.preferredDateTooSoon
        : t.estimate.form.preferredDateInvalid;
  const attachmentMessage =
    attachmentError === "size"
      ? t.estimate.form.photosTooLarge
      : t.estimate.form.photosWrongType;

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("rfs-language");
    if (savedLanguage === "en" || savedLanguage === "es") {
      const timer = window.setTimeout(() => setLang(savedLanguage), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Campaign data lives on the landing URL, which is rarely the URL the visitor is
  // on when they submit. Record it on arrival so Leadprime can attribute the lead;
  // handleSubmit reads it back out of session storage.
  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    if (selectedProject === null) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", close);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("modal-open");
    };
  }, [selectedProject]);

  const schema = useMemo(() => buildBusinessSchema(), []);

  function changeLanguage(next: Lang) {
    setLang(next);
    window.localStorage.setItem("rfs-language", next);
    setMobileMenuOpen(false);
  }

  function handleDateChange(value: string) {
    setPreferredDate(value);
    setDateError(validateEstimateDate(value));
  }

  function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);

    // Reject here as well as on the server, so a visitor learns about a 12 MB photo
    // before waiting on an upload that was always going to be refused.
    const tooLarge = picked.some((file) => file.size > MAX_ATTACHMENT_BYTES);
    const wrongType = picked.some((file) => !ALLOWED_ATTACHMENT_TYPES.includes(file.type));

    if (tooLarge || wrongType) {
      event.target.value = "";
      setAttachments([]);
      setAttachmentError(tooLarge ? "size" : "type");
      return;
    }

    setAttachmentError(null);
    setAttachments(picked);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const dateProblem = validateEstimateDate(preferredDate);
    if (dateProblem) {
      setDateError(dateProblem);
      form.querySelector<HTMLInputElement>('input[name="preferred_date"]')?.focus();
      return;
    }
    if (attachmentError) return;

    const body = new FormData(form);
    for (const [field, value] of Object.entries(readAttribution())) {
      if (value) body.append(field, value);
    }

    setFormStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        body,
      });
      if (response.status === 503) {
        setFormStatus("pending");
        return;
      }
      if (!response.ok) throw new Error("Lead request failed");
      setFormStatus("success");
      form.reset();
      setAttachments([]);
      setAttachmentError(null);
      setPreferredDate("");
      setDateError(null);
    } catch {
      setFormStatus("error");
    }
  }

  const formMessage =
    formStatus === "pending"
      ? { title: t.estimate.form.pendingTitle, body: t.estimate.form.pendingBody }
      : formStatus === "success"
        ? { title: t.estimate.form.successTitle, body: t.estimate.form.successBody }
        : formStatus === "error"
          ? { title: t.estimate.form.errorTitle, body: t.estimate.form.errorBody }
          : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <a className="skip-link" href="#main">
        {lang === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>

      <div className="site-shell">
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-left">
              <span>
                <Icon name="map" size={15} />
                {t.topbar.service}
              </span>
              <span className="topbar-divider" aria-hidden="true" />
              <span>{t.topbar.spanish}</span>
            </div>
            <a
              className="topbar-license"
              href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1144949"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="shield" size={15} />
              {t.topbar.license}
            </a>
          </div>
        </div>

        <header className="site-header">
          <div className="container header-inner">
            <a className="brand" href="#main" aria-label="Perez Rough Framing home">
              <Image src="/assets/logo.png" alt="" width={72} height={72} />
              <span>
                <strong>PEREZ</strong>
                <small>ROUGH FRAMING</small>
              </span>
            </a>

            <nav className="desktop-nav" aria-label="Main navigation">
              <a href="#work">{t.nav.work}</a>
              <a href="#services">{t.nav.services}</a>
              <a href="#builders">{t.nav.builders}</a>
              <a href="#process">{t.nav.process}</a>
              <a href="#about">{t.nav.about}</a>
            </nav>

            <div className="header-actions">
              <LanguageToggle lang={lang} onChange={changeLanguage} />
              <a className="button button-small button-copper" href="#estimate">
                {t.nav.estimate}
                <Icon name="arrow" size={17} />
              </a>
              <button
                className="menu-button"
                type="button"
                aria-label={t.nav.menu}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((value) => !value)}
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} size={24} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="mobile-menu" aria-label="Mobile navigation">
              <div className="container">
                <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.work}
                </a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.services}
                </a>
                <a href="#builders" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.builders}
                </a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.process}
                </a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.about}
                </a>
                <a href="#estimate" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav.estimate}
                </a>
                <LanguageToggle compact lang={lang} onChange={changeLanguage} />
              </div>
            </nav>
          )}
        </header>

        <main id="main">
          <section className="hero">
            <div className="hero-grain" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy">
                <p className="eyebrow light">{t.hero.eyebrow}</p>
                <h1>
                  {t.hero.titleA}
                  <span>{t.hero.titleB}</span>
                </h1>
                <p className="hero-body">{t.hero.body}</p>
                <div className="hero-actions">
                  <a className="button button-copper" href="#estimate">
                    {t.hero.estimate}
                    <Icon name="arrow" size={19} />
                  </a>
                  <a className="button button-ghost" href={`tel:${phoneHref}`}>
                    <Icon name="phone" size={18} />
                    {t.hero.call} {phoneDisplay}
                  </a>
                </div>
                <a className="hero-scroll" href="#work">
                  <span aria-hidden="true" />
                  {t.hero.scroll}
                </a>
              </div>

              <div className="hero-visual">
                <div className="hero-image-frame">
                  <Image
                    src="/assets/project-05.jpg"
                    alt={t.work.projects[0].alt}
                    width={768}
                    height={1024}
                    priority
                  />
                  <div className="hero-image-shade" />
                  <div className="hero-image-label">
                    <span />
                    {t.hero.photoLabel}
                  </div>
                </div>
                <div className="hero-measure-lines" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="experience-card">
                  <strong>{t.hero.years}</strong>
                  <span>{t.hero.yearsLabel}</span>
                </div>
              </div>
            </div>

            <div className="container trust-strip">
              <div>
                <Icon name="ruler" size={22} />
                <span>
                  <small>{t.hero.years}</small>
                  {t.hero.yearsLabel}
                </span>
              </div>
              <div>
                <Icon name="shield" size={22} />
                <span>
                  <small>{t.hero.licenseLabel}</small>
                  {t.hero.licenseValue}
                </span>
              </div>
              <div>
                <Icon name="map" size={22} />
                <span>
                  <small>{t.hero.coverageLabel}</small>
                  {t.hero.coverageValue}
                </span>
              </div>
            </div>
          </section>

          <section className="credentials section" id="credentials">
            <div className="container">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{t.trust.eyebrow}</p>
                  <h2 className="section-title">{t.trust.title}</h2>
                </div>
                <p>{t.trust.body}</p>
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
                          {item.verify}
                          <Icon name="arrow" size={15} />
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              <p className="credential-note">{t.trust.note}</p>
            </div>
          </section>

          <section className="intro section">
            <div className="container intro-grid">
              <div>
                <p className="eyebrow">{t.intro.eyebrow}</p>
                <h2 className="section-title">{t.intro.title}</h2>
              </div>
              <div className="intro-content">
                <p>{t.intro.body}</p>
                <ul className="check-list">
                  {t.intro.items.map((item) => (
                    <li key={item}>
                      <span>
                        <Icon name="check" size={15} strokeWidth={2.4} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="services section" id="services">
            <div className="container">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{t.services.eyebrow}</p>
                  <h2 className="section-title">{t.services.title}</h2>
                </div>
                <p>{t.services.body}</p>
              </div>

              <div className="service-grid">
                {t.services.cards.map((service) => (
                  <article className="service-card" key={service.number}>
                    <div className="service-card-top">
                      <span className="service-icon">
                        <Icon name={service.icon} size={26} />
                      </span>
                      <span className="service-number">{service.number}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.body}</p>
                    <ul>
                      {service.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="services-cta">
                <span className="timber-line" aria-hidden="true" />
                <a href="#estimate">
                  {t.services.cta}
                  <Icon name="arrow" size={19} />
                </a>
              </div>
            </div>
          </section>

          <section className="builders section" id="builders">
            <div className="container builders-grid">
              <div className="builders-copy">
                <p className="eyebrow light">{t.builders.eyebrow}</p>
                <h2 className="section-title light">{t.builders.title}</h2>
                <p>{t.builders.body}</p>
                <div className="builders-actions">
                  <a
                    className="button button-copper"
                    href={`mailto:${email}?subject=${encodeURIComponent(t.builders.subject)}`}
                  >
                    {t.builders.primary}
                    <Icon name="arrow" size={19} />
                  </a>
                  <a className="button button-ghost" href={`tel:${phoneHref}`}>
                    <Icon name="phone" size={18} />
                    {t.builders.secondary}
                  </a>
                </div>
                <small>{t.builders.note}</small>
              </div>
              <div className="builders-panel">
                <span className="builders-panel-label">BID READY</span>
                <ul>
                  {t.builders.items.map((item, index) => (
                    <li key={item}>
                      <span>0{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="work section" id="work">
            <div className="container">
              <div className="section-heading work-heading">
                <div>
                  <p className="eyebrow light">{t.work.eyebrow}</p>
                  <h2 className="section-title light">{t.work.title}</h2>
                </div>
                <p>{t.work.body}</p>
              </div>

              <div className="project-grid">
                {t.work.projects.map((project, index) => (
                  <button
                    className={`project-card project-${index + 1}`}
                    key={project.image}
                    type="button"
                    aria-label={`${t.work.view}: ${project.title}`}
                    onClick={() => setSelectedProject(index)}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      width={index === 0 || index === 4 || index === 5 ? 768 : 1024}
                      height={index === 0 || index === 4 || index === 5 ? 1024 : 768}
                    />
                    <span className="project-overlay" />
                    <span className="project-copy">
                      <small>{project.detail}</small>
                      <strong>{project.title}</strong>
                    </span>
                    <span className="project-arrow">
                      <Icon name="arrow" size={18} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="compare section">
            <div className="container compare-grid">
              <div className="compare-copy">
                <p className="eyebrow">{t.compare.eyebrow}</p>
                <h2 className="section-title">{t.compare.title}</h2>
                <p>{t.compare.body}</p>
                <div className="compare-legend">
                  <span>
                    <i className="legend-before" />
                    {t.compare.before}
                  </span>
                  <span>
                    <i className="legend-after" />
                    {t.compare.after}
                  </span>
                </div>
              </div>

              <div className="comparison">
                <div className="comparison-stage">
                  <Image
                    className="comparison-after"
                    src="/assets/project-06.jpg"
                    alt={t.work.projects[4].alt}
                    width={768}
                    height={1024}
                  />
                  <div
                    className="comparison-before"
                    style={{ width: `${comparePosition}%` }}
                  >
                    <Image
                      src="/assets/project-03.jpg"
                      alt={t.work.projects[3].alt}
                      width={1024}
                      height={768}
                      style={{ width: `${10000 / comparePosition}%` }}
                    />
                  </div>
                  <span className="comparison-label before-label">{t.compare.before}</span>
                  <span className="comparison-label after-label">{t.compare.after}</span>
                  <div
                    className="comparison-handle"
                    style={{ left: `${comparePosition}%` }}
                    aria-hidden="true"
                  >
                    <span>‹ ›</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="92"
                    value={comparePosition}
                    aria-label={t.compare.label}
                    onChange={(event) => setComparePosition(Number(event.target.value))}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="process section" id="process">
            <div className="container">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{t.process.eyebrow}</p>
                  <h2 className="section-title">{t.process.title}</h2>
                </div>
                <p>{t.process.body}</p>
              </div>
              <ol className="process-grid">
                {t.process.steps.map((step) => (
                  <li key={step.number}>
                    <span className="process-number">{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="about section" id="about">
            <div className="container about-grid">
              <div className="about-image-stack">
                <div className="about-image">
                  <Image
                    src="/assets/project-02.jpg"
                    alt={t.work.projects[1].alt}
                    width={768}
                    height={1024}
                  />
                </div>
                <blockquote>{t.about.quote}</blockquote>
              </div>

              <div className="about-copy">
                <p className="eyebrow light">{t.about.eyebrow}</p>
                <h2 className="section-title light">{t.about.title}</h2>
                <p>{t.about.bodyA}</p>
                <p>{t.about.bodyB}</p>
                <div className="credential-cards">
                  <article>
                    <Icon name="shield" size={27} />
                    <div>
                      <h3>{t.about.credentialTitle}</h3>
                      <p>{t.about.credentialBody}</p>
                      <a
                        href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1144949"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.about.verify}
                        <Icon name="arrow" size={16} />
                      </a>
                    </div>
                  </article>
                  <article>
                    <Icon name="map" size={27} />
                    <div>
                      <h3>{t.about.areaTitle}</h3>
                      <p>{t.about.areaBody}</p>
                      <ul className="service-cities">
                        {serviceCities.map((city) => (
                          <li key={city}>{city}</li>
                        ))}
                      </ul>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=San+Pablo+CA+94806"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.about.map}
                        <Icon name="arrow" size={16} />
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          {t.reviews.items.length > 0 && (
            <section className="reviews section" id="reviews">
              <div className="container">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{t.reviews.eyebrow}</p>
                    <h2 className="section-title">{t.reviews.title}</h2>
                  </div>
                </div>
                <div className="review-grid">
                  {t.reviews.items.map((review) => (
                    <figure className="review-card" key={`${review.name}-${review.project}`}>
                      <blockquote>{review.quote}</blockquote>
                      <figcaption>
                        <strong>{review.name}</strong>
                        <small>{review.project}</small>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="faq section">
            <div className="container faq-grid">
              <div className="faq-intro">
                <p className="eyebrow">{t.faq.eyebrow}</p>
                <h2 className="section-title">{t.faq.title}</h2>
                <a className="text-link" href={`tel:${phoneHref}`}>
                  <Icon name="phone" size={18} />
                  {phoneDisplay}
                </a>
              </div>
              <div className="faq-list">
                {t.faq.items.map((item, index) => (
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

          <section className="estimate section" id="estimate">
            <div className="container estimate-grid">
              <div className="estimate-intro">
                <p className="eyebrow light">{t.estimate.eyebrow}</p>
                <h2 className="section-title light">{t.estimate.title}</h2>
                <p>{t.estimate.body}</p>
                <div className="direct-contact">
                  <small>{t.estimate.callLabel}</small>
                  <a href={`tel:${phoneHref}`}>
                    <span>
                      <Icon name="phone" size={22} />
                    </span>
                    {t.estimate.callAction}
                  </a>
                  <div>
                    <a href={`sms:${phoneHref}`}>{t.estimate.textAction}</a>
                    <a href={`mailto:${email}`}>{t.estimate.emailAction}</a>
                  </div>
                  <p>{t.estimate.hours}</p>
                </div>
              </div>

              <form
                className="estimate-form"
                onSubmit={handleSubmit}
                data-leadprime-form="estimate-request"
              >
                <input type="hidden" name="preferred_language" value={lang} />
                {/* The exact wording the visitor agreed to, stored with the consent
                    record in Leadprime for A2P 10DLC / TCPA evidence. */}
                <input type="hidden" name="consent_text" value={t.estimate.form.consent} />
                <label className="trap-field" aria-hidden="true">
                  Website
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
                <div className="field-row">
                  <label>
                    <span>{t.estimate.form.name} *</span>
                    <input name="full_name" type="text" autoComplete="name" required />
                  </label>
                  <label>
                    <span>{t.estimate.form.phone} *</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                    />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    <span>{t.estimate.form.email}</span>
                    <input name="email" type="email" autoComplete="email" />
                  </label>
                  <label>
                    <span>{t.estimate.form.city} *</span>
                    <input name="project_location" type="text" autoComplete="postal-code" required />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    <span>{t.estimate.form.service} *</span>
                    <select name="project_type" defaultValue="" required>
                      <option value="" disabled>
                        {t.estimate.form.select}
                      </option>
                      {t.estimate.form.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.estimate.form.timeline}</span>
                    <select name="timeline" defaultValue="">
                      <option value="" disabled>
                        {t.estimate.form.select}
                      </option>
                      {t.estimate.form.timelineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  <span>{t.estimate.form.message} *</span>
                  <textarea
                    name="project_details"
                    rows={5}
                    placeholder={t.estimate.form.messagePlaceholder}
                    required
                  />
                </label>

                <label className="date-field">
                  <span>{t.estimate.form.preferredDate}</span>
                  <input
                    name="preferred_date"
                    type="date"
                    value={preferredDate}
                    min={dateBounds.min}
                    max={dateBounds.max}
                    aria-describedby="preferred-date-hint"
                    aria-invalid={dateError ? true : undefined}
                    onChange={(event) => handleDateChange(event.target.value)}
                  />
                  <small id="preferred-date-hint">{t.estimate.form.preferredDateHint}</small>
                  {dateError && (
                    <small className="field-error" role="alert">
                      {dateMessage}
                    </small>
                  )}
                </label>

                <label className="upload-field">
                  <input
                    name="attachments"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    multiple
                    onChange={handleAttachmentChange}
                  />
                  <span className="upload-icon">
                    <Icon name="upload" size={24} />
                  </span>
                  <span className="upload-copy">
                    <strong>{t.estimate.form.photos}</strong>
                    <small>{t.estimate.form.photosHint}</small>
                  </span>
                </label>

                {attachmentError && (
                  <p className="field-error upload-error" role="alert">
                    {attachmentMessage}
                  </p>
                )}

                {attachments.length > 0 && (
                  <ul className="upload-list">
                    {attachments.map((file) => (
                      <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                        <Icon name="check" size={14} strokeWidth={2.4} />
                        <span>{file.name}</span>
                        <small>{formatFileSize(file.size)}</small>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="plans-field">
                  <span className="plans-copy">
                    <small>{t.estimate.form.photosNote}</small>
                    <span className="plans-actions">
                      <a href={`mailto:${email}?subject=${encodeURIComponent(t.estimate.form.photosSubject)}`}>
                        {t.estimate.form.photosEmail}
                      </a>
                      <a href={`sms:${phoneHref}`}>{t.estimate.form.photosText}</a>
                    </span>
                  </span>
                </div>

                <label className="consent-field">
                  <input name="contact_consent" type="checkbox" value="yes" required />
                  <span>{t.estimate.form.consent}</span>
                </label>

                {formMessage && (
                  <div className={`form-message ${formStatus}`} role="status">
                    <Icon
                      name={formStatus === "success" ? "check" : "message"}
                      size={21}
                    />
                    <span>
                      <strong>{formMessage.title}</strong>
                      <small>{formMessage.body}</small>
                    </span>
                  </div>
                )}

                <button
                  className="button button-copper form-submit"
                  type="submit"
                  disabled={formStatus === "sending"}
                >
                  {formStatus === "sending"
                    ? t.estimate.form.sending
                    : t.estimate.form.submit}
                  <Icon name="arrow" size={19} />
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <Image src="/assets/logo.png" alt="" width={104} height={104} />
              <div>
                <strong>PEREZ</strong>
                <span>ROUGH FRAMING</span>
                <p>{t.footer.body}</p>
              </div>
            </div>
            <div>
              <h2>{t.footer.contact}</h2>
              <a href={`tel:${phoneHref}`}>{phoneDisplay}</a>
              <a href={`mailto:${email}`}>{email}</a>
              <span>{t.footer.location}</span>
            </div>
            <div>
              <h2>{t.footer.links}</h2>
              <a href="#work">{t.nav.work}</a>
              <a href="#services">{t.nav.services}</a>
              <a href="#builders">{t.nav.builders}</a>
              <a href="#process">{t.nav.process}</a>
              <a href="#estimate">{t.nav.estimate}</a>
              <a href="/company-profile">{t.footer.profile}</a>
              <a href="/privacy">{t.footer.privacy}</a>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} Perez Rough Framing. {t.footer.rights}</span>
            <span>{t.footer.ownership}</span>
          </div>
        </footer>

        {selectedProject !== null && (
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={t.work.projects[selectedProject].title}
            onClick={() => setSelectedProject(null)}
          >
            <button
              type="button"
              aria-label={t.work.close}
              onClick={() => setSelectedProject(null)}
            >
              <Icon name="close" size={24} />
            </button>
            <figure onClick={(event) => event.stopPropagation()}>
              <Image
                src={t.work.projects[selectedProject].image}
                alt={t.work.projects[selectedProject].alt}
                width={1024}
                height={768}
              />
              <figcaption>
                <small>{t.work.projects[selectedProject].detail}</small>
                <strong>{t.work.projects[selectedProject].title}</strong>
              </figcaption>
            </figure>
          </div>
        )}

        <AssistantChat lang={lang} copy={t.chat} phoneHref={phoneHref} />

        <nav className="mobile-action-bar" aria-label="Quick contact">
          <a href={`tel:${phoneHref}`}>
            <Icon name="phone" size={19} />
            {t.mobile.call}
          </a>
          <a href={`sms:${phoneHref}`}>
            <Icon name="message" size={19} />
            {t.mobile.text}
          </a>
          <a href="#estimate">
            <Icon name="ruler" size={19} />
            {t.mobile.quote}
          </a>
        </nav>
      </div>
    </>
  );
}
