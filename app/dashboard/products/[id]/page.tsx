import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const revalidate = 0

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    redirect('/login')
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,
      category: true,
      seller: true,
    },
  })

  if (!product || product.sellerId !== sellerId) {
    redirect('/dashboard/products')
  }

  const imageUrl = product.images[0]?.imageUrl || "/placeholder.png"

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-sm font-medium border border-zinc-200 dark:border-zinc-700"
          >
            &larr; Kembali ke Katalog
          </Link>
          <span className="text-zinc-400">/</span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs sm:max-w-md">
            {product.productName}
          </h1>
        </div>

        <Link
          href={`/dashboard/products/${product.id}/edit`}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md transition font-medium text-sm shadow-sm"
        >
          Edit Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img
              src={imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-zinc-400 text-center">
            ID Produk: <span className="font-mono">{product.id}</span>
          </p>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {product.category?.categoryName || "Umum"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {product.status || "PUBLISHED"}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {product.productName}
            </h2>

            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </div>

            {/* INJEKSI STOK */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sisa Stok:</span>
              <span className={`text-sm font-bold ${product.stock > 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-500'}`}>
                {product.stock} Unit
              </span>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Deskripsi Produk
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {product.description || "Tidak ada deksripsi yang dilampirkan untuk produk ini."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Dipublikasikan oleh:</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                {product.seller?.organizationName || product.seller?.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal Buat:</span>
              <span>{new Date(product.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}