import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dominio canonico del sitio. Cualquier otro host que sirva este mismo
// contenido (previews de Vercel, *.vercel.app, etc.) se marca como noindex
// para que Google no lo trate como una copia competidora de elevable.es.
const CANONICAL_HOST = "elevable.es";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
