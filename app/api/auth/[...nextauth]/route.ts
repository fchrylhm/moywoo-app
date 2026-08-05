import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "seller-login",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const seller = await prisma.seller.findUnique({
            where: { email: credentials.email },
          });
          
          if (!seller) return null;
          if (seller.password !== credentials.password) return null;
          
          return {
            id: seller.id,
            email: seller.email,
            name: seller.fullName,
            role: "seller",
            sellerId: seller.id, // Typo sellerld telah diperbaiki menjadi sellerId
          };
        } catch (error) {
          console.error("Prisma Auth Error:", error);
          return null; // Mencegah crash jika koneksi database Vercel bermasalah
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          await prisma.buyer.upsert({
            where: { email: user.email },
            update: { fullName: user.name || "Buyer" },
            create: {
              email: user.email,
              fullName: user.name || "Buyer",
            },
          });
          return true;
        } catch (error) {
          console.error("Prisma Google Auth Error:", error);
          return false;
        }
      }
      return true; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "buyer";
        if ((user as any).sellerId) {
          token.sellerId = (user as any).sellerId; // Menggunakan sellerId yang benar
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).sellerId = token.sellerId; // Menggunakan sellerId yang benar
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };