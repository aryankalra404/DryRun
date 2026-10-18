import { NextResponse, type NextRequest } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Pages on another site can't change the room. The check is against the Host header, not nextUrl, which says
// localhost in dev even when the app was opened at the laptop's Wi-Fi address.
export function proxy(request: NextRequest) {
  if (SAFE_METHODS.has(request.method)) return NextResponse.next();
  const origin = request.headers.get("origin");
  if (!origin) return NextResponse.next();
  let originHost: string | null = null;
  try {
    originHost = origin === "null" ? null : new URL(origin).host;
  } catch {}
  if (!originHost || originHost !== request.headers.get("host")) return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
