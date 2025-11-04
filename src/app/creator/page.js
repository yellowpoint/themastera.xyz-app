'use client'

import { useState, useEffect } from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// shadcn/ui components
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableWithPagination, DataTable } from '@/components/ui/data-table'
import { useCreatorColumns } from './columns'



export default function CreatorPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, deleteWork } = useWorks()

  // State
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  // Pagination moved to DataTable (TanStack) per shadcn docs

  // Columns for DataTable - must be called unconditionally (Rules of Hooks)
  const columns = useCreatorColumns()


  // Filter works based on search and visibility
  const filteredWorks = [...works, ...works, ...works, ...works, ...works, ...works, ...works, ...works, ...works, ...works,].filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVisibility = visibilityFilter === 'all' || work.status === visibilityFilter
    return matchesSearch && matchesVisibility
  })



  // formatters moved to shared module

  // Handle delete work
  const handleDeleteWork = async (workId) => {
    if (!confirm('Are you sure you want to delete this work?')) return

    try {
      await deleteWork(workId)
      toast.success('Work deleted successfully!')
    } catch (error) {
      console.error('Error deleting work:', error)
      toast.error('Failed to delete work')
    }
  }

  // Auth handling unified in root layout via AuthRequired

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-2xl font-normal">Dashboard</h1>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-0">
            <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start h-auto p-0 space-x-9">
              <TabsTrigger
                value="overview"
                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 px-0 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-[#422A71] data-[state=active]:text-[#2C2A29] text-[#8F9192]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 px-0 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-[#422A71] data-[state=active]:text-[#2C2A29] text-[#8F9192]"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="musics"
                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 px-0 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-[#422A71] data-[state=active]:text-[#2C2A29] text-[#8F9192]"
              >
                Musics
              </TabsTrigger>
              <TabsTrigger
                value="podcasts"
                className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-2 px-0 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-1 data-[state=active]:after:bg-[#422A71] data-[state=active]:text-[#2C2A29] text-[#8F9192]"
              >
                podcasts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-0">
              <div className="px-8 py-6 space-y-6">
                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for video name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-gray-300"
                    />
                  </div>
                  <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                    <SelectTrigger className="w-40 border-gray-300">
                      <SelectValue placeholder="All visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All visibility</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Table (TanStack + shadcn) with doc-style pagination */}
                <DataTableWithPagination
                  columns={columns}
                  data={filteredWorks}
                // pageSizeOptions={[5, 10, 20, 50]}
                />

                {/* Pagination handled by DataTableWithPagination per docs */}
              </div>
            </TabsContent>

            {/* Videos Tab Content */}
            <TabsContent value="videos" className="mt-6">
              <div className="px-8 py-6">
                <p className="text-gray-500">Videos content coming soon...</p>
              </div>
            </TabsContent>

            {/* Musics Tab Content */}
            <TabsContent value="musics" className="mt-6">
              <div className="px-8 py-6">
                <p className="text-gray-500">Musics content coming soon...</p>
              </div>
            </TabsContent>

            {/* Podcasts Tab Content */}
            <TabsContent value="podcasts" className="mt-6">
              <div className="px-8 py-6">
                <p className="text-gray-500">Podcasts content coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
