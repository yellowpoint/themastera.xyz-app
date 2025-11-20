'use client'

import Header from '@/components/Header'
import AuthRequired from '@/components/auth-required'
import { usePathname } from 'next/navigation'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = pathname?.startsWith('/content/')

  return (
    <div className="flex flex-col h-screen">
      <img
        src="/bg.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/30 backdrop-blur-md" />
      <div className="relative z-20">{!hideHeader && <Header />}</div>
      {/* border-t-4 border-l-4 border-secondary */}
      <div
        className={`flex-1 h-full ${!hideHeader ? 'mt-16' : 'pt-6'} relative z-30`}
      >
        <AuthRequired>{children}</AuthRequired>
      </div>
    </div>
  )
}
