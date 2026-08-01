"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks `prefers-reduced-motion`, SSR-safe.
 *
 * useSyncExternalStore rather than an effect: reading a media query with setState
 * inside an effect causes a cascading render, and a lazy useState initializer would
 * disagree between server and client and break hydration.
 */
function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // The server cannot know; assume motion is fine and let the client correct it.
    () => false,
  );
}
