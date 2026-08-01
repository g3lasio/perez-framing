"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import { business } from "@/lib/site";
import { cities } from "@/lib/cities";
import { chrome } from "@/lib/chromeCopy";

type Lang = "en" | "es";

/**
 * Header, footer and mobile contact bar, shared by every page.
 *
 * `base` prefixes the in-page anchors. It is "" on the homepage, where "#work"
 * scrolls, and "/" everywhere else, where the same link has to travel home first.
 * Without it a visitor landing on a city page from search would click the nav and
 * go nowhere.
 */
export function LanguageToggle({
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

export function SiteTopBar({ lang }: { lang: Lang }) {
  const t = chrome[lang];
  return (
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
        <a className="topbar-license" href={business.cslbVerifyUrl} target="_blank" rel="noreferrer">
          <Icon name="shield" size={15} />
          {t.topbar.license}
        </a>
      </div>
    </div>
  );
}

export function SiteHeader({
  lang,
  onChangeLang,
  base = "",
}: {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  base?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = chrome[lang];
  const links = [
    { href: `${base}#work`, label: t.nav.work },
    { href: `${base}#services`, label: t.nav.services },
    { href: `${base}#builders`, label: t.nav.builders },
    { href: `${base}#process`, label: t.nav.process },
    { href: `${base}#about`, label: t.nav.about },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className={base ? "brand" : "brand"} href={base || "#main"} aria-label={`${business.publicName} home`}>
          <Image src="/assets/logo-mark.png" alt="" width={72} height={72} />
          <span>
            <strong>PEREZ</strong>
            <small>ROUGH FRAMING</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageToggle lang={lang} onChange={onChangeLang} />
          <a className="button button-small button-copper" href={`${base}#estimate`}>
            {t.nav.estimate}
            <Icon name="arrow" size={17} />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <div className="container">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href={`${base}#estimate`} onClick={() => setMenuOpen(false)}>
              {t.nav.estimate}
            </a>
            <LanguageToggle compact lang={lang} onChange={onChangeLang} />
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter({ lang, base = "" }: { lang: Lang; base?: string }) {
  const t = chrome[lang];
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/assets/logo-mark.png" alt="" width={104} height={104} />
          <div>
            <strong>PEREZ</strong>
            <span>ROUGH FRAMING</span>
            <p>{t.footer.body}</p>
          </div>
        </div>
        <div>
          <h2>{t.footer.contact}</h2>
          <a href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span>{t.footer.location}</span>
        </div>
        <div>
          <h2>{t.footer.links}</h2>
          <a href={`${base}#work`}>{t.nav.work}</a>
          <a href={`${base}#services`}>{t.nav.services}</a>
          <a href={`${base}#builders`}>{t.nav.builders}</a>
          <a href={`${base}#process`}>{t.nav.process}</a>
          <a href={`${base}#estimate`}>{t.nav.estimate}</a>
          <a href="/company-profile">{t.footer.profile}</a>
          <a href="/privacy">{t.footer.privacy}</a>
        </div>
        <div>
          <h2>{t.footer.areas}</h2>
          {cities.map((city) => (
            <a key={city.slug} href={`/framing/${city.slug}`}>
              {lang === "es" ? `Framing en ${city.name}` : `Framing in ${city.name}`}
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.publicName}. {t.footer.rights}
        </span>
        <span>{t.footer.ownership}</span>
      </div>
    </footer>
  );
}

export function MobileActionBar({ lang, base = "" }: { lang: Lang; base?: string }) {
  const t = chrome[lang];
  return (
    <nav className="mobile-action-bar" aria-label="Quick contact">
      <a href={`tel:${business.phoneE164}`}>
        <Icon name="phone" size={19} />
        {t.mobile.call}
      </a>
      <a href={`sms:${business.phoneE164}`}>
        <Icon name="message" size={19} />
        {t.mobile.text}
      </a>
      <a href={`${base}#estimate`}>
        <Icon name="ruler" size={19} />
        {t.mobile.quote}
      </a>
    </nav>
  );
}
