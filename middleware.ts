import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects /admin routes - extend with NextAuth session check.
 * Placeholder: redirects unauthenticated users (to be wired to NextAuth).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    // TODO: Check NextAuth session and user role
    // const session = await getToken({ req: request });
    // if (!session || session.role !== "admin") return NextResponse.redirect(...)
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
