import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const cookieStore = await cookies()
  const sellerId = cookieStore.get('seller_session')?.value

  // Jika belum login, paksa ke /login
  if (!sellerId) {
    redirect('/login')
  }

  // Jika sudah login, alihkan ke /dashboard
  redirect('/dashboard')
}