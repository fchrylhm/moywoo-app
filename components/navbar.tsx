"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ShoppingBag, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  userRole?: "SELLER" | "BUYER" | null;
}

export default function Navbar({ userRole = null }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = userRole !== null;

  const navLinks = [
    { name: "Fitur", href: "/#fitur" },
    { name: "Cara Kerja", href: "/#cara-kerja" },
    { name: "Keunggulan", href: "/#keunggulan" },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-[#F7F8F0]/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 focus:outline-none rounded-lg" onClick={closeMenu}>
          <Image
            src="/logo-moywoo.png" 
            alt="Moywoo Logo"
            width={120}
            height={36}
            priority
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {userRole !== "BUYER" && navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="transition-colors hover:text-[#E47632]">
              {link.name}
            </Link>
          ))}
          {userRole === "BUYER" && (
            <Link href="/catalog" className="transition-colors hover:text-[#E47632] font-semibold">
              Katalog Produk
            </Link>
          )}
        </nav>

        {/* DESKTOP CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            userRole === "SELLER" ? (
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[#E47632] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#c96222] active:scale-95">
                Dashboard Mitra <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/cart" className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-[#E47632] transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </Link>
                <Link href="/profile" className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-[#E47632] transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-2.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )
          ) : (
            <>
              <Link href="/seller/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Masuk
              </Link>
              <Link href="/seller/register" className="inline-flex items-center gap-2 rounded-xl bg-[#E47632] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#c96222] active:scale-95">
                Daftar Danusan <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE ACTIONS BAR (Termasuk Ikon Ekstraksi Buyer & Hamburger) */}
        <div className="flex md:hidden items-center">
          
          {/* Ekstraksi Ikon Khusus Buyer ke Top Bar */}
          {isLoggedIn && userRole === "BUYER" && (
            <div className="flex items-center mr-1">
              <Link href="/cart" onClick={closeMenu} className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors">
                <ShoppingBag className="h-[22px] w-[22px]" />
              </Link>
              <Link href="/profile" onClick={closeMenu} className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors">
                <User className="h-[22px] w-[22px]" />
              </Link>
            </div>
          )}

          {/* Hamburger Menu Utama */}
          <button 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU RENDER BLOCK */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full border-b border-zinc-200 bg-white shadow-xl px-4 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-4 text-base font-medium text-zinc-600">
            {userRole !== "BUYER" && navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={closeMenu} className="hover:text-[#E47632] transition-colors">
                {link.name}
              </Link>
            ))}
            {userRole === "BUYER" && (
              <Link href="/catalog" onClick={closeMenu} className="hover:text-[#E47632] font-semibold">
                Katalog Produk
              </Link>
            )}
          </nav>

          <hr className="border-zinc-100" />

          {/* Mobile CTA Buttons */}
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              userRole === "SELLER" ? (
                <>
                  <Link href="/dashboard" onClick={closeMenu} className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#E47632] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#c96222]">
                    Dashboard Mitra <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => { closeMenu(); signOut({ callbackUrl: "/login" }); }} className="w-full flex justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 px-5 py-3.5 text-sm font-semibold border border-red-200">
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                </>
              ) : (
                // BUYER DROPDOWN: Hanya menyisakan tombol keluar (Keranjang & Profil sudah di luar)
                <button onClick={() => { closeMenu(); signOut({ callbackUrl: "/login" }); }} className="w-full flex justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 px-5 py-3.5 text-sm font-semibold border border-red-100">
                  <LogOut className="h-4 w-4" /> Keluar dari Akun
                </button>
              )
            ) : (
              <>
                <Link href="/seller/login" onClick={closeMenu} className="w-full flex justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700">
                  Masuk
                </Link>
                <Link href="/seller/register" onClick={closeMenu} className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#E47632] px-5 py-3.5 text-sm font-semibold text-white">
                  Daftar Danusan <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

        </div>
      )}
    </header>
  );
}