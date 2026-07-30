'use client'

import { useState, ChangeEvent, FormEvent, useRef } from "react"
import { createProduct } from "./action"
import Link from "next/link"

// ============================================================================
// UTILITAS KOMPRESI GAMBAR (CLIENT-SIDE CANVAS API)
// ============================================================================
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  if (file.size <= 1024 * 1024) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Gagal membuat konteks canvas browser."));
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Gagal mengompres gambar."));
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    img.src = objectUrl;
  });
}

// ============================================================================
// TIPE DATA
// ============================================================================
type PreviewData = {
  productName: string
  price: string
  stock: string
  categoryName: string
  description: string
} | null

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================
export default function NewProductPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData>(null)
  const pendingFormDataRef = useRef<FormData | null>(null)

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setErrorMessage(null)

    if (!file) {
      setImagePreview(null)
      setCompressedFile(null)
      return
    }

    try {
      setIsCompressing(true)
      const optimizedFile = await compressImage(file)
      setCompressedFile(optimizedFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(optimizedFile)
    } catch (err: any) {
      console.error("Image Compression Error:", err)
      setErrorMessage("Gagal memproses gambar. Pastikan format file didukung.")
      setImagePreview(null)
      setCompressedFile(null)
    } finally {
      setIsCompressing(false)
    }
  }

  const handlePreSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    
    if (isCompressing) {
      setErrorMessage("Tunggu sebentar, gambar sedang diproses...")
      return
    }

    const formData = new FormData(e.currentTarget)
    
    if (compressedFile) {
      formData.set("image", compressedFile)
    }

    pendingFormDataRef.current = formData

    setPreviewData({
      productName: formData.get("productName") as string,
      price: formData.get("price") as string,
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
      await createProduct(pendingFormDataRef.current)
    } catch (error: any) {
      if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error
      }
      console.error("Form Submit Error:", error)
      setErrorMessage(error?.message || "Terjadi kesalahan saat menyimpan produk.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-12 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-zinc-100">Tambah Produk Baru</h1>
          <p className="text-zinc-500 text-sm">Lengkapi informasi detail produk untuk dipublikasikan.</p>
        </div>
        <Link
          href="/dashboard"
          replace
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 transition"
        >
          Kembali
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* FORM UTAMA */}
      <form onSubmit={handlePreSubmit} className="space-y-5">
        <fieldset disabled={isSubmitting || isCompressing} className="space-y-5 group-disabled:opacity-60 transition-opacity">
          
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
              Nama Produk <span className="text-red-500 font-bold" aria-hidden="true" title="Wajib diisi">*</span>
            </label>
            <input
              type="text"
              name="productName"
              required
              placeholder="Contoh: Basreng Pedas Daun Jeruk"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* GRID DIREVISI MENJADI 3 KOLOM UNTUK MENGAKOMODASI STOK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Harga (Rp) <span className="text-red-500 font-bold" aria-hidden="true" title="Wajib diisi">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                placeholder="15000"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Stok <span className="text-red-500 font-bold" aria-hidden="true" title="Wajib diisi">*</span>
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                placeholder="100"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Kategori <span className="text-red-500 font-bold" aria-hidden="true" title="Wajib diisi">*</span>
              </label>
              <select
                name="categoryName"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:cursor-not-allowed"
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Merchandise">Merchandise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Deskripsi Produk</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Jelaskan spesifikasi, varian rasa, atau detail produk..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Foto Produk
              </label>
              <span className="text-red-500 font-bold" aria-hidden="true" title="Wajib diisi">*</span>
            </div>
            
            <p className="text-xs text-zinc-500 mb-2">
              Unggah 1 foto terbaik untuk merepresentasikan produk Anda (Wajib).
            </p>

            <div className="relative group">
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className={`w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-200 disabled:cursor-not-allowed transition-all ${!imagePreview && !isCompressing ? 'outline-dashed outline-2 outline-red-200/50 hover:outline-red-300 rounded-lg p-1' : ''}`}
              />
            </div>
            
            {isCompressing && (
              <p className="text-xs text-[#E47632] font-medium mt-2 animate-pulse flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-[#E47632] border-t-transparent rounded-full animate-spin"></span>
                Memproses & mengoptimasi gambar...
              </p>
            )}

            {imagePreview && !isCompressing && (
              <div className="mt-3 relative w-32 h-32 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 group-hover:border-[#355872] transition-colors">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="w-full bg-[#355872] hover:bg-[#274256] text-white font-medium py-2.5 rounded-lg transition disabled:bg-[#355872]/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Memproses & Menyimpan...</span>
              </>
            ) : isCompressing ? (
              "Memproses Gambar..."
            ) : (
              "Simpan & Publikasikan"
            )}
          </button>
        </fieldset>
      </form>

      {/* MODAL KONFIRMASI (DI-UPDATE DENGAN DATA STOK) */}
      {showConfirmModal && previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Konfirmasi Publikasi Produk</h3>
              <p className="text-xs text-zinc-500 mt-1">Periksa kembali kebenaran data katalog sebelum dipublikasikan.</p>
            </div>

            <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-sm">
              {imagePreview && (
                <div className="w-full h-36 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 mb-3 bg-white dark:bg-zinc-800">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Nama</span>
                <span className="col-span-2 font-semibold text-zinc-900 dark:text-zinc-100">{previewData.productName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Harga</span>
                <span className="col-span-2 font-semibold text-blue-600 dark:text-blue-400">
                  Rp {Number(previewData.price || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-200/50 dark:border-zinc-700/50 pb-2">
                <span className="text-zinc-500 font-medium">Stok</span>
                <span className="col-span-2 font-semibold text-zinc-900 dark:text-zinc-100">{previewData.stock} Pcs</span>
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#E47632] hover:bg-[#c96222] rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Publikasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}