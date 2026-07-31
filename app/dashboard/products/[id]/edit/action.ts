'use server'

import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateProduct(productId: string, formData: FormData) {
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    throw new Error("Sesi telah berakhir. Silakan login kembali.")
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true }
  })

  if (!existingProduct || existingProduct.sellerId !== sellerId) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas untuk memodifikasi produk ini.")
  }

  const productName = formData.get('productName') as string
  const priceInput = formData.get('price') as string
  // INJEKSI STOK: Tangkap data stok dari form
  const stockInput = formData.get('stock') as string
  const categoryName = (formData.get('categoryName') as string) || "Umum"
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  // Validasi tambahan untuk stok
  if (!productName || !priceInput || !stockInput) {
    throw new Error("Nama produk, harga, dan stok wajib diisi.")
  }

  const price = parseFloat(priceInput)
  const stock = parseInt(stockInput, 10)

  if (isNaN(stock) || stock < 0) {
    throw new Error("Format stok tidak valid. Harus berupa angka bulat positif.")
  }

  let category = await prisma.category.findFirst({ where: { categoryName } })
  if (!category) {
    category = await prisma.category.create({ data: { categoryName } })
  }

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

  // INJEKSI STOK: Masukkan variabel stock ke payload database
  const updatePayload: any = {
    productName,
    price,
    stock, 
    description,
    categoryId: category.id,
  }

  if (newImageUrl) {
    updatePayload.images = {
      deleteMany: {},
      create: { imageUrl: newImageUrl }
    }
  }

  await prisma.product.update({
    where: { id: productId },
    data: updatePayload
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/products')
  revalidatePath(`/dashboard/products/${productId}`)
  redirect('/dashboard/products')
}