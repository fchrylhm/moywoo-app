'use server'

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateProduct(productId: string, formData: FormData) {
  // 1. Cek Cookie Session
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    throw new Error("Sesi telah berakhir. Silakan login kembali.")
  }

  // 2. Proteksi IDOR & Verifikasi Kepemilikan
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true }
  })

  if (!existingProduct || existingProduct.sellerId !== sellerId) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas untuk memodifikasi produk ini.")
  }

  // 3. Ambil & Validasi Data Form
  const productName = formData.get('productName') as string
  const priceInput = formData.get('price') as string
  const categoryName = (formData.get('categoryName') as string) || "Umum"
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  if (!productName || !priceInput) {
    throw new Error("Nama produk dan harga wajib diisi.")
  }

  const price = parseFloat(priceInput)

  // 4. Resolusi Kategori (Cari atau Buat baru)
  let category = await prisma.category.findFirst({ where: { categoryName } })
  if (!category) {
    category = await prisma.category.create({ data: { categoryName } })
  }

  // 5. Penanganan Opsional Penggantian Foto ke Supabase
  let newImageUrl: string | null = null
  
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase
      .storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false
      })

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError)
      throw new Error(`Gagal mengunggah foto baru ke Supabase: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(fileName)

    newImageUrl = publicUrlData.publicUrl
  }

  // 6. Siapkan Payload Mutasi Database
  const updatePayload: any = {
    productName,
    price,
    description,
    categoryId: category.id,
  }

  // Jika ada foto baru, gunakan Nested Write Prisma untuk menimpa relasi gambar lama
  if (newImageUrl) {
    updatePayload.images = {
      deleteMany: {},
      create: { imageUrl: newImageUrl }
    }
  }

  // 7. Eksekusi Update
  await prisma.product.update({
    where: { id: productId },
    data: updatePayload
  })

  // 8. Purge Cache & Redirect
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')
  revalidatePath(`/dashboard/products/${productId}`)
  redirect('/dashboard/products')
}