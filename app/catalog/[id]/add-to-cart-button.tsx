"use client";

import React, { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
// KOREKSI: Path import disesuaikan menjadi /action/ (tanpa 's')
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
      // Refresh router untuk memastikan state keranjang di Navbar/halaman terbaru
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
      className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
        stock < 1
          ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
          : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingBag className="w-5 h-5" />
      )}
      {stock < 1 ? "Stok Habis" : isPending ? "Memproses..." : "Tambah ke Keranjang"}
    </button>
  );
}