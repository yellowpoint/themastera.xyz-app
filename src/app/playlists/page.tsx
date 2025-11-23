'use client'

import TopTabs from '@/components/TopTabs'

import React from 'react'

import MineTab from './MineTab'
import RecommendTab from './RecommendTab'

export default function PlaylistsPage() {
  const [activeTab, setActiveTab] = React.useState<'recommend' | 'mine'>(
    'recommend'
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top fixed tabs */}
      <TopTabs
        tabs={[
          { key: 'recommend', label: 'Recommend list' },
          { key: 'mine', label: 'My playlist' },
        ]}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'recommend' | 'mine')}
      />
      {activeTab === 'recommend' ? <RecommendTab /> : null}
      {activeTab === 'mine' ? <MineTab /> : null}
    </div>
  )
}
