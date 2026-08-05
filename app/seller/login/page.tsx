"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handler Login Organisasi (Seller)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("seller-login", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok && !res.error) {
        // Menggunakan hard navigation untuk menghindari Cookie Race Condition
        window.location.href = "/dashboard";
      } else {
        
        setError("Email atau kata sandi salah.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError("Terjadi kesalahan koneksi sistem.");
      setLoading(false);
    }
  }

  // Handler Login Pembeli (Buyer) via Google
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

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

        {/* ERROR STATE BOX */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM LOGIN SELLER */}
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

          {/* TOMBOL SUBMIT SELLER */}
          <button
            type="submit"
            disabled={loading || isGoogleLoading}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-moywoo-orange/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk sebagai Organisasi"
            )}
          </button>
        </form>

        {/* SEPARATOR */}
        <div className="mt-8 mb-6 flex items-center justify-center">
          <div className="h-px w-full bg-moywoo-slate/10"></div>
          <span className="absolute bg-white px-4 text-xs font-medium text-moywoo-slate/50 uppercase tracking-wider">
            Atau
          </span>
        </div>

        {/* TOMBOL GOOGLE LOGIN (BUYER) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || isGoogleLoading}
          className="w-full h-12 inline-flex items-center justify-center gap-3 rounded-xl border border-moywoo-slate/20 bg-white px-6 text-sm font-semibold text-moywoo-slate shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-moywoo-slate/50" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Masuk sebagai Pembeli
        </button>

        {/* FOOTER LINK REGISTER */}
        <p className="mt-8 text-center text-sm text-moywoo-slate/75">
          Organisasi belum terdaftar?{" "}
          <Link
            href="register"
            className="font-bold text-moywoo-orange hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}