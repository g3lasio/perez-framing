"use client";

import { useEffect } from "react";

/**
 * Reveals `[data-reveal]` elements as they scroll into view.
 *
 * The hidden state is scoped to `.js-reveal` on <html>, which this hook adds on
 * mount. Without that guard a JavaScript failure would leave the whole page
 * invisible — the content has to be readable even when the motion never runs.
 * Users asking for reduced motion are opted out entirely.
 */
export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") return;

    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const targets = document.querySelectorAll("[data-reveal]");
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);
}
