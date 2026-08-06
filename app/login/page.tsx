"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam ? "Sesi tidak valid atau akses ditolak." : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("buyer-login", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Kredensial tidak valid. Periksa email dan kata sandi Anda.");
      } else {
        // PERUBAHAN DI SINI: Arahkan ke rute isolasi katalog
        router.push("/catalog");
        router.refresh(); 
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm">
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
        <h1 className="text-2xl font-bold text-moywoo-slate">Masuk sebagai Pembeli</h1>
        <p className="text-sm text-moywoo-slate/75">
          Gunakan email terdaftar untuk mulai berbelanja
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-moywoo-blue focus:outline-none focus:ring-1 focus:ring-moywoo-blue"
            placeholder="mahasiswa@kampus.ac.id"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-moywoo-blue focus:outline-none focus:ring-1 focus:ring-moywoo-blue"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-4 flex items-center justify-center rounded-xl bg-gray-900 text-white text-sm font-bold shadow-sm transition-all hover:bg-gray-800 disabled:opacity-70"
        >
          {isLoading ? "Memverifikasi..." : "Masuk"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-moywoo-slate/75">
        Belum punya akun pembeli?{" "}
        <Link href="/register" className="font-bold text-moywoo-blue hover:underline">
          Daftar di sini
        </Link>
      </div>

      <div className="mt-8 text-center text-xs text-moywoo-slate/60">
        Organisasi yang ingin berjualan?{" "}
        <Link href="/seller/login" className="font-bold text-gray-800 hover:underline">
          Portal Mitra
        </Link>
      </div>
    </div>
  );
}

export default function LoginBuyerPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 selection:bg-moywoo-blue selection:text-white">
      <div className="w-full max-w-md mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
      <Suspense fallback={<div>Memuat form...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}