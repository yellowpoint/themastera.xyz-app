'use client'

import EventStatusBadge from '@/components/EventStatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoPlayer from '@/components/VideoPlayer'
import { request } from '@/lib/request'
import { formatDateRange } from '@/lib/utils'
import {
  Calendar,
  ExternalLink,
  Linkedin,
  Loader2,
  MapPin,
  Twitter,
  Youtube,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const getCleanImageUrl = (url: string) => {
  if (!url) return ''
  // If it looks like HTML, return as is
  if (url.trim().startsWith('<')) return url
  try {
    // Handle relative URLs by providing a base if needed, or just catch error
    const urlObj = new URL(url, 'http://dummy.com')
    if (url.includes('/_next/image')) {
      const innerUrl = urlObj.searchParams.get('url')
      if (innerUrl) {
        return innerUrl
      }
    }
  } catch (e) {
    console.error('Error parsing URL:', url, e)
  }
  return url
}

const isEmbedCode = (str: string) => {
  if (!str) return false
  return str.trim().startsWith('<') || str.includes('<iframe')
}

export default function EventDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const { data } = await request.get(`/api/events/${id}`)
        if (data?.success) {
          const e = data.data
          // Map to UI structure
          const mapped = {
            id: e.id,
            title: e.title,
            status: e.status,
            period: formatDateRange(e.dates) || e.period,
            location: e.location,
            posterUrl: getCleanImageUrl(e.posterUrl || ''),
            dates: e.dates || [],
            artist: {
              name: e.artistName || '',
              avatar: getCleanImageUrl(e.artistAvatar || ''),
              detailName: e.artistDetailName || e.artistName || '',
              detailAvatar: getCleanImageUrl(
                e.artistDetailAvatar || e.artistAvatar || ''
              ),
              birth: e.artistBirth || '',
              bio: e.artistBio || '',
            },
            introduction: {
              imageUrl: getCleanImageUrl(e.introductionImageUrl || ''),
              videoCover: getCleanImageUrl(e.introductionVideoCover || ''),
            },
            exhibitionInfo: {
              name: e.exhibitionName || '',
              duration: e.exhibitionDuration || '',
              location: e.exhibitionLocation || '',
              curator: e.exhibitionCurator || '',
            },
          }
          setEvent(mapped)
          if (mapped.dates && mapped.dates.length > 0) {
            setSelectedDate(mapped.dates[0])
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Event not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Poster */}
        <div className="lg:col-span-5">
          <div className="sticky top-18">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-xl border border-border/50 bg-muted">
              {event.posterUrl && (
                <Image
                  src={event.posterUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {event.title}
            </h1>

            <EventStatusBadge status={event.status} size="md" />

            <div className="flex items-center gap-3 pt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={event.artist.avatar} />
                <AvatarFallback>
                  {event.artist.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">
                {event.artist.name}
              </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/10 rounded-xl border border-border/50">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="bg-background h-12">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                {event.dates.map((date: string) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                event.status === 'Upcoming' || event.status === 'Archive'
              }
            >
              Reserve Now
              <Badge className="ml-2 bg-yellow-400 text-black hover:bg-yellow-500 border-none">
                Admission Free
              </Badge>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="introduction" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent border-b rounded-none h-auto p-0 space-x-6 justify-start">
              <TabsTrigger
                value="introduction"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium"
              >
                Introduction
              </TabsTrigger>
              <TabsTrigger
                value="artist"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium"
              >
                About artist
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium"
              >
                Exhibition info
              </TabsTrigger>
            </TabsList>

            {/* Introduction Tab */}
            <TabsContent value="introduction" className="space-y-8 py-6">
              {/* Collection Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {event.introduction.imageUrl && (
                    <div className="relative w-full md:w-1/3 aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={event.introduction.imageUrl}
                        alt="Intro"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {event.artist.bio}
                  </div>
                </div>
              </div>

              {/* Video Player */}
              {event.introduction.videoCover && (
                <div className="rounded-lg overflow-hidden shadow-lg bg-black">
                  {isEmbedCode(event.introduction.videoCover) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: event.introduction.videoCover,
                      }}
                    />
                  ) : (
                    <VideoPlayer
                      videoUrl={event.introduction.videoCover}
                      thumbnailUrl={event.introduction.imageUrl}
                    />
                  )}
                </div>
              )}

              {/* Artist Info Section (also in Intro tab as per design) */}
              <div className="space-y-4 pt-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Artist name
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold">
                      {event.artist.detailName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {event.artist.birth}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.artist.bio}
                </p>
              </div>

              {/* Exhibition Info Table (also in Intro tab as per design bottom part) */}
              <div className="pt-6">
                <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                  Exhibition info
                </h4>
                <div className="bg-secondary/20 rounded-lg p-6 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">
                      Exhibition name
                    </span>
                    <span className="md:col-span-3 font-medium">
                      {event.exhibitionInfo.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Duration</span>
                    <div className="md:col-span-3 flex items-center gap-2">
                      <span>{event.exhibitionInfo.duration}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="md:col-span-3">
                      {event.exhibitionInfo.location}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Curator</span>
                    <span className="md:col-span-3">
                      {event.exhibitionInfo.curator}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="artist" className="py-6">
              <div className="text-muted-foreground">
                {/* Duplicated content for now */}
                <div className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Artist name
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <h3 className="text-xl font-bold">
                        {event.artist.detailName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {event.artist.birth}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {event.artist.detailAvatar && (
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={event.artist.detailAvatar} />
                        <AvatarFallback>AN</AvatarFallback>
                      </Avatar>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.artist.bio}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="info" className="py-6">
              <div className="pt-6">
                <div className="bg-secondary/20 rounded-lg p-6 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">
                      Exhibition name
                    </span>
                    <span className="md:col-span-3 font-medium">
                      {event.exhibitionInfo.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Duration</span>
                    <div className="md:col-span-3 flex items-center gap-2">
                      <span>{event.exhibitionInfo.duration}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="md:col-span-3">
                      {event.exhibitionInfo.location}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <span className="text-muted-foreground">Curator</span>
                    <span className="md:col-span-3">
                      {event.exhibitionInfo.curator}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-8" />

          {/* Footer Links */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:underline">
                Policy
              </Link>
              <Link href="#" className="hover:underline">
                Terms
              </Link>
              <Link href="#" className="hover:underline">
                Privacy
              </Link>
              <span>Copyright</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
