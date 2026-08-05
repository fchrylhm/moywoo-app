import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // Jika ada yang mencoba masuk /dashboard tanpa login, 
    // lempar langsung ke rute ini. Tidak ada kompromi.
    signIn: "/seller/login",
  },
});

export const config = {
  // Hanya lindungi area organisasi
  matcher: ["/dashboard/:path*"],
};