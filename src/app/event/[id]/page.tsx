'use client'

import EventStatusBadge from '@/components/EventStatusBadge'
import TabsBar from '@/components/TabsBar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import { request } from '@/lib/request'
import { formatDateRange } from '@/lib/utils'
import {
  Calendar,
  ExternalLink,
  Linkedin,
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

function ArtistCard({
  detailName,
  birth,
  bio,
  className = '',
}: {
  detailName: string
  birth?: string
  bio?: string
  detailAvatar?: string
  showAvatar?: boolean
  className?: string
}) {
  return (
    <Card className={`bg-card/70 px-4 ${className}`}>
      <div className="space-y-1 text-foreground">
        <div className="text-sm text-muted-foreground">Artist name</div>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
          <h3 className="text-xl font-bold">{detailName}</h3>
          <span className="text-sm">{birth}</span>
        </div>
      </div>
      <p className="text-sm text-[#c9cdd4]">{bio}</p>
    </Card>
  )
}

function ExhibitionInfoCard({
  info,
  className = '',
  showTitle = true,
  useCard = true,
}: {
  info: { name: string; duration: string; location: string; curator: string }
  className?: string
  showTitle?: boolean
  useCard?: boolean
}) {
  const Wrapper: any = useCard ? Card : 'div'
  const wrapperProps = useCard
    ? { className: `bg-card/70 px-4 ${className}` }
    : { className }
  return (
    <Wrapper {...wrapperProps}>
      {showTitle && (
        <h4 className="text-xl text-foreground">Exhibition info</h4>
      )}
      <div className="rounded-xl space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <span className="text-muted-foreground">Exhibition name</span>
          <span className="md:col-span-3 font-medium">{info.name}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <span className="text-muted-foreground">Duration</span>
          <div className="md:col-span-3 flex items-center gap-2">
            <span>{info.duration}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <span className="text-muted-foreground">Location</span>
          <span className="md:col-span-3">{info.location}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <span className="text-muted-foreground">Curator</span>
          <span className="md:col-span-3">{info.curator}</span>
        </div>
      </div>
    </Wrapper>
  )
}

export default function EventDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<
    'introduction' | 'artist' | 'info'
  >('introduction')

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <div className="sticky top-26">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <Card className="bg-card/70 px-4 gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Skeleton className="h-15 w-full rounded-md" />
            <Skeleton className="md:col-span-2 h-15 w-full rounded-md" />
          </div>

          <div>
            <div className="flex gap-3">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-36" />
            </div>

            <div className="space-y-6 pt-6">
              <Card className="bg-card/70 px-4">
                <Skeleton className="h-6 w-40" />
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="relative w-full md:w-1/3 aspect-[3/4] rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </Card>

              <Skeleton className="rounded-xl w-full aspect-[16/9]" />

              <Card className="bg-card/70 px-4">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>

              <Card className="bg-card/70 px-4">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-3 mt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </Card>
            </div>
          </div>

          <Card className="bg-card/70 px-4">
            <div className="flex gap-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="">Event not found</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Column: Poster */}
      <div className="md:col-span-5">
        <div className="sticky top-26">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-card/70">
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
      <div className="md:col-span-7 space-y-6">
        {/* Header Info */}
        <Card className="bg-card/70 px-4 gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl">{event.title}</h1>
            <EventStatusBadge status={event.status} />
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-highlight/50">
              <AvatarImage src={event.artist.avatar} />
              <AvatarFallback>
                {event.artist.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground">
              {event.artist.name}
            </span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground" />
              <span>{event.period}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
        </Card>

        {/* Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger
              className="bg-[#6B75F8]! text-white! h-15! w-full border-0 text-md"
              iconClassName="opacity-100 size-6 text-white"
            >
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
            className=" md:col-span-2 h-15 w-full relative text-2xl disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground"
            disabled={event.status === 'Upcoming' || event.status === 'Archive'}
            // onClick={() => {
            //   alert('Reserve Now')
            // }}
          >
            Reserve Now
            <Badge className="absolute -top-2 right-2 bg-highlight text-primary  border-none rounded">
              Admission Free
            </Badge>
          </Button>
        </div>

        <div>
          {/* Tabs */}
          <TabsBar
            labelClassName="text-white text-base"
            tabs={[
              { key: 'introduction', label: 'Introduction' },
              { key: 'artist', label: 'About artist' },
              { key: 'info', label: 'Exhibition info' },
            ]}
            activeKey={activeTab}
            onChange={(key) =>
              setActiveTab(key as 'introduction' | 'artist' | 'info')
            }
          />

          {/* Introduction Tab */}
          <div hidden={activeTab !== 'introduction'} className="space-y-6 pt-6">
            {/* Collection Info */}
            <Card className="bg-card/70 px-4">
              <h3 className="text-xl">{event.title}</h3>
              <div className="flex flex-col md:flex-row gap-6">
                {event.introduction.imageUrl && (
                  <div className="relative w-full md:w-1/3 aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={event.introduction.imageUrl}
                      alt="Intro"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-sm text-[#C9CDD4] whitespace-pre-line">
                  {event.artist.bio}
                </div>
              </div>
            </Card>

            {/* Video Player */}
            {event.introduction.videoCover && (
              <div className="rounded-xl overflow-hidden w-full aspect-[16/9] flex-shrink-0">
                {isEmbedCode(event.introduction.videoCover) ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: event.introduction.videoCover,
                    }}
                  />
                ) : (
                  <VideoPlayer videoUrl={event.introduction.videoCover} />
                )}
              </div>
            )}

            {/* Artist Info Section (also in Intro tab as per design) */}
            <ArtistCard
              detailName={event.artist.detailName}
              birth={event.artist.birth}
              bio={event.artist.bio}
            />

            <ExhibitionInfoCard info={event.exhibitionInfo} />
          </div>

          <div hidden={activeTab !== 'artist'} className="pt-6">
            <ArtistCard
              detailName={event.artist.detailName}
              birth={event.artist.birth}
              bio={event.artist.bio}
            />
          </div>
          <div hidden={activeTab !== 'info'} className="pt-6">
            <ExhibitionInfoCard info={event.exhibitionInfo} />
          </div>
        </div>
        {/* Footer Links */}
        <Card className="bg-card/70 px-4">
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
        </Card>
      </div>
    </div>
  )
}
