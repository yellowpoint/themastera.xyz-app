'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Copy, ChevronDown, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import VideoUpload, { UploadedVideo } from '@/components/VideoUpload'
import ImgUpload from '@/components/ImgUpload'
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import WorkDetailsForm, {
  UploadFormState as DetailsFormState,
  CoverImage as DetailsCoverImage,
} from '@/components/creator/WorkDetailsForm'
import { api } from '@/lib/request'
import { formatDuration } from '@/lib/format'

// Use UploadedVideo type from VideoUpload for consistency

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

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { createWork } = useWorks()

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
  const [isCopyPrefillLoading, setIsCopyPrefillLoading] =
    useState<boolean>(false)

  // Prefill when copying from an existing work
  useEffect(() => {
    const copyFrom = searchParams?.get('copyFrom')
    if (!copyFrom) return
    setIsCopyPrefillLoading(true)

    const loadWorkForCopy = async (workId: string) => {
      try {
        const res = await api.get<any>(`/api/works/${workId}`)
        const result = res.data as any
        if (!res.ok || !result?.data?.work) {
          throw new Error(result?.error?.message || 'Failed to load work')
        }
        const work = result.data.work

        // Prefill upload form with copied data, append " copy" to title
        setUploadForm((prev) => ({
          ...prev,
          title: `${work.title || ''} copy`,
          description: work.description || '',
          category: work.category || '',
          language: work.language || '',
          tags: work.tags || '',
          isPaid: false,
          isForKids:
            typeof work.isForKids === 'boolean' ? work.isForKids : true,
          fileUrl: work.fileUrl || '',
          thumbnailUrl: work.thumbnailUrl || '',
          status: 'draft',
          durationSeconds: work.durationSeconds ?? null,
        }))

        // If the original work has a fileUrl, set uploadedVideo to skip upload step
        if (work.fileUrl) {
          const copiedVideo: UploadedVideo = {
            fileUrl: work.fileUrl,
            playbackId: '',
            assetId: '',
            originalName: work.title || 'Video',
            size: 0,
            type: 'video',
            durationSeconds: work.durationSeconds ?? null,
            duration:
              typeof work.durationSeconds === 'number' &&
              work.durationSeconds > 0
                ? formatDuration(work.durationSeconds)
                : null,
            completedAt: work.createdAt || new Date().toISOString(),
          }
          setUploadedVideo(copiedVideo)
        }

        // Preload cover image in the thumbnail uploader
        if (work.thumbnailUrl) {
          const initialCover: CoverImage = {
            fileUrl: work.thumbnailUrl,
            originalName: 'Copied thumbnail',
            size: 0,
            type: 'image',
          }
          setAutoCover(initialCover)
        }
      } catch (error) {
        console.error('Failed to copy work:', error)
        toast.error('Failed to load work for copy')
      } finally {
        setIsCopyPrefillLoading(false)
      }
    }

    loadWorkForCopy(copyFrom)
  }, [searchParams])

  // Unified beforeunload warning: during upload or when details are being edited (unsaved changes)
  const hasUnsavedChanges = !!uploadedVideo && !isSubmitting
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
    if (isUploading || hasUnsavedChanges) {
      window.addEventListener('beforeunload', handler)
      return () => window.removeEventListener('beforeunload', handler)
    }
    return () => window.removeEventListener('beforeunload', handler)
  }, [isUploading, hasUnsavedChanges])

  const categories = MUSIC_CATEGORIES.map((category) => ({
    key: category,
    label: category,
  }))

  // Handle video upload completion
  const handleVideoUploadComplete = (uploadedFiles: UploadedVideo[]) => {
    console.log('Video upload results:', uploadedFiles)

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
    console.log('Cover upload result:', coverImage)

    setUploadForm((prev) => ({
      ...prev,
      thumbnailUrl: coverImage ? coverImage.fileUrl : '',
    }))
  }

  // Shared submit implementation
  const submitWork = async () => {
    setShowErrors(true)

    if (!user) {
      toast.error('Please login first')
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
      const workData = {
        ...uploadForm,
        userId: user.id,
        status: 'published',
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      }

      await createWork(workData)
      toast.success('Work published successfully!')
      router.push('/creator')
    } catch (error) {
      console.error('Publish failed:', error)
      toast.error('Publish failed, please try again')
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

  // Save draft
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error('Please login first')
      return
    }

    // Only require fileUrl for drafts
    const draftFileUrl = uploadForm?.fileUrl || uploadedVideo?.fileUrl
    if (!draftFileUrl) {
      toast.error('Please upload a video file first')
      return
    }

    // Build a draft title if available; otherwise allow empty
    const draftTitleCandidate = (
      uploadForm?.title?.trim() ||
      uploadedVideo?.originalName?.replace(/\.[^/.]+$/, '') ||
      ''
    ).trim()

    setIsSubmitting(true)

    try {
      const workData = {
        // only minimal fields for draft
        fileUrl: draftFileUrl,
        thumbnailUrl: uploadForm?.thumbnailUrl || null,
        title: draftTitleCandidate,
        description: uploadForm?.description ?? '',
        category: uploadForm?.category ?? '',
        language: uploadForm?.language ?? '',
        tags: uploadForm?.tags ?? '',
        isPaid: uploadForm?.isPaid ?? false,
        isForKids: uploadForm?.isForKids ?? true,
        userId: user.id,
        status: 'draft',
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      }

      await createWork(workData)
      toast.success('Draft saved successfully!')
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
  // Step 1: When copying, show a simple loading to avoid flashing the uploader
  const copyFromParam = searchParams?.get('copyFrom')
  if (copyFromParam && isCopyPrefillLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-muted-foreground"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              fill="currentColor"
              className="opacity-75"
            />
          </svg>
          <h1 className="text-4xl font-normal">Loading...</h1>
          <p className="text-base text-muted-foreground">Preparing copy data</p>
        </div>
      </div>
    )
  }

  // Step 2: Simple uploader view before details
  // Show simple uploader until a video is uploaded (when not copying or copy has no fileUrl)
  if (!uploadedVideo) {
    return (
      <div className="h-full">
        <div className="px-8 pt-6 pb-4 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-normal">Upload video</h1>
          </div>
          <p className="text-base text-muted-foreground">
            One sentence to describe The benefit for people to upload videos on
            Mastera
          </p>
          {/* {isUploading && (
            <div className="flex items-start gap-2 p-2 border rounded-md bg-yellow-50">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                Upload in progress. Please do not refresh or close this page.
              </div>
            </div>
          )} */}
        </div>

        <div className="px-8 py-10 flex justify-center">
          <div className="max-w-[640px] w-full">
            {/* Use existing uploader component for simplicity */}
            <div className="rounded-lg p-10">
              <VideoUpload
                onUploadComplete={handleVideoUploadComplete}
                onUploadingChange={setIsUploading}
              />
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
              By submitting your videos to Mastera, you acknowledge that you
              agree to Mastera's Terms of Service and Community Guidelines.
              Please be sure not to violate others' copyright or privacy rights.
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
                <h1 className="text-4xl font-normal">Upload video</h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground">
              One sentence to describe The benefit for people to upload videos
              on Mastera
            </p>

            {/* Unified warning during details editing (unsaved changes) */}
            {/* {hasUnsavedChanges && (
              <div className="flex items-start gap-2 p-2 border rounded-md bg-yellow-50">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  You have unsaved changes. Please do not refresh or close this
                  page.
                </div>
              </div>
            )} */}

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
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="bg-background border-t px-6 py-3 flex-shrink-0 absolute bottom-0 left-0 right-0 z-999">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                className="text-primary text-sm"
                onClick={handleSaveDraft}
              >
                Save a draft
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-[#F2F3F5] text-foreground px-4 h-10"
                  onClick={handleSaveDraft}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-white px-4 h-10"
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar removed; now inside WorkDetailsForm */}
      </div>
    </div>
  )
}
