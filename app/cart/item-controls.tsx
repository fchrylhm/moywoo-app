'use client'

import { useState } from "react"
import { updateCartItemQuantity, deleteCartItem } from "./action"
import { Plus, Minus, Trash2, Loader2 } from "lucide-react"

export default function ItemQuantityControls({ 
  itemId, 
  quantity 
}: { 
  itemId: string
  quantity: number 
}) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (newQty: number) => {
    setLoading(true)
    await updateCartItemQuantity(itemId, newQty)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteCartItem(itemId)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-moywoo-slate/40" />
      ) : (
        <>
          <div className="flex items-center border border-moywoo-slate/20 rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => handleUpdate(quantity - 1)}
              className="p-1.5 hover:bg-moywoo-slate/5 text-moywoo-slate transition-colors"
              aria-label="Kurangi kuantitas"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-moywoo-slate">
              {quantity}
            </span>
            <button
              onClick={() => handleUpdate(quantity + 1)}
              className="p-1.5 hover:bg-moywoo-slate/5 text-moywoo-slate transition-colors"
              aria-label="Tambah kuantitas"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}