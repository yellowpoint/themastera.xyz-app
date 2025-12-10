'use client'

import ImgUpload from '@/components/ImgUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import VideoPlayer from '@/components/VideoPlayer'
import VideoUpload, { UploadedVideo } from '@/components/VideoUpload'
import { request } from '@/lib/request'
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface EventFormProps {
  initialData?: any
  isEdit?: boolean
}

export default function EventForm({ initialData, isEdit }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      status: 'Upcoming',
      artistName: '',
      artistAvatar: '',
      artistDetailName: '',
      artistDetailAvatar: '',
      artistBirth: '',
      artistBio: '',
      period: '',
      location: '',
      posterUrl: '',
      introductionImageUrl: '',
      introductionVideoCover: '',
      exhibitionName: '',
      exhibitionDuration: '',
      exhibitionLocation: '',
      exhibitionCurator: '',
      dates: [], // Array of strings
    }
  )

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  // Simple dates handling: textarea split by newline
  const [datesText, setDatesText] = useState(
    initialData?.dates && Array.isArray(initialData.dates)
      ? initialData.dates.join('\n')
      : ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const datesArray = datesText
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean)

    const payload = { ...formData, dates: datesArray }

    try {
      let res
      if (isEdit) {
        res = await request.put(`/api/events/${initialData.id}`, payload)
      } else {
        res = await request.post('/api/events', payload)
      }

      if (res.data?.success) {
        toast.success(isEdit ? 'Event updated' : 'Event created')
        router.push('/admin/events')
      } else {
        toast.error(res.data?.error?.message || 'Operation failed')
      }
    } catch (err: any) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const fillTemplateData = () => {
    const template = {
      title: 'Modern Art Exhibition 2025',
      status: 'Upcoming',
      artistName: 'Elena Rodriguez',
      artistAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      artistDetailName: 'Elena Rodriguez',
      artistDetailAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      artistBirth: '1985, Spain',
      artistBio:
        'Elena Rodriguez is a contemporary artist known for her immersive installations and vibrant color palettes. Her work explores themes of memory, nature, and the digital age.',
      period: '2025.03.15-2025.04.30',
      location: 'The Grand Gallery, New York',
      posterUrl:
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
      introductionImageUrl:
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      introductionVideoCover:
        'https://stream.mux.com/VMJzj3TPKvLozhDsBUB9A1C02XyWNS4o6nqjGR7qa5mA.m3u8',
      exhibitionName: 'Echoes of Tomorrow',
      exhibitionDuration: '45 Days',
      exhibitionLocation: 'Main Hall, Level 2',
      exhibitionCurator: 'Sarah Jenkins',
    }
    setFormData((prev: any) => ({ ...prev, ...template }))
    setDatesText(
      '2025-03-15 10:00 AM\n2025-03-16 10:00 AM\n2025-04-30 14:00 PM'
    )
    toast.success('Template data filled')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={fillTemplateData}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Auto Fill Template
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="On viewing">On viewing</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Poster</Label>
            <ImgUpload
              showFilename={false}
              folder="events"
              subDir="poster"
              initialImage={
                formData.posterUrl ? { fileUrl: formData.posterUrl } : null
              }
              onUploadComplete={(img) =>
                handleChange('posterUrl', img?.fileUrl || '')
              }
            />
            <Input
              value={formData.posterUrl || ''}
              onChange={(e) => handleChange('posterUrl', e.target.value)}
              placeholder="Paste image URL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Period</Label>
              <Input
                value={formData.period || ''}
                onChange={(e) => handleChange('period', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dates (One per line)</Label>
            <Textarea
              rows={5}
              value={datesText}
              onChange={(e) => setDatesText(e.target.value)}
              placeholder="Nov 14th 1:00 PM"
            />
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-medium">Artist Info</h3>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Artist Name</Label>
              <Input
                value={formData.artistName || ''}
                onChange={(e) => handleChange('artistName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Artist Avatar</Label>
              <ImgUpload
                showFilename={false}
                folder="events"
                subDir="artist"
                initialImage={
                  formData.artistAvatar
                    ? { fileUrl: formData.artistAvatar }
                    : null
                }
                onUploadComplete={(img) =>
                  handleChange('artistAvatar', img?.fileUrl || '')
                }
              />
              <Input
                value={formData.artistAvatar || ''}
                onChange={(e) => handleChange('artistAvatar', e.target.value)}
                placeholder="Paste image URL"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={formData.artistBio || ''}
              onChange={(e) => handleChange('artistBio', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-medium">Introduction Media</h3>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intro Image</Label>
              <ImgUpload
                showFilename={false}
                folder="events"
                subDir="intro"
                initialImage={
                  formData.introductionImageUrl
                    ? { fileUrl: formData.introductionImageUrl }
                    : null
                }
                onUploadComplete={(img) =>
                  handleChange('introductionImageUrl', img?.fileUrl || '')
                }
              />
              <Input
                value={formData.introductionImageUrl || ''}
                onChange={(e) =>
                  handleChange('introductionImageUrl', e.target.value)
                }
                placeholder="Paste image URL"
              />
            </div>
            <div className="space-y-2">
              <Label>Intro Video</Label>
              <div className="space-y-3">
                <VideoUpload
                  onUploadComplete={(files: UploadedVideo[]) => {
                    const first = files?.[0]
                    if (!first) return
                    handleChange('introductionVideoCover', first.fileUrl)
                  }}
                />
                <Input
                  placeholder="Paste video URL or embed code"
                  value={formData.introductionVideoCover || ''}
                  onChange={(e) =>
                    handleChange('introductionVideoCover', e.target.value)
                  }
                />
                {formData.introductionVideoCover && (
                  <div className="rounded-xl overflow-hidden w-full aspect-[16/9]">
                    <VideoPlayer videoUrl={formData.introductionVideoCover} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-medium">Exhibition Info</h3>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exhibition Name</Label>
              <Input
                value={formData.exhibitionName || ''}
                onChange={(e) => handleChange('exhibitionName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Exhibition Duration</Label>
              <Input
                value={formData.exhibitionDuration || ''}
                onChange={(e) =>
                  handleChange('exhibitionDuration', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Exhibition Location</Label>
              <Input
                value={formData.exhibitionLocation || ''}
                onChange={(e) =>
                  handleChange('exhibitionLocation', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Exhibition Curator</Label>
              <Input
                value={formData.exhibitionCurator || ''}
                onChange={(e) =>
                  handleChange('exhibitionCurator', e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update Event' : 'Create Event'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
