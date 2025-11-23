import { HOMEPAGE_SECTIONS } from '@/config/sections'
import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    const items = HOMEPAGE_SECTIONS.map((s) => ({
      id: s.id,
      name: s.title,
      description: (s as any).description || s.title,
      coverUrl: (s as any).coverUrl || '/thumbnail-placeholder.svg',
      list: [],
    }))

    function toHomepageItem(work: any) {
      return {
        id: work.id,
        title: work.title,
        thumbnailUrl: work.thumbnailUrl ?? null,
        fileUrl: work.fileUrl ?? null,
        user: work.user
          ? { id: work.user.id, name: work.user.name, image: work.user.image }
          : null,
        views: work.views ?? 0,
        downloads: work.downloads ?? 0,
        duration: work.duration ?? null,
        durationSeconds: work.durationSeconds ?? null,
        tags: work.tags ?? '',
        language: work.language ?? null,
        updatedAt: work.updatedAt ?? null,
      }
    }

    async function fetchSectionItems(sectionId: string) {
      const baseWhere: Prisma.WorkWhereInput = { status: 'published' }
      let where: Prisma.WorkWhereInput = { ...baseWhere }
      let orderBy: Prisma.WorkOrderByWithRelationInput[] = [
        { createdAt: 'desc' },
      ]

      const now = new Date()
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 30)

      switch (sectionId) {
        case 'trending':
          orderBy = [{ views: 'desc' }]
          break
        case 'featured-artists':
          orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
          break
        case 'new-releases':
          orderBy = [{ createdAt: 'desc' }]
          break
        case 'popular-this-week':
          where = { ...where, createdAt: { gte: sevenDaysAgo } }
          orderBy = [{ views: 'desc' }]
          break
        case 'recommended':
          orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
          break
        case 'top-rated':
          orderBy = [{ views: 'desc' }]
          break
        case 'rising-creators':
          where = { ...where, createdAt: { gte: thirtyDaysAgo } }
          orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
          break
        case 'recently-viewed':
          orderBy = [{ createdAt: 'desc' }]
          break
        default:
          orderBy = [{ createdAt: 'desc' }]
      }

      const works = await prisma.work.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy,
        take: 3,
      })

      return works.map(toHomepageItem)
    }

    function reorderList(sectionId: string, list: any[]) {
      if (!Array.isArray(list)) return list
      if (sectionId === 'recommended' && list.length >= 2) {
        const arr = list.slice()
        const t = arr[0]
        arr[0] = arr[1]
        arr[1] = t
        return arr
      }
      if (sectionId === 'rising-creators' && list.length >= 3) {
        const arr = list.slice()
        const t = arr[0]
        arr[0] = arr[2]
        arr[2] = t
        return arr
      }
      return list
    }

    await Promise.all(
      items.map(async (item) => {
        const secItems = await fetchSectionItems(item.id)
        item.list = reorderList(item.id, secItems)
      })
    )

    return NextResponse.json(apiSuccess(items))
  } catch (error) {
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
