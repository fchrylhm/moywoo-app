"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { loginSeller } from "./action";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await loginSeller(formData);

      if (res && res.success) {
        router.replace("/dashboard");
      } else {
        setError(res?.error || "Email atau kata sandi salah.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError("Terjadi kesalahan koneksi sistem.");
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

      {/* KARTU AUTENTIKASI */}
      <div className="w-full max-w-md rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm">
        {/* LOGO & HEADER */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/Logo-Moywoo.png"
              alt="Moywoo Logo"
              width={120}
              height={36}
              priority
              className="h-8 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-bold text-moywoo-slate">
            Masuk Akun Organisasi
          </h1>
          <p className="text-sm text-moywoo-slate/75">
            Mulai kelola usaha danusan organisasi kamu di Moywoo
          </p>
        </div>

        {/* ERROR STATE BOX (ZERO LAYOUT SHIFT) */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-moywoo-slate">
                Kata Sandi
              </label>
              <Link
                href="#"
                className="text-xs font-medium text-moywoo-slate/70 hover:text-moywoo-orange transition-colors"
              >
                Lupa Kata Sandi?
              </Link>
            </div>
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
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-moywoo-orange/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* FOOTER LINK REGISTER */}
        <p className="mt-8 text-center text-sm text-moywoo-slate/75">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-bold text-moywoo-orange hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}