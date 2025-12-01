'use client'

import { request } from '@/lib/request'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import EventForm from '../_components/EventForm'

export default function EditEventPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const res = await request.get(`/api/events/${id}`)
        if (res.data?.success) {
          setData(res.data.data)
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
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return <div>Event not found</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
      <EventForm initialData={data} isEdit />
    </div>
  )
}
