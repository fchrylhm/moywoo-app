'use client'

import { useState } from "react"
import { checkoutSellerGroup } from "./action"
import { MessageSquare, Loader2 } from "lucide-react"

export default function SellerCheckoutButton({ 
  sellerId, 
  sellerName 
}: { 
  sellerId: string
  sellerName: string 
}) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await checkoutSellerGroup(sellerId)

      if (res.error) {
        alert(res.error)
      } else if (res.waLink) {
        // Buka link WhatsApp di tab baru
        window.open(res.waLink, '_blank')
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Memproses Pesanan...
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4" />
          Checkout via WhatsApp ({sellerName})
        </>
      )}
    </button>
  )
}