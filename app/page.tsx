import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Smartphone 
} from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sellerId = cookieStore.get("seller_session")?.value;
  const isLoggedIn = Boolean(sellerId);

  return (
    <div className="min-h-screen flex flex-col bg-moywoo-bg text-moywoo-slate overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* HERO SECTION - FOKUS VALUE PROPOSITION & CONVERSION */}
      <main className="flex-grow">
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-moywoo-blue/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* BADGE PROPOSISI */}
              <div className="inline-flex items-center gap-2 rounded-full border border-moywoo-slate/15 bg-white/60 px-4 py-1.5 text-xs md:text-sm font-semibold text-moywoo-slate">
                <span className="h-2 w-2 rounded-full bg-moywoo-orange animate-pulse" />
                Revolusi Cara Danusan Organisasi Kampus
              </div>

              {/* HEADLINE UTAMA (SCANNABLE & TEGAS) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-moywoo-slate leading-[1.15]">
                Danusan Kampus Lebih{" "}
                <span className="underline decoration-moywoo-orange decoration-4 underline-offset-4">
                  Terstruktur
                </span>
                , Transparan, & Tanpa Ribet.
              </h1>

              {/* SUB-HEADLINE */}
              <p className="text-base sm:text-lg text-moywoo-slate/80 leading-relaxed max-w-2xl mx-auto">
                Tinggalkan rekap manual di WhatsApp yang rawan selisih. Moywoo
                membantu divisi kewirausahaan mengelola katalog produk, pesanan,
                dan rekap keuangan dalam satu platform terintegrasi.
              </p>

              {/* CTA BUTTON COMPASS */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-moywoo-orange/90 hover:shadow-xl active:scale-95"
                  >
                    Buka Dashboard Saya
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-moywoo-orange/90 hover:shadow-xl active:scale-95"
                    >
                      Mulai Danusan Sekarang
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#cara-kerja"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-moywoo-slate/20 bg-white/50 px-7 py-4 text-base font-semibold text-moywoo-slate hover:bg-white transition-colors"
                    >
                      Lihat Cara Kerja
                    </Link>
                  </>
                )}
              </div>

              {/* TRUST METRICS / BRIEF SELLING POINT */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-moywoo-slate/75">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-moywoo-orange" />
                  Katalog Web Otomatis
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-moywoo-orange" />
                  Rekap Keuangan Real-Time
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-moywoo-orange" />
                  Mobile-Friendly 100%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION FITUR - VALUE PROPOSITION GRID */}
        <section id="fitur" className="py-16 md:py-24 border-t border-moywoo-slate/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-moywoo-slate">
                Mengapa Danusan Membutuhkan Moywoo?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-moywoo-slate/80">
                Dirancang khusus untuk memecahkan kekacauan manajemen operasional usaha organisasi kampus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* FITUR 1 */}
              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-blue/20 text-moywoo-slate">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">
                  Katalog Publik Responsif
                </h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Setiap divisi mendapatkan tautan katalog produk yang rapi, ringan diakses dari ponsel, dan siap dibagikan ke media sosial organisasi.
                </p>
              </div>

              {/* FITUR 2 */}
              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-orange/15 text-moywoo-orange">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">
                  Manajemen Pesanan Akurat
                </h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Lacak pesanan masuk, status pembayaran, dan distribusi barang tanpa takut data tercampur atau hilang di riwayat obrolan pesan cepat.
                </p>
              </div>

              {/* FITUR 3 */}
              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-blue/20 text-moywoo-slate">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">
                  Transparansi & Akuntabilitas
                </h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Rekapitulasi otomatis yang memudahkan koordinasi antara penanggung jawab danusan, bendahara, dan ketua organisasi saat evaluasi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CARA KERJA (SIMPLE STRIP) */}
        <section id="cara-kerja" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-moywoo-slate p-8 sm:p-12 md:p-16 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Siap Meningkatkan Profit Danusan Kampusmu?
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-moywoo-bg/80">
                Pendaftaran hanya membutuhkan waktu kurang dari 2 menit. Tidak memerlukan kartu kredit atau instalasi rumit.
              </p>
              <div className="mt-8">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/register"}
                  className="inline-flex items-center gap-2 rounded-xl bg-moywoo-orange px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-moywoo-orange/90 active:scale-95"
                >
                  {isLoggedIn ? "Masuk ke Dashboard Saya" : "Daftarkan Organisasi Sekarang"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}