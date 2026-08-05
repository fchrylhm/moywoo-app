'use server'

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation" // INJEKSI BARU: Modul navigasi paksa

// Helper internal untuk mengecek sesi Buyer (MODE DUMMY AKTIF)
async function getBuyerSession() {
  // LOGIKA ASLI DIMATIKAN SEMENTARA UNTUK TESTING
  /* 
  const cookieStore = await cookies()
  const buyerId = cookieStore.get('buyer_session')?.value
  if (!buyerId) {
    throw new Error("Anda harus login sebagai Buyer terlebih dahulu.")
  }
  return buyerId 
  */

  // INJEKSI HARDCODE UUID DUMMY BUYER (BYPASS LOGIN)
  return "c13516e1-9d54-450f-96c9-0958e5ff4e9e";
}

// 1. Menambahkan produk ke keranjang (Add to Cart)
export async function addToCart(productId: string, quantity: number = 1) {
  const buyerId = await getBuyerSession()

  // Pastikan keranjang Buyer ada, jika belum buat baru
  let cart = await prisma.cart.findUnique({
    where: { buyerId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { buyerId }
    })
  }

  // Cek apakah item sudah ada di dalam keranjang
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: productId
    }
  })

  if (existingItem) {
    // Jika sudah ada, update jumlahnya
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    })
  } else {
    // Jika belum ada, buat item baru
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    })
  }

  // Membersihkan cache agar data terbaru termuat
  revalidatePath('/cart')
  revalidatePath('/products/[id]', 'page') 
  
  // INJEKSI BARU: Memaksa navigasi pengguna ke halaman keranjang
  redirect('/cart') 
}

// 2. Mengambil data keranjang beserta item dan produknya (Get Cart)
export async function getCart() {
  const buyerId = await getBuyerSession()

  const cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              seller: true
            }
          }
        },
        orderBy: { addedAt: 'desc' }
      }
    }
  })

  return cart
}

// 3. Menghapus Item dari Keranjang
export async function removeFromCart(cartItemId: string) {
  await getBuyerSession()

  await prisma.cartItem.delete({
    where: { id: cartItemId }
  })

  // KOREKSI: Rute dialihkan ke publik, bukan dashboard seller
  revalidatePath('/cart')
  return { success: true }
}

// 4. Memproses Simulasi Checkout (Dummy Checkout)
export async function simulateCheckout() {
  const buyerId = await getBuyerSession()

  const cart = await prisma.cart.findUnique({
    where: { buyerId },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  if (!cart || cart.items.length === 0) {
    throw new Error("Keranjang belanja Anda kosong.")
  }

  // Hitung total harga
  const totalPrice = cart.items.reduce((sum: number, item) => {
    return sum + (Number(item.product.price) * item.quantity)
  }, 0)

  // Buat record OrderSimulation sesuai Bab XII PRD
  const simulation = await prisma.orderSimulation.create({
    data: {
      buyerId,
      cartId: cart.id,
      totalPrice,
      status: 'COMPLETED'
    }
  })

  // Bersihkan isi keranjang belanja setelah checkout simulasi berhasil
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  })

  // KOREKSI: Rute dialihkan ke publik, bukan dashboard seller
  revalidatePath('/cart')
  return { success: true, simulationId: simulation.id }
}