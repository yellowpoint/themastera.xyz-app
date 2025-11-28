'use client'
import AuthRequired from '@/components/auth-required'
import HomeAllTab from '@/components/HomeAllTab'
import TopTabs from '@/components/TopTabs'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const SubscriptionsPageLazy = dynamic(
  () => import('@/app/subscriptions/page'),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm text-muted-foreground text-center">
        Loading...
      </div>
    ),
  }
)
const WatchHistoryPageLazy = dynamic(() => import('@/app/history/page'), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-muted-foreground text-center">Loading...</div>
  ),
})

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    'All' | 'Subscriptions' | 'History'
  >('All')
  const tabList = [
    { key: 'All', label: 'All', content: <HomeAllTab /> },
    {
      key: 'Subscriptions',
      label: 'Subscriptions',
      content: (
        <AuthRequired enabled>
          <SubscriptionsPageLazy />
        </AuthRequired>
      ),
    },
    {
      key: 'History',
      label: 'History',
      content: (
        <AuthRequired enabled>
          <WatchHistoryPageLazy />
        </AuthRequired>
      ),
    },
  ]
  return (
    <TopTabs
      tabs={tabList as any}
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key as any)}
      contentClassName="px-4 py-4 h-full"
    />
  )
}
