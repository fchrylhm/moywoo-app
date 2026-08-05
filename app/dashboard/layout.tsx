// app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Validasi Sesi NextAuth
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/seller/login") // Arahkan ke portal organisasi
  }

  // 2. Tarik Data Seller
  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email },
    select: {
      fullName: true,
      organizationName: true,
      email: true,
    },
  })

  if (!seller) {
    redirect("/seller/login")
  }

  // 3. Render Cangkang Dashboard & Sidebar
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F7F8F0] dark:bg-zinc-950 font-sans">
      <DashboardSidebar seller={seller} />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative w-full h-full">
        <div className="w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}