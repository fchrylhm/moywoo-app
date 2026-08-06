"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { registerSeller } from "./action";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await registerSeller(formData);

      if (!result.success) {
        setError(result.error || "Gagal mendaftarkan akun.");
        setLoading(false);
      } else {
        // Arahkan tepat ke halaman login khusus Seller/Organisasi
        window.location.href = "/seller/login";
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Terjadi kesalahan sistem internal.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-moywoo-bg px-4 py-12 sm:px-6 lg:px-8 selection:bg-moywoo-blue selection:text-moywoo-slate">
      {/* KEMBALI KE BERANDA */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-moywoo-slate/70 hover:text-moywoo-orange transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* KARTU REGISTRASI */}
      <div className="w-full max-w-md rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm">
        {/* LOGO & HEADER */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-block">
            <Image
                      src="/logo-moywoo.png" // <-- Pastikan huruf kecil semua
                      alt="Moywoo Logo"
                      width={120}
                      height={36}
                      priority
                      className="h-8 md:h-9 w-auto object-contain"
                      />
          </Link>
          <h1 className="text-2xl font-bold text-moywoo-slate">
            Daftar Akun Organisasi
          </h1>
          <p className="text-sm text-moywoo-slate/75">
            Mulai kelola usaha danusan organisasi kamu di Moywoo
          </p>
        </div>

        {/* ERROR STATE BOX */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM REGISTRASI */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* INPUT NAMA LENGKAP */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Budi Santoso"
              className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white px-4 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
            />
          </div>

          {/* INPUT NAMA ORGANISASI */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Nama Organisasi
            </label>
            <input
              type="text"
              name="organizationName"
              required
              placeholder="HIMATIF"
              className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white px-4 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
            />
          </div>

          {/* INPUT NOMOR WHATSAPP (INJEKSI BARU) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              name="whatsappNumber"
              required
              placeholder="Contoh: 081234567890"
              className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white px-4 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
            />
          </div>

          {/* INPUT EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Email Organisasi
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="budi@student.ac.id"
              className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white px-4 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white pl-4 pr-11 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-moywoo-slate/50 hover:text-moywoo-slate focus:outline-none"
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* TOMBOL SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-moywoo-orange/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        {/* FOOTER LINK LOGIN */}
        <p className="mt-8 text-center text-sm text-moywoo-slate/75">
          Sudah memiliki akun?{" "}
          <Link
            href="/seller/login"
            className="font-bold text-moywoo-orange hover:underline"
          >
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}