"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Video, Check, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatDuration } from "@/lib/format";

export default function VideoUpload({
  onUploadComplete,
  maxSize = 50 * 1024 * 1024, // 50MB
  readOnly = false,
  initialFiles = [],
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Initialize with provided files in read-only mode
  if (
    readOnly &&
    uploadedFiles.length === 0 &&
    Array.isArray(initialFiles) &&
    initialFiles.length > 0
  ) {
    // Set once to avoid re-renders; rely on parent controlling data
    setUploadedFiles(initialFiles);
  }

  // Upload a single file via Mux Direct Upload
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Check user authentication status
    if (!user) {
      throw new Error("Please log in before uploading files");
    }

    try {
      // Step 1: Request a Mux direct upload URL
      const createRes = await fetch("/api/mux/create-upload", {
        method: "POST",
      });
      const createData = await createRes.json();
      if (!createRes.ok || !createData?.url || !createData?.id) {
        throw new Error(createData?.error || "Failed to create Mux upload");
      }

      const { url: uploadUrl, id: uploadId } = createData;

      // Step 2: PUT the file to Mux direct upload URL
      setProgress(5);
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "video/mp4",
        },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error(
          `Mux upload failed: ${putRes.status} ${putRes.statusText}`
        );
      }
      setProgress(60);

      // Step 3: Poll upload status until asset is created
      let assetId = null;
      const maxTries = 20;
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let i = 0; i < maxTries; i++) {
        const statusRes = await fetch(`/api/mux/upload/${uploadId}`);
        const statusData = await statusRes.json();
        if (!statusRes.ok) {
          throw new Error(
            statusData?.error || "Failed to check Mux upload status"
          );
        }
        const u = statusData?.upload;
        if (u?.asset_id) {
          assetId = u.asset_id;
          break;
        }
        await delay(1000);
        setProgress((p) => Math.min(p + 5, 85));
      }

      if (!assetId) {
        throw new Error("Timed out waiting for asset to be created");
      }
      setProgress(90);

      // Step 4: Get asset details to fetch playbackId
      const assetRes = await fetch(`/api/mux/asset/${assetId}`);
      const assetData = await assetRes.json();
      if (!assetRes.ok) {
        throw new Error(assetData?.error || "Failed to retrieve Mux asset");
      }
      const playbackId = assetData?.asset?.playback_ids?.[0]?.id;
      const durationSec = assetData?.asset?.duration
        ? Math.round(assetData.asset.duration)
        : null;
      if (!playbackId) {
        throw new Error("No playback ID found on asset");
      }

      const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      setProgress(100);

      return {
        fileUrl: hlsUrl,
        playbackId,
        assetId,
        originalName: file.name,
        size: file.size,
        type: file.type,
        durationSeconds: durationSec,
        duration: formatDuration(durationSec),
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleFileSelect = async (files) => {
    setError("");
    const fileArray = Array.from(files);
    if (fileArray.length > 1) {
      setError("Please select only one file");
      return;
    }

    const file = fileArray[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError(`File ${file.name} is not a video file`);
      return;
    }
    if (file.size > maxSize) {
      setError(
        `File ${file.name} exceeds size limit (${maxSize / 1024 / 1024}MB)`
      );
      return;
    }

    try {
      setUploading(true);
      const result = await uploadFile(file);
      const newUploadedFiles = [...uploadedFiles, result];
      setUploadedFiles(newUploadedFiles);
      onUploadComplete?.(newUploadedFiles);
    } catch (error) {
      console.error("Upload failed:", error);
      setFailedFiles((prev) => [...prev, { file, error: error.message }]);
      setError(error.message || "Upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files.length > 1) {
        setError("Please drop only one file");
        return;
      }
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onUploadComplete?.(newFiles);
  };

  const retryFailed = async (index) => {
    const item = failedFiles[index];
    if (!item?.file) return;
    setError("");
    try {
      setUploading(true);
      const result = await uploadFile(item.file);
      setUploadedFiles((prev) => [...prev, result]);
      setFailedFiles((prev) => prev.filter((_, i) => i !== index));
      onUploadComplete?.([...uploadedFiles, result]);
    } catch (e) {
      setFailedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, error: e.message || "Upload failed, please retry" }
            : f
        )
      );
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Video file upload area */}
      {!readOnly && (
        <div
          className={`rounded-lg p-10 text-center transition-colors cursor-pointer ${
            dragActive ? "bg-primary/5" : "hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
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
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#6E56CF] text-white"
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
                    {item.file?.name || "Unknown file"}
                  </p>
                  <p className="text-sm text-red-600">
                    {item.error || "Upload failed"}
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
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
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
                      {file.originalName || file.fileName}
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
  );
}
