'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import VideoUpload, { UploadedVideo } from '@/components/VideoUpload'
import WorkDetailsForm from '@/components/creator/WorkDetailsForm'
import { api } from '@/lib/request'

type CoverImage = {
  fileUrl: string
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
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // Load existing work details
  useEffect(() => {
    const loadWork = async () => {
      if (!workId) return
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
            originalName: 'Current thumbnail',
            size: 0,
            type: 'image',
          }
          setAutoCover(initialImage)
        }
      } catch (err: any) {
        console.error('Error loading work:', err)
        toast.error(err?.message || 'Failed to load work')
      }
    }
    loadWork()
  }, [workId])

  // Form details are now handled by WorkDetailsForm

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

  // Publish work via form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submitWork()
  }

  // Publish work via button click
  const handleSubmitClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await submitWork()
  }

  // Save as draft (update)
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

  // If we haven't loaded an existing video yet, show a simple uploader to allow replacing/adding
  if (!uploadedVideo) {
    return (
      <div className="h-full">
        <div className="px-8 pt-6 pb-4 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-normal">Edit video</h1>
          </div>
          <p className="text-base text-muted-foreground">
            Upload or replace your video to start editing details.
          </p>
        </div>

        <div className="px-8 py-10 flex justify-center">
          <div className="max-w-[640px] w-full">
            <div className="rounded-lg p-10">
              <VideoUpload
                onUploadComplete={handleVideoUploadComplete}
                onUploadingChange={setIsUploading}
              />
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
              By editing your videos on Mastera, you acknowledge that you agree
              to Mastera's Terms of Service and Community Guidelines.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="flex gap-1 h-full">
        {/* Middle Content - Upload Form */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pb-18">
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

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-8 py-2">
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
              />

              {/* Footer Actions */}
              <div className="bg-background border-t px-6 py-3 flex-shrink-0 absolute bottom-0 left-0 right-0 z-999">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className="text-primary text-sm"
                    onClick={handleSaveDraft}
                  >
                    Save as draft
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="bg-[#F2F3F5] text-foreground px-4 h-10"
                      onClick={() => router.push('/creator')}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-white px-4 h-10"
                      onClick={handleSubmitClick}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </div>
              </div>
          </div>

          {/* Vertical separator removed; WorkDetailsForm now handles layout */}
        </div>
      </div>
    </div>
  )
}
