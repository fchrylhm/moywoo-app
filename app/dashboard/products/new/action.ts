'use server'

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
// Pastikan path import authOptions di bawah ini sesuai dengan struktur folder Anda
import { authOptions } from "@/app/api/auth/[...nextauth]/route" 

export async function createProduct(formData: FormData) {
  // 1. Ekstrak Sesi dari NextAuth (Menggantikan manual cookie)
  const session = await getServerSession(authOptions)

  // Validasi absolut: Hanya user yang login DAN memiliki role 'seller' yang diizinkan
  if (!session || (session.user as any).role !== "seller") {
    throw new Error("Akses Ilegal. Sesi tidak valid atau otorisasi ditolak.")
  }

  // Ambil ID langsung dari token sesi server yang mustahil dimanipulasi dari frontend
  const sellerId = session.user.id

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
    throw new Error("Akun organisasi tidak ditemukan di database. Integritas data bermasalah.")
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