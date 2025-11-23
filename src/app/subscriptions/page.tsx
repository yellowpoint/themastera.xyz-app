'use client'

import { request } from '@/lib/request'
import { Search, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import SubscribeButton from '@/components/SubscribeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

export default function SubscriptionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const searchInitRef = useRef<boolean>(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim())
      const { data } = await request.get(
        `/api/subscriptions?${params.toString()}`
      )
      if (data?.success) {
        const list = Array.isArray((data as any)?.data?.items)
          ? (data as any).data.items
          : []
        setItems(list.map((u) => ({ ...u, isFollowing: !!u.isFollowing })))
        const pg = (data as any)?.data?.pagination || {}
        setTotal(pg.total || 0)
        setTotalPages(pg.totalPages || 1)
      }
    } catch (_) {
      // errors handled by request util
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [page, limit])

  useEffect(() => {
    if (searchInitRef.current) {
      searchInitRef.current = false
      return
    }
    if (page !== 1) {
      setPage(1)
    } else {
      loadData()
    }
  }, [debouncedSearch])

  const handleSubscribeChanged = (
    userId: string,
    action: 'follow' | 'unfollow'
  ) => {
    setItems((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: action === 'follow' } : u
      )
    )
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const pages = useMemo(() => {
    const arr = []
    const max = Math.max(1, totalPages)
    for (let i = 1; i <= max; i++) arr.push(i)
    return arr
  }, [totalPages])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Creators you follow</p>
        </div>

        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onDebouncedValueChange={(value) => setDebouncedSearch(value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-24" />
            </Skeleton>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty className="bg-[#F6F9FC1A]">
          <EmptyHeader>
            <Users className="w-6 h-6" />
            <EmptyTitle>No subscriptions yet</EmptyTitle>
            <EmptyDescription>
              Find creators you love and subscribe to them.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((u) => (
            <Link href={`/user/${u.id}`}>
              <Card key={u.id}>
                <CardHeader>
                  <Link
                    href={`/user/${u.id}`}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={u.image || ''}
                        alt={u.name || u.email || 'User'}
                      />
                      <AvatarFallback>
                        {(u.name || u.email || 'U').slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {u.name || u.email}
                      </CardTitle>
                    </div>
                  </Link>
                  <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                  <SubscribeButton
                    userId={u.id}
                    isFollowing={u.isFollowing}
                    onChanged={(action) => handleSubscribeChanged(u.id, action)}
                    size="sm"
                  />
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {u.description || 'aaaaa'}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span>Works {u._count?.works ?? 0}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {items.length > 0 && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePrev()
                }}
              />
            </PaginationItem>
            {pages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNext()
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
