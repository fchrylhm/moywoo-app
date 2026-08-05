import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import EditProductForm from "./form"

export const revalidate = 0

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  
  // VALIDASI BARU
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/seller/login')

  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })
  if (!seller) redirect('/seller/login')

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,
      category: true,
    },
  })

  if (!product || product.sellerId !== seller.id) {
    redirect('/dashboard/products')
  }

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