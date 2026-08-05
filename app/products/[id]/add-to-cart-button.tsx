'use client'

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "./action" // Import disesuaikan dengan nama file di sidebar
import { useRouter } from "next/navigation"

export default function AddToCartButton({ 
  productId, 
  stock 
}: { 
  productId: string, 
  stock: number 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const result = await addToCart(productId, 1) 
      
      // Validasi ketat untuk menenangkan TypeScript
      if (result?.error) {
        alert(result.error)
      } else if (result?.success) {
        router.push('/cart')
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem di luar dugaan.")
    } finally {
      setIsLoading(false)
    }
  }

  if (stock <= 0) {
    return (
      <button disabled className="w-full py-4 rounded-xl font-bold text-gray-400 bg-gray-200 cursor-not-allowed text-lg shadow-md flex justify-center items-center gap-2">
        Stok Habis
      </button>
    )
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`w-full text-white px-8 py-4 rounded-xl transition-all font-bold text-lg shadow-md hover:shadow-lg flex justify-center items-center gap-2 
        ${isLoading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {isLoading ? "Memproses..." : "🛒 Order Now"}
    </button>
  )
}