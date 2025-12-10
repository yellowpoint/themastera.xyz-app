'use client'

import PageLoading from '@/components/PageLoading'
import { UploadedVideo } from '@/components/VideoUpload'
import WorkDetailsForm from '@/components/creator/WorkDetailsForm'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { api } from '@/lib/request'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type CoverImage = {
  fileUrl: string
  playbackId: string
  originalName?: string
  size?: number
  type?: string
}

type UploadFormState = {
  title: string
  description: string
  category: string
  language: string
  tags: string
  isPaid: boolean
  isForKids: boolean
  fileUrl: string
  thumbnailUrl: string
  status: 'draft' | 'published'
  durationSeconds?: number | null
}

export default function EditWorkPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const workId = params?.id
  const { user } = useAuth()
  const { updateWork } = useWorks()

  const [uploadForm, setUploadForm] = useState<UploadFormState>({
    title: '',
    description: '',
    category: '',
    language: '',
    tags: '',
    isPaid: false,
    isForKids: true,
    fileUrl: '',
    thumbnailUrl: '',
    status: 'draft',
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null)
  const [autoCover, setAutoCover] = useState<CoverImage | null>(null)
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)

  // Load existing work details
  useEffect(() => {
    const loadWork = async () => {
      if (!workId) {
        setIsInitialLoading(false)
        return
      }
      try {
        const res = await api.get<any>(`/api/works/${workId}`)
        const result = res.data as any
        if (!res.ok || !result?.data?.work) {
          throw new Error(result?.error?.message || 'Failed to load work')
        }
        const work = result.data.work
        // Initialize form with existing data
        setUploadForm((prev) => ({
          ...prev,
          title: work.title || '',
          description: work.description || '',
          category: work.category || '',
          language: work.language || '',
          tags: work.tags || '',
          fileUrl: work.fileUrl || '',
          thumbnailUrl: work.thumbnailUrl || '',
          status: (work.status as 'draft' | 'published') || 'draft',
          durationSeconds: work.durationSeconds ?? null,
        }))

        // Prepare video state so the full form shows up
        if (work.fileUrl) {
          const initialVideo: UploadedVideo = {
            fileUrl: work.fileUrl,
            playbackId: '',
            assetId: '',
            originalName: work.title || 'Video',
            size: 0,
            type: 'video',
            durationSeconds: work.durationSeconds ?? null,
            duration: null,
            completedAt: work.createdAt || new Date().toISOString(),
          }
          setUploadedVideo(initialVideo)
        }

        // Initial cover from existing thumbnail
        if (work.thumbnailUrl) {
          const initialImage: CoverImage = {
            fileUrl: work.thumbnailUrl,
            playbackId:
              work.fileUrl?.match(/stream\.mux\.com\/([^.?]+)/)?.[1] || '',
            originalName: 'Current thumbnail',
            size: 0,
            type: 'image',
          }
          setAutoCover(initialImage)
        }
      } catch (err: any) {
        console.error('Error loading work:', err)
        toast.error(err?.message || 'Failed to load work')
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadWork()
  }, [workId])

  // Handle video upload completion (allow replacing video)
  const handleVideoUploadComplete = (uploadedFiles: UploadedVideo[]) => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      const first = uploadedFiles[0]
      setUploadedVideo(first)

      setUploadForm((prev) => ({
        ...prev,
        fileUrl: first.fileUrl,
        title: prev.title || first.originalName?.replace(/\.[^/.]+$/, '') || '',
        durationSeconds: first.durationSeconds ?? null,
      }))

      // Try to auto-generate a cover thumbnail from Mux playbackId
      const withPlayback = uploadedFiles.find((f) => !!f.playbackId)
      if (withPlayback?.playbackId) {
        const playbackId = withPlayback.playbackId
        const thumbUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360&fit_mode=smartcrop&time=3`

        const initialImage: CoverImage = {
          fileUrl: thumbUrl,
          playbackId,
          originalName: 'Auto thumbnail',
          size: 0,
          type: 'image/webp',
        }
        setAutoCover(initialImage)

        setUploadForm((prev) => ({
          ...prev,
          thumbnailUrl: thumbUrl,
        }))
      }
    }
  }

  // Handle cover upload completion
  const handleCoverUploadComplete = (coverImage: CoverImage | null) => {
    setUploadForm((prev) => ({
      ...prev,
      thumbnailUrl: coverImage ? coverImage.fileUrl : '',
    }))
  }

  // Shared submit implementation (Update existing work)
  const submitWork = async () => {
    setShowErrors(true)

    if (!user) {
      toast.error('Please login first')
      return
    }

    if (!workId) {
      toast.error('Invalid work ID')
      return
    }

    if (
      !uploadForm.title ||
      !uploadForm.description ||
      !uploadForm.category ||
      !uploadForm.language
    ) {
      toast.error('Please fill in required information')
      return
    }

    if (!uploadForm.fileUrl) {
      toast.error('Please upload video file')
      return
    }

    if (!uploadForm.thumbnailUrl) {
      toast.error('Please upload cover image')
      return
    }

    setIsSubmitting(true)

    try {
      const updates = {
        ...uploadForm,
        status: 'published' as const,
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      }

      await updateWork(workId, updates)
      toast.success('Changes saved!')
      router.push('/creator')
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Update failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error('Please login first')
      return
    }
    if (!workId) {
      toast.error('Invalid work ID')
      return
    }

    const draftFileUrl = uploadForm?.fileUrl || uploadedVideo?.fileUrl
    if (!draftFileUrl) {
      toast.error('Please upload a video file first')
      return
    }

    const draftTitleCandidate = (
      uploadForm?.title?.trim() ||
      uploadedVideo?.originalName?.replace(/\.[^/.]+$/, '') ||
      ''
    ).trim()

    setIsSubmitting(true)

    try {
      const updates = {
        fileUrl: draftFileUrl,
        thumbnailUrl: uploadForm?.thumbnailUrl || null,
        title: draftTitleCandidate,
        description: uploadForm?.description ?? '',
        category: uploadForm?.category ?? '',
        language: uploadForm?.language ?? '',
        tags: uploadForm?.tags ?? '',
        isPaid: uploadForm?.isPaid ?? false,
        isForKids: uploadForm?.isForKids ?? true,
        status: 'draft' as const,
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      }

      await updateWork(workId, updates)
      toast.success('Draft saved!')
      router.push('/creator')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Save failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = () => {
    if (uploadedVideo?.fileUrl) {
      navigator.clipboard.writeText(uploadedVideo.fileUrl)
      toast.success('Video link copied to clipboard')
    }
  }

  if (isInitialLoading) {
    return <PageLoading />
  }

  return (
    <div className=" pb-18">
      <div className="flex flex-col">
        <div className="px-8 pt-6 pb-4 space-y-4 flex-shrink-0">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-normal">Edit video</h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-base text-muted-foreground">
            Update your video details before saving.
          </p>

          <Separator className="opacity-20" />
        </div>

        <div className="flex-1 px-8 py-2">
          <WorkDetailsForm
            value={{
              title: uploadForm.title,
              description: uploadForm.description,
              category: uploadForm.category,
              language: uploadForm.language,
              isPaid: uploadForm.isPaid,
              isForKids: uploadForm.isForKids,
              thumbnailUrl: uploadForm.thumbnailUrl,
            }}
            onChange={(patch) =>
              setUploadForm((prev) => ({
                ...prev,
                ...patch,
              }))
            }
            showErrors={showErrors}
            autoCover={autoCover}
            onCoverUploadComplete={handleCoverUploadComplete}
            uploadedVideo={uploadedVideo}
            onVideoUploadComplete={handleVideoUploadComplete}
            onCopyLink={handleCopyLink}
            showFooter={true}
            onSaveDraft={handleSaveDraft}
            onCancel={() => router.push('/creator')}
            onPrimary={() => submitWork()}
            isSubmitting={isSubmitting}
            primaryButtonText="Save changes"
            primaryButtonLoadingText="Saving..."
          />
        </div>
      </div>
    </div>
  )
}
