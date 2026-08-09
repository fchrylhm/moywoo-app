import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Building2, Tag, ArrowLeft, ShieldCheck, CreditCard, Share2, Heart } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";

// 1. KOREKSI STRUKTURAL: Ubah tipe params menjadi Promise
interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // 2. RESOLVE PROMISE: Ekstrak ID setelah Promise diselesaikan
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 3. INJEKSI ID: Gunakan productId yang sudah valid ke dalam kueri Prisma
  const product = await prisma.product.findUnique({
    where: { id: productId },
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

  if (!product) notFound();

  const defaultImage = product.images[0]?.imageUrl || "/placeholder-image.jpg";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-24">
        
        {/* Navigasi Kembali */}
        <Link 
          href="/catalog" 
          className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* KOLOM KIRI: Visual Produk (Porsi 7 kolom) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#F7F8F0] rounded-3xl overflow-hidden relative aspect-[4/3] lg:aspect-square flex items-center justify-center border border-zinc-100">
              <Image
                src={defaultImage}
                alt={product.productName}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            {/* Ruang untuk thumbnail galeri di masa depan */}
          </div>

          {/* KOLOM KANAN: Informasi & CTA (Porsi 5 kolom) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Header Informasi */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">
                Official Merchandise
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight leading-tight">
                {product.productName}
              </h1>
              <div className="text-3xl font-extrabold text-[#E47632] mb-4">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                <Tag className="w-4 h-4" />
                <span>Kategori: {product.category.categoryName}</span>
              </div>
            </div>

            {/* Kartu Profil Penyelenggara (Sesuai Wireframe) */}
            <div className="flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 rounded-2xl mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Diselenggarakan Oleh
                  </span>
                  <span className="text-base font-bold text-zinc-900">
                    {product.seller.organizationName}
                  </span>
                </div>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View Profile
              </button>
            </div>

            {/* Deskripsi */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Deskripsi Produk</h3>
              <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                {product.description || "Tidak ada deskripsi rinci untuk produk ini. Silakan hubungi pihak penyelenggara untuk informasi lebih lanjut."}
              </p>
            </div>

            {/* Eksekusi & Trust Badges */}
            <div className="flex flex-col gap-6 mt-auto">
              <div className="flex items-center justify-between text-sm font-medium text-zinc-500 px-1">
                <span>Sisa kuota pemesanan:</span>
                <span className="text-zinc-900 font-bold">{product.stock} Unit</span>
              </div>

              {/* Komponen Client Action */}
              <AddToCartButton productId={product.id} stock={product.stock} />

              {/* Dummy Aksi Ekstra */}
              <div className="flex items-center justify-center gap-8 py-2 border-b border-zinc-100 pb-8">
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Share2 className="w-4 h-4" /> Bagikan
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Heart className="w-4 h-4" /> Simpan
                </button>
              </div>

              {/* Trust Badges (Sesuai Wireframe) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center gap-2 p-4 border border-zinc-200 rounded-2xl text-center">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-bold text-zinc-900">Inisiatif Mahasiswa Terverifikasi</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-4 border border-zinc-200 rounded-2xl text-center">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <span className="text-xs font-bold text-zinc-900">Pembayaran Terpusat & Aman</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}