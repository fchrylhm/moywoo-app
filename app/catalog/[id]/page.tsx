import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Store, Package, Tag } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";

// Definisi tipe params di Next.js App Router
interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Query tunggal untuk menarik produk, gambar, kategori, dan identitas penjual (FR-04 & FR-06)
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      category: true,
      seller: {
        select: {
          organizationName: true,
          fullName: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fallback gambar jika array images kosong
  const defaultImage = product.images[0]?.imageUrl || "/placeholder-image.jpg";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Sektor Visual */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-center aspect-square overflow-hidden relative">
          <Image
            src={defaultImage}
            alt={product.productName}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Sektor Informasi Data */}
        <div className="flex flex-col py-4">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600">
              <Tag className="w-3.5 h-3.5" />
              {product.category.categoryName}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
            {product.productName}
          </h1>

          <div className="text-3xl font-bold text-[#E47632] mb-6">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </div>

          <div className="prose prose-zinc mb-8">
            <p className="text-zinc-600 leading-relaxed">
              {product.description || "Tidak ada deskripsi tersedia untuk produk ini."}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            {/* Pemenuhan FR-06: Identitas Organisasi Penjual */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-zinc-100">
                <Store className="w-5 h-5 text-zinc-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Dijual Oleh
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {product.seller.organizationName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span className="font-medium text-sm">Sisa Stok Sistem</span>
              </div>
              <span className="font-bold text-lg">{product.stock} Unit</span>
            </div>

            {/* Pemenuhan FR-05: Eksekusi Keranjang */}
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}