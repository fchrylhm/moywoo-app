import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Smartphone,
  Store
} from "lucide-react";

export default async function HomePage() {
  // 1. Validasi Sesi Terpusat menggunakan NextAuth
  const session = await getServerSession(authOptions);
  const isSeller = session?.user && (session.user as any).role === "seller";

  // 2. Optimasi Kueri Katalog: Hanya ambil Seller yang punya produk PUBLISHED
  const activeOrganizations = await prisma.seller.findMany({
    where: {
      products: {
        some: { status: "PUBLISHED" }
      }
    },
    select: {
      id: true,
      organizationName: true,
      products: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          productName: true,
          price: true,
          images: {
            take: 1, // Hanya ambil gambar utama untuk thumbnail
            select: { imageUrl: true }
          }
        }
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-moywoo-bg text-moywoo-slate overflow-x-hidden">
      <Navbar isLoggedIn={isSeller} />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-moywoo-blue/15 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-moywoo-slate/15 bg-white/60 px-4 py-1.5 text-xs md:text-sm font-semibold text-moywoo-slate">
                <span className="h-2 w-2 rounded-full bg-moywoo-orange animate-pulse" />
                Revolusi Cara Danusan Organisasi Kampus
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-moywoo-slate leading-[1.15]">
                Danusan Kampus Lebih{" "}
                <span className="underline decoration-moywoo-orange decoration-4 underline-offset-4">
                  Terstruktur
                </span>
                , Transparan, & Tanpa Ribet.
              </h1>

              <p className="text-base sm:text-lg text-moywoo-slate/80 leading-relaxed max-w-2xl mx-auto">
                Tinggalkan rekap manual di WhatsApp yang rawan selisih. Moywoo
                membantu divisi kewirausahaan mengelola katalog produk, pesanan,
                dan rekap keuangan dalam satu platform terintegrasi.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
                {isSeller ? (
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
                      href="/seller/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-moywoo-orange px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-moywoo-orange/90 hover:shadow-xl active:scale-95"
                    >
                      Mulai Danusan Sekarang
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      href="#katalog"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-moywoo-slate/20 bg-white/50 px-7 py-4 text-base font-semibold text-moywoo-slate hover:bg-white transition-colors"
                    >
                      Jelajahi Katalog
                    </Link>
                  </>
                )}
              </div>

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

        {/* SECTION KATALOG PRODUK (Dikelompokkan berdasarkan Organisasi) */}
        <section id="katalog" className="py-16 bg-white border-t border-moywoo-slate/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-moywoo-slate">Etalase Organisasi</h2>
                <p className="text-sm text-moywoo-slate/70 mt-1">Dukung kegiatan himpunan dan UKM kampusmu.</p>
              </div>
            </div>

            {activeOrganizations.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed border-moywoo-slate/10 bg-moywoo-bg/50">
                <Store className="mx-auto h-12 w-12 text-moywoo-slate/30 mb-3" />
                <h3 className="text-lg font-medium text-moywoo-slate">Belum ada produk aktif</h3>
                <p className="text-sm text-moywoo-slate/60">Organisasi belum mempublikasikan produk mereka.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {activeOrganizations.map((org) => (
                  <div key={org.id} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-moywoo-slate/10 pb-4">
                      <div className="h-10 w-10 rounded-full bg-moywoo-blue/10 flex items-center justify-center">
                        <Store className="h-5 w-5 text-moywoo-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-moywoo-slate">{org.organizationName}</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {org.products.map((product) => (
                        <Link 
                          href={`/products/${product.id}`} 
                          key={product.id}
                          className="group rounded-2xl border border-moywoo-slate/10 bg-white overflow-hidden hover:shadow-lg transition-all"
                        >
                          <div className="aspect-square relative bg-moywoo-bg">
                            {product.images[0] ? (
                              <Image 
                                src={product.images[0].imageUrl} 
                                alt={product.productName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-moywoo-slate/30">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-moywoo-slate line-clamp-1">{product.productName}</h4>
                            <p className="font-bold text-moywoo-orange mt-1">
                              Rp {Number(product.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-blue/20 text-moywoo-slate">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">Katalog Publik Responsif</h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Setiap divisi mendapatkan tautan katalog produk yang rapi, ringan diakses dari ponsel, dan siap dibagikan ke media sosial organisasi.
                </p>
              </div>

              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-orange/15 text-moywoo-orange">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">Manajemen Pesanan Akurat</h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Lacak pesanan masuk, status pembayaran, dan distribusi barang tanpa takut data tercampur atau hilang di riwayat obrolan pesan cepat.
                </p>
              </div>

              <div className="rounded-2xl border border-moywoo-slate/10 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moywoo-blue/20 text-moywoo-slate">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-moywoo-slate">Transparansi & Akuntabilitas</h3>
                <p className="mt-2 text-sm text-moywoo-slate/75 leading-relaxed">
                  Rekapitulasi otomatis yang memudahkan koordinasi antara penanggung jawab danusan, bendahara, dan ketua organisasi saat evaluasi.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}