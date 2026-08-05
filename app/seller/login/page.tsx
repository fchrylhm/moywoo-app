"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SellerLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        // 1. Paksa sinkronisasi status sesi Next.js di klien
        router.refresh();
        
        // 2. Jeda mikro 300ms. Ini adalah kunci penyelesaiannya. 
        // Memberikan waktu agar Cookie Token JWT tertanam di browser sebelum Middleware bekerja.
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      } else {
        setError("Kredensial Organisasi tidak valid.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError("Terjadi kesalahan koneksi ke server.");
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
            Portal Organisasi
          </h1>
          <p className="text-sm text-moywoo-slate/75">
            Masuk untuk mengelola produk dan pesanan
          </p>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM LOGIN SELLER */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-moywoo-slate">
              Email Organisasi
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@bem.ac.id"
              className="w-full h-12 rounded-xl border border-moywoo-slate/20 bg-white px-4 text-sm text-moywoo-slate placeholder:text-moywoo-slate/40 focus:border-moywoo-blue focus:outline-none focus:ring-2 focus:ring-moywoo-blue/30 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-moywoo-slate">
                Kata Sandi
              </label>
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
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-moywoo-orange/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengautentikasi...
              </>
            ) : (
              "Masuk Dashboard"
            )}
          </button>
        </form>

        {/* CROSS-LINK KE PORTAL BUYER */}
        <div className="mt-8 text-center text-xs text-moywoo-slate/60">
          Hanya ingin berbelanja?{" "}
          <Link href="/login" className="font-bold text-moywoo-blue hover:underline">
            Masuk sebagai Pembeli
          </Link>
        </div>
      </div>
    </div>
  );
}