import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Memperluas tipe Session bawaan untuk menyertakan 'id' pengguna
   */
  interface Session {
    user: {
      id: string; // Asumsi ID Prisma Anda menggunakan String (UUID/CUID). Ubah ke 'number' jika menggunakan Auto-Increment ID.
    } & DefaultSession["user"]
  }
}