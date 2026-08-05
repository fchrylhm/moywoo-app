'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

// Utility Pembersih & Formatter Nomor WhatsApp
function formatWaNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '') // Hapus karakter non-digit
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1)
  }
  return cleaned
}

// ACTION 1: CHECKOUT PER SELLER
export async function checkoutSellerGroup(sellerId: string) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || (session.user as any).role !== "buyer") {
    return { error: "Silakan login menggunakan akun pembeli." }
  }

  const buyerId = session.user.id

  try {
    // 1. Ambil Keranjang Pembeli beserta item khusus dari Seller ini
    const cart = await prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: {
          where: { product: { sellerId } },
          include: {
            product: {
              include: { seller: true }
            }
          }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return { error: "Item tidak ditemukan di keranjang." }
    }

    const items = cart.items
    const seller = items[0].product.seller
    const buyerName = session.user.name || "Mahasiswa"

    // 2. Hitung Total Pembayaran
    let total = 0
    let itemDetailsText = ""

    items.forEach((item, index) => {
      const subtotal = Number(item.product.price) * item.quantity
      total += subtotal
      itemDetailsText += `${index + 1}. *${item.product.productName}* (${item.quantity}x) = Rp${subtotal.toLocaleString('id-ID')}\n`
    })

    // 3. Rakit Format Pesan WhatsApp
    const rawMessage = 
`Halo *${seller.organizationName}*,
Saya *${buyerName}* ingin memesan produk berikut via Moywoo:

${itemDetailsText}
*Total Pembayaran: Rp${total.toLocaleString('id-ID')}*

Mohon konfirmasi ketersediaan stok dan instruksi pembayarannya. Terima kasih!`

    const encodedMessage = encodeURIComponent(rawMessage)
    const formattedPhone = formatWaNumber(seller.whatsappNumber)
    const waLink = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    // 4. HAPUS PERMANEN Item dari Keranjang untuk Seller ini
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        product: { sellerId }
      }
    })

    revalidatePath('/cart')
    return { success: true, waLink }

  } catch (error) {
    console.error("Checkout Error:", error)
    return { error: "Gagal memproses checkout." }
  }
}

// ACTION 2: UPDATE QUANTITY ITEM
export async function updateCartItemQuantity(itemId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    return deleteCartItem(itemId)
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity }
    })
    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { error: "Gagal memperbarui kuantitas." }
  }
}

// ACTION 3: HAPUS INDIVIDUAL ITEM
export async function deleteCartItem(itemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId }
    })
    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { error: "Gagal menghapus item." }
  }
}