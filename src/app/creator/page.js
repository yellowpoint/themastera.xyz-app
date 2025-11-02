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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDuration, formatDate, formatViews } from '@/lib/format'

export default function CreatorPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, deleteWork } = useWorks()

  // State
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5


  // Filter works based on search and visibility
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVisibility = visibilityFilter === 'all' || work.status === visibilityFilter
    return matchesSearch && matchesVisibility
  })

  // Pagination
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage)
  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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

  // If user is not logged in, show login prompt
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-lg border">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Creator Center</h2>
            <p className="text-muted-foreground mb-6">
              Please login to access creator features
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Login / Register
            </Button>
          </div>
        </Card>
      </div>
    )
  }

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

                {/* Table */}
                <div className="border border-gray-200 rounded-sm overflow-hidden w-full">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="font-normal text-[#3B3E3F]">Video</TableHead>
                        <TableHead className="font-normal text-[#3B3E3F] w-[120px]">Visibility</TableHead>
                        <TableHead className="font-normal text-[#3B3E3F] text-right w-[120px]">Views</TableHead>
                        <TableHead className="font-normal text-[#3B3E3F] w-[180px]">Date</TableHead>
                        <TableHead className="font-normal text-[#3B3E3F] w-[180px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedWorks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            {worksLoading ? 'Loading...' : 'No works found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedWorks.map((work) => (
                          <TableRow key={work.id} className="border-gray-100">
                            <TableCell className="py-3">
                              <div className="flex gap-2 items-start min-w-30 h-[72px]">
                                <div className="relative flex-shrink-0 h-full">
                                  <div className="w-[100px] h-full bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                      src={work.thumbnailUrl || '/placeholder-video.jpg'}
                                      alt={work.title}
                                      className={`w-full h-full object-cover ${work.status === 'draft' ? 'opacity-60' : ''}`}
                                    />
                                  </div>
                                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                                    {formatDuration(work.durationSeconds)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-20 h-full flex flex-col justify-between py-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="text-sm font-normal text-[#1D2129] line-clamp-2 mb-1 ">
                                        {work.title}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <p className="text-sm">{work.title}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="text-xs text-[#86909C] truncate line-clamp-2">
                                        {work.description || 'No description'}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <p className="text-sm">{work.description || 'No description'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className="text-sm text-[#1D2129] capitalize">
                                {work.status || 'Draft'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <span className="text-sm text-[#1D2129]">
                                {formatViews(work.views || 0)}
                              </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className="text-sm text-[#1D2129]">
                                {formatDate(work.createdAt)}
                              </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => router.push(`/creator/edit/${work.id}`)}
                                  className="text-sm text-[#1D2129] hover:underline whitespace-nowrap"
                                >
                                  Edit
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-[#4E5969] hover:text-[#1D2129]">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/creator/edit/${work.id}`)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/content/${work.id}`)}>
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteWork(work.id)}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end py-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#1D2129]">Total {filteredWorks.length} items</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-3 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = index + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[36px] h-[36px] px-2 rounded ${currentPage === pageNum
                              ? 'bg-[#F4E8FF] text-[#805333]'
                              : 'text-[#4E5969] hover:bg-gray-100'
                              }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2 ml-2">
                        <Select defaultValue="5">
                          <SelectTrigger className="w-24 h-9 bg-[#F7F8FA] border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 / Page</SelectItem>
                            <SelectItem value="10">10 / Page</SelectItem>
                            <SelectItem value="20">20 / Page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[#86909C] text-sm">Go to</span>
                        <Input
                          type="number"
                          min="1"
                          max={totalPages}
                          className="w-16 h-9 text-center bg-[#F7F8FA] border-0"
                          defaultValue="20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
