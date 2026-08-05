'use client'

import { useState, ChangeEvent, FormEvent, useRef } from "react"
import { updateProduct } from "./action"
import Link from "next/link"

type EditFormProps = {
  initialData: {
    id: string
    productName: string
    price: number
    stock: number 
    description: string
    categoryName: string
    imageUrl: string
  }
}

type PreviewData = {
  productName: string
  price: string
  stock: string 
  categoryName: string
  description: string
} | null

export default function EditProductForm({ initialData }: EditFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData>(null)
  const pendingFormDataRef = useRef<FormData | null>(null)

  // INJEKSI UX: State inisialisasi dari initialData.price ke string dengan format ribuan
  const [priceDisplay, setPriceDisplay] = useState(
    initialData.price ? initialData.price.toLocaleString("id-ID") : ""
  )

  // INJEKSI UX: Handler format
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    if (!rawValue) {
      setPriceDisplay("")
      return
    }
    const formatted = Number(rawValue).toLocaleString("id-ID")
    setPriceDisplay(formatted)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(initialData.imageUrl)
    }
  }

  const handlePreSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    pendingFormDataRef.current = formData

    setPreviewData({
      productName: formData.get("productName") as string,
      price: formData.get("price") as string, // Tetap mengambil hidden input murni
      stock: formData.get("stock") as string, 
      categoryName: formData.get("categoryName") as string,
      description: (formData.get("description") as string) || "Tidak ada deskripsi yang dilampirkan.",
    })

    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    if (!pendingFormDataRef.current) return

    setIsSubmitting(true)
    setShowConfirmModal(false)

    try {
      await updateProduct(initialData.id, pendingFormDataRef.current)
    } catch (error: any) {
      if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error
      }
      console.error("Form Update Error:", error)
      setErrorMessage(error?.message || "Terjadi kesalahan saat memperbarui produk.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm relative">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-zinc-100">Edit Produk</h1>
          <p className="text-zinc-500 text-sm">Perbarui spesifikasi atau harga katalog Anda.</p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 transition"
        >
          Batal
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePreSubmit} className="space-y-5">
        <fieldset disabled={isSubmitting} className="space-y-5 group-disabled:opacity-60 transition-opacity">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <input
              type="text"
              name="productName"
              required
              defaultValue={initialData.productName}
              placeholder="Contoh: Basreng Pedas Daun Jeruk"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
              {/* SHADOW INPUT TECHNIQUE */}
              <input
                type="text"
                value={priceDisplay}
                onChange={handlePriceChange}
                required
                placeholder="15.000"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 disabled:cursor-not-allowed"
              />
              <input 
                type="hidden" 
                name="price" 
                value={priceDisplay.replace(/\D/g, "")} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stok Fisik</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                defaultValue={initialData.stock}
                placeholder="100"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                name="categoryName"
                defaultValue={initialData.categoryName}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 disabled:cursor-not-allowed"
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Merchandise">Merchandise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Produk</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={initialData.description}
              placeholder="Jelaskan spesifikasi, varian rasa, atau detail produk..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Foto Produk</label>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                *Opsional: Kosongkan jika tidak mengganti foto
              </span>
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-200 disabled:cursor-not-allowed"
            />
            {imagePreview && (
              <div className="mt-3 relative w-32 h-32 border rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg transition disabled:bg-amber-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Memperbarui Katalog...</span>
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </fieldset>
      </form>

      {showConfirmModal && previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Konfirmasi Perubahan</h3>
              <p className="text-xs text-zinc-500 mt-1">Periksa kembali pembaruan data sebelum disimpan.</p>
            </div>

            <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-sm">
              {imagePreview && (
                <div className="w-full h-36 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 mb-3 bg-white dark:bg-zinc-800">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Nama Produk</span>
                <span className="col-span-2 font-semibold text-zinc-900 dark:text-zinc-100">{previewData.productName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Harga & Stok</span>
                <span className="col-span-2 font-semibold text-amber-600 dark:text-amber-400">
                  Rp {Number(previewData.price || 0).toLocaleString("id-ID")} <span className="text-zinc-400 font-normal mx-1">|</span> Stok: {previewData.stock}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Kategori</span>
                <span className="col-span-2 font-semibold text-zinc-900 dark:text-zinc-100">{previewData.categoryName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <span className="text-zinc-500 font-medium">Deskripsi</span>
                <p className="col-span-2 text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed line-clamp-3">
                  {previewData.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition cursor-pointer"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}