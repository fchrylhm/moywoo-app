import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/navbar-wrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "react-hot-toast"; // INJEKSI TOAST

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
        <NavbarWrapper userRole={(session?.user as { role?: "SELLER" | "BUYER" })?.role || null} />
        
        {children}

        {/* EKSEKUSI: Pengendali Notifikasi Global */}
        <Toaster 
          position="bottom-center" 
          toastOptions={{ 
            duration: 3000, 
            style: { background: '#18181B', color: '#fff', borderRadius: '12px', fontSize: '14px', fontWeight: '500' } 
          }} 
        />
      </body>
    </html>
  );
}