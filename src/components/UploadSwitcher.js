'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import VideoUpload from './VideoUpload'
import MuxUploaderPanel from './MuxUploaderPanel'

/**
 * UploadSwitcher
 * 在两种上传方式间切换：
 * - 手动直传（现有 VideoUpload 逻辑）
 * - 官方组件（MuxUploaderPanel）
 */
export default function UploadSwitcher({ onUploadComplete }) {
  const [method, setMethod] = useState('mux-uploader') // 'mux-uploader' | 'manual-mux'

  const handleSwitch = useCallback((next) => setMethod(next), [])

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-2">
        <Button
          variant={method === 'mux-uploader' ? 'solid' : 'flat'}
          color="primary"
          onPress={() => handleSwitch('mux-uploader')}
        >
          使用 Mux Uploader（推荐）
        </Button>
        <Button
          variant={method === 'manual-mux' ? 'solid' : 'flat'}
          color="secondary"
          onPress={() => handleSwitch('manual-mux')}
        >
          手动直传（现有方案）
        </Button>
      </div> */}

      {method === 'mux-uploader' ? (
        <MuxUploaderPanel onUploadComplete={onUploadComplete} />
      ) : (
        <VideoUpload onUploadComplete={onUploadComplete} />
      )}
    </div>
  )
}