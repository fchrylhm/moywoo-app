"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

interface NavbarWrapperProps {
  userRole: "SELLER" | "BUYER" | null;
}

export default function NavbarWrapper({ userRole }: NavbarWrapperProps) {
  const pathname = usePathname();

  // INJEKSI BARU: Tambahkan "/login" dan "/register" ke dalam daftar blokir
  const hiddenRoutes = [
    "/dashboard", 
    "/seller", 
    "/login", 
    "/register"
  ];

  // Jika URL saat ini cocok dengan salah satu daftar hitam di atas, batalkan rendering Navbar
  const isHidden = hiddenRoutes.some((route) => pathname?.startsWith(route));

  if (isHidden) {
    return null;
  }

  // Jika aman (berada di beranda, katalog, dll), render Navbar seperti biasa
  return <Navbar userRole={userRole} />;
}