import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export const revalidate = 0 

export default async function DashboardPage() {
  // 1. Ambil ID dari sesi
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')!.value

  // 2. Fetch Data: Kita hanya butuh profil dan JUMLAH produk untuk Overview, bukan seluruh datanya.
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      _count: {
        select: { products: true } // Hanya hitung total produk untuk metrik dasbor
      }
    },
  })

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Overview {seller!.organizationName || seller!.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 sm:mt-0">
            Selamat datang di Merchant Center Moywoo. Berikut adalah ringkasan operasional Anda.
          </p>
        </div>
      </div>

      {/* Main Content: Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card Metrik 1: Total Produk */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">
            Total Produk Aktif
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {seller!._count.products}
          </p>
        </div>

        {/* Card Metrik Placeholder untuk Pengembangan Masa Depan */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 shadow-sm flex flex-col justify-center opacity-60">
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">
            Total Transaksi
          </h3>
          <p className="text-xl font-semibold text-zinc-400 dark:text-zinc-600">
            Segera Hadir
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 shadow-sm flex flex-col justify-center opacity-60">
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">
            Pendapatan Danusan
          </h3>
          <p className="text-xl font-semibold text-zinc-400 dark:text-zinc-600">
            Segera Hadir
          </p>
        </div>
      </div>
    </div>
  )
}