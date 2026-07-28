import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logoutSeller } from "@/app/login/action"

export const revalidate = 0 

export default async function DashboardPage() {
  // 1. Validasi Autentikasi via Cookie Session
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    redirect('/login')
  }

  // 2. Fetch Data Seller & Produk berdasarkan Prisma Schema
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      products: {
        include: {
          images: true,
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  // Handled jika cookie valid tetapi record seller di database telah dihapus
  if (!seller) {
    redirect('/login')
  }

  const products = seller.products

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Top Header & Navigation */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard {seller.organizationName || seller.fullName}
          </h1>
          <p className="text-sm text-zinc-500">
            Kelola katalog produk organisasi Anda ({seller.email})
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* TOMBOL BARU: Jembatan menuju halaman Product List (FR-08) */}
          <Link
            href="/dashboard/products"
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-medium text-sm border border-zinc-200 dark:border-zinc-700"
          >
            Daftar Produk &rarr;
          </Link>

          <Link
            href="/dashboard/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm"
          >
            + Tambah Produk
          </Link>
          
          <form action={logoutSeller}>
            <button
              type="submit"
              className="bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md transition text-sm font-medium border border-zinc-200 dark:border-zinc-700"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Main Content: Product Grid / Empty State */}
      {products.length === 0 ? (
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-12 text-center text-zinc-500">
          <p className="mb-4">Belum ada produk yang dipublikasikan.</p>
          <Link
            href="/dashboard/products/new"
            className="text-blue-600 hover:underline font-medium"
          >
            Buat produk pertama Anda sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = product.images[0]?.imageUrl || "/placeholder.png"
            return (
              <div 
                key={product.id} 
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-48 mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {product.category && (
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded font-medium">
                      {product.category.categoryName}
                    </span>
                  )}
                  
                  <h2 className="font-semibold text-lg mt-2 text-zinc-900 dark:text-zinc-100">
                    {product.productName}
                  </h2>
                  
                  <p className="text-zinc-500 text-sm line-clamp-2 mt-1">
                    {product.description || "Tidak ada deskripsi"}
                  </p>
                </div>

                <p className="font-bold text-blue-600 dark:text-blue-400 mt-4 text-lg">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}