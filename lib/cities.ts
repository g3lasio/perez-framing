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
  faq: { es: { q: string; a: string }[]; en: { q: string; a: string }[] };
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
    faq: {
      es: [
      { q: "¿Trabajan en Richmond y cuánto tardan en llegar?", a: "San Pablo colinda con Richmond, así que es de las zonas donde más rápido podemos coordinar una visita de estimado y la entrega de material. Los estimados se agendan en fin de semana con 2 a 5 días de anticipación." },
      { q: "Mi casa es de los años cuarenta cerca de los astilleros. ¿Qué suelen encontrar al abrir un muro?", a: "En vivienda de posguerra construida rápido es común encontrar refuerzo lateral escaso para los estándares actuales, y madera con daño por humedad en la parte baja de los muros. Lo documentamos antes de tocarlo y lo incluimos en el alcance." },
      { q: "¿Pueden abrir un muro de carga para conectar cocina y sala?", a: "Sí, es de los trabajos que más hacemos en Richmond. Requiere un cabezal dimensionado para el claro y la carga de arriba, y normalmente cálculo estructural y permiso. Manda fotos y planos y lo revisamos antes de la visita." },
      ],
      en: [
      { q: "Do you work in Richmond, and how soon can you come out?", a: "San Pablo borders Richmond, so it is one of the areas where we can schedule an estimate visit and material delivery fastest. Estimates are held on weekends, booked 2 to 5 days ahead." },
      { q: "My house is 1940s, near the shipyards. What do you usually find behind a wall?", a: "In post-war housing built quickly, it is common to find little lateral bracing by today's standards, and moisture-damaged lumber low in the walls. We document it before touching it and fold it into the scope." },
      { q: "Can you open a load-bearing wall to connect the kitchen and living room?", a: "Yes — it is one of the jobs we do most in Richmond. It needs a header sized for the span and the load above, and usually engineering and a permit. Send photos and plans and we will review before the visit." },
      ],
    },
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
    faq: {
      es: [
      { q: "Mi casa es craftsman anterior a 1940. ¿Pueden trabajar sin alterar su carácter?", a: "Sí. En Berkeley buena parte del inventario tiene detalles que ya no se construyen así, y el objetivo es que la estructura nueva quede integrada sin que se note desde afuera. Preferimos revisar planos y fotos antes de la visita." },
      { q: "¿Hacen framing para ADUs en Berkeley?", a: "Sí, es uno de los trabajos más solicitados aquí. El alcance depende de si es conversión de espacio existente o construcción nueva, y del acceso al lote — en las colinas eso cambia mucho el plan de obra." },
      { q: "El lote está en ladera. ¿Complica el trabajo?", a: "Complica el acceso y el acopio de material más que el framing en sí. Se planea antes de empezar: por dónde entra la madera, dónde se corta y cómo se sube. Por eso la visita de estimado en ladera es indispensable." },
      ],
      en: [
      { q: "My house is pre-1940 craftsman. Can you work without altering its character?", a: "Yes. Much of Berkeley's stock is detailed in ways nobody builds anymore, and the goal is for new structure to integrate without reading from outside. We prefer to review plans and photos before the visit." },
      { q: "Do you frame ADUs in Berkeley?", a: "Yes, it is one of the most requested jobs here. Scope depends on whether it is a conversion of existing space or new construction, and on lot access — in the hills that changes the build plan considerably." },
      { q: "The lot is on a hillside. Does that complicate the work?", a: "It complicates access and material staging more than the framing itself. It gets planned before the start: how the lumber comes in, where it is cut, how it goes up. That is why a hillside estimate visit is essential." },
      ],
    },
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
    faq: {
      es: [
      { q: "¿Trabajan como subcontrato de framing para contratistas generales en Oakland?", a: "Sí, es el mercado donde más lo hacemos. Cuadrilla propia de 11 personas en nómina, seguro de responsabilidad civil y workers’ compensation vigentes, y el paquete de cumplimiento listo para enviarse." },
      { q: "Mi casa es victoriana en los barrios planos. ¿Qué implica para el framing?", a: "La estructura original suele ser de dimensiones y espaciados distintos a los actuales, y a veces con modificaciones previas sin permiso. Antes de proponer alcance hay que ver qué hay realmente detrás del acabado." },
      { q: "¿Hacen comercial ligero en Oakland?", a: "Sí. Framing de madera y metal para proyectos comerciales ligeros, y estamos certificados también para trabajo gubernamental." },
      ],
      en: [
      { q: "Do you work as a framing subcontractor for general contractors in Oakland?", a: "Yes, it is the market where we do it most. Our own 11-person crew on payroll, general liability and workers' compensation in force, and the compliance package ready to send." },
      { q: "My house is a Victorian in the flats. What does that mean for framing?", a: "The original structure usually uses different dimensions and spacing than today's, sometimes with earlier unpermitted modifications. Before proposing scope we need to see what is actually behind the finish." },
      { q: "Do you do light commercial in Oakland?", a: "Yes. Wood and metal framing for light commercial projects, and we are certified for government work as well." },
      ],
    },
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
    faq: {
      es: [
      { q: "¿Pueden agregar un segundo piso a una casa de posguerra en El Cerrito?", a: "Es uno de los trabajos típicos aquí. Depende de la capacidad de la cimentación y de la estructura existente, así que requiere cálculo estructural antes de definir alcance. La visita de estimado es el primer paso." },
      { q: "¿Qué tan rápido pueden ir a ver mi proyecto?", a: "Colindamos con El Cerrito, así que agendar es sencillo. Las visitas son en fin de semana con 2 a 5 días de anticipación, porque entre semana el equipo está en obra." },
      { q: "Mi casa tiene la planta cerrada. ¿Se puede abrir?", a: "Casi siempre sí, pero depende de qué muros carguen. Se resuelve con cabezales y a veces con columnas ocultas. Lo definimos en sitio con los planos a la mano." },
      ],
      en: [
      { q: "Can you add a second story to a post-war house in El Cerrito?", a: "It is one of the typical jobs here. It depends on the foundation's capacity and the existing structure, so it needs engineering before scope is set. The estimate visit is the first step." },
      { q: "How quickly can you look at my project?", a: "We border El Cerrito, so scheduling is simple. Visits are on weekends with 2 to 5 days' notice, because during the week the crew is on site." },
      { q: "My floor plan is closed off. Can it be opened?", a: "Almost always, but it depends which walls carry load. It is solved with headers and sometimes hidden columns. We define it on site with the plans in hand." },
      ],
    },
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
    faq: {
      es: [
      { q: "El lote es muy angosto. ¿Pueden trabajar ahí?", a: "Sí, y en Albany es la norma. El acceso y el acopio de material se planean antes de empezar, no sobre la marcha — es lo que evita que la obra se detenga a media semana." },
      { q: "¿Conviene ampliar o reconfigurar lo que ya tengo?", a: "En lotes chicos muchas veces rinde más reconfigurar el espacio existente que ampliar. Lo revisamos en la visita y te decimos con franqueza qué conviene." },
      { q: "¿Cuánto cuesta un proyecto en Albany?", a: "Los precios se dan únicamente en persona, después de revisar el sitio y el alcance. No publicamos precios, rangos ni tarifas por pie cuadrado en ningún canal." },
      ],
      en: [
      { q: "The lot is very narrow. Can you still work there?", a: "Yes, and in Albany that is the norm. Access and material staging get planned before the start, not on the fly — that is what keeps the job from stalling mid-week." },
      { q: "Should I add on or reconfigure what I already have?", a: "On small lots, reconfiguring existing space often returns more than adding on. We look at it during the visit and tell you plainly which makes sense." },
      { q: "What does a project in Albany cost?", a: "Pricing is given in person only, after seeing the site and the scope. We do not publish prices, ranges or square-foot rates on any channel." },
      ],
    },
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
    faq: {
      es: [
      { q: "Mi casa está en el centro antiguo de Pinole. ¿Cambia algo?", a: "Sí. El inventario del centro es más antiguo que el de las subdivisiones nuevas y suele pedir más revisión estructural antes de definir alcance. Son dos formas distintas de trabajar." },
      { q: "¿Hacen framing de construcción nueva en Pinole?", a: "Sí, además de ampliaciones y remodelaciones con modificación estructural." },
      { q: "¿Atienden Pinole con la misma rapidez que San Pablo?", a: "Prácticamente. Pinole está dentro de nuestra zona de cobertura directa desde San Pablo." },
      ],
      en: [
      { q: "My house is in old downtown Pinole. Does that change anything?", a: "Yes. Downtown stock is older than the newer subdivisions and usually needs more structural review before scope is set. They are two different ways of working." },
      { q: "Do you do new construction framing in Pinole?", a: "Yes, along with additions and remodels involving structural modification." },
      { q: "Do you serve Pinole as quickly as San Pablo?", a: "Practically. Pinole is inside our direct coverage area from San Pablo." },
      ],
    },
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
    faq: {
      es: [
      { q: "Vivo en un fraccionamiento con HOA. ¿Eso afecta el proyecto?", a: "Puede afectar qué se permite construir y cómo se ve desde afuera. Conviene revisar las reglas del fraccionamiento antes de definir el alcance, para no rediseñar a medio camino." },
      { q: "Tengo los planos originales de la casa. ¿Sirven?", a: "Muchísimo. Al ser vivienda más reciente los planos suelen existir, y con ellos el estimado sale mucho más preciso y con menos sorpresas al abrir." },
      { q: "¿Hacen conversiones de garaje?", a: "Sí. Es de los trabajos más comunes en Hercules, junto con ampliaciones dentro de la huella existente." },
      ],
      en: [
      { q: "I live in an HOA subdivision. Does that affect the project?", a: "It can affect what you are allowed to build and how it looks from outside. Worth checking the rules before scope is set, so nothing gets redesigned halfway." },
      { q: "I have the original house plans. Are they useful?", a: "Very. Because the housing is newer, plans usually exist, and with them the estimate is far more precise and there are fewer surprises on opening." },
      { q: "Do you do garage conversions?", a: "Yes. It is one of the most common jobs in Hercules, along with additions inside the existing footprint." },
      ],
    },
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
    faq: {
      es: [
      { q: "Mi casa es victoriana cerca del centro. ¿La pueden trabajar?", a: "Sí. En casa histórica lo primero es ver qué hay: abrir un muro suele revelar trabajo previo hecho sin permiso o madera dañada. Lo documentamos antes de tocarlo." },
      { q: "Encontré daño por termita o humedad. ¿Lo reparan?", a: "Sí, la reparación estructural y el reframing de zonas dañadas es parte de lo que hacemos. El alcance real se define cuando se abre y se ve la extensión." },
      { q: "¿Vallejo está dentro de su cobertura?", a: "Sí, dentro del radio general de aproximadamente 35 millas alrededor de San Pablo. La aceptación depende del proyecto, acceso y capacidad disponible." },
      ],
      en: [
      { q: "My house is a Victorian near downtown. Can you work on it?", a: "Yes. In a historic house the first job is finding out what is there: opening a wall often reveals earlier unpermitted work or damaged lumber. We document it before touching it." },
      { q: "I found termite or moisture damage. Do you repair it?", a: "Yes, structural repair and reframing of damaged areas is part of what we do. The real scope gets set once it is open and the extent is visible." },
      { q: "Is Vallejo within your coverage?", a: "Yes, inside the general radius of roughly 35 miles around San Pablo. Acceptance depends on the project, access and available capacity." },
      ],
    },
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
    faq: {
      es: [
      { q: "Tengo una casa ranch con lote grande. ¿Conviene ampliar hacia atrás o hacia arriba?", a: "Depende de la cimentación, del uso que le quieras dar y de las restricciones del lote. En Concord el lote amplio suele hacer más sencilla la ampliación trasera, pero lo definimos en sitio." },
      { q: "¿El lote grande acorta el tiempo de obra?", a: "Suele ayudar. Poder acopiar y cortar material en el sitio, sin pelear por espacio, quita fricción a la obra." },
      { q: "¿Hacen construcción nueva en Concord?", a: "Sí, además de ampliaciones de una y dos plantas y apertura de plantas cerradas." },
      ],
      en: [
      { q: "I have a ranch house on a big lot. Add out back or up top?", a: "It depends on the foundation, what you want the space for, and lot restrictions. In Concord the generous lot usually makes a rear addition simpler, but we settle it on site." },
      { q: "Does the big lot shorten the build?", a: "It usually helps. Being able to stage and cut material on site without fighting for space takes friction out of the job." },
      { q: "Do you do new construction in Concord?", a: "Yes, along with one and two-story additions and opening up closed floor plans." },
      ],
    },
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
    faq: {
      es: [
      { q: "Tengo arquitecto e ingeniero. ¿Cómo trabajan con ellos?", a: "Preferimos revisar el juego completo de planos antes de cotizar. Con cálculo estructural definido el alcance es preciso y no hay sorpresas de dimensionamiento a media obra." },
      { q: "¿Coordinan con otros oficios en una renovación integral?", a: "Sí, cuando el contrato y el alcance lo permiten. En renovación integral el framing marca el ritmo de los demás oficios, así que la coordinación se planea desde el principio." },
      { q: "¿Hacen proyectos grandes en Walnut Creek?", a: "Sí. Ampliaciones grandes y renovación estructural completa, con cuadrilla propia de 11 personas en nómina." },
      ],
      en: [
      { q: "I have an architect and an engineer. How do you work with them?", a: "We prefer to review the full plan set before quoting. With engineering defined, the scope is precise and there are no sizing surprises mid-build." },
      { q: "Do you coordinate with other trades on a full renovation?", a: "Yes, when the contract and scope allow. On a full renovation framing sets the pace for the other trades, so coordination gets planned from the start." },
      { q: "Do you take large projects in Walnut Creek?", a: "Yes. Large additions and full structural renovation, with our own 11-person crew on payroll." },
      ],
    },
  },
];

/**
 * Photos, in the same rotation the city landing pages use for their hero.
 * Exported so page metadata can name the same image the visitor will see, instead
 * of every share of every city falling back to one generic photo.
 */
export const cityPhotos = [
  "/assets/project-05.jpg",
  "/assets/project-02.jpg",
  "/assets/project-04.jpg",
  "/assets/project-03.jpg",
  "/assets/project-06.jpg",
  "/assets/project-01.jpg",
] as const;

export function cityPhoto(city: City): string {
  return cityPhotos[(city.priority - 1) % cityPhotos.length];
}

export function cityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
