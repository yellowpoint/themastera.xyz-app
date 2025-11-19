'use client'

import Header from '@/components/Header'
import AuthRequired from '@/components/auth-required'
import { usePathname } from 'next/navigation'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = pathname?.startsWith('/content/')

  return (
    <div className="flex flex-col h-screen">
      {!hideHeader && <Header />}
      {/* border-t-4 border-l-4 border-secondary */}
      <div className={`flex-1 h-full ${!hideHeader ? 'mt-16' : 'pt-6'}`}>
        <AuthRequired>{children}</AuthRequired>
      </div>
    </div>
  )
}
