import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // ==============================================================================
    // PROVIDER 1: PINTU KHUSUS SELLER
    // ==============================================================================
    CredentialsProvider({
      id: "seller-login",
      name: "Seller Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const cleanEmail = credentials.email.trim();
        const cleanPassword = credentials.password.trim();

        try {
          const seller = await prisma.seller.findUnique({
            where: { email: cleanEmail },
          });

          if (!seller || seller.password.trim() !== cleanPassword) return null;

          // INJEKSI ROLE: SELLER
          return {
            id: seller.id,
            email: seller.email,
            name: seller.fullName,
            role: "SELLER", 
          };
        } catch (error) {
          console.error("Database Error (Seller Auth):", error);
          return null;
        }
      },
    }),

    // ==============================================================================
    // PROVIDER 2: PINTU KHUSUS BUYER
    // ==============================================================================
    CredentialsProvider({
      id: "buyer-login",
      name: "Buyer Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const cleanEmail = credentials.email.trim();
        const cleanPassword = credentials.password.trim();

        try {
          const buyer = await prisma.buyer.findUnique({
            where: { email: cleanEmail },
          });

          if (!buyer || buyer.password?.trim() !== cleanPassword) return null;

          // INJEKSI ROLE: BUYER
          return {
            id: buyer.id,
            email: buyer.email,
            name: buyer.fullName,
            role: "BUYER",
          };
        } catch (error) {
          console.error("Database Error (Buyer Auth):", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Menangkap 'role' dari fungsi authorize dan menanamkannya ke dalam token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Mengekspos 'role' dan 'id' ke frontend dan server actions
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  // KUNCI PENTING: Hapus konfigurasi 'pages: { signIn: "/seller/login" }'
  // Biarkan middleware.ts yang menjadi satpam tunggal untuk mengatur arah lemparan rute.
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };