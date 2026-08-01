/**
 * Service-area city pages.
 *
 * These are not doorway pages. Each one carries content that is actually different
 * — the housing stock a framer meets in that city, and the framing work those homes
 * typically need — because near-duplicate city pages are worth less than no city
 * pages at all.
 *
 * Everything here describes general, well-established characteristics of Bay Area
 * housing stock and terrain. Nothing claims a completed project in any city, names a
 * client, quotes a price, or promises a permit outcome.
 */

export type City = {
  slug: string;
  name: string;
  county: string;
  /** Ordered by commercial value: home turf first, then the large East Bay markets. */
  priority: number;
  es: { stock: string; work: string; note: string };
  en: { stock: string; work: string; note: string };
  services: string[];
};

export const cities: City[] = [
  {
    slug: "richmond",
    name: "Richmond",
    county: "Contra Costa",
    priority: 1,
    es: {
      stock:
        "Richmond mezcla bungalows de principios del siglo XX con vivienda de posguerra construida rápido para los astilleros. Son casas de estructura ligera, muchas sin refuerzo lateral moderno y con cimentaciones que ya vieron varios sismos.",
      work: "Ampliaciones traseras, reconfiguración de interiores para abrir cocina y sala, y reframing cuando se descubre madera dañada al abrir un muro.",
      note: "Estamos a unos minutos: San Pablo colinda con Richmond, así que es de las zonas donde mejor podemos coordinar visitas y entregas de material.",
    },
    en: {
      stock:
        "Richmond mixes early-1900s bungalows with post-war housing built fast for the shipyards. These are light-frame houses, many without modern lateral bracing, on foundations that have already seen several earthquakes.",
      work: "Rear additions, interior reconfiguration to open kitchen and living areas, and reframing when damaged lumber turns up behind a wall.",
      note: "We are minutes away — San Pablo borders Richmond, so this is one of the areas where we can coordinate visits and material deliveries most easily.",
    },
    services: ["Ampliaciones", "Reframing estructural", "Aperturas de muro"],
  },
  {
    slug: "berkeley",
    name: "Berkeley",
    county: "Alameda",
    priority: 2,
    es: {
      stock:
        "Berkeley conserva mucha casa anterior a 1940 — craftsman y brown shingle — y buena parte del inventario está en ladera. Estructuras con detalles que ya no se construyen así, y lotes donde el acceso complica todo.",
      work: "Ampliaciones y ADUs, aperturas estructurales en muros de carga, y framing para renovaciones completas que respetan el carácter original de la casa.",
      note: "En casas de este tipo la sorpresa es la regla: hay que abrir para saber qué hay. Preferimos revisar planos y fotos antes de la visita.",
    },
    en: {
      stock:
        "Berkeley holds a lot of pre-1940 housing — craftsman and brown shingle — and much of it sits on hillsides. Structures detailed in ways nobody builds anymore, on lots where access complicates everything.",
      work: "Additions and ADUs, structural openings in load-bearing walls, and framing for whole renovations that keep the home's original character.",
      note: "In houses like these, surprises are the rule: you open the wall to find out what is there. We prefer to review plans and photos before the visit.",
    },
    services: ["ADUs", "Aperturas estructurales", "Renovación completa"],
  },
  {
    slug: "oakland",
    name: "Oakland",
    county: "Alameda",
    priority: 3,
    es: {
      stock:
        "Oakland va de victorianas y bungalows en los barrios planos a casas en pendiente en las colinas, donde el framing tiene que resolver desniveles y accesos difíciles.",
      work: "Ampliaciones, framing residencial y comercial ligero, subcontratos de framing para contratistas generales, y reconfiguración de plantas.",
      note: "Es el mercado más grande de nuestra área y donde más trabajamos como subcontrato para GCs.",
    },
    en: {
      stock:
        "Oakland runs from Victorians and bungalows in the flats to hillside homes where framing has to resolve grade changes and difficult access.",
      work: "Additions, residential and light-commercial framing, framing subcontracts for general contractors, and floor plan reconfiguration.",
      note: "It is the largest market in our area and where we most often work as a framing subcontractor for GCs.",
    },
    services: ["Subcontrato de framing", "Comercial ligero", "Ampliaciones"],
  },
  {
    slug: "el-cerrito",
    name: "El Cerrito",
    county: "Contra Costa",
    priority: 4,
    es: {
      stock:
        "El Cerrito es sobre todo vivienda de posguerra en lotes compactos, con buena parte del inventario en ladera hacia el este.",
      work: "Ampliaciones de segundo piso, ampliaciones traseras y aperturas estructurales para modernizar plantas cerradas.",
      note: "Colindamos. Las visitas de estimado aquí son sencillas de agendar.",
    },
    en: {
      stock:
        "El Cerrito is mostly post-war housing on compact lots, with a good share of the stock climbing the hillside to the east.",
      work: "Second-story additions, rear additions, and structural openings to modernize closed-off floor plans.",
      note: "We border it. Estimate visits here are simple to schedule.",
    },
    services: ["Segundo piso", "Ampliaciones", "Aperturas"],
  },
  {
    slug: "albany",
    name: "Albany",
    county: "Alameda",
    priority: 5,
    es: {
      stock:
        "Albany es una ciudad pequeña y densa, con casas de los años veinte a cuarenta en lotes angostos donde cada pie cuadrado se pelea.",
      work: "Ampliaciones que aprovechan lotes chicos, conversión de espacios existentes y aperturas estructurales.",
      note: "En lotes angostos el acceso y el acopio de material se planean antes de empezar, no sobre la marcha.",
    },
    en: {
      stock:
        "Albany is small and dense, with 1920s–1940s houses on narrow lots where every square foot is contested.",
      work: "Additions that make the most of small lots, conversion of existing space, and structural openings.",
      note: "On narrow lots, access and material staging get planned before the start, not on the fly.",
    },
    services: ["Ampliaciones", "Conversiones", "Aperturas"],
  },
  {
    slug: "pinole",
    name: "Pinole",
    county: "Contra Costa",
    priority: 6,
    es: {
      stock:
        "Pinole combina un centro antiguo con subdivisiones más recientes. Dos inventarios muy distintos que piden enfoques distintos de framing.",
      work: "Ampliaciones familiares, remodelaciones de cocina y baño con modificación estructural, y framing de construcción nueva.",
      note: "Zona de cobertura directa desde San Pablo.",
    },
    en: {
      stock:
        "Pinole combines an older downtown with newer subdivisions — two very different housing stocks that call for different framing approaches.",
      work: "Family additions, kitchen and bath remodels with structural modification, and new construction framing.",
      note: "Direct coverage area from San Pablo.",
    },
    services: ["Ampliaciones", "Remodelación", "Construcción nueva"],
  },
  {
    slug: "hercules",
    name: "Hercules",
    county: "Contra Costa",
    priority: 7,
    es: {
      stock:
        "Hercules es en buena medida desarrollo planeado más reciente, con estructuras más uniformes y reglas de fraccionamiento que hay que considerar antes de ampliar.",
      work: "Ampliaciones, conversiones de garaje y modificaciones estructurales dentro de la huella existente.",
      note: "Al ser vivienda más nueva, los planos originales suelen existir — mándalos y el estimado sale mucho más preciso.",
    },
    en: {
      stock:
        "Hercules is largely newer planned development, with more uniform structures and HOA rules worth checking before you add on.",
      work: "Additions, garage conversions, and structural modifications inside the existing footprint.",
      note: "Because the housing is newer, original plans usually exist — send them and the estimate gets far more precise.",
    },
    services: ["Ampliaciones", "Conversión de garaje", "Modificación estructural"],
  },
  {
    slug: "vallejo",
    name: "Vallejo",
    county: "Solano",
    priority: 8,
    es: {
      stock:
        "Vallejo tiene un inventario histórico importante — victorianas y casas de principios del siglo XX cerca del centro — junto a vivienda de posguerra.",
      work: "Reframing estructural en casas antiguas, ampliaciones y reparación de estructura dañada por humedad o termita.",
      note: "En casa histórica, abrir un muro suele revelar trabajo previo hecho sin permiso. Lo documentamos antes de tocarlo.",
    },
    en: {
      stock:
        "Vallejo has significant historic stock — Victorians and early-1900s homes near downtown — alongside post-war housing.",
      work: "Structural reframing in older homes, additions, and repair of structure damaged by moisture or termites.",
      note: "In a historic house, opening a wall often reveals earlier unpermitted work. We document it before touching it.",
    },
    services: ["Reframing", "Reparación estructural", "Ampliaciones"],
  },
  {
    slug: "concord",
    name: "Concord",
    county: "Contra Costa",
    priority: 9,
    es: {
      stock:
        "Concord es sobre todo vivienda de posguerra tipo ranch en lotes amplios — el inventario ideal para ampliar hacia atrás o hacia arriba.",
      work: "Ampliaciones de una y dos plantas, apertura de plantas cerradas y framing de construcción nueva.",
      note: "Los lotes amplios facilitan el acopio de material y suelen acortar el tiempo de obra.",
    },
    en: {
      stock:
        "Concord is mostly post-war ranch housing on generous lots — the ideal stock for adding out back or up top.",
      work: "One and two-story additions, opening up closed floor plans, and new construction framing.",
      note: "Generous lots make material staging easier and usually shorten the build.",
    },
    services: ["Ampliaciones", "Segundo piso", "Construcción nueva"],
  },
  {
    slug: "walnut-creek",
    name: "Walnut Creek",
    county: "Contra Costa",
    priority: 10,
    es: {
      stock:
        "Walnut Creek mezcla vivienda de mediados de siglo con propiedades de mayor valor donde la renovación suele ser integral y con planos de arquitecto.",
      work: "Renovación estructural completa, ampliaciones grandes y framing coordinado con varios oficios.",
      note: "Cuando hay arquitecto e ingeniero involucrados, preferimos revisar el set completo antes de cotizar.",
    },
    en: {
      stock:
        "Walnut Creek mixes mid-century housing with higher-value properties where renovation tends to be comprehensive and architect-drawn.",
      work: "Full structural renovation, large additions, and framing coordinated across multiple trades.",
      note: "When an architect and engineer are involved, we prefer to review the full set before quoting.",
    },
    services: ["Renovación integral", "Ampliaciones grandes", "Coordinación"],
  },
];

export function cityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
