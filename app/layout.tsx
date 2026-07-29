import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-moywoo-bg text-moywoo-slate font-sans selection:bg-[#A0D6FE] selection:text-[#355872]">
        {children}
      </body>
    </html>
  );
}