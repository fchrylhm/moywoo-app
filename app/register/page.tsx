'use client'

import { useState } from "react"
// router tidak lagi wajib digunakan untuk redirect ini, tapi Link tetap pakai next/link
import Link from "next/link"
import { registerSeller } from "./action"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await registerSeller(formData)

      if (!result.success) {
        setError(result.error || "Gagal mendaftarkan akun.")
        setLoading(false)
      } else {
        // PERBAIKAN DI SINI:
        // Gunakan Hard Navigation untuk memutus state loading React & memaksa halaman pindah bersih ke /login
        window.location.href = '/login'
      }
    } catch (err) {
      console.error("Register error:", err)
      setError("Terjadi kesalahan sistem internal.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100">
          Daftar Akun Organisasi
        </h1>
        <p className="text-sm text-center text-zinc-500 mb-6">
          Mulai kelola usaha danusan organisasi kamu di Moywoo
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md">
            {error}
          </div>
        )}

        <form method="POST" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Budi Santoso"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nama Organisasi
            </label>
            <input
              type="text"
              name="organizationName"
              required
              placeholder="HIMATIF"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          Sudah memiliki akun?{" "}
          <Link 
            href="/login" 
            className="text-blue-600 hover:underline font-semibold"
          >
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  )
}