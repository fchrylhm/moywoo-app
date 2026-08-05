import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import DeleteProductButton from "./delete-button"

export const revalidate = 0 

export default async function ProductListPage() {
  // 1. Standarisasi Validasi Sesi menggunakan NextAuth
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/seller/login')
  }

  // 2. Ekstraksi ID Seller berdasarkan email dari JWT Session
  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!seller) {
    redirect('/seller/login')
  }

  // 3. Tarik data dari Database (Aman dari kebocoran antar-tenant)
  const products = await prisma.product.findMany({
    where: {
      sellerId: seller.id,
    },
    include: {
      images: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // -- UI UTUH (TIDAK ADA PERUBAHAN PADA DESAIN ANDA) --
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Product List
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your catalog, update pricing, and monitor stock levels.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="flex-1 sm:flex-initial text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-medium text-sm border border-zinc-200 dark:border-zinc-700"
          >
            &larr; Dashboard
          </Link>
          <Link
            href="/dashboard/products/new"
            className="flex-1 sm:flex-initial text-center bg-[#355872] text-white px-4 py-2 rounded-md hover:bg-[#274256] transition font-medium text-sm shadow-sm"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-12 text-center text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50">
          <p className="mb-4 font-medium">Katalog produk Anda masih kosong.</p>
          <Link
            href="/dashboard/products/new"
            className="text-[#E47632] hover:underline font-semibold text-sm"
          >
            + Mulai publikasikan produk pertama Anda
          </Link>
        </div>
      ) : (
        <>
          {/* A. DESKTOP VIEW */}
          <div className="hidden md:block border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 w-20">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
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
                        <td className="p-4">
                          <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                            <img
                              src={imageUrl}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                          {product.productName}
                          <div className="text-xs text-zinc-400 line-clamp-1 font-normal mt-0.5">
                            {product.description || "Tidak ada deskripsi"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {product.category?.categoryName || "Umum"}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          Rp {Number(product.price).toLocaleString("id-ID")}
                        </td>
                        <td className={`p-4 font-bold ${product.stock > 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-500'}`}>
                          {product.stock}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            {product.status || "PUBLISHED"}
                          </span>
                        </td>
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

          {/* B. MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => {
              const imageUrl = product.images[0]?.imageUrl || "/placeholder.png"
              return (
                <div
                  key={product.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-sm space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                      <img
                        src={imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {product.category?.categoryName || "Umum"}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {product.status || "PUBLISHED"}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mt-1.5 text-base truncate">
                        {product.productName}
                      </h3>
                      
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {product.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>

                  {/* INJEKSI STOK MOBILE */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500">Harga Satuan</span>
                      <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-zinc-500">Sisa Stok</span>
                      <span className={`font-bold text-sm sm:text-base ${product.stock > 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-500'}`}>
                        {product.stock} Unit
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="flex-1 text-center py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded border border-blue-200 dark:border-blue-800 transition"
                    >
                      Pratinjau
                    </Link>
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="flex-1 text-center py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded border border-amber-200 dark:border-amber-800 transition"
                    >
                      Edit
                    </Link>
                    <div className="flex-1 flex justify-stretch">
                      <div className="w-full [&>button]:w-full [&>button]:py-1.5">
                        <DeleteProductButton 
                          id={product.id} 
                          productName={product.productName} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}