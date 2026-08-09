"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { addToCart } from "@/app/action/cart"; 
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (stock < 1) return;
    
    setIsPending(true);
    const result = await addToCart(productId, 1);
    setIsPending(false);

    if (result.success) {
      router.refresh(); 
      router.push("/cart");
    } else {
      alert(result.message);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || stock < 1}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all ${
        stock < 1
          ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none"
          : "bg-[#E47632] text-white hover:bg-[#c96222] shadow-[0_8px_20px_-6px_rgba(228,118,50,0.4)] hover:-translate-y-0.5 active:scale-95"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <ShoppingCart className="w-6 h-6" />
      )}
      {stock < 1 ? "Stok Habis Terjual" : isPending ? "Memproses Pesanan..." : "Tambah ke Keranjang"}
    </button>
  );
}