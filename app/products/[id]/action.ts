'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

// Perhatikan: Mengembalikan Promise dengan tipe spesifik agar TypeScript tenang
export async function addToCart(productId: string, quantity: number = 1): Promise<{ success?: boolean; error?: string }> {
  // 1. Validasi Sesi Pembeli
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || (session.user as any).role !== "buyer") {
    return { error: "Akses ditolak. Silakan login menggunakan akun Google (email kampus) untuk memesan." }
  }

  const buyerId = session.user.id

  try {
    // 2. Transaksi Database Keranjang
    await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: { buyerId }
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: { buyerId }
        })
      }

      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        })
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId,
            quantity: quantity
          }
        })
      }
    })

    revalidatePath(`/products/${productId}`)
    return { success: true }

  } catch (error) {
    console.error("Gagal menambahkan ke keranjang:", error)
    return { error: "Terjadi kesalahan sistem saat memproses keranjang." }
  }
}