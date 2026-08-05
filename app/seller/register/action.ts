'use server'

import { prisma } from "@/lib/prisma"

export async function registerSeller(formData: FormData) {
  console.log("=== 1. SERVER ACTION REGISTER TERPANGGIL ===")
  
  const fullName = (formData.get('fullName') as string)?.trim()
  const organizationName = (formData.get('organizationName') as string)?.trim()
  const whatsappNumber = (formData.get('whatsappNumber') as string)?.trim()
  // Wajib disamakan dengan login: trim dan toLowerCase
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  console.log("=== 2. DATA DARI FORM ===", { fullName, organizationName, whatsappNumber, email })

  if (!fullName || !organizationName || !whatsappNumber || !email || !password) {
    return { success: false, error: "Semua kolom wajib diisi termasuk nomor WhatsApp." }
  }

  try {
    const result = await prisma.seller.create({
      data: {
        fullName,
        organizationName,
        whatsappNumber, // Injeksi data WhatsApp ke database
        email,
        password,
      },
    })
    console.log("=== 3. BERHASIL MASUK SUPABASE ===", result.id)
    return { success: true }
  } catch (error: any) {
    console.error("=== 3. GAGAL INSERT KE SUPABASE ===", error)
    // Tangani error P2002 jika email sudah terdaftar di database
    if (error.code === 'P2002') {
      return { success: false, error: "Email organisasi ini sudah terdaftar." }
    }
    return { success: false, error: error.message || "Gagal menyimpan ke database." }
  }
}