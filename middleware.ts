import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Mengambil token JWT secara manual, membutuhkan secret yang sama dengan route.ts
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // LOGIKA 1: Penanganan Akses Tanpa Token (Belum Login)
  if (!token) {
    if (path.startsWith("/dashboard")) {
      // Jika mencoba masuk dashboard tanpa token, lempar ke portal organisasi
      return NextResponse.redirect(new URL("/seller/login", req.url));
    }
    if (path.startsWith("/cart")) {
      // Jika mencoba masuk keranjang tanpa token, lempar ke portal pembeli
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // LOGIKA 2: Identifikasi Role
  // Membaca property 'sellerId' (sudah dikoreksi dari typo 'sellerld')
  const isSeller = !!token?.sellerId || token?.role === "seller";

  // PROTEKSI 1: Jika Pembeli (Buyer) mencoba masuk ke dashboard organisasi
  if (path.startsWith("/dashboard") && !isSeller) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // PROTEKSI 2: Jika Organisasi (Seller) mencoba mengakses keranjang pembeli
  if (path.startsWith("/cart") && isSeller) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*"],
};