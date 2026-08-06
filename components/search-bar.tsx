"use client"; // Deklarasi mutlak untuk interaktivitas sisi klien

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Membaca status URL saat ini untuk dijadikan nilai awal
  const currentQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  // Fungsi utama untuk mendorong parameter pencarian ke URL
  const executeSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    // router.replace mencegah penumpukan histori browser berlebihan 
    // jika kita mengimplementasikan auto-search nantinya
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Menangani submit via tombol Enter atau klik tombol Cari
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  // Menangani pembersihan teks (Tombol X)
  const handleClear = () => {
    setSearchTerm("");
    executeSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:w-[28rem] flex gap-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari produk usaha dana..."
          className="block w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E47632] focus:border-[#E47632] sm:text-sm transition-all"
        />
        
        {/* Tombol X hanya muncul jika ada teks di dalam kolom */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tombol Cari Eksplisit untuk interaksi seluler/mouse */}
      <button
        type="submit"
        className="px-4 py-2.5 bg-[#E47632] text-white text-sm font-semibold rounded-xl hover:bg-[#d0672a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E47632] transition-colors"
      >
        Cari
      </button>
    </form>
  );
}