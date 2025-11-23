'use client'
import WatchHistoryPage from '@/app/history/page'
import SubscriptionsPage from '@/app/subscriptions/page'
import AuthRequired from '@/components/auth-required'
import HomeAllTab from '@/components/HomeAllTab'
import TopTabs from '@/components/TopTabs'
import { useState } from 'react'

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
          <SubscriptionsPage />
        </AuthRequired>
      ),
    },
    {
      key: 'History',
      label: 'History',
      content: (
        <AuthRequired enabled>
          <WatchHistoryPage />
        </AuthRequired>
      ),
    },
  ]
  return (
    <div className="mux-player-controls-none h-full">
      <TopTabs
        tabs={tabList as any}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as any)}
        contentClassName="px-4 py-4 h-full"
      />
    </div>
  )
}
