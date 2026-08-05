import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Membaca property 'sellerld' dari JWT payload Anda
    const isSeller = !!token?.sellerld || token?.role === "seller";

    // PROTEKSI 1: Jika bukan seller (misal: buyer / belum login) mencoba masuk dashboard, tendang ke home
    if (path.startsWith("/dashboard") && !isSeller) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // PROTEKSI 2: Organisasi tidak perlu mengakses keranjang belanja pembeli
    if (path.startsWith("/cart") && isSeller) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Wajibkan harus ada token untuk rute yang di-match
      authorized: ({ token }) => !!token,
    },
    pages: {
      // INI KUNCI FIX-NYA: arahkan ke seller login saat unauthorized
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*"],
};