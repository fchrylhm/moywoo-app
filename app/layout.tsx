import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moywoo MVP",
  description: "Marketplace Usaha Dana Organisasi Mahasiswa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="id">
      <body className={`${inter.className} bg-zinc-50 min-h-screen text-zinc-900`}>
        {/* Navbar Global (Satu-satunya sumber kebenaran) */}
        <Navbar userRole={(session?.user as { role?: "SELLER" | "BUYER" })?.role || null} />
        
        {/* KOREKSI: Pembungkus max-w-7xl dilepas agar landing page bisa edge-to-edge */}
        {children}
      </body>
    </html>
  );
}