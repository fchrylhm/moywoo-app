import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import SellerCheckoutButton from "./checkout-button"
import ItemQuantityControls from "./item-controls" // Kita definisikan di komponen kecil/inline
import { ShoppingBag, Store, ArrowLeft } from "lucide-react"

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || (session.user as any).role !== "buyer") {
    redirect("/login")
  }

  // 1. Fetch Cart Data
  const cart = await prisma.cart.findUnique({
    where: { buyerId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              seller: true,
              images: { take: 1 }
            }
          }
        },
        orderBy: { addedAt: 'desc' }
      }
    }
  })

// 2. Grouping Items by Seller
  // Ambil tipe data spesifik dari hasil relasi kueri Prisma di atas
  type CartItemWithDetails = NonNullable<typeof cart>['items'][number]

  type GroupedCart = {
    [sellerId: string]: {
      sellerName: string
      items: CartItemWithDetails[]
      subtotal: number
    }
  }

  const groupedCart = cart?.items.reduce((acc: GroupedCart, item) => {
    const seller = item.product.seller
    const sellerId = seller.id
    const itemTotal = Number(item.product.price) * item.quantity

    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerName: seller.organizationName,
        items: [],
        subtotal: 0
      }
    }

    acc[sellerId].items.push(item)
    acc[sellerId].subtotal += itemTotal
    return acc
  }, {} as GroupedCart) || {} // Tambahkan as GroupedCart untuk validasi tipe akhir

  const sellerIds = Object.keys(groupedCart)

  return (
    <div className="min-h-screen flex flex-col bg-moywoo-bg text-moywoo-slate">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Keranjang Belanja</h1>
              <p className="text-sm text-moywoo-slate/70 mt-1">
                Pesanan akan dikirimkan langsung ke WhatsApp organisasi penjual.
              </p>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-moywoo-orange hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Lanjut Belanja
            </Link>
          </div>

          {/* EMPTY STATE */}
          {sellerIds.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-moywoo-slate/10 shadow-sm">
              <ShoppingBag className="mx-auto h-16 w-16 text-moywoo-slate/20 mb-4" />
              <h2 className="text-lg font-bold text-moywoo-slate">Keranjang Anda Masih Kosong</h2>
              <p className="text-sm text-moywoo-slate/60 mt-1 mb-6">
                Belum ada produk danusan yang ditambahkan.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-moywoo-orange px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-moywoo-orange/90"
              >
                Jelajahi Katalog
              </Link>
            </div>
          ) : (
            /* GROUPED CART LIST */
            <div className="space-y-8">
              {sellerIds.map((sellerId) => {
                const group = groupedCart[sellerId]
                return (
                  <div 
                    key={sellerId} 
                    className="bg-white rounded-2xl border border-moywoo-slate/10 p-6 shadow-sm space-y-6"
                  >
                    {/* SELLER HEADER */}
                    <div className="flex items-center gap-2.5 pb-4 border-b border-moywoo-slate/10">
                      <Store className="h-5 w-5 text-moywoo-blue" />
                      <h2 className="font-bold text-lg text-moywoo-slate">
                        {group.sellerName}
                      </h2>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="divide-y divide-moywoo-slate/10">
                      {group.items.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 relative rounded-xl bg-moywoo-bg border border-moywoo-slate/10 overflow-hidden shrink-0">
                              {item.product.images[0] ? (
                                <Image
                                  src={item.product.images[0].imageUrl}
                                  alt={item.product.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-moywoo-slate/30">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base text-moywoo-slate">
                                {item.product.productName}
                              </h3>
                              <p className="text-xs sm:text-sm font-bold text-moywoo-orange mt-0.5">
                                Rp {Number(item.product.price).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>

                          {/* CONTROLS (QUANTITY & DELETE) */}
                          <ItemQuantityControls itemId={item.id} quantity={item.quantity} />
                        </div>
                      ))}
                    </div>

                    {/* FOOTER CHECKOUT PER SELLER */}
                    <div className="pt-4 border-t border-moywoo-slate/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-moywoo-slate/60 block">Subtotal Organisasi</span>
                        <span className="text-lg font-extrabold text-moywoo-slate">
                          Rp {group.subtotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="w-full sm:w-auto sm:min-w-[280px]">
                        <SellerCheckoutButton 
                          sellerId={sellerId} 
                          sellerName={group.sellerName} 
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}