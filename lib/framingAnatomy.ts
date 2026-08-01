/**
 * The pieces of a load-bearing wood-framed wall, in the order a crew builds them.
 *
 * This is the trade knowledge the site is built on: framing disappears behind
 * drywall, so the only way to show judgment is to explain what is back there. Every
 * description is general construction practice — nothing here claims anything about
 * a specific project, price, schedule, or outcome.
 */

export type AnatomyPart = {
  id: string;
  /** Build order, used to stagger the assembly animation. */
  step: number;
  es: { name: string; role: string; body: string };
  en: { name: string; role: string; body: string };
};

export const anatomyParts: AnatomyPart[] = [
  {
    id: "bottom-plate",
    step: 0,
    es: {
      name: "Solera inferior",
      role: "Sujeta el muro al piso",
      body: "La tabla horizontal de abajo. Amarra el muro al subpiso y define exactamente dónde cae cada montante. Si esta pieza queda fuera de escuadra, todo lo que va encima hereda el error.",
    },
    en: {
      name: "Bottom plate",
      role: "Ties the wall to the floor",
      body: "The horizontal board at the base. It fastens the wall to the subfloor and sets exactly where every stud lands. If this one is out of square, everything above it inherits the error.",
    },
  },
  {
    id: "stud",
    step: 1,
    es: {
      name: "Montantes",
      role: "Cargan el peso hacia abajo",
      body: "Los verticales, normalmente cada 16 pulgadas de centro a centro. Llevan la carga del techo y los pisos hasta la cimentación. El espaciado no es estético: define qué tan rígido queda el muro y dónde caerán los clavos del drywall.",
    },
    en: {
      name: "Studs",
      role: "Carry the load down",
      body: "The verticals, usually 16 inches on center. They carry roof and floor load down to the foundation. The spacing is not cosmetic: it sets how stiff the wall is and where the drywall fasteners will land.",
    },
  },
  {
    id: "top-plate",
    step: 2,
    es: {
      name: "Doble solera superior",
      role: "Amarra los muros entre sí",
      body: "Dos tablas encimadas arriba. La segunda se traslapa en las esquinas y uniones, y es lo que convierte muros sueltos en una estructura amarrada. Sobre ella descansan las viguetas y la armadura del techo.",
    },
    en: {
      name: "Double top plate",
      role: "Ties the walls together",
      body: "Two boards stacked at the top. The second laps the corners and intersections, which is what turns separate walls into one tied structure. Joists and roof trusses bear on it.",
    },
  },
  {
    id: "king-stud",
    step: 3,
    es: {
      name: "Montante rey",
      role: "Enmarca la abertura completa",
      body: "Corre completo de solera a solera, a cada lado de una puerta o ventana. Es el borde de la abertura y le da rigidez lateral al conjunto.",
    },
    en: {
      name: "King stud",
      role: "Frames the full opening",
      body: "Runs full height from plate to plate on each side of a door or window. It forms the edge of the opening and gives the assembly its lateral stiffness.",
    },
  },
  {
    id: "jack-stud",
    step: 4,
    es: {
      name: "Montante de carga",
      role: "Sostiene el cabezal",
      body: "También llamado trimmer. Va cortado a la altura de la abertura, pegado por dentro del montante rey, y baja hasta la solera inferior la carga que recoge el cabezal. Cuántos van depende del claro y del peso arriba.",
    },
    en: {
      name: "Jack stud",
      role: "Holds up the header",
      body: "Also called a trimmer. Cut to the opening height and nailed inside the king stud, it carries the header's load down to the bottom plate. How many you need depends on the span and the weight above.",
    },
  },
  {
    id: "header",
    step: 5,
    es: {
      name: "Cabezal",
      role: "Puentea el hueco",
      body: "La viga horizontal sobre la puerta o ventana. Recoge la carga que ya no pueden llevar los montantes eliminados y la reparte a los lados. Su tamaño sale del claro y de lo que carga encima — no se escoge de memoria.",
    },
    en: {
      name: "Header",
      role: "Bridges the gap",
      body: "The horizontal beam over a door or window. It picks up the load the removed studs can no longer carry and moves it to the sides. Its size comes from the span and what sits above — not from habit.",
    },
  },
  {
    id: "cripple",
    step: 6,
    es: {
      name: "Montantes cortos",
      role: "Continúan el ritmo del muro",
      body: "Los cortos arriba del cabezal y abajo del alféizar. Mantienen el espaciado del muro a través de la abertura y dan respaldo al panel exterior. Se ven sobrantes y no lo son.",
    },
    en: {
      name: "Cripple studs",
      role: "Keep the wall's rhythm",
      body: "The short ones above the header and below the sill. They carry the wall's spacing across the opening and back the exterior sheathing. They look redundant and are not.",
    },
  },
  {
    id: "sill",
    step: 7,
    es: {
      name: "Alféizar",
      role: "Define el fondo de la ventana",
      body: "La horizontal que cierra la ventana por abajo y reparte su carga a los montantes cortos. En ventanas anchas se dobla.",
    },
    en: {
      name: "Rough sill",
      role: "Sets the bottom of the window",
      body: "The horizontal that closes the window at the bottom and spreads its load into the cripples. On wide windows it gets doubled.",
    },
  },
  {
    id: "blocking",
    step: 8,
    es: {
      name: "Bloqueo",
      role: "Evita que los montantes giren",
      body: "Piezas cortas horizontales entre montantes. Impiden que se tuerzan, rigidizan el muro, y dan dónde anclar gabinetes, barandales o un televisor. Ponerlo mientras el muro está abierto cuesta minutos; ponerlo después cuesta abrir el drywall.",
    },
    en: {
      name: "Blocking",
      role: "Keeps studs from twisting",
      body: "Short horizontal pieces between studs. They stop twist, stiffen the wall, and give you something to anchor cabinets, railings or a TV into. Installed while the wall is open it costs minutes; added later it costs opening the drywall.",
    },
  },
  {
    id: "sheathing",
    step: 9,
    es: {
      name: "Panel de corte",
      role: "Resiste el sismo y el viento",
      body: "El panel estructural clavado por fuera. Es lo que impide que el muro se deforme en paralelogramo durante un sismo. El patrón de clavado — separación en el borde y en el centro — es lo que revisa el inspector, y es donde se nota quién trabaja bien.",
    },
    en: {
      name: "Shear panel",
      role: "Resists earthquake and wind",
      body: "The structural panel nailed to the outside. It is what keeps the wall from racking into a parallelogram during an earthquake. The nailing pattern — edge and field spacing — is what the inspector checks, and where good work shows.",
    },
  },
  {
    id: "holddown",
    step: 10,
    es: {
      name: "Anclaje",
      role: "Amarra el muro a la cimentación",
      body: "El herraje que sujeta el extremo del muro al concreto. En sismo el muro tiende a levantarse por una esquina; esto es lo que lo detiene. En el Área de la Bahía no es un extra.",
    },
    en: {
      name: "Hold-down",
      role: "Anchors the wall to the foundation",
      body: "The hardware tying the end of the wall into the concrete. In an earthquake the wall wants to lift at one corner; this is what stops it. In the Bay Area it is not an optional extra.",
    },
  },
];
