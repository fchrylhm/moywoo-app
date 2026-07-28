import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
// Import fungsi lama sudah dihapus, digantikan oleh Client Component modular di bawah ini:
import DeleteProductButton from "./delete-button"

// Memastikan data selalu segar (no-cache SSR) sesuai standar dashboard eksisting
export const revalidate = 0 

export default async function ProductListPage() {
  // 1. Validasi Autentikasi via Cookie Session (100% sinkron dengan alur eksisting)
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    redirect('/login')
  }

  // 2. Optimasi Query: Tarik langsung dari model Product berdasarkan sellerId
  const products = await prisma.product.findMany({
    where: {
      sellerId: sellerId,
    },
    include: {
      images: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header & Navigation - Sesuai Wireframe Product List */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Product List
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your catalog, update pricing, and monitor stock levels.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-medium text-sm border border-zinc-200 dark:border-zinc-700"
          >
            &larr; Dashboard
          </Link>
          <Link
            href="/dashboard/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm shadow-sm"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      {/* Table Container - Menggantikan Grid View untuk tampilan manajemen intensif */}
      {products.length === 0 ? (
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-12 text-center text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50">
          <p className="mb-4 font-medium">Katalog produk Anda masih kosong.</p>
          <Link
            href="/dashboard/products/new"
            className="text-blue-600 hover:underline font-semibold text-sm"
          >
            + Mulai publikasikan produk pertama Anda
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                {products.map((product) => {
                  const imageUrl = product.images[0]?.imageUrl || "/placeholder.png"
                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {/* Kolom 1: Image */}
                      <td className="p-4">
                        <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                          <img
                            src={imageUrl}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Kolom 2: Name & Description Snippet */}
                      <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {product.productName}
                        <div className="text-xs text-zinc-400 line-clamp-1 font-normal mt-0.5">
                          {product.description || "Tidak ada deskripsi"}
                        </div>
                      </td>

                      {/* Kolom 3: Category */}
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {product.category?.categoryName || "Umum"}
                        </span>
                      </td>

                      {/* Kolom 4: Price */}
                      <td className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </td>

                      {/* Kolom 5: Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {product.status || "PUBLISHED"}
                        </span>
                      </td>

                      {/* Kolom 6: Action */}
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded border border-blue-200 dark:border-blue-800 transition"
                        >
                          Pratinjau
                        </Link>

                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded border border-amber-200 dark:border-amber-800 transition"
                        >
                          Edit
                        </Link>

                        {/* TOMBOL DELETE BARU VIA COMPONENT MODULAR */}
                        <DeleteProductButton 
                          id={product.id} 
                          productName={product.productName} 
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}