import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// INJEKSI: Impor wrapper yang baru kita buat, bukan komponen navbar aslinya
import NavbarWrapper from "@/components/navbar-wrapper";
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
        {/* EKSEKUSI: Panggil komponen pencegat. Ia akan memutuskan kapan harus muncul. */}
        <NavbarWrapper userRole={(session?.user as { role?: "SELLER" | "BUYER" })?.role || null} />
        
        {children}
      </body>
    </html>
  );
}