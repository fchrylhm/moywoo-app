import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Ekstraksi Autentikasi Sesi
  const cookieStore = await cookies()
  const sellerId = cookieStore.get("seller_session")?.value

  if (!sellerId) {
    redirect("/login")
  }

  // 2. Tarik Data Seller Berdasarkan Sesi Aktif
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    select: {
      fullName: true,
      organizationName: true,
      email: true,
    },
  })

  // Proteksi ganda jika ID dari cookie tidak valid / terhapus di database
  if (!seller) {
    redirect("/login")
  }

  // 3. Render Struktur App Shell
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F7F8F0] dark:bg-zinc-950 font-sans">
      {/* Sidebar Injeksi: Menangani navigasi dan Mobile Drawer */}
      <DashboardSidebar seller={seller} />
      
      {/* Area Workspace Konten Utama */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative w-full h-full">
        <div className="w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}