"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateItemQuantity(itemId: string, newQuantity: number) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || user?.role !== "BUYER") {
      return { success: false, message: "Akses ditolak." };
    }

    if (newQuantity < 1) {
      return { success: false, message: "Kuantitas minimal adalah 1." };
    }

    // Ambil item beserta stok produk aslinya
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: { select: { stock: true } } }
    });

    if (!cartItem) return { success: false, message: "Item tidak ditemukan." };

    // Validasi pencegahan Race Condition & eksploitasi UI
    if (newQuantity > cartItem.product.stock) {
      return { success: false, message: `Gagal. Sisa stok hanya ${cartItem.product.stock}.` };
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity }
    });

    revalidatePath("/cart");
    return { success: true, message: "Kuantitas diperbarui." };
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || user?.role !== "BUYER") {
      return { success: false, message: "Akses ditolak." };
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    revalidatePath("/cart");
    return { success: true, message: "Item dihapus dari keranjang." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus item." };
  }
}

// ... (biarkan fungsi updateItemQuantity dan removeCartItem yang sudah ada di atas)

export async function simulateCheckout() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || user?.role !== "BUYER") {
      return { success: false, message: "Akses ditolak. Sesi tidak valid." };
    }

    // Eksekusi Interactive Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Tarik keranjang dan item beserta relasi produknya
      const cart = await tx.cart.findUnique({
        where: { buyerId: user.id },
        include: { 
          items: { 
            include: { product: true } 
          } 
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Keranjang Anda kosong.");
      }

      let serverCalculatedTotal = 0;

      // 2. Validasi stok aktual & Kalkulasi harga yang aman di Server
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Stok untuk produk ${item.product.productName} tidak mencukupi (Sisa: ${item.product.stock}).`);
        }

        // Kalkulasi: Harga Prisma (Decimal) dikonversi dengan aman
        serverCalculatedTotal += (Number(item.product.price) * item.quantity);

        // 3. Kurangi stok produk secara presisi
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 4. Rekam simulasi pesanan
      await tx.orderSimulation.create({
        data: {
          buyerId: user.id,
          cartId: cart.id, // Sesuai skema Anda, ini opsional tapi baik untuk dihubungkan
          totalPrice: serverCalculatedTotal,
          status: "SIMULATED" // Status bawaan dari ENUM Anda
        }
      });

      // 5. Bersihkan keranjang (Hapus semua CartItem yang terhubung dengan cartId ini)
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return { success: true };
    });

    revalidatePath("/cart");
    revalidatePath("/catalog"); // Segarkan katalog agar stok terbaru langsung terefleksi
    
    return { success: true, message: "Simulasi pesanan berhasil! Keranjang telah dikosongkan." };

  } catch (error: any) {
    console.error("Kesalahan Sistem Checkout:", error);
    // Menangkap pesan spesifik dari Error yang kita lempar di dalam transaksi
    return { success: false, message: error.message || "Gagal memproses pesanan." };
  }
}