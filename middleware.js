// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const isAdmin = req.cookies.get("adminAccess")?.value;

  if (url.pathname.startsWith("/Admin")) {
    if (isAdmin !== "true") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin/:path*"],
};
