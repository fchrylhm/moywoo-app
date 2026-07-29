'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logoutSeller } from '@/app/login/action'

// Definisi Tipe Data Props
interface SidebarProps {
  seller: {
    fullName: string
    organizationName: string
    email: string
  }
}

// Konfigurasi Navigasi Menu
const menuItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    name: 'Katalog Produk',
    href: '/dashboard/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    name: 'Transaksi (Segera)',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
]

export default function DashboardSidebar({ seller }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      {/* =========================================================
          A. MOBILE TOPBAR (Muncul di layar HP < 768px)
         ========================================================= */}
      <header className="md:hidden flex items-center justify-between bg-[#355872] p-4 border-b border-[#355872]/80 shrink-0">
        <div className="flex items-center gap-3 text-[#F7F8F0]">
          <div className="w-8 h-8 rounded bg-[#E47632] flex items-center justify-center font-bold text-sm">
            {seller.organizationName.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-lg tracking-tight truncate max-w-[200px]">
            {seller.organizationName}
          </span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="text-[#F7F8F0] hover:text-[#A0D6FE] focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* =========================================================
          B. BACKDROP MOBILE OVERLAY
         ========================================================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* =========================================================
          C. SIDEBAR UTAMA (Desktop: Static, Mobile: Absolute Slide-over)
         ========================================================= */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#355872] flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header Logo Sidebar */}
        <div className="p-6 flex items-center justify-between md:block">
          <div>
            <h2 className="text-2xl font-black text-[#F7F8F0] tracking-tight">MOYWOO</h2>
            <p className="text-xs text-[#A0D6FE] font-medium tracking-wide mt-1 uppercase">Merchant Center</p>
          </div>
          <button onClick={closeMobileMenu} className="md:hidden text-[#F7F8F0] hover:text-[#E47632]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profil Merchant */}
        <div className="px-6 py-4 mb-4 border-y border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#E47632] flex items-center justify-center font-bold text-white text-lg shrink-0">
              {seller.organizationName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F7F8F0] truncate">{seller.organizationName}</p>
              <p className="text-xs text-[#A0D6FE] truncate mt-0.5">{seller.fullName}</p>
            </div>
          </div>
        </div>

{/* Navigasi Utama */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-[#A0D6FE]/70 uppercase tracking-wider mb-3 px-2 mt-4">Menu Utama</div>
          {menuItems.map((item) => {
            
            // KOREKSI LOGIKA ACTIVE STATE:
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' // Jika Overview, URL harus persis '/dashboard'
              : pathname.startsWith(item.href) // Jika menu lain, bisa toleransi sub-path

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-[#E47632] text-white shadow-md' 
                    : 'text-[#F7F8F0]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Area Footer Sidebar & Logout */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <form action={logoutSeller}>
            <button 
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}