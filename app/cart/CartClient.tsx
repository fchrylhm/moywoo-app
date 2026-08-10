"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, Loader2, ShoppingCart, AlertTriangle, Info } from "lucide-react";
import { updateItemQuantity, removeCartItem, simulateCheckout } from "@/app/action/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast"; // INJEKSI TOAST

type SerializedCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    productName: string;
    price: number;
    stock: number;
    sellerName: string;
    imageUrl: string | null;
  };
};

export default function CartClient({ initialItems }: { initialItems: SerializedCartItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // STATE UNTUK MODAL PROFESIONAL
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  const router = useRouter();

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const handleUpdateQuantity = async (id: string, currentQty: number, change: number, maxStock: number) => {
    const newQty = currentQty + change;
    if (newQty < 1 || newQty > maxStock) return;

    setLoadingId(id);
    const res = await updateItemQuantity(id, newQty);
    if (!res.success) toast.error(res.message || "Gagal memperbarui jumlah barang.");
    setLoadingId(null);
  };

  // REVISI: Membuka Modal Hapus, bukan confirm bawaan
  const triggerRemove = (id: string) => {
    setItemToDelete(id);
  };

  // REVISI: Logika Eksekusi Hapus yang sesungguhnya
  const confirmRemove = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;
    
    setItemToDelete(null); // Tutup modal langsung
    setLoadingId(id);
    const toastId = toast.loading("Menghapus produk...");
    
    const res = await removeCartItem(id);
    if (res.success) {
      toast.success("Produk dihapus dari keranjang.", { id: toastId });
    } else {
      toast.error(res.message || "Gagal menghapus produk.", { id: toastId });
    }
    setLoadingId(null);
  };

  // REVISI: Membuka Modal Checkout
  const triggerCheckout = () => {
    setShowCheckoutModal(true);
  };

  // REVISI: Logika Eksekusi Checkout yang sesungguhnya
  const confirmCheckout = async () => {
    setShowCheckoutModal(false); // Tutup modal
    setIsCheckingOut(true);
    
    const toastId = toast.loading("Memproses pesanan...");
    const res = await simulateCheckout();
    
    if (res.success) {
      toast.success("Pesanan berhasil diproses!", { id: toastId });
      router.push("/checkout-success"); 
    } else {
      toast.error(res.message || "Gagal memproses pesanan.", { id: toastId });
      setIsCheckingOut(false);
    }
  };

  const subtotal = initialItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Mencari nama produk yang akan dihapus untuk ditampilkan di Modal
  const productToDelete = initialItems.find(i => i.id === itemToDelete)?.product.productName;

  // Status Kosong
  if (initialItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white border border-zinc-100 rounded-3xl shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-zinc-300" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Keranjang masih kosong</h2>
        <p className="text-zinc-500 mb-8 max-w-md">
          Sepertinya Anda belum menemukan produk yang pas. Mari jelajahi katalog untuk mendukung organisasi kampus.
        </p>
        <Link 
          href="/catalog"
          className="px-8 py-3.5 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Daftar Produk (Kiri) */}
        <div className="flex-grow space-y-4">
          {initialItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white p-5 rounded-3xl border border-zinc-200/60 shadow-sm relative group transition-all hover:shadow-md"
            >
              {loadingId === item.id && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-3xl">
                  <Loader2 className="h-8 w-8 animate-spin text-[#E47632]" />
                </div>
              )}
              
              {/* Gambar Produk */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
                {item.product.imageUrl ? (
                  <Image src={item.product.imageUrl} alt={item.product.productName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium">No Image</div>
                )}
              </div>

              {/* Detail Produk & Kontrol */}
              <div className="flex flex-col flex-grow justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">{item.product.sellerName}</p>
                    <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-2">{item.product.productName}</h3>
                    <p className="text-[#E47632] font-bold text-lg">{formatRupiah(item.product.price)}</p>
                  </div>
                  
                  {/* Tombol Hapus: Sekarang memanggil modal, bukan window.confirm */}
                  <button 
                    onClick={() => triggerRemove(item.id)}
                    disabled={isCheckingOut || loadingId === item.id}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                    title="Hapus produk"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Kontrol Kuantitas */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="text-sm text-zinc-500 hidden sm:block">Jumlah:</span>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-full overflow-hidden p-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, item.product.stock)}
                      disabled={item.quantity <= 1 || isCheckingOut || loadingId === item.id}
                      className="p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-zinc-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-zinc-900">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, item.product.stock)}
                      disabled={item.quantity >= item.product.stock || isCheckingOut || loadingId === item.id}
                      className="p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-zinc-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan Pesanan */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/60 shadow-sm sticky top-28">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6 text-sm text-zinc-600">
              <div className="flex justify-between items-center">
                <span>Total Harga ({initialItems.reduce((acc, item) => acc + item.quantity, 0)} barang)</span>
                <span className="font-medium text-zinc-900">{formatRupiah(subtotal)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 pt-6 border-t border-zinc-100">
              <span className="text-zinc-900 font-medium">Subtotal</span>
              <span className="font-extrabold text-2xl text-zinc-900">{formatRupiah(subtotal)}</span>
            </div>

            {/* Tombol Pesan: Sekarang memanggil modal konfirmasi */}
            <button 
              onClick={triggerCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 rounded-full bg-[#E47632] text-white font-bold text-lg flex justify-center items-center gap-2 hover:bg-[#d0672a] hover:shadow-[0_8px_20px_-6px_rgba(228,118,50,0.4)] hover:-translate-y-0.5 transition-all disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
                </>
              ) : (
                "Proses Pesanan"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL: KONFIRMASI HAPUS PRODUK            */}
      {/* ========================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-50 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Hapus Produk Permanen?</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Anda yakin ingin menghapus <span className="font-bold text-zinc-900">{productToDelete}</span> dari keranjang? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmRemove}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL: KONFIRMASI CHECKOUT                */}
      {/* ========================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Konfirmasi Pemrosesan</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Apakah Anda yakin ingin memproses transaksi ini? Tindakan ini akan mengunci stok inventaris dari pihak penyelenggara dan pesanan tidak dapat dibatalkan secara sepihak.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Periksa Kembali
              </button>
              <button 
                onClick={confirmCheckout}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#E47632] hover:bg-[#d0672a] rounded-xl shadow-sm transition-colors"
              >
                Ya, Proses Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}