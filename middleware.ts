import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isGuestOnlyRoute = 
    pathname.startsWith("/seller/login") || 
    pathname.startsWith("/seller/register") || 
    pathname === "/login";

  // Inisialisasi response agar kita bisa memanipulasi header
  let response = NextResponse.next();

  // Aturan 1: Cegah akses ilegal ke area organisasi
  if (isDashboardRoute && !token) {
    response = NextResponse.redirect(new URL("/seller/login", req.url));
  }

  // Aturan 2: Cegah paradoks sesi (User aktif dilarang melihat form login)
  if (isGuestOnlyRoute && token) {
    response = NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ==============================================================================
  // INJEKSI HEADER ANTI-BFCACHE (MITIGASI ILUSI BACK/FORWARD)
  // ==============================================================================
  // Memaksa peramban untuk selalu memvalidasi ulang rute ke server
  // dan melarang keras penyimpanan halaman ke dalam RAM (no-store)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/seller/login",
    "/seller/register",
    "/login"
  ],
};