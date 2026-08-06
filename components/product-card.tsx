"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Building2, Loader2 } from "lucide-react";
// Import Server Action yang baru dibuat
import { addToCart } from "@/app/action/cart"; 

interface ProductProps {
  id: string;
  productName: string;
  price: number;
  stock: number;
  sellerName: string;
  categoryName: string;
  imageUrl: string | null;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isAdding, setIsAdding] = useState(false);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Panggil Server Action
    const result = await addToCart(product.id);
    
    if (result.success) {
      // Jika butuh lebih estetik nanti, ganti alert ini dengan komponen Toast
      alert(`${product.productName} berhasil ditambahkan!`);
    } else {
      alert(`Gagal: ${result.message}`);
    }

    setIsAdding(false);
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
      <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            <ShoppingBag className="h-12 w-12 opacity-20" />
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm">
            {product.categoryName}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
          <Building2 className="h-3.5 w-3.5" />
          <span className="truncate">{product.sellerName}</span>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 mb-1 leading-tight line-clamp-2">
          {product.productName}
        </h3>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-500 mb-1">
              Sisa stok: <span className="font-semibold">{product.stock}</span>
            </p>
            <p className="text-[#E47632] font-bold text-xl">{formattedPrice}</p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock < 1}
            // Ubah sedikit styling saat disabled agar transisi button mulus
            className="p-3 rounded-xl bg-zinc-900 text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:active:scale-100 flex items-center justify-center"
            aria-label="Tambah ke keranjang"
          >
            {isAdding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShoppingBag className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}