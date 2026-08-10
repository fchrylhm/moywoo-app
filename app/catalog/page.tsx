import React from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar"; 

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CatalogPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q;
  const searchQuery = typeof q === 'string' ? q : "";

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(searchQuery && {
        productName: {
          contains: searchQuery,
          mode: "insensitive", 
        },
      }),
    },
    include: {
      category: true,
      seller: {
        select: {
          organizationName: true,
        },
      },
      images: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-12 space-y-6 sm:space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Katalog Produk</h1>
          <p className="text-sm sm:text-base text-zinc-500 mt-1">Dukung kegiatan organisasi mahasiswa lewat setiap pembelian.</p>
        </div>

        <SearchBar />
      </div>

      {/* INDIKATOR STATUS PENCARIAN */}
      {searchQuery && (
        <div className="text-sm font-medium text-zinc-500 pb-2 border-b border-zinc-100">
          Menampilkan hasil pencarian untuk: <span className="font-bold text-zinc-900">"{searchQuery}"</span>
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-zinc-200 rounded-3xl border-dashed">
          <p className="text-xl font-semibold text-zinc-900 mb-2">Produk tidak ditemukan</p>
          <p className="text-zinc-500 mb-4 text-sm sm:text-base">Tidak ada produk yang cocok dengan kata kunci "{searchQuery}".</p>
        </div>
      ) : (
        // EKSEKUSI GRID 2 KOLOM (Mobile) ke 4/5 KOLOM (Desktop)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                productName: product.productName,
                price: Number(product.price),
                stock: product.stock,
                sellerName: product.seller.organizationName,
                categoryName: product.category.categoryName,
                imageUrl: product.images[0]?.imageUrl || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}