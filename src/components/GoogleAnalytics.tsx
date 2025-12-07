'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    // 1. 检查是否在生产环境
    // if (process.env.NODE_ENV !== 'production') {
    //   return
    // }

    // 2. 检查网络连通性
    const checkConnectivity = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

        // 尝试请求 GA 脚本地址 (使用 no-cors 模式，仅检测网络层面的可达性)
        // 改用 GET 请求，避免某些环境不支持 HEAD
        // await fetch(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, {
        //   method: 'GET',
        //   mode: 'no-cors',
        //   signal: controller.signal,
        // })

        await fetch('https://www.google-analytics.com', {
          method: 'HEAD',
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        setIsAllowed(true)
      } catch (error) {
        // 网络不可达（如被屏蔽），静默失败，不加载脚本
        console.warn('Google Analytics unreachable, skipping.')
      }
    }

    // 延迟一点执行，优先保证首屏关键资源加载
    const timer = setTimeout(checkConnectivity, 1000)

    return () => clearTimeout(timer)
  }, [gaId])

  if (!isAllowed) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onError={(e) => {
          console.warn('GA Script failed to load', e)
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
