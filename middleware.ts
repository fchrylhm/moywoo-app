import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isSeller = !!token?.sellerId || token?.role === "seller"; 

    // PROTEKSI 1: Mahasiswa/Buyer dilarang masuk ke area organisasi
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
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: "/login",
    },
    // INJEKSI FATAL: Memaksa Edge Runtime untuk mengetahui kunci dekripsi token
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cart/:path*",
  ],
};