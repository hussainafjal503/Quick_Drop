import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "api/auth",
    "/favicon.ico",
    "_next",
  ];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    const loginURL = new URL("/auth/login", req.url);

    loginURL.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

