import type { NextConfig } from "next";

/**
 * Resolve the canonical origin at build time.
 *
 * Order matters. An explicit `NEXT_PUBLIC_SITE_URL` always wins — that is the knob
 * to turn the day the site moves to its own domain. Failing that, Railway's own
 * public domain for this service is used: it is the address the site is actually
 * served from, so canonical, og:url and og:image stay correct without anyone
 * having to remember a variable.
 *
 * What is deliberately *not* here is a hardcoded fallback. The previous build
 * defaulted to a prototype `chatgpt.site` origin, which told Google the
 * authoritative copy lived on someone else's domain and kept this site out of the
 * index. If neither source above yields a domain, the build fails loudly rather
 * than shipping a wrong canonical again.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Railway exposes these to the build. RAILWAY_PUBLIC_DOMAIN is the current name;
  // RAILWAY_STATIC_URL is the older one and may already include the scheme.
  const fromRailway =
    process.env.RAILWAY_PUBLIC_DOMAIN?.trim() || process.env.RAILWAY_STATIC_URL?.trim();

  if (fromRailway) {
    const derived = `https://${fromRailway.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
    // Loud on purpose. Railway reports whichever domain is attached to the service,
    // which is not necessarily the canonical one — a staging or legacy custom domain
    // reports just the same. Adopting it silently is how canonical, og:url, the
    // sitemap and the JSON-LD all ended up pointing at a host that 404s, which tells
    // Google the authoritative copy lives somewhere dead. The deploy still succeeds,
    // but the wrong value is now visible in the build log instead of invisible.
    console.warn(
      [
        "",
        "  ⚠  NEXT_PUBLIC_SITE_URL is not set.",
        `     Falling back to the domain Railway reports: ${derived}`,
        "     canonical, og:url, og:image, robots.txt, sitemap.xml and the JSON-LD",
        "     are all being built from that value. If it is not the canonical public",
        "     domain, set NEXT_PUBLIC_SITE_URL and redeploy.",
        "",
      ].join("\n"),
    );
    return derived;
  }

  throw new Error(
    "Cannot determine the canonical site URL.\n" +
      "Set NEXT_PUBLIC_SITE_URL to the production origin in the deployment " +
      "environment, or in .env.local for local development.\n" +
      "There is no default on purpose: canonical, og:url, og:image and " +
      "twitter:image are all derived from this value, and a wrong one keeps the " +
      "site out of Google.",
  );
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Inlined into both the server and client bundles, so lib/site.ts can read
  // process.env.NEXT_PUBLIC_SITE_URL in either place.
  env: {
    NEXT_PUBLIC_SITE_URL: resolveSiteUrl(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
