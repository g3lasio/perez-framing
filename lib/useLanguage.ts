"use client";

import { useEffect, useState } from "react";

export type Lang = "en" | "es";

const STORAGE_KEY = "rfs-language";

/**
 * Site-wide language, persisted so the choice survives navigation between the
 * homepage and a city page.
 *
 * Spanish is the rendered default. The stored preference is applied after mount
 * rather than during render, because reading localStorage while rendering would
 * disagree with the server-rendered HTML and break hydration.
 */
export function useLanguage() {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") {
      const timer = window.setTimeout(() => setLang(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function changeLanguage(next: Lang) {
    setLang(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return { lang, changeLanguage };
}
