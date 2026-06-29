import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken, SESSION_COOKIE_NAME } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is not a SUPER_ADMIN, they can only access Dashboard overview and Content sections.
  if (session.role !== "SUPER_ADMIN") {
    const allowedPatterns = [
      /^\/admin$/,
      /^\/admin\/$/,
      /^\/admin\/books(\/.*)?$/,
      /^\/admin\/articles(\/.*)?$/,
      /^\/admin\/archive(\/.*)?$/,
      /^\/admin\/videos(\/.*)?$/,
      /^\/admin\/gallery(\/.*)?$/,
      /^\/admin\/testimonials(\/.*)?$/,
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(pathname));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
