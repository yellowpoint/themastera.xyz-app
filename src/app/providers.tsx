'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lightModePaths = ['/creator', '/user', '/admin']
  const isLightModePath =
    lightModePaths.some((p) => pathname?.startsWith(p)) ?? false

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme={isLightModePath ? 'light' : 'dark'}
      enableSystem={false}
    >
      <AuthProvider>
        <Toaster
          position="top-center"
          theme={isLightModePath ? 'light' : 'dark'}
        />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
