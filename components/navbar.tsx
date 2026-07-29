"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Fitur", href: "#fitur" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Keunggulan", href: "#keunggulan" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-moywoo-slate/10 bg-moywoo-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        {/* LOGO BRANDING */}
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-moywoo-blue rounded-lg"
        >
          <Image
            src="/Logo-Moywoo.png"
            alt="Moywoo Logo"
            width={120}
            height={36}
            priority
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-moywoo-slate/80">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-moywoo-orange focus:outline-none"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP CTA BUTTONS (60-30-10 RULE) */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-moywoo-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-moywoo-orange/90 active:scale-95"
            >
              Ke Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-moywoo-slate transition-colors hover:bg-moywoo-slate/5"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-moywoo-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-moywoo-orange/90 active:scale-95"
              >
                Daftar Danusan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON (MIN TOUCH TARGET 44x44px) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex md:hidden items-center justify-center rounded-xl p-2.5 text-moywoo-slate transition-colors hover:bg-moywoo-slate/5 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-moywoo-slate/10 bg-moywoo-bg px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-moywoo-slate/90 hover:bg-moywoo-slate/5"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-moywoo-slate/10">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange py-3 text-sm font-semibold text-white shadow-sm"
              >
                Ke Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-moywoo-slate/20 py-3 text-sm font-semibold text-moywoo-slate"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Daftar Danusan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}