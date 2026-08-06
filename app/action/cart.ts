"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

/**
 * Helper internal untuk memvalidasi sesi secara ketat.
 * Menggantikan getBuyerSession() dummy yang lama.
 */
async function validateBuyerSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || session.user.role !== "BUYER") {
    throw new Error("Autentikasi ditolak: Akses spesifik Buyer diperlukan.");
  }
  
  return session.user.id;
}

// 1. Menambahkan produk ke keranjang
export async function addToCart(productId: string, requestedQuantity: number = 1) {
  try {
    const buyerId = await validateBuyerSession(); // Memanggil helper validasi yang sudah kita buat

    // 1. Validasi Ketersediaan & Status Produk (Diambil dari logika Anda yang superior)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { status: true, stock: true }
    });

    if (!product || product.status !== "PUBLISHED" || product.stock < 1) {
      return { success: false, message: "Produk tidak tersedia atau stok habis." };
    }

    // 2. Prisma Upsert: Cari keranjang, jika tidak ada langsung buat (Lebih efisien & aman dari race-condition)
    const cart = await prisma.cart.upsert({
      where: { buyerId },
      update: {},
      create: { buyerId },
    });

    // 3. Cek eksistensi item di keranjang
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      // 4. Proteksi Eksploitasi Kuantitas (Logika Anda)
      const newQuantity = existingItem.quantity + requestedQuantity;
      if (newQuantity > product.stock) {
        return { success: false, message: "Kuantitas di keranjang melebihi batas stok yang tersedia." };
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Validasi juga saat pertama kali memasukkan item
      if (requestedQuantity > product.stock) {
        return { success: false, message: "Kuantitas melampaui stok." };
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: requestedQuantity
        }
      });
    }

    // Revalidasi rute yang terdampak agar UI ter-update
    revalidatePath("/cart");
    revalidatePath("/catalog"); // Mempertahankan revalidasi katalog Anda
    revalidatePath(`/catalog/${productId}`); 
    
    return { success: true, message: "Berhasil ditambahkan ke keranjang." };

  } catch (error: any) {
    console.error("Kesalahan Sistem AddToCart:", error);
    return { success: false, message: error.message || "Gagal memproses permintaan ke server." };
  }
}

// 4. Memproses Simulasi Checkout (ACID Compliant)
export async function simulateCheckout() {
  try {
    const buyerId = await validateBuyerSession();

    const cart = await prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Keranjang belanja Anda kosong." };
    }

    // Kalkulasi Total Harga
    const totalPrice = cart.items.reduce((sum: number, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    // INJEKSI BARU: Menyiapkan array kueri untuk memotong stok produk secara dinamis
    const stockUpdateOperations = cart.items.map((item) => {
      return prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity // Operator atomik untuk pemotongan stok yang aman
          }
        }
      });
    });

    // Mengeksekusi Order Simulation, Update Stok, & Clear Cart secara Transaksional (ACID)
    const [simulation] = await prisma.$transaction([
      prisma.orderSimulation.create({
        data: {
          buyerId,
          cartId: cart.id,
          totalPrice,
          status: "COMPLETED"
        }
      }),
      // Menyuntikkan seluruh operasi potong stok ke dalam transaksi
      ...stockUpdateOperations, 
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    ]);

    // Revalidasi rute
    revalidatePath("/cart");
    // Wajib merevalidasi katalog agar perubahan stok langsung tercermin di UI
    revalidatePath("/catalog"); 
    
    return { success: true, simulationId: simulation.id };
  } catch (error: any) {
    console.error("Checkout simulation error:", error);
    return { success: false, message: error.message || "Gagal memproses checkout." };
  }
}

export async function updateItemQuantity(cartItemId: string, newQuantity: number) {
  try {
    const buyerId = await validateBuyerSession();

    // Verifikasi kepemilikan item keranjang demi keamanan lapis kedua
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { 
        cart: true,
        product: { select: { stock: true } }
      }
    });

    if (!cartItem || cartItem.cart.buyerId !== buyerId) {
      return { success: false, message: "Item keranjang tidak ditemukan atau akses ditolak." };
    }

    if (newQuantity > cartItem.product.stock) {
      return { success: false, message: "Kuantitas melebihi stok yang tersedia." };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity }
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("Update quantity error:", error);
    return { success: false, message: "Gagal memperbarui kuantitas." };
  }
}

// 4. Menghapus Item dari Keranjang
export async function removeCartItem(cartItemId: string) {
  try {
    const buyerId = await validateBuyerSession();

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.buyerId !== buyerId) {
      return { success: false, message: "Item tidak ditemukan atau akses ditolak." };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Remove cart item error:", error);
    return { success: false, message: "Gagal menghapus item dari keranjang." };
  }
}