'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Users, UserMinus, UserPlus } from 'lucide-react'
import { request } from '@/lib/request'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from '@/components/ui/empty'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import SubscribeButton from '@/components/SubscribeButton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function SubscriptionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (search.trim()) params.set('search', search.trim())
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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPage(1)
    loadData()
  }

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

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full max-w-md"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="default">
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="w-6 h-6" />
            </EmptyMedia>
            <EmptyTitle>No subscriptions yet</EmptyTitle>
            <EmptyDescription>
              Find creators you love and subscribe to them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => loadData()}>
              Refresh
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((u) => (
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
                    <CardDescription className="truncate">
                      {u.level || 'User'}
                    </CardDescription>
                  </div>
                </Link>
                <CardAction>
                  <SubscribeButton
                    userId={u.id}
                    isFollowing={u.isFollowing}
                    onChanged={(action) => handleSubscribeChanged(u.id, action)}
                    size="sm"
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {u.description || ''}
                </p>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span>Works {u._count?.works ?? 0}</span>
                  <span>Reviews {u._count?.reviews ?? 0}</span>
                </div>
              </CardFooter>
            </Card>
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
