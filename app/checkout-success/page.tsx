import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 pt-16 pb-24">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2rem] border border-zinc-100 shadow-sm text-center">
        
        {/* Ikon Sukses dengan Animasi Pulse Halus */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-60"></div>
          <div className="relative bg-green-100 text-green-600 p-5 rounded-full flex items-center justify-center z-10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        {/* Copywriting Profesional yang Menjaga Ilusi Transaksi */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-4 tracking-tight">
          Pesanan Diterima!
        </h1>
        <p className="text-zinc-500 mb-10 leading-relaxed text-sm sm:text-base">
          Terima kasih telah mendukung kegiatan organisasi mahasiswa. Detail pesanan dan instruksi pembayaran lanjutan akan segera diinformasikan oleh pihak penjual.
        </p>

        {/* Susunan CTA (Call to Action) */}
        <div className="space-y-4">
          <Link 
            href="/catalog"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#E47632] text-white font-bold rounded-full hover:bg-[#d0672a] hover:shadow-[0_8px_20px_-6px_rgba(228,118,50,0.4)] hover:-translate-y-0.5 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Lanjut Jelajahi Katalog
          </Link>
          
          <Link 
            href="/"
            className="flex items-center justify-center w-full py-4 text-zinc-500 font-semibold rounded-full hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
        
      </div>
    </div>
  );
}