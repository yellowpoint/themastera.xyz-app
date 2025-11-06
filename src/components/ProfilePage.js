"use client";

import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ChevronDown, Edit, Save, X, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase, getStorageUrl } from "@/lib/supabase";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "Jacky Q",
    description: "",
    avatar: user?.image || null,
  });

  // Prefill from API to get description and latest fields
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/${user.id}`);
        const json = await res.json();
        if (json?.success && json?.data) {
          const u = json.data;
          setFormData((prev) => ({
            ...prev,
            name: u.name || prev.name,
            description: u.description || "",
            avatar: u.image || prev.avatar,
          }));
        }
      } catch (e) {
        console.error("Failed to fetch user profile:", e);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText("8912345678912345679");
    toast.success("Mastera ID copied to clipboard");
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText("ATZ56N5U");
    toast.success("Invite code copied to clipboard");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadAvatar = async (file) => {
    if (!file || !user?.id) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from("data")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Avatar upload failed: ${error.message}`);
      }

      const publicUrl = getStorageUrl("data", filePath);
      return publicUrl;
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const handleAvatarUpload = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB limit — consistent with ImgUpload)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      const avatarUrl = await uploadAvatar(file);
      handleInputChange("avatar", avatarUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Avatar upload failed");
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
      handleAvatarUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarUpload(e.target.files);
    }
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }
      const payload = {
        name: formData.name,
        image: formData.avatar || null,
        description: formData.description || null,
      };

      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.error || "Update failed");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData((prev) => ({
      name: user?.name || prev.name || "Jacky Q",
      description: prev.description || "",
      avatar: user?.image || prev.avatar || null,
    }));
    setIsEditing(false);
  };

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardContent className="p-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Profile</h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-[168px] h-[168px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl text-gray-600">
                            {formData.name?.[0] || "U"}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div
                        className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                          <Camera className="w-8 h-8 text-white" />
                        )}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>

                  {isEditing && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Click or drag to upload new avatar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Name Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your name"
                      className="text-2xl font-normal h-12"
                    />
                  ) : (
                    <h2 className="text-2xl font-normal">{formData.name}</h2>
                  )}
                </div>

                {/* Badge */}
                <div className="flex justify-center">
                  <Badge variant="outline" className="rounded h-6">
                    <img
                      src="/path/to/badge.png"
                      alt="Badge"
                      className="h-full"
                    />
                  </Badge>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px] resize-none"
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {formData.description}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.description.length}/500
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Stats and Info */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="flex justify-center gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-base font-normal text-foreground">
                      400
                    </span>
                    <span className="text-base text-muted-foreground">
                      Following
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-base font-normal text-foreground">
                      200
                    </span>
                    <span className="text-base text-muted-foreground">
                      Followers
                    </span>
                  </div>
                </div>

                <Separator className="opacity-20" />

                {/* Mastera ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mastera ID</label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>8912345678912345679</span>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={handleCopyId}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mastera Points */}
                <div className="bg-[#F7F8FA] p-4 rounded-lg">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">
                        Mastera Points
                      </span>
                      <span className="text-4xl font-normal text-[#7440DF]">
                        1,257
                      </span>
                    </div>
                    <Button className="bg-[#7440DF] text-white px-4 py-2 rounded h-10 flex items-center gap-2">
                      Get more points
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Invite Code */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Personal invite code
                  </label>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-normal">ATZ56N5U</span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={handleCopyInviteCode}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-[68px] h-[69px] bg-[#F7F8FA] rounded flex items-center justify-center">
                      {/* QR Code placeholder */}
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
