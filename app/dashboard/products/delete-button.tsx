'use client'

import { useState, useTransition } from "react"
import { deleteProduct } from "./action"

type DeleteButtonProps = {
  id: string
  productName: string
}

export default function DeleteProductButton({ id, productName }: DeleteButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = () => {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await deleteProduct(id)
        setShowModal(false)
      } catch (error) {
        console.error("Gagal menghapus produk:", error)
        setErrorMessage("Gagal menghapus produk. Silakan coba lagi.")
      }
    })
  }

  return (
    <>
      {/* Tombol Pemicu di Tabel */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 rounded border border-red-200 dark:border-red-800 transition cursor-pointer"
        title="Hapus produk ini secara permanen"
      >
        Hapus
      </button>

      {/* Pop-up Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left font-normal whitespace-normal">
            
            {/* Header Modal */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-full shrink-0 mt-0.5 border border-red-200 dark:border-red-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Hapus Produk Permanen?
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Anda yakin ingin menghapus <strong className="text-zinc-800 dark:text-zinc-200">{productName}</strong>? Tindakan ini akan menghapus data beserta relasi gambarnya dan tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            {/* Error Message Feedback */}
            {errorMessage && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm flex items-center gap-1.5 disabled:bg-red-500/50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  "Ya, Hapus Produk"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}