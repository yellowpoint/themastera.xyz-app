'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Video, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function VideoUpload({
  onUploadComplete,
  maxSize = 50 * 1024 * 1024, // 50MB
  bucket = 'data',
  folder = ''
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  // Ensure bucket and folder parameters are valid
  const storageBucket = bucket || 'data'
  const storageFolder = folder ? `${folder}/` : ''

  // Upload a single file via Mux Direct Upload
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error('No file provided')
    }

    // Check user authentication status
    if (!user) {
      throw new Error('Please log in before uploading files')
    }

    try {
      // Step 1: Request a Mux direct upload URL
      const createRes = await fetch('/api/mux/create-upload', { method: 'POST' })
      const createData = await createRes.json()
      if (!createRes.ok || !createData?.url || !createData?.id) {
        throw new Error(createData?.error || 'Failed to create Mux upload')
      }

      const { url: uploadUrl, id: uploadId } = createData

      // Step 2: PUT the file to Mux direct upload URL
      setProgress(5)
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'video/mp4',
        },
        body: file,
      })

      if (!putRes.ok) {
        throw new Error(`Mux upload failed: ${putRes.status} ${putRes.statusText}`)
      }
      setProgress(60)

      // Step 3: Poll upload status until asset is created
      let assetId = null
      const maxTries = 20
      const delay = (ms) => new Promise((r) => setTimeout(r, ms))
      for (let i = 0; i < maxTries; i++) {
        const statusRes = await fetch(`/api/mux/upload/${uploadId}`)
        const statusData = await statusRes.json()
        if (!statusRes.ok) {
          throw new Error(statusData?.error || 'Failed to check Mux upload status')
        }
        const u = statusData?.upload
        if (u?.asset_id) {
          assetId = u.asset_id
          break
        }
        await delay(1000)
        setProgress((p) => Math.min(p + 5, 85))
      }

      if (!assetId) {
        throw new Error('Timed out waiting for asset to be created')
      }
      setProgress(90)

      // Step 4: Get asset details to fetch playbackId
      const assetRes = await fetch(`/api/mux/asset/${assetId}`)
      const assetData = await assetRes.json()
      if (!assetRes.ok) {
        throw new Error(assetData?.error || 'Failed to retrieve Mux asset')
      }
      const playbackId = assetData?.asset?.playback_ids?.[0]?.id
      if (!playbackId) {
        throw new Error('No playback ID found on asset')
      }

      const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`
      setProgress(100)

      return {
        fileUrl: hlsUrl,
        playbackId,
        assetId,
        originalName: file.name,
        size: file.size,
        type: file.type,
      }

    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }

  // Upload multiple files
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    setUploading(true)
    const results = []
    const errors = []

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await uploadFile(files[i])
          results.push(result)
        } catch (error) {
          errors.push({ file: files[i].name, error: error.message })
        }
      }

      return {
        results,
        errors,
        success: errors.length === 0
      }
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (files) => {
    setError('') // Clear previous errors
    const fileArray = Array.from(files)
    
    // Validate file type (only allow video files)
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('video/')) {
        setError(`File ${file.name} is not a video file`)
        return false
      }
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds size limit (${maxSize / 1024 / 1024}MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Start uploading automatically
    try {
      setUploading(true)
      const uploadResult = await uploadFiles(validFiles)

      if (uploadResult && uploadResult.results) {
        const newUploadedFiles = [...uploadedFiles, ...uploadResult.results];
        setUploadedFiles(newUploadedFiles);
        
        // Pass file information
        onUploadComplete?.(newUploadedFiles);
        setError('');
      } else {
        setError('Upload failed: No valid upload result received')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setError(error.message || 'Upload failed, please try again')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files)
    }
  }

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUploadComplete?.(newFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      {/* Video file upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          Click or drag video files here to upload
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: MP4, MOV, AVI, MKV | Max size: {maxSize / 1024 / 1024}MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* List of uploaded videos */}
      {uploadedFiles.length > 0 && (
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
                    <p className="font-medium text-green-800">{file.originalName || file.fileName}</p>
                    <p className="text-sm text-green-600">
                      Upload successful • {formatFileSize(file.size)}
                    </p>
                    {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Video
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
              </Card>
          ))}
        </div>
      )}
    </div>
  )
}