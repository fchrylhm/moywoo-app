import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Package, AlertTriangle, TrendingUp, Wallet, Receipt } from "lucide-react"

export const revalidate = 0 

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) redirect('/seller/login')

  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationName: true, fullName: true }
  })

  if (!seller) redirect('/seller/login')

  // Agregasi Intelijen Inventaris Berdasarkan Data Tersedia
  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    select: { price: true, stock: true }
  })

  const totalProducts = products.length
  const outOfStockProducts = products.filter(p => p.stock === 0).length
  const activeProducts = totalProducts - outOfStockProducts
  
  // Menghitung potensi valuasi inventaris (Harga x Sisa Stok)
  const potentialValue = products.reduce((acc, curr) => {
    return acc + (Number(curr.price) * curr.stock)
  }, 0)

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Selamat datang, {seller.organizationName}
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Pusat kendali inventaris dan operasional usaha dana Anda.
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 flex items-center gap-2 shadow-sm">
          <TrendingUp className="w-4 h-4" /> V1.0 Dashboard Metrik
        </div>
      </div>

      {/* GRID METRIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metrik 1: Total Produk */}
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-500">Total Katalog</h3>
            <div className="p-2 bg-zinc-50 rounded-lg">
              <Package className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-zinc-900">{totalProducts}</p>
            <p className="text-xs text-zinc-400 mt-2 font-medium">Item terdaftar di sistem</p>
          </div>
        </div>

        {/* Metrik 2: Produk Aktif (Stok > 0) */}
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-500">Katalog Aktif</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-zinc-900">{activeProducts}</p>
            <p className="text-xs text-green-600 mt-2 font-bold">Siap dibeli pengunjung</p>
          </div>
        </div>

        {/* Metrik 3: Valuasi Inventaris */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-md flex flex-col justify-between transform transition-transform hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-400">Valuasi Inventaris</h3>
            <div className="p-2 bg-zinc-800 rounded-lg">
              <Wallet className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
        <div>
          
    {/* KOREKSI: Ukuran diturunkan menjadi text-2xl (atau text-xl di layar kecil), tracking diperketat, dan truncate dihapus */}
    <p className="text-xl lg:text-2xl font-black text-white tracking-tighter leading-none break-words">
      {formatRupiah(potentialValue)}
    </p>
    <p className="text-xs text-zinc-400 mt-2 font-medium">Nilai total dari sisa stok</p>
  </div>
</div>

        {/* Metrik 4: Peringatan Stok */}
        <div className={`p-6 border rounded-2xl shadow-sm flex flex-col justify-between transition-shadow ${outOfStockProducts > 0 ? 'bg-red-50/50 border-red-200 hover:shadow-red-100' : 'bg-white border-zinc-200 hover:shadow-md'}`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className={`text-sm font-bold ${outOfStockProducts > 0 ? 'text-red-600' : 'text-zinc-500'}`}>Stok Habis</h3>
            <div className={`p-2 rounded-lg ${outOfStockProducts > 0 ? 'bg-red-100 text-red-600' : 'bg-zinc-50 text-zinc-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className={`text-4xl font-black ${outOfStockProducts > 0 ? 'text-red-700' : 'text-zinc-900'}`}>{outOfStockProducts}</p>
            <p className={`text-xs mt-2 font-bold ${outOfStockProducts > 0 ? 'text-red-500' : 'text-zinc-400'}`}>
              {outOfStockProducts > 0 ? 'Segera perbarui stok Anda!' : 'Semua stok aman.'}
            </p>
          </div>
        </div>

      </div>

      {/* MANUVER UX: ILUSI TABEL TRANSAKSI (EMPTY STATE) */}
      <div className="mt-8 bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Header palsu untuk tabel */}
        <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-zinc-900">Riwayat Transaksi Terkini</h2>
          <button disabled className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-lg cursor-not-allowed border border-zinc-200">
            Unduh Laporan
          </button>
        </div>
        
        {/* Konten tabel (Kosong) */}
        <div className="p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-5 border border-zinc-100">
            <Receipt className="w-8 h-8 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Belum ada transaksi masuk</h3>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
            Pesanan dari pembeli akan otomatis muncul di sini. Pastikan status katalog Anda aktif dan bagikan tautan toko ke calon pendukung kegiatan organisasi Anda.
          </p>
        </div>
      </div>

    </div>
  )
}