'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MagicCard } from '@/components/ui/magic-card'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

type AuthCardLayoutProps = {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export default function AuthCardLayout({
  title,
  description,
  children,
  className,
  contentClassName,
}: AuthCardLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className={cn('flex justify-center px-4', className)}>
      <Card className="w-full max-w-sm border-none p-0 shadow-none">
        <MagicCard
          gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
          className="p-0"
        >
          <CardHeader className="border-border border-b p-4 [.border-b]:pb-4">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={cn('p-4', contentClassName)}>
            {children}
          </CardContent>
        </MagicCard>
      </Card>
    </div>
  )
}
