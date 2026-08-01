"use client";

import { useEffect, useRef, useState } from "react";
import { anatomyParts } from "@/lib/framingAnatomy";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type AnatomyCopy = {
  eyebrow: string;
  title: string;
  body: string;
  hint: string;
  diagramLabel: string;
  legendLabel: string;
  note: string;
};

/**
 * A wall section that assembles itself as you scroll, with every member
 * explainable on tap.
 *
 * Framing is the one trade whose work is invisible the moment drywall goes up, so
 * the whole site's argument depends on showing what is back there. Drawn as SVG
 * rather than photographed: it stays sharp at any size, weighs almost nothing, and
 * needs no site photography to exist.
 *
 * Accessibility: the drawing is decorative to assistive tech (`role="img"` with a
 * label) and the same content is reachable as a real list of buttons underneath, so
 * keyboard and screen-reader users get the identical explanations without having to
 * navigate a diagram.
 */
export default function FramingAnatomy({
  lang,
  copy,
}: {
  lang: "en" | "es";
  copy: AnatomyCopy;
}) {
  const [selected, setSelected] = useState<string>("header");
  const [built, setBuilt] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Assemble on first scroll into view. Users who ask for reduced motion get the
  // finished wall immediately instead of a build they did not want.
  const assembled = built || reducedMotion;

  useEffect(() => {
    if (reducedMotion) return;
    const node = sectionRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer available: show the finished wall on the next tick rather than
      // leaving it invisible.
      const timer = window.setTimeout(() => setBuilt(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setBuilt(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const active = anatomyParts.find((part) => part.id === selected) ?? anatomyParts[0];
  const text = active[lang];

  function partProps(id: string, step: number) {
    return {
      className: `fa-part${selected === id ? " is-active" : ""}`,
      style: { "--step": step } as React.CSSProperties,
      onClick: () => setSelected(id),
      onMouseEnter: () => setSelected(id),
    };
  }

  return (
    <section
      className={`anatomy section${assembled ? " is-built" : ""}`}
      id="anatomy"
      ref={sectionRef}
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
          </div>
          <p>{copy.body}</p>
        </div>

        <div className="anatomy-grid">
          <div className="anatomy-stage">
            <svg
              viewBox="0 0 860 560"
              role="img"
              aria-label={copy.diagramLabel}
              className="anatomy-svg"
            >
              <defs>
                <pattern
                  id="fa-shear"
                  width="14"
                  height="14"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#7d8f86" strokeWidth="1.4" />
                </pattern>
              </defs>

              {/* Blueprint grid, purely decorative backdrop */}
              <g className="fa-grid" aria-hidden="true">
                {Array.from({ length: 17 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 54} y1="0" x2={i * 54} y2="560" />
                ))}
                {Array.from({ length: 11 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 56} x2="860" y2={i * 56} />
                ))}
              </g>

              {/* Shear panel sits behind the framing it braces */}
              <g {...partProps("sheathing", 9)}>
                <rect x="30" y="30" width="300" height="484" fill="url(#fa-shear)" opacity="0.5" />
                <rect x="30" y="30" width="300" height="484" className="fa-outline" />
              </g>

              <g {...partProps("bottom-plate", 0)}>
                <rect x="30" y="498" width="800" height="16" className="fa-wood" />
              </g>

              <g {...partProps("top-plate", 2)}>
                <rect x="30" y="30" width="800" height="16" className="fa-wood" />
                <rect x="30" y="46" width="800" height="16" className="fa-wood" />
              </g>

              <g {...partProps("stud", 1)}>
                {[30, 130, 230, 650, 750, 816].map((x) => (
                  <rect key={x} x={x} y="62" width="14" height="436" className="fa-wood" />
                ))}
              </g>

              <g {...partProps("blocking", 8)}>
                {[
                  [44, 86],
                  [144, 86],
                  [244, 86],
                  [664, 86],
                  [764, 52],
                ].map(([x, w]) => (
                  <rect key={x} x={x} y="272" width={w} height="14" className="fa-wood" />
                ))}
              </g>

              <g {...partProps("king-stud", 3)}>
                <rect x="330" y="62" width="14" height="436" className="fa-wood" />
                <rect x="596" y="62" width="14" height="436" className="fa-wood" />
              </g>

              <g {...partProps("jack-stud", 4)}>
                <rect x="344" y="160" width="14" height="338" className="fa-wood" />
                <rect x="582" y="160" width="14" height="338" className="fa-wood" />
              </g>

              <g {...partProps("header", 5)}>
                <rect x="330" y="110" width="280" height="50" className="fa-wood fa-beam" />
              </g>

              <g {...partProps("cripple", 6)}>
                {[372, 444, 516].map((x) => (
                  <rect key={`ct${x}`} x={x} y="62" width="14" height="48" className="fa-wood" />
                ))}
                {[372, 444, 516].map((x) => (
                  <rect key={`cb${x}`} x={x} y="346" width="14" height="152" className="fa-wood" />
                ))}
              </g>

              <g {...partProps("sill", 7)}>
                <rect x="344" y="330" width="252" height="16" className="fa-wood" />
              </g>

              <g {...partProps("holddown", 10)}>
                <rect x="22" y="454" width="30" height="60" className="fa-metal" />
                <rect x="14" y="506" width="46" height="10" className="fa-metal" />
                <circle cx="37" cy="470" r="6" className="fa-bolt" />
              </g>

              {/* Opening void, drawn last so it reads as empty space */}
              <rect
                x="358"
                y="160"
                width="224"
                height="170"
                className="fa-void"
                aria-hidden="true"
              />
            </svg>

            <p className="anatomy-hint">{copy.hint}</p>
          </div>

          <div className="anatomy-panel">
            <div className="anatomy-detail" aria-live="polite">
              <p className="anatomy-role">{text.role}</p>
              <h3>{text.name}</h3>
              <p>{text.body}</p>
            </div>

            <ul className="anatomy-legend" aria-label={copy.legendLabel}>
              {anatomyParts.map((part) => (
                <li key={part.id}>
                  <button
                    type="button"
                    className={selected === part.id ? "is-active" : ""}
                    aria-pressed={selected === part.id}
                    onClick={() => setSelected(part.id)}
                  >
                    {part[lang].name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="anatomy-note">{copy.note}</p>
      </div>
    </section>
  );
}
