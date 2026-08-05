"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
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
          Masuk sebagai Pembeli
        </h1>
        <p className="text-sm text-moywoo-slate/75">
          Gunakan email kampus untuk mulai berbelanja
        </p>
      </div>

      {/* ERROR STATE: Penolakan Akses dari route.ts NextAuth */}
      {error === "AccessDenied" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <span>Akses ditolak. Anda wajib menggunakan email institusi/mahasiswa (.ac.id).</span>
        </div>
      )}

      {/* TOMBOL GOOGLE OAUTH */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-moywoo-slate/20 bg-white px-6 text-sm font-bold text-moywoo-slate shadow-sm transition-all hover:bg-gray-50 active:scale-95"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Lanjutkan dengan Google
      </button>

      {/* CROSS-LINK KE PORTAL SELLER */}
      <div className="mt-8 text-center text-xs text-moywoo-slate/60">
        Organisasi yang ingin berjualan?{" "}
        <Link href="/seller/login" className="font-bold text-moywoo-blue hover:underline">
          Masuk di Portal Mitra
        </Link>
      </div>
    </div>
  );
}

export default function LoginBuyerPage() {
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
      
      {/* SUSPENSE UNTUK MENGHINDARI SSR DEOPT PADA USE_SEARCH_PARAMS */}
      <Suspense fallback={<div>Memuat form...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}