'use server'

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  // 1. Cek Cookie Session (Cepat & Sinkron dengan alur login sebelumnya)
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    throw new Error("Sesi telah berakhir. Silakan login kembali.")
  }

  // 2. Ambil & Validasi Data Form
  const productName = formData.get('productName') as string
  const priceInput = formData.get('price') as string
  const categoryName = (formData.get('categoryName') as string) || "Umum"
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  if (!productName || !priceInput || !imageFile || imageFile.size === 0) {
    throw new Error("Semua kolom wajib diisi termasuk foto produk.")
  }

  const price = parseFloat(priceInput)

  // 3. OPTIMASI I/O: Eksekusi verifikasi Seller dan pengecekan Kategori secara serentak (Paralel)
  const [seller, existingCategory] = await Promise.all([
    prisma.seller.findUnique({ where: { id: sellerId } }),
    prisma.category.findFirst({ where: { categoryName } })
  ])

  if (!seller) {
    cookieStore.delete('seller_session')
    throw new Error("Akun penjual tidak ditemukan di database. Silakan register/login ulang.")
  }

  // 4. Persiapan buffer gambar
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 5. OPTIMASI I/O: Upload gambar ke Supabase DAN pembuatan kategori (jika belum ada) berjalan serentak
  const uploadPromise = supabase
    .storage
    .from('product-images')
    .upload(fileName, buffer, {
      contentType: imageFile.type,
      upsert: false
    })

  const categoryPromise = existingCategory 
    ? Promise.resolve(existingCategory) 
    : prisma.category.create({ data: { categoryName } })

  const [uploadResult, category] = await Promise.all([uploadPromise, categoryPromise])

  if (uploadResult.error) {
    console.error("Supabase Storage Error:", uploadResult.error)
    throw new Error(`Gagal upload gambar ke Supabase: ${uploadResult.error.message}`)
  }

  // Ambil Public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(fileName)

  const imageUrl = publicUrlData.publicUrl

  // 6. Transaksi Akhir: Simpan Produk & Relasi Gambar ke Database
  await prisma.product.create({
    data: {
      productName,
      price,
      description,
      sellerId: seller.id,
      categoryId: category.id,
      images: {
        create: {
          imageUrl: imageUrl
        }
      }
    }
  })

  // 7. Redirect instan kembali ke Dashboard
  redirect('/dashboard')
}