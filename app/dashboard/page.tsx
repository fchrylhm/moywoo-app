import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export const revalidate = 0 

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) redirect('/seller/login')

  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationName: true, fullName: true }
  })

  if (!seller) redirect('/seller/login')

  // Hitung metrik sederhana untuk dashboard
  const totalProducts = await prisma.product.count({
    where: { sellerId: seller.id }
  })

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Selamat datang, {seller.organizationName || seller.fullName}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Ringkasan performa dan metrik katalog Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Total Produk Aktif</h3>
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{totalProducts}</p>
        </div>
        {/* Anda bisa menambahkan card metrik lain di sini nantinya (misal: Total Terjual) */}
      </div>
    </div>
  )
}