'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import MuxUploader from '@mux/mux-uploader-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Video, X, Check } from 'lucide-react'

/**
 * MuxUploaderPanel
 * 使用官方 Mux Uploader 组件完成直传，便于与现有上传方式对比切换。
 * - 动态创建 Direct Upload endpoint（每次上传都会创建一个新的 URL）
 * - 监听上传成功事件后轮询 upload -> asset -> playbackId
 * - 将结果以与 VideoUpload 相同的结构通过 onUploadComplete 回传
 */
export default function MuxUploaderPanel({
  onUploadComplete,
  maxFileSize = 5 * 1024 * 1024 * 1024, // 默认最大 5GB
}) {
  const [currentUploadId, setCurrentUploadId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const pollingRef = useRef({ aborted: false })

  const resetState = useCallback(() => {
    setCurrentUploadId(null)
    setUploading(false)
    setProgress(0)
    setError('')
    pollingRef.current.aborted = false
  }, [])

  // 每次上传前创建新的直传 URL（endpoint）
  const getEndpoint = useCallback(async () => {
    try {
      setError('')
      setUploading(true)
      setProgress(5)
      const res = await fetch('/api/mux/create-upload', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data?.url || !data?.id) {
        throw new Error(data?.error || '创建直传链接失败')
      }
      setCurrentUploadId(data.id)
      setProgress(10)
      return data.url
    } catch (e) {
      console.error('获取直传链接失败:', e)
      setError(e.message || '获取直传链接失败')
      setUploading(false)
      throw e
    }
  }, [])

  const delay = useCallback((ms) => new Promise((r) => setTimeout(r, ms)), [])

  const pollForAssetAndPlayback = useCallback(async (uploadId) => {
    let assetId = null
    const maxTries = 30
    for (let i = 0; i < maxTries; i++) {
      if (pollingRef.current.aborted) return null
      const statusRes = await fetch(`/api/mux/upload/${uploadId}`)
      const statusData = await statusRes.json()
      if (!statusRes.ok) {
        throw new Error(statusData?.error || '查询上传状态失败')
      }
      const u = statusData?.upload
      if (u?.asset_id) {
        assetId = u.asset_id
        break
      }
      setProgress((p) => Math.min(p + 3, 70))
      await delay(1000)
    }
    if (!assetId) {
      throw new Error('等待创建资产超时')
    }
    setProgress(80)

    const assetRes = await fetch(`/api/mux/asset/${assetId}`)
    const assetData = await assetRes.json()
    if (!assetRes.ok) {
      throw new Error(assetData?.error || '获取资产信息失败')
    }
    const playbackId = assetData?.asset?.playback_ids?.[0]?.id
    const durationSec = assetData?.asset?.duration ? Math.round(assetData.asset.duration) : null
    if (!playbackId) {
      throw new Error('资产未包含 playbackId')
    }
    setProgress(100)
    return { assetId, playbackId, hlsUrl: `https://stream.mux.com/${playbackId}.m3u8`, durationSeconds: durationSec }
  }, [delay])

  // 上传成功事件（仅表示文件已成功 PUT 至直传 URL）
  const handleSuccess = useCallback(async () => {
    try {
      setProgress(60)
      if (!currentUploadId) {
        throw new Error('缺少上传 ID，无法继续查询资产')
      }
      const info = await pollForAssetAndPlayback(currentUploadId)
      if (!info) return

      const newItem = {
        fileUrl: info.hlsUrl,
        playbackId: info.playbackId,
        assetId: info.assetId,
        originalName: 'Uploaded Video',
        size: 0,
        type: 'video',
        durationSeconds: info.durationSeconds,
        duration: formatDuration(info.durationSeconds),
      }
      const newUploadedFiles = [...uploadedFiles, newItem]
      setUploadedFiles(newUploadedFiles)
      onUploadComplete?.(newUploadedFiles)
      setError('')
    } catch (e) {
      console.error('处理上传成功后的查询失败:', e)
      setError(e.message || '上传完成，但查询播放信息失败')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [currentUploadId, pollForAssetAndPlayback, uploadedFiles, onUploadComplete])

  const handleUploadError = useCallback((e) => {
    const msg = typeof e === 'string' ? e : (e?.message || '上传失败')
    setError(msg)
    setUploading(false)
  }, [])

  const removeFile = useCallback((index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUploadComplete?.(newFiles)
  }, [uploadedFiles, onUploadComplete])

  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0) return '—'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const formatDuration = useCallback((seconds) => {
    if (!seconds && seconds !== 0) return null
    const s = Math.max(0, Math.round(seconds))
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
    const ss = String(sec).padStart(2, '0')
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
  }, [])

  return (
    <div className="w-full space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">

        <MuxUploader
          endpoint={getEndpoint}
          accept="video/*"
          maxFileSize={maxFileSize / 1024} // kB
          onSuccess={handleSuccess}
          onUploadError={handleUploadError}
        />

        {/* 上传进度 */}
        {uploading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>上传中...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-green-600">已上传的视频:</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="border-green-200">
              <CardContent className="flex flex-row items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{file.originalName || file.fileName || 'Uploaded Video'}</p>
                    <p className="text-sm text-green-600">
                      上传成功 • {formatFileSize(file.size)}
                    </p>
                    {/* {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        预览播放
                      </a>
                    )} */}
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