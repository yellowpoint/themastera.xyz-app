"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorks } from "@/hooks/useWorks";
import VideoUpload from "@/components/VideoUpload";
import ImgUpload from "@/components/ImgUpload";
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from "@/config/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/field";

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createWork } = useWorks();

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    language: "",
    tags: "",
    isPaid: false,
    isForKids: true,
    fileUrl: "",
    thumbnailUrl: "",
    status: "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [autoCover, setAutoCover] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  const categories = MUSIC_CATEGORIES.map((category) => ({
    key: category,
    label: category,
  }));

  // Handle video upload completion
  const handleVideoUploadComplete = (uploadedFiles) => {
    console.log("Video upload results:", uploadedFiles);

    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileUrls = uploadedFiles.map((file) => file.fileUrl).join(",");

      setUploadedVideo({
        name: uploadedFiles[0].originalName || "video.mp4",
        fileUrl: fileUrls,
        playbackId: uploadedFiles[0].playbackId,
        duration: uploadedFiles[0].duration || "0:00",
        durationSeconds: uploadedFiles[0].durationSeconds ?? null,
      });

      setUploadForm((prev) => ({
        ...prev,
        fileUrl: fileUrls,
        title:
          prev.title ||
          uploadedFiles[0].originalName?.replace(/\.[^/.]+$/, "") ||
          "",
        durationSeconds: uploadedFiles[0].durationSeconds ?? null,
      }));

      // Try to auto-generate a cover thumbnail from Mux playbackId
      const withPlayback = uploadedFiles.find((f) => !!f.playbackId);
      if (withPlayback?.playbackId) {
        const playbackId = withPlayback.playbackId;
        const thumbUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360&fit_mode=smartcrop&time=3`;

        const initialImage = {
          fileUrl: thumbUrl,
          originalName: "Auto thumbnail",
          size: 0,
          type: "image/webp",
        };
        setAutoCover(initialImage);

        setUploadForm((prev) => ({
          ...prev,
          thumbnailUrl: thumbUrl,
        }));
      }
    }
  };

  // Handle cover upload completion
  const handleCoverUploadComplete = (coverImage) => {
    console.log("Cover upload result:", coverImage);

    setUploadForm((prev) => ({
      ...prev,
      thumbnailUrl: coverImage ? coverImage.fileUrl : "",
    }));
  };

  // Publish work
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (
      !uploadForm.title ||
      !uploadForm.description ||
      !uploadForm.category ||
      !uploadForm.language
    ) {
      toast.error("Please fill in required information");
      return;
    }

    if (!uploadForm.fileUrl) {
      toast.error("Please upload video file");
      return;
    }

    if (!uploadForm.thumbnailUrl) {
      toast.error("Please upload cover image");
      return;
    }

    setIsSubmitting(true);

    try {
      const workData = {
        ...uploadForm,
        userId: user.id,
        status: "published",
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      };

      await createWork(workData);
      toast.success("Work published successfully!");
      router.push("/creator");
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error("Publish failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    // Only require fileUrl for drafts
    const draftFileUrl = uploadForm?.fileUrl || uploadedVideo?.fileUrl;
    if (!draftFileUrl) {
      toast.error("Please upload a video file first");
      return;
    }

    setIsSubmitting(true);

    try {
      const workData = {
        // only minimal fields for draft
        fileUrl: draftFileUrl,
        thumbnailUrl: uploadForm?.thumbnailUrl || null,
        userId: user.id,
        status: "draft",
        durationSeconds:
          uploadForm.durationSeconds ?? uploadedVideo?.durationSeconds ?? null,
      };

      await createWork(workData);
      toast.success("Draft saved successfully!");
      router.push("/creator");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Save failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadedVideo?.fileUrl) {
      navigator.clipboard.writeText(uploadedVideo.fileUrl);
      toast.success("Video link copied to clipboard");
    }
  };
  // Step 1: Simple uploader view before details
  // Show simple uploader until a video is uploaded
  if (!uploadedVideo) {
    return (
      <div className="h-full bg-white text-foreground">
        <div className="px-8 pt-6 pb-4 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-normal">Upload video</h1>
          </div>
          <p className="text-base text-muted-foreground">
            One sentence to describe The benefit for people to upload videos on
            Mastera
          </p>
        </div>

        <div className="px-8 py-10 flex justify-center">
          <div className="max-w-[640px] w-full">
            {/* Use existing uploader component for simplicity */}
            <div className="rounded-lg p-10">
              <VideoUpload onUploadComplete={handleVideoUploadComplete} />
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
              By submitting your videos to Mastera, you acknowledge that you
              agree to Mastera's Terms of Service and Community Guidelines.
              Please be sure not to violate others' copyright or privacy rights.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full light bg-background text-foreground">
      <div className="flex gap-1 h-full">
        {/* Middle Content - Upload Form */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pb-18">
          <div className="bg-white px-8 pt-6 pb-4 space-y-4 flex-shrink-0">
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

            <Separator className="opacity-20" />
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-8 py-2">
            <div className="max-w-[800px]">
              <FieldGroup>
                {/* Video Details Section */}
                <FieldSet>
                  <FieldLegend className="text-2xl font-normal text-primary">
                    Video details
                  </FieldLegend>
                  <FieldGroup>
                    {/* Title Field */}
                    <Field
                      className="bg-[#F7F8FA] rounded-lg p-2"
                      orientation="vertical"
                      data-invalid={
                        showErrors && !uploadForm.title ? true : undefined
                      }
                    >
                      <div className="px-3 py-2">
                        <FieldLabel className="text-lg text-muted-foreground">
                          Title <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>
                          Add a clear, descriptive title.
                        </FieldDescription>
                      </div>
                      <FieldContent>
                        <div className="flex justify-between items-center px-3">
                          <Input
                            placeholder="Add a title for your video"
                            value={uploadForm.title}
                            onChange={(e) =>
                              setUploadForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            maxLength={200}
                            required
                            aria-invalid={
                              showErrors && !uploadForm.title ? true : undefined
                            }
                          />
                          <span className="text-base text-muted-foreground ml-2">
                            {uploadForm.title.length}/200
                          </span>
                        </div>
                        <div className="px-3">
                          <FieldError
                            errors={
                              showErrors && !uploadForm.title
                                ? [{ message: "Title is required" }]
                                : []
                            }
                          />
                        </div>
                      </FieldContent>
                    </Field>

                    {/* Description Field */}
                    <Field
                      className="bg-[#F7F8FA] rounded-lg p-2 h-[180px]"
                      orientation="vertical"
                      data-invalid={
                        showErrors && !uploadForm.description ? true : undefined
                      }
                    >
                      <div className="px-3 py-2">
                        <FieldLabel className="text-lg text-muted-foreground">
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>
                          Explain what your video covers.
                        </FieldDescription>
                      </div>
                      <FieldContent>
                        <div className="flex flex-col h-[calc(100%-48px)] px-3">
                          <Textarea
                            placeholder="Tell viewer about your video"
                            value={uploadForm.description}
                            onChange={(e) =>
                              setUploadForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            maxLength={200}
                            required
                            aria-invalid={
                              showErrors && !uploadForm.description
                                ? true
                                : undefined
                            }
                          />
                          <span className="text-base text-muted-foreground text-right">
                            {uploadForm.description.length}/200
                          </span>
                          <FieldError
                            errors={
                              showErrors && !uploadForm.description
                                ? [{ message: "Description is required" }]
                                : []
                            }
                          />
                        </div>
                      </FieldContent>
                    </Field>

                    {/* Paid Content Toggle */}
                    <Field orientation="horizontal" className="py-2">
                      <Switch
                        disabled
                        className="mt-2"
                        id="isPaid"
                        checked={uploadForm.isPaid}
                        onCheckedChange={(checked) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            isPaid: checked,
                          }))
                        }
                      />
                      <FieldContent>
                        <FieldLabel
                          className="text-2xl font-normal text-primary cursor-pointer"
                          htmlFor="isPaid"
                        >
                          Paid Content
                        </FieldLabel>
                        <FieldDescription>
                          This is the description of why people paid to view,
                          and how creator have reward from this, such as for
                          each review, the create can have 10 mastera points
                          reward.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Thumbnail Section */}
                <FieldSet>
                  <FieldLegend className="text-2xl font-normal text-primary">
                    Thumbnail
                  </FieldLegend>
                  <FieldDescription>
                    Set a thumbnail that stands out and draws viewers'
                    attention.
                  </FieldDescription>
                  <FieldGroup>
                    <Field
                      className="space-y-2"
                      data-invalid={
                        showErrors && !uploadForm.thumbnailUrl
                          ? true
                          : undefined
                      }
                    >
                      <FieldContent>
                        <ImgUpload
                          onUploadComplete={handleCoverUploadComplete}
                          required={true}
                          initialImage={autoCover}
                        />
                        <FieldError
                          errors={
                            showErrors && !uploadForm.thumbnailUrl
                              ? [{ message: "Thumbnail is required" }]
                              : []
                          }
                        />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Music Style Section */}
                <FieldSet>
                  <FieldLegend className="text-2xl font-normal text-primary">
                    Music style
                  </FieldLegend>
                  <FieldDescription>
                    Let people know what kind of music style you create.
                  </FieldDescription>
                  <FieldGroup>
                    <Field
                      className="py-2"
                      data-invalid={
                        showErrors && !uploadForm.category ? true : undefined
                      }
                    >
                      <FieldContent>
                        <Select
                          value={uploadForm.category}
                          onValueChange={(val) =>
                            setUploadForm((prev) => ({
                              ...prev,
                              category: val,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-[#F7F8FA] border-0 h-auto p-2 w-full">
                            <div className="px-3 py-2">
                              <SelectValue
                                placeholder="Select music style"
                                className="text-2xl font-normal"
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.key}
                                value={category.key}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={
                            showErrors && !uploadForm.category
                              ? [{ message: "Music style is required" }]
                              : []
                          }
                        />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {/* Language Section */}
                <FieldSet>
                  <FieldLegend className="text-2xl font-normal text-primary">
                    Language and captions certification
                  </FieldLegend>
                  <FieldDescription>
                    Select your video's language and, if needed, a caption
                    certification.
                  </FieldDescription>
                  <FieldGroup>
                    <Field
                      className="py-2"
                      data-invalid={
                        showErrors && !uploadForm.language ? true : undefined
                      }
                    >
                      <FieldContent>
                        <Select
                          value={uploadForm.language}
                          onValueChange={(val) =>
                            setUploadForm((prev) => ({
                              ...prev,
                              language: val,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-[#F7F8FA] border-0 h-auto p-2 w-full">
                            <div className="px-3 py-2">
                              <SelectValue
                                placeholder="Select language"
                                className="text-2xl font-normal"
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_CATEGORIES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={
                            showErrors && !uploadForm.language
                              ? [{ message: "Language is required" }]
                              : []
                          }
                        />
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Audience Section */}
                <FieldSet>
                  <FieldLegend className="text-2xl font-normal text-primary">
                    Audience
                  </FieldLegend>
                  <FieldDescription>
                    Regardless of your location, you're legally required to
                    comply with COPPA and/or other laws. Tell us whether your
                    videos are made for kids.
                  </FieldDescription>
                  <FieldGroup>
                    <RadioGroup
                      value={uploadForm.isForKids ? "yes" : "no"}
                      onValueChange={(val) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          isForKids: val === "yes",
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="kids-yes" />
                        <Label
                          htmlFor="kids-yes"
                          className="text-base font-normal cursor-pointer"
                        >
                          Yes, this content is for kids
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="kids-no" />
                        <Label
                          htmlFor="kids-no"
                          className="text-base font-normal cursor-pointer"
                        >
                          No, this content is not made for kids
                        </Label>
                      </div>
                    </RadioGroup>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </div>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="bg-white border-t px-6 py-3 flex-shrink-0 absolute bottom-0 left-0 right-0 z-999">
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator orientation="vertical" className="h-auto opacity-20" />

        {/* Right Sidebar - Video Status */}
        <div className="flex-none w-[250px] bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-normal text-primary">Video status</h2>

            {/* Video Upload Section */}
            <div className="space-y-4">
              <VideoUpload
                readOnly={true}
                initialFiles={uploadedVideo ? [uploadedVideo] : []}
                onUploadComplete={handleVideoUploadComplete}
              />
            </div>

            <Separator className="opacity-20" />

            {/* Video Preview */}
            {uploadedVideo && (
              <div className="space-y-4">
                <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {uploadedVideo.playbackId ? (
                    <img
                      src={`https://image.mux.com/${uploadedVideo.playbackId}/thumbnail.webp?width=640&height=360&fit_mode=smartcrop&time=3`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-600">Video Preview</span>
                    </div>
                  )}
                  {uploadedVideo.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded text-sm">
                      {uploadedVideo.duration}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-normal mb-1">File name</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedVideo.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal mb-1">Video link</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {uploadedVideo.fileUrl}
                      </span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                        onClick={handleCopyLink}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
