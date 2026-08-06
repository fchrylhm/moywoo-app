import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "BUYER" | "SELLER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "BUYER" | "SELLER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "BUYER" | "SELLER";
  }
}