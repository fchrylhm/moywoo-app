"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Building2, Loader2 } from "lucide-react";
import { addToCart } from "@/app/action/cart"; 
import toast from "react-hot-toast"; // INJEKSI TOAST

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah klik tombol men-trigger Link pembungkus gambar
    setIsAdding(true);
    
    // Tampilkan loading state di UX
    const toastId = toast.loading("Memasukkan ke keranjang...");
    
    const result = await addToCart(product.id);
    
    if (result.success) {
      toast.success(`${product.productName} berhasil ditambahkan!`, { id: toastId });
    } else {
      toast.error(result.message || "Gagal mengunci stok.", { id: toastId });
    }
    
    setIsAdding(false);
  };

  return (
    <div className="group flex flex-col rounded-xl sm:rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
      
      <Link href={`/catalog/${product.id}`} className="relative aspect-square w-full bg-zinc-100 overflow-hidden block">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold text-zinc-700 shadow-sm">
            {product.categoryName}
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-3 sm:p-5">
        
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-zinc-500 mb-1.5 sm:mb-2">
          <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
          <span className="truncate">{product.sellerName}</span>
        </div>
        
        <Link href={`/catalog/${product.id}`} className="hover:text-[#E47632] transition-colors">
          <h3 className="text-xs sm:text-lg font-bold text-zinc-900 mb-1 leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.75rem]">
            {product.productName}
          </h3>
        </Link>
        
        <div className="mt-auto pt-2 sm:pt-4 flex items-end justify-between gap-1">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm text-zinc-500 mb-0.5 sm:mb-1">
              Sisa: <span className="font-semibold text-zinc-900">{product.stock}</span>
            </p>
            <p className="text-[#E47632] font-bold text-sm sm:text-xl truncate">{formattedPrice}</p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock < 1}
            className="p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-zinc-900 text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 flex-shrink-0"
            title="Tambah ke keranjang"
          >
            {isAdding ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}