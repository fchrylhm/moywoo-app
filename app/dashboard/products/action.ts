'use server'

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
  // 1. Validasi Autentikasi (Konsisten dengan alur login eksisting)
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    throw new Error("Sesi tidak valid atau telah habis.")
  }

  // 2. Proteksi Keamanan (IDOR Mitigation): 
  // Pastikan produk yang akan dihapus BENAR-BENAR milik seller yang sedang login
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true }
  })

  if (!product || product.sellerId !== sellerId) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas untuk menghapus produk ini.")
  }

  // 3. Transaksi Database Penghapusan (Atomic Operation)
  // Mencegah fatal error akibat Foreign Key Constraint dengan menghapus gambar terlebih dahulu
  await prisma.$transaction([
    prisma.image.deleteMany({
      where: { productId: productId }
    }),
    prisma.product.delete({
      where: { id: productId }
    })
  ])

  // 4. Purge Cache agar perubahan langsung terlihat di layar tanpa reload manual
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')
}