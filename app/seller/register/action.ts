'use server'

import { prisma } from "@/lib/prisma"

export async function registerSeller(formData: FormData) {
  console.log("=== 1. SERVER ACTION REGISTER TERPANGGIL ===")
  
  const fullName = (formData.get('fullName') as string)?.trim()
  const organizationName = (formData.get('organizationName') as string)?.trim()
  const whatsappNumber = (formData.get('whatsappNumber') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  console.log("=== 2. DATA DARI FORM ===", { fullName, organizationName, whatsappNumber, email })

  // Validasi Eksistensi Data
  if (!fullName || !organizationName || !whatsappNumber || !email || !password) {
    return { success: false, error: "Semua kolom wajib diisi termasuk nomor WhatsApp." }
  }

  // VALIDASI BARU: Tembok Pertahanan 8 Karakter
  if (password.length < 8) {
    return { success: false, error: "Kata sandi terlalu pendek. Minimal 8 karakter." }
  }

  try {
    const result = await prisma.seller.create({
      data: {
        fullName,
        organizationName,
        whatsappNumber,
        email,
        password,
      },
    })
    console.log("=== 3. BERHASIL MASUK SUPABASE ===", result.id)
    return { success: true }
  } catch (error: any) {
    console.error("=== 3. GAGAL INSERT KE SUPABASE ===", error)
    if (error.code === 'P2002') {
      return { success: false, error: "Email organisasi ini sudah terdaftar." }
    }
    return { success: false, error: error.message || "Gagal menyimpan ke database." }
  }
}