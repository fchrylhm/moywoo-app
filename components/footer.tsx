import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-moywoo-slate/10 bg-moywoo-slate text-moywoo-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* IDENTITAS BRAND & VALUE PROP */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo-Moywoo.png"
                alt="Moywoo Logo"
                width={130}
                height={40}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm text-sm text-moywoo-bg/80 leading-relaxed">
              Platform manajemen kewirausahaan dan dana usaha (danusan) untuk
              organisasi mahasiswa. Kelola pesanan, katalog produk, dan kas
              organisasi secara transparan dan terstruktur.
            </p>
          </div>

          {/* KOLOM NAVIGASI CEPAT */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-moywoo-blue">
              Produk & Fitur
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-moywoo-bg/80">
              <li>
                <Link href="#fitur" className="hover:text-white transition-colors">
                  Katalog Digital
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-white transition-colors">
                  Manajemen Pesanan
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-white transition-colors">
                  Rekap Keuangan
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM INFORMASI & BANTUAN */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-moywoo-blue">
              Organisasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-moywoo-bg/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Daftarkan Divisi
                </Link>
              </li>
              <li>
                <span className="text-moywoo-bg/50">Bantuan & Syarat (Coming Soon)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & BOTTOM DIVIDER */}
        <div className="mt-12 border-t border-moywoo-bg/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-moywoo-bg/60">
          <p>© {currentYear} Moywoo MVP. All rights reserved.</p>
          <p>Built for high-performance campus organizations.</p>
        </div>
      </div>
    </footer>
  );
}