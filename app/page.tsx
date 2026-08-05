import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowRight, PackageOpen, TrendingUp, Zap, ShieldCheck, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F8F0] dark:bg-zinc-950 font-sans scroll-smooth">
      <Navbar isLoggedIn={false} />
      
      {/* HERO SECTION */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-[#E47632]/10 border border-[#E47632]/20 text-[#E47632] text-sm font-medium">
          <Zap className="h-4 w-4" />
          <span>V1.0 Sudah Dirilis</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6 leading-tight">
          Platform Manajemen Usaha <br className="hidden md:block" />
          <span className="text-[#E47632]">Organisasi & Danusan</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          Ubah cara Anda mengelola kegiatan dana usaha. Pantau stok katalog secara real-time, tingkatkan konversi penjualan, dan kelola operasional dalam satu ekosistem digital yang bersih dan terstruktur.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/seller/register"
            className="inline-flex justify-center items-center gap-2 rounded-xl bg-[#E47632] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#c96222] hover:-translate-y-0.5"
          >
            Mulai Berjualan
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/seller/login"
            className="inline-flex justify-center items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 px-8 py-3.5 text-base font-semibold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Masuk Dashboard
          </Link>
        </div>
      </main>

      {/* FITUR SECTION */}
      <section id="fitur" className="py-24 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Fitur Esensial untuk Pertumbuhan</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Dirancang khusus untuk menghapus kompleksitas pengelolaan inventaris manual. Fokus pada strategi, biarkan sistem yang menangani data.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-[#355872]/10 flex items-center justify-center text-[#355872] mb-6">
                <PackageOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Manajemen Katalog</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Tambah, edit, dan awasi produk Anda dalam antarmuka terpusat. Dilengkapi kompresi gambar otomatis untuk performa maksimal.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-[#E47632]/10 flex items-center justify-center text-[#E47632] mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Pelacakan Stok Dinamis</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Ketahui persis ketersediaan barang. Sistem mengunci transaksi saat stok menipis untuk mencegah *overselling*.</p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Otorisasi Terpisah</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Arsitektur keamanan ganda memisahkan akses ruang tenant (*seller*) dengan ruang publik konsumen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARA KERJA SECTION */}
      <section id="cara-kerja" className="py-24 bg-zinc-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Alur Kerja yang Intuitif</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Tidak ada kurva belajar yang curam. Mulai dari registrasi hingga melayani transaksi pertama Anda dalam hitungan menit.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E47632] flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Registrasi Organisasi</h4>
                    <p className="text-zinc-400">Daftarkan tim atau kepanitiaan Anda untuk mendapatkan kredensial otorisasi sistem.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E47632] flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Bangun Katalog</h4>
                    <p className="text-zinc-400">Unggah produk, tentukan harga, dan atur kuantitas fisik. Sistem akan membuat etalase digital secara otomatis.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E47632] flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Publikasi & Distribusi</h4>
                    <p className="text-zinc-400">Bagikan tautan etalase ke konsumen. Pantau dashboard untuk analitik dan status persediaan.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visualisasi Mockup Abstract */}
            <div className="relative rounded-2xl bg-zinc-800 border border-zinc-700 p-8 shadow-2xl aspect-square lg:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#355872]/20 to-[#E47632]/20 rounded-2xl opacity-50"></div>
              <div className="relative space-y-4">
                <div className="w-full h-8 bg-zinc-700/50 rounded-md"></div>
                <div className="w-3/4 h-8 bg-zinc-700/50 rounded-md"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="w-full h-32 bg-zinc-700/30 rounded-lg border border-zinc-600/30"></div>
                  <div className="w-full h-32 bg-zinc-700/30 rounded-lg border border-zinc-600/30"></div>
                  <div className="w-full h-32 bg-zinc-700/30 rounded-lg border border-zinc-600/30"></div>
                  <div className="w-full h-32 bg-[#E47632]/20 border border-[#E47632]/30 rounded-lg flex items-center justify-center text-[#E47632]">
                    <span className="font-medium">+ Tambah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section id="keunggulan" className="py-24 bg-[#F7F8F0] dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12">Mengapa Memilih Moywoo?</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="h-6 w-6 text-[#E47632] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">UI Bersih & Reaktif</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Dibangun dengan arsitektur web modern yang memastikan eksekusi instan tanpa beban komputasi berlebih.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="h-6 w-6 text-[#E47632] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Keamanan Data</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Proteksi endpoint tingkat tinggi dengan NextAuth untuk memastikan akses modifikasi hanya dimiliki oleh pemilik.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="h-6 w-6 text-[#E47632] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Akurasi Nominal</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Format I/O yang disesuaikan secara lokal (IDR) mencegah kesalahan persepsi harga pada konsumen.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="h-6 w-6 text-[#E47632] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Skalabilitas Jangka Panjang</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Relational database (PostgreSQL) siap menampung ribuan relasi produk dan transaksi secara bersamaan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-12 bg-white dark:bg-zinc-950 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Moywoo Merchant Center. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  )
}