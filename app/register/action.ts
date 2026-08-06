"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerBuyer(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName || !email || !password) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    // 1. Cek apakah email sudah terdaftar
    const existingBuyer = await prisma.buyer.findUnique({
      where: { email },
    });

    if (existingBuyer) {
      return { error: "Email sudah terdaftar. Silakan gunakan email lain." };
    }

    // 2. Injeksi Relasional (Prisma Nested Writes)
    // Membuat Buyer SEKALIGUS membuat record Cart yang terhubung ke ID Buyer ini.
    // Catatan Teknis: Untuk MVP ini password kita simpan plain-text agar seragam dengan sistem Seller Anda. 
    // Di fase produksi nyata, ini HARUS di-hash menggunakan bcrypt.
    await prisma.buyer.create({
      data: {
        fullName,
        email,
        password,
        cart: {
          create: {} // Otomatis membuatkan entitas Cart baru di tabel carts
        }
      },
    });

    revalidatePath("/login");
    return { success: true };
    
  } catch (error) {
    console.error("Database Error (Register Buyer):", error);
    return { error: "Terjadi kesalahan internal server." };
  }
}