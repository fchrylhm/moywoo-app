'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" 

export async function deleteProduct(productId: string) {
  // 1. Validasi Autentikasi NextAuth
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("Sesi tidak valid atau telah habis.")
  }

  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!seller) throw new Error("Akun organisasi tidak ditemukan.")

  // 2. Proteksi Keamanan (IDOR Mitigation)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true }
  })

  if (!product || product.sellerId !== seller.id) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas untuk menghapus produk ini.")
  }

  // 3. Transaksi Database Penghapusan (Atomic Operation)
  await prisma.$transaction([
    prisma.image.deleteMany({
      where: { productId: productId }
    }),
    prisma.product.delete({
      where: { id: productId }
    })
  ])

  // 4. Purge Cache
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')
}