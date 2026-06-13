import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const cookie = req.cookies.get("admin_auth");

  if (!cookie?.value) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
