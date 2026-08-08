import { NextResponse, type NextRequest } from "next/server";

/**
 * Redirects the `www` host to the apex, permanently.
 *
 * The canonical origin is the apex. Serving the same pages on both hosts splits
 * ranking signals and gives Google two URLs for one page, so `www` answers with a
 * 301 rather than a copy. This runs at the application layer, which means the
 * redirect holds no matter how the platform's domains are configured — but DNS for
 * `www` still has to point here, or nothing reaches this code at all.
 *
 * The target host comes from NEXT_PUBLIC_SITE_URL, so a domain change stays a
 * single environment edit.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.toLowerCase().startsWith("www.")) return NextResponse.next();

  const canonical = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!canonical) return NextResponse.next();

  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical);
  return NextResponse.redirect(target, 301);
}

export const config = {
  // Everything except Next's own assets and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
