import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mastera Platform - 创作者与粉丝的创意平台',
  description: '连接创作者与粉丝的创意平台，让每个人都能发现和分享精彩内容。支持多种内容类型、会员等级系统、积分奖励机制和社区互动功能。',
  keywords: '创作者平台, 内容分享, 社区互动, 积分系统, 会员等级, 创意内容',
  authors: [{ name: 'Mastera Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#BEF264',
  openGraph: {
    title: 'Mastera Platform - 创作者与粉丝的创意平台',
    description: '连接创作者与粉丝的创意平台，让每个人都能发现和分享精彩内容',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mastera Platform',
    description: '连接创作者与粉丝的创意平台',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
