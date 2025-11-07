'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  X,
  Video,
  Check,
  RefreshCw,
  Pause,
  Play,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatDuration } from '@/lib/format'
import { request } from '@/lib/request'
import { createUpload as createUpChunkUpload } from '@mux/upchunk'

export type UploadedVideo = {
  fileUrl: string
  playbackId: string
  assetId: string
  originalName: string
  size: number
  type: string
  durationSeconds?: number | null
  duration?: string | null
  completedAt: string
}

type FailedUpload = {
  file: File
  error: string
}

type VideoUploadProps = {
  onUploadComplete?: (files: UploadedVideo[]) => void
  onUploadingChange?: (uploading: boolean) => void
  maxSize?: number
  readOnly?: boolean
  initialFiles?: UploadedVideo[]
}

export default function VideoUpload({
  onUploadComplete,
  onUploadingChange,
  maxSize = 50 * 1024 * 1024, // 50MB
  readOnly = false,
  initialFiles = [],
}: VideoUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null) // bytes/sec
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedVideo[]>([])
  const [failedFiles, setFailedFiles] = useState<FailedUpload[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // Guard to prevent double-opening the system file picker
  const selectingRef = useRef<boolean>(false)
  // Keep a reference to the active UpChunk upload instance for pause/resume
  const currentUploadRef = useRef<any | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const { user } = useAuth()

  // Initialize with provided files in read-only mode
  if (
    readOnly &&
    uploadedFiles.length === 0 &&
    Array.isArray(initialFiles) &&
    initialFiles.length > 0
  ) {
    // Set once to avoid re-renders; rely on parent controlling data
    setUploadedFiles(initialFiles)
  }

  // Upload a single file via Mux Direct Upload
  const uploadFile = async (file: File): Promise<UploadedVideo> => {
    if (!file) {
      throw new Error('No file provided')
    }

    // Check user authentication status
    if (!user) {
      throw new Error('Please log in before uploading files')
    }

    try {
      // Step 1: Request a Mux direct upload URL (use shared request util)
      const createRes = await request.post<{ url: string; id: string }>(
        '/api/mux/create-upload'
      )
      const createData: any = createRes.data as any
      const uploadUrl =
        (createData as any)?.data?.url ?? (createData as any)?.url
      const uploadId = (createData as any)?.data?.id ?? (createData as any)?.id
      if (!createRes.ok || !uploadUrl || !uploadId) {
        throw new Error(
          (createData as any)?.error?.message || 'Failed to create Mux upload'
        )
      }

      // Step 2: PUT the file to Mux direct upload URL
      // Step 2: Upload via Mux UpChunk (chunked, resumable) with real-time progress
      await new Promise<void>((resolve, reject) => {
        // Use direct signed upload URL with UpChunk. The correct option is `uploadUrl`, not `endpoint`.
        const upload = createUpChunkUpload({
          endpoint: uploadUrl,
          file,
          // Reduce chunk size to increase progress event frequency (KB). Default is 5120 (5MB).
          chunkSize: 2048,
        })

        currentUploadRef.current = upload
        setIsPaused(false)

        const last = { percent: 0, bytes: 0, time: Date.now() }

        upload.on('progress', (event: any) => {
          const d = event?.detail ?? event
          const percent = Math.max(
            0,
            Math.min(
              100,
              Number(d?.percent ?? d?.percentage ?? d?.progress ?? 0)
            )
          )
          const percentUpload = Math.floor((percent / 100) * 70) // 0–70% reserved for upload
          setProgress((p) => (percentUpload > p ? percentUpload : p))

          // Approximate uploaded bytes based on percent and total size
          const uploadedBytes = Math.floor(
            Number(d?.uploadedBytes ?? (percent / 100) * file.size) as number
          )
          const now = Date.now()
          const deltaBytes = uploadedBytes - last.bytes
          const deltaMs = now - last.time
          if (deltaMs > 0 && deltaBytes >= 0) {
            const speedBytesPerSec = (deltaBytes / deltaMs) * 1000
            setUploadSpeed(speedBytesPerSec)
            last.percent = percent
            last.bytes = uploadedBytes
            last.time = now
          }
        })

        // Optional: mark chunk boundaries (can be useful for debugging perceived stalls)
        upload.on('chunkSuccess', () => {
          // Small nudge forward to ensure UI feels responsive even if percent is sparse
          setProgress((p) => (p < 70 ? Math.min(p + 1, 70) : p))
        })

        upload.on('success', () => {
          setProgress((p) => (p < 75 ? 75 : p))
          setUploadSpeed(null)
          currentUploadRef.current = null
          setIsPaused(false)
          resolve()
        })

        upload.on('error', (e: any) => {
          currentUploadRef.current = null
          setIsPaused(false)
          reject(new Error(e?.detail?.message || 'Mux upload failed'))
        })
      })

      // Step 3: Poll upload status until asset is created
      let assetId: string | null = null
      const maxTries = 20
      const delay = (ms) => new Promise((r) => setTimeout(r, ms))
      for (let i = 0; i < maxTries; i++) {
        const statusRes = await request.get<any>(`/api/mux/upload/${uploadId}`)
        const statusData: any = statusRes.data as any
        if (!statusRes.ok) {
          throw new Error(
            (statusData as any)?.error?.message ||
              'Failed to check Mux upload status'
          )
        }
        const u =
          (statusData as any)?.data?.upload ?? (statusData as any)?.upload
        if (u?.asset_id) {
          assetId = u.asset_id
          break
        }
        await delay(1000)
        // Polling phase progresses from 75% to 95%
        setProgress((p) => (p < 95 ? Math.min(p + 2, 95) : p))
      }

      if (!assetId) {
        throw new Error('Timed out waiting for asset to be created')
      }
      setProgress(90)

      // Step 4: Get asset details to fetch playbackId
      const assetRes = await request.get<any>(`/api/mux/asset/${assetId}`)
      const assetData: any = assetRes.data as any
      if (!assetRes.ok) {
        throw new Error(
          (assetData as any)?.error?.message || 'Failed to retrieve Mux asset'
        )
      }
      const asset = (assetData as any)?.data?.asset ?? (assetData as any)?.asset
      const playbackId: string | undefined = asset?.playback_ids?.[0]?.id
      const durationSec: number | null = asset?.duration
        ? Math.round(asset.duration as number)
        : null
      if (!playbackId) {
        throw new Error('No playback ID found on asset')
      }

      const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`
      setProgress(100)

      return {
        fileUrl: hlsUrl,
        playbackId: playbackId!,
        assetId: assetId!,
        originalName: file.name,
        size: file.size,
        type: file.type,
        durationSeconds: durationSec,
        duration: formatDuration(durationSec),
        completedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error as Error
    } finally {
      setTimeout(() => {
        setProgress(0)
        setUploadSpeed(null)
        currentUploadRef.current = null
        setIsPaused(false)
      }, 1000)
    }
  }

  const handleFileSelect = async (files: FileList) => {
    setError('')
    const fileArray = Array.from(files)
    if (fileArray.length > 1) {
      setError('Please select only one file')
      return
    }

    const file = fileArray[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError(`File ${file.name} is not a video file`)
      return
    }
    if (file.size > maxSize) {
      setError(
        `File ${file.name} exceeds size limit (${maxSize / 1024 / 1024}MB)`
      )
      return
    }

    try {
      setUploading(true)
      onUploadingChange?.(true)
      const result = await uploadFile(file)
      const newUploadedFiles = [...uploadedFiles, result]
      setUploadedFiles(newUploadedFiles)
      onUploadComplete?.(newUploadedFiles)
    } catch (error: any) {
      console.error('Upload failed:', error)
      setFailedFiles((prev) => [...prev, { file, error: error.message }])
      setError(error.message || 'Upload failed, please try again')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files.length > 1) {
        setError('Please drop only one file')
        return
      }
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent duplicate dialogs and uploads when already handling a selection
    if (uploading || selectingRef.current) {
      e.preventDefault()
      return
    }
    const files = e.target.files
    if (files && files[0]) {
      selectingRef.current = true
      try {
        await handleFileSelect(files)
      } finally {
        // Reset input value to allow re-selecting the same file and avoid spurious re-opens
        selectingRef.current = false
        e.target.value = ''
      }
    }
  }

  // Pause/resume controls for UpChunk
  const pauseUpload = () => {
    if (
      currentUploadRef.current &&
      typeof currentUploadRef.current.pause === 'function'
    ) {
      currentUploadRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeUpload = () => {
    if (
      currentUploadRef.current &&
      typeof currentUploadRef.current.resume === 'function'
    ) {
      currentUploadRef.current.resume()
      setIsPaused(false)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUploadComplete?.(newFiles)
  }

  const retryFailed = async (index: number) => {
    const item = failedFiles[index]
    if (!item?.file) return
    setError('')
    try {
      setUploading(true)
      onUploadingChange?.(true)
      const result = await uploadFile(item.file)
      setUploadedFiles((prev) => [...prev, result])
      setFailedFiles((prev) => prev.filter((_, i) => i !== index))
      onUploadComplete?.([...uploadedFiles, result])
    } catch (e: any) {
      setFailedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, error: e.message || 'Upload failed, please retry' }
            : f
        )
      )
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSec: number | null) => {
    if (!bytesPerSec || bytesPerSec <= 0) return ''
    const k = 1024
    if (bytesPerSec < k) return `${bytesPerSec.toFixed(0)} B/s`
    const kb = bytesPerSec / k
    if (kb < k) return `${kb.toFixed(1)} KB/s`
    const mb = kb / k
    return `${mb.toFixed(2)} MB/s`
  }

  return (
    <div className="w-full space-y-4">
      {/* Video file upload area */}
      {!readOnly && (
        <div
          className={`rounded-lg p-10 text-center transition-colors cursor-pointer ${
            dragActive ? 'bg-primary/5' : 'hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => {
            e.stopPropagation()
            if (!uploading) {
              fileInputRef.current?.click()
            }
          }}
          aria-disabled={uploading}
        >
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl font-semibold mb-2">
            Drag and drop a video file to upload
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your videos will be private until you publish them
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (!uploading) {
                fileInputRef.current?.click()
              }
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#6E56CF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            Select file
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Failed uploads list with retry */}
      {!readOnly && failedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-red-600">Upload errors:</h4>
          {failedFiles.map((item, index) => (
            <Card key={`failed-${index}`} className="border-red-200">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-red-800">
                    {item.file?.name || 'Unknown file'}
                  </p>
                  <p className="text-sm text-red-600">
                    {item.error || 'Upload failed'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => retryFailed(index)}
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Retry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {!readOnly && uploading && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 border rounded-md bg-yellow-50">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-700">
              Upload in progress. Please do not refresh or close this page.
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>
              {progress}%{uploadSpeed ? ` • ${formatSpeed(uploadSpeed)}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            {!isPaused ? (
              <Button size="sm" variant="outline" onClick={pauseUpload}>
                <Pause className="w-4 h-4 mr-1" /> Pause
              </Button>
            ) : (
              <Button size="sm" variant="default" onClick={resumeUpload}>
                <Play className="w-4 h-4 mr-1" /> Resume
              </Button>
            )}
          </div>
        </div>
      )}

      {/* List of uploaded videos */}
      {!readOnly && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-green-600">Uploaded videos:</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="border-green-200">
              <CardContent className="flex flex-row items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      {file.originalName}
                    </p>
                    <p className="text-sm text-green-600">
                      Upload successful • {formatFileSize(file.size)}
                    </p>
                    {file.completedAt && (
                      <p className="text-xs text-gray-500">
                        Completed at {formatDate(file.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
