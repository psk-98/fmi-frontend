import { type NextRequest, NextResponse } from "next/server";

import { TOKEN_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (request.cookies.has(TOKEN_COOKIE)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/galleries/:path*",
    "/profile",
    "/search",
  ],
};
