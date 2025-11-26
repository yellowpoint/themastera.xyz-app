'use client'
import { HeaderHeight } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserProfileSidebar from '@/components/UserProfileSidebar'
import WorkCardList from '@/components/WorkCardList'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserDetailPage() {
  const params = useParams()
  const userId = (params as Record<string, string>)?.id?.toString?.() || ''

  const [user, setUser] = useState<any>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [sort, setSort] = useState<'latest' | 'popular' | 'oldest'>('latest')
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(9) // match 3x3 grid for aesthetic
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    let ignore = false
    async function fetchUserPage() {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)
      setError('')
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
        })
        if (debouncedSearch) params.set('q', debouncedSearch)
        const { data } = await request.get(
          `/api/users/${userId}?${params.toString()}`
        )
        const u = data?.data || null
        if (!ignore) {
          setUser(u)
          const list = Array.isArray(u?.works)
            ? u.works.map((w: any) => ({
                ...w,
                // attach basic user info for card avatar
                user: u
                  ? { id: u.id, name: u.name, image: u.image }
                  : undefined,
              }))
            : []
          setWorks((prev) =>
            page === 1 ? (list as Work[]) : [...prev, ...(list as Work[])]
          )
          const tp = (u?.pagination?.totalPages as number) || 1
          setTotalPages(tp)
        }
      } catch (err) {
        const msg = (err as any)?.message || 'Failed to load user'
        if (!ignore) setError(msg)
      } finally {
        if (!ignore) {
          if (page === 1) setLoading(false)
          else setLoadingMore(false)
        }
      }
    }
    if (userId) fetchUserPage()
    return () => {
      ignore = true
    }
  }, [userId, page, limit, sort, debouncedSearch])

  // Reset pagination when sort changes or user changes
  useEffect(() => {
    setPage(1)
    setWorks([])
  }, [sort, userId, debouncedSearch])

  const handleSubscribeChanged = (action: 'follow' | 'unfollow') => {
    setUser((prev) => {
      if (!prev) return prev
      const followed = action === 'follow'
      const delta = followed ? 1 : -1
      const nextFollowers = Math.max(0, (prev.followersCount || 0) + delta)
      return {
        ...prev,
        isFollowing: followed,
        followersCount: nextFollowers,
      }
    })
  }

  return (
    <div
      className="mx-auto flex flex-col md:flex-row gap-2"
      style={{ height: `calc(100vh - ${HeaderHeight})` }}
    >
      {/* Left: Profile Sidebar */}
      <div className="w-full md:w-[320px] md:flex-shrink-0">
        <UserProfileSidebar
          user={user}
          onSubscribeChanged={handleSubscribeChanged}
        />
      </div>

      {/* Right: Works and filters */}
      <div className="md:flex-1 min-w-0 h-auto md:h-full md:overflow-y-auto p-2 scrollbar-gutter-stable">
        <div className="flex flex-wrap items-center justify-start md:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant={sort === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSort('popular')}
            >
              Popular
            </Button>
            <Button
              variant={sort === 'latest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSort('latest')}
            >
              Latest
            </Button>
            <Button
              variant={sort === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSort('oldest')}
            >
              Oldest
            </Button>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search works"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onDebouncedValueChange={(value) => setDebouncedSearch(value)}
                className="pl-9 border-gray-300"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Works grid */}
        <WorkCardList
          works={works}
          isLoading={loading}
          isLoadingMore={loadingMore}
          hasMore={page < totalPages}
          onLoadMore={async () => {
            if (page >= totalPages) return
            setPage((p) => Math.min(p + 1, totalPages))
          }}
        />
      </div>
    </div>
  )
}
