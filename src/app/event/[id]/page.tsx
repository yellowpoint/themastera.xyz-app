'use client'

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
import { request } from '@/lib/request'
import {
  Calendar,
  ExternalLink,
  Linkedin,
  Loader2,
  MapPin,
  Maximize,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Twitter,
  Volume2,
  Youtube,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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
            period: e.period,
            location: e.location,
            posterUrl: e.posterUrl || '',
            dates: e.dates || [],
            artist: {
              name: e.artistName || '',
              avatar: e.artistAvatar || '',
              detailName: e.artistDetailName || e.artistName || '',
              detailAvatar: e.artistDetailAvatar || e.artistAvatar || '',
              birth: e.artistBirth || '',
              bio: e.artistBio || '',
            },
            introduction: {
              imageUrl: e.introductionImageUrl || '',
              videoCover: e.introductionVideoCover || '',
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

            <Badge
              variant="outline"
              className="border-green-500 text-green-500 px-3 py-1 text-xs uppercase tracking-wider"
            >
              {event.status}
            </Badge>

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

            <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base">
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

              {/* Video Player Mock */}
              {event.introduction.videoCover && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                  <Image
                    src={event.introduction.videoCover}
                    alt="Video Cover"
                    fill
                    className="object-cover opacity-80"
                  />

                  {/* Play Button Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Controls Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-white/30 rounded-full mb-4 overflow-hidden cursor-pointer">
                      <div className="h-full w-1/3 bg-blue-500"></div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <Play className="h-5 w-5 fill-white" />
                        <SkipBack className="h-5 w-5 fill-white" />
                        <SkipForward className="h-5 w-5 fill-white" />
                        <Volume2 className="h-5 w-5" />
                        <span className="text-xs font-mono">1:51 / 4:12</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Settings className="h-5 w-5" />
                        <Maximize className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
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
