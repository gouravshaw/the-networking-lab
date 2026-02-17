'use client'

import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-gray-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold gradient-text">Admin</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 rounded-lg px-3 py-1.5"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
