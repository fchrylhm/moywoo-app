import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CartClient from "./CartClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Keranjang | Moywoo",
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || user?.role !== "BUYER") {
    redirect("/buyer-login");
  }

  const cart = await prisma.cart.findUnique({
    where: { buyerId: user.id },
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        include: {
          product: {
            include: {
              seller: { select: { organizationName: true } },
              images: { select: { imageUrl: true }, take: 1 }
            }
          }
        }
      }
    }
  });

  const serializedItems = cart?.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      productName: item.product.productName,
      price: Number(item.product.price), 
      stock: item.product.stock,
      sellerName: item.product.seller.organizationName,
      imageUrl: item.product.images[0]?.imageUrl || null
    }
  })) || [];

  return (
    // Penyesuaian margin dan padding agar tidak terlalu menempel ke atas
    <div className="min-h-screen bg-[#FDFDFD] pt-8 md:pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* REVISI UX: Ghost Button untuk navigasi kembali */}
        <div className="mb-8">
          <Link 
            href="/catalog" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-zinc-400 group-hover:-translate-x-1 group-hover:text-zinc-600 transition-all" />
            Lanjut Belanja
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-8 tracking-tight">Keranjang Belanja</h1>
        
        <CartClient initialItems={serializedItems} />
      </div>
    </div>
  );
}