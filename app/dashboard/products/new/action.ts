'use server'

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" 

export async function createProduct(formData: FormData) {
  // 1. Ekstrak Sesi dari NextAuth secara Konsisten
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Akses Ilegal. Sesi tidak valid atau otorisasi ditolak.")
  }

  // 2. Ambil & Validasi Data Form TERMASUK STOK (Lubang yang sebelumnya terbuka)
  const productName = formData.get('productName') as string
  const priceInput = formData.get('price') as string
  const stockInput = formData.get('stock') as string // Ekstraksi Stok
  const categoryName = (formData.get('categoryName') as string) || "Umum"
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  if (!productName || !priceInput || !stockInput || !imageFile || imageFile.size === 0) {
    throw new Error("Semua kolom wajib diisi termasuk foto produk dan stok.")
  }

  const price = parseFloat(priceInput)
  const stock = parseInt(stockInput, 10) // Parsing Stok menjadi Integer

  // 3. OPTIMASI I/O: Verifikasi Seller berbasis Email (mengikuti standar page.tsx) & Kategori
  const [seller, existingCategory] = await Promise.all([
    prisma.seller.findUnique({ where: { email: session.user.email } }),
    prisma.category.findFirst({ where: { categoryName } })
  ])

  if (!seller) {
    throw new Error("Akun organisasi tidak ditemukan di database. Integritas data bermasalah.")
  }

  // 4. Persiapan buffer gambar
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 5. Upload gambar ke Supabase DAN pembuatan kategori secara serentak
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
      stock, // Injeksi data stok ke database
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

  // 7. Redirect instan kembali ke Dashboard Katalog
  // (Lebih baik mengarah ke /products agar user langsung melihat produk yang baru saja dibuat)
  redirect('/dashboard/products')
}