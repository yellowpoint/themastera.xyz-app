'use client'

import ImgUpload from '@/components/ImgUpload'
import { PageLoading } from '@/components/PageLoading'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import VideoPlayer from '@/components/VideoPlayer'
import VideoUpload, { UploadedVideo } from '@/components/VideoUpload'
import { LANGUAGE_CATEGORIES, MUSIC_CATEGORIES } from '@/config/categories'
import { CustomSidebarWidth } from '../CustomSidebar'

export type CoverImage = {
  fileUrl: string
  originalName?: string
  size?: number
  type?: string
}

export type UploadFormState = {
  title: string
  description: string
  category: string
  language: string
  isPaid: boolean
  isForKids: boolean
  thumbnailUrl: string
}

type WorkDetailsFormProps = {
  value: UploadFormState
  onChange: (patch: Partial<UploadFormState>) => void
  showErrors?: boolean
  autoCover: CoverImage | null
  onCoverUploadComplete: (coverImage: CoverImage | null) => void
  // Right sidebar props
  uploadedVideo: UploadedVideo | null
  onVideoUploadComplete: (files: UploadedVideo[]) => void
  onCopyLink: () => void
  // Loading overlay props
  loading?: boolean
  // Footer action bar props
  showFooter?: boolean
  onSaveDraft?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
  onPrimary?: () => void | Promise<void>
  isSubmitting?: boolean
  primaryButtonText?: string
  primaryButtonLoadingText?: string
  saveDraftLabel?: string
  cancelLabel?: string
}

export default function WorkDetailsForm({
  value,
  onChange,
  showErrors = false,
  autoCover,
  onCoverUploadComplete,
  uploadedVideo,
  onVideoUploadComplete,
  onCopyLink,
  loading = false,
  showFooter = false,
  onSaveDraft,
  onCancel,
  onPrimary,
  isSubmitting = false,
  primaryButtonText = 'Submit',
  primaryButtonLoadingText = 'Submitting...',
  saveDraftLabel = 'Save as draft',
  cancelLabel = 'Cancel',
}: WorkDetailsFormProps) {
  const categories = MUSIC_CATEGORIES.map((category) => ({
    key: category,
    label: category,
  }))

  // Loading layer: extracted as a dedicated component
  if (loading) {
    return <PageLoading />
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details form */}
        <div className="lg:col-span-2">
          <FieldGroup>
            {/* Video Details Section */}
            <FieldSet>
              <FieldLegend className="text-2xl! font-normal text-primary">
                Video details
              </FieldLegend>
              <FieldGroup>
                {/* Title Field */}
                <Field
                  className="bg-[#F7F8FA] rounded-lg p-2"
                  orientation="vertical"
                  data-invalid={showErrors && !value.title ? true : undefined}
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
                        value={value.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        maxLength={200}
                        required
                        aria-invalid={
                          showErrors && !value.title ? true : undefined
                        }
                      />
                      <span className="text-base text-muted-foreground ml-2">
                        {value.title.length}/200
                      </span>
                    </div>
                    <div className="px-3">
                      <FieldError
                        errors={
                          showErrors && !value.title
                            ? [{ message: 'Title is required' }]
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
                    showErrors && !value.description ? true : undefined
                  }
                >
                  <div className="px-3 py-2">
                    <FieldLabel className="text-lg text-muted-foreground">
                      Description <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldDescription>
                      Explain what your video covers.
                    </FieldDescription>
                  </div>
                  <FieldContent>
                    <div className="flex flex-col h-[calc(100%-48px)] px-3">
                      <Textarea
                        placeholder="Tell viewer about your video"
                        value={value.description}
                        onChange={(e) =>
                          onChange({ description: e.target.value })
                        }
                        maxLength={200}
                        required
                        aria-invalid={
                          showErrors && !value.description ? true : undefined
                        }
                      />
                      <span className="text-base text-muted-foreground text-right">
                        {value.description.length}/200
                      </span>
                      <FieldError
                        errors={
                          showErrors && !value.description
                            ? [{ message: 'Description is required' }]
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
                    checked={value.isPaid}
                    onCheckedChange={(checked) => onChange({ isPaid: checked })}
                  />
                  <FieldContent>
                    <FieldLabel
                      className="text-2xl font-normal text-primary cursor-pointer"
                      htmlFor="isPaid"
                    >
                      Paid Content
                    </FieldLabel>
                    <FieldDescription>
                      This is the description of why people paid to view, and
                      how creator have reward from this.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Thumbnail Section */}
            <FieldSet>
              <FieldLegend className="text-2xl! font-normal text-primary">
                Thumbnail
              </FieldLegend>
              <FieldDescription>
                Set a thumbnail that stands out and draws viewers' attention.
              </FieldDescription>
              <FieldGroup>
                <Field
                  className="space-y-2"
                  data-invalid={
                    showErrors && !value.thumbnailUrl ? true : undefined
                  }
                >
                  <FieldContent>
                    <ImgUpload
                      key={autoCover?.fileUrl || 'no-auto-cover'}
                      onUploadComplete={onCoverUploadComplete}
                      required={true}
                      initialImage={autoCover}
                    />
                    <FieldError
                      errors={
                        showErrors && !value.thumbnailUrl
                          ? [{ message: 'Thumbnail is required' }]
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
              <FieldLegend className="text-2xl! font-normal text-primary">
                Music style
              </FieldLegend>
              <FieldDescription>
                Let people know what kind of music style you create.
              </FieldDescription>
              <FieldGroup>
                <Field
                  className="py-2"
                  data-invalid={
                    showErrors && !value.category ? true : undefined
                  }
                >
                  <FieldContent>
                    <Select
                      value={value.category}
                      onValueChange={(val) => onChange({ category: val })}
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
                          <SelectItem key={category.key} value={category.key}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        showErrors && !value.category
                          ? [{ message: 'Music style is required' }]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Language Section */}
            <FieldSet>
              <FieldLegend className="text-2xl! font-normal text-primary">
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
                    showErrors && !value.language ? true : undefined
                  }
                >
                  <FieldContent>
                    <Select
                      value={value.language}
                      onValueChange={(val) => onChange({ language: val })}
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
                        showErrors && !value.language
                          ? [{ message: 'Language is required' }]
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
              <FieldLegend className="text-2xl! font-normal text-primary">
                Audience
              </FieldLegend>
              <FieldDescription>
                Regardless of your location, you're legally required to comply
                with COPPA and/or other laws. Tell us whether your videos are
                made for kids.
              </FieldDescription>
              <FieldGroup>
                <RadioGroup
                  value={value.isForKids ? 'yes' : 'no'}
                  onValueChange={(val) =>
                    onChange({ isForKids: val === 'yes' })
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="kids-yes" />
                    <Label
                      htmlFor="kids-yes"
                      className="text-base font-normal cursor-pointer"
                    >
                      Yes, this content is for kids
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
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

        {/* Right: Video status */}
        <div className="flex-none lg:col-span-1">
          <div className="p-6 space-y-6 bg-background rounded-md border">
            <h2 className="text-2xl font-normal text-primary">Video status</h2>

            {/* Video Upload Section */}
            <div className="space-y-4">
              <VideoUpload
                readOnly={true}
                initialFiles={uploadedVideo ? [uploadedVideo] : []}
                onUploadComplete={onVideoUploadComplete}
              />
            </div>

            <Separator className="opacity-20" />

            {/* Video Preview -> Player */}
            {uploadedVideo && (
              <div className="space-y-4">
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  <VideoPlayer
                    videoUrl={uploadedVideo.fileUrl}
                    title={value.title || 'Preview'}
                    width="100%"
                    height="100%"
                    autoPlay={false}
                    muted={true}
                  />

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
                      {uploadedVideo.originalName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      {showFooter && (
        <div
          className="fixed bottom-0 right-0 z-50 bg-background border-t px-6 py-3 flex-shrink-0"
          style={{ left: CustomSidebarWidth }}
        >
          <div className="flex justify-between items-center">
            {onSaveDraft ? (
              <Button
                variant="ghost"
                className="text-primary text-sm"
                onClick={onSaveDraft}
              >
                {saveDraftLabel}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {onCancel && (
                <Button
                  variant="outline"
                  className="bg-[#F2F3F5] text-foreground px-4 h-10"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              )}
              {onPrimary && (
                <Button
                  className="bg-primary text-white px-4 h-10"
                  onClick={onPrimary}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? primaryButtonLoadingText : primaryButtonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
