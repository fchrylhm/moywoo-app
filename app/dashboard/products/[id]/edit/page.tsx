import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import EditProductForm from "./form"

export const revalidate = 0

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  if (!sellerId) {
    redirect('/login')
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,
      category: true,
    },
  })

  if (!product || product.sellerId !== sellerId) {
    redirect('/dashboard/products')
  }

  // INJEKSI STOK KE DALAM FORMATTED DATA
  const formattedData = {
    id: product.id,
    productName: product.productName,
    price: Number(product.price),
    stock: product.stock, 
    description: product.description || "",
    categoryName: product.category?.categoryName || "Umum",
    imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
  }

  return <EditProductForm initialData={formattedData} />
}