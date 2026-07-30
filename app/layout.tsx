import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Menggunakan Inter untuk estetika geometris modern
import "./globals.css";

// Inisialisasi font tanpa perlu variabel config
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moywoo — Platform Manajemen Usaha Danusan Kampus",
  description:
    "Kelola katalog produk, pesanan, dan keuangan usaha danusan organisasi kampus dengan mudah, transparan, dan terstruktur bersama Moywoo.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.className} h-full antialiased`}>
      {/* Hapus pemanggilan font-sans Tailwind, biarkan Inter mengambil alih secara absolut */}
      <body className="min-h-full flex flex-col bg-moywoo-bg text-moywoo-slate selection:bg-[#A0D6FE] selection:text-[#355872]">
        {children}
      </body>
    </html>
  );
}