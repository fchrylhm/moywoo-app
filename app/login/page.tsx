'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loginSeller } from './action'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await loginSeller(formData)

      if (res && res.success) {
        // Eksekusi redirect penuh ke dashboard
        window.location.href = '/dashboard'
      } else {
        setError(res?.error || 'Email atau kata sandi salah.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Submit Error:', err)
      setError('Terjadi kesalahan koneksi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100">
          Masuk Akun Organisasi
        </h1>
        <p className="text-sm text-center text-zinc-500 mb-6">
          Mulai kelola usaha danusan organisasi kamu di Moywoo
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Organisasi
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="budi@student.ac.id"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          Belum memiliki akun?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}