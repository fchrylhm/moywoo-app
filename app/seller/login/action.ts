'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginSeller(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' }
    }

    // 1. Cari seller di database
    const seller = await prisma.seller.findUnique({
      where: { email },
    })

    if (!seller) {
      return { success: false, error: 'Email atau kata sandi tidak ditemukan.' }
    }

    // 2. Verifikasi kata sandi
    if (seller.password !== password) {
      return { success: false, error: 'Email atau kata sandi salah.' }
    }

    // 3. Set Cookie Sesi (DIPERBAIKI: Gunakan 'seller_session' agar sinkron dengan dashboard)
    const cookieStore = await cookies()
    cookieStore.set('seller_session', seller.id, { httpOnly: true, path: '/' })

    return { success: true }
  } catch (error: any) {
    console.error('Login Server Error:', error)
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan pada server.',
    }
  }
}

// FUNGSI INI DIBUTUHKAN OLEH app/dashboard/page.tsx
// DIPERBAIKI: Menerima parameter opsional FormData dan menggunakan redirect() agar sesuai standar tipe React Form
export async function logoutSeller(_formData?: FormData) {
  const cookieStore = await cookies()
  cookieStore.delete('seller_session')
  redirect('/login')
}