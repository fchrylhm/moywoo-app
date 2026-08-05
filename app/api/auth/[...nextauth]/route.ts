import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "seller-login", // Ditetapkan eksplisit agar cocok jika frontend memanggil "seller-login"
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("--- PROSES LOGIN SELLER DIMULAI ---");
        
        if (!credentials?.email || !credentials?.password) {
          console.log("DIAGNOSTIK: Email atau password kosong dari Form Input.");
          return null;
        }

        const cleanEmail = credentials.email.trim();
        const cleanPassword = credentials.password.trim();

        try {
          // 1. Cari Seller di Database
          const seller = await prisma.seller.findUnique({
            where: { email: cleanEmail },
          });

          if (!seller) {
            console.log(`DIAGNOSTIK: Email '${cleanEmail}' TIDAK DITEMUKAN di tabel 'sellers' Supabase.`);
            return null;
          }

          console.log(`DIAGNOSTIK: Seller ditemukan. Email: ${seller.email}`);

          // 2. Evaluasi Kata Sandi (Plain-text)
          const isPasswordMatch = seller.password.trim() === cleanPassword;

          if (!isPasswordMatch) {
            console.log("DIAGNOSTIK: Password TIDAK COCOK!");
            console.log(`Input Form: '${cleanPassword}' | Di Database: '${seller.password}'`);
            return null;
          }

          console.log("DIAGNOSTIK: Login BERHASIL!");
          return {
            id: seller.id,
            email: seller.email,
            name: seller.fullName,
          };
        } catch (error) {
          console.error("DIAGNOSTIK FATAL (Koneksi DB Gagal):", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/seller/login",
    error: "/seller/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };