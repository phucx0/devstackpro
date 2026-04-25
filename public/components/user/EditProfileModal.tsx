"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { updateAvatar, updateInfo } from "@/server/users/user.actions";
import { useAuth } from "@/public/providers/AuthProvider";
import { useModal } from "@/public/providers/ModalProvider";

export default function EditProfileModal() {
  const { profile } = useAuth();

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL_IMAGE!;
  const router = useRouter();
  const { uploadFile } = useFileUpload();
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { open, setOpen } = useModal();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitial = () => {
    if (!profile) return;
    const text = name || profile.display_name || profile.email || "U";
    return text.charAt(0).toUpperCase();
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await updateInfo({
        display_name: name,
        bio: bio,
      });

      router.refresh();
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save profile. Please try again ");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { fileKey, success } = await uploadFile(file, "image");
      if (success && fileKey) {
        setAvatarPreview(IMAGE_BASE_URL + fileKey);
        updateAvatar(fileKey);
        toast.success("Avatar uploaded successfully");
      } else {
        toast.error("Upload thumbnail failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Cập nhật lại preview khi name thay đổi (nếu chưa có ảnh)
  useEffect(() => {
    if (profile) {
      setName(profile.display_name || "");
      setBio(profile.bio || "");
      setAvatarPreview(IMAGE_BASE_URL + profile.avatar_url);
    }
  }, [profile, IMAGE_BASE_URL]);

  if (!open || !profile) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-100 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-(--noir-card) w-[70%] rounded-md border-2 border-(--noir-border-md) overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-(--noir-border) flex items-center justify-between">
          <p className="text-xl font-semibold text-(--noir-white)">
            Edit Profile
          </p>
          <button
            onClick={() => setOpen(false)}
            className="text-(--noir-muted) hover:text-white transition-colors p-1"
          >
            <X size={26} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-3xl overflow-hidden border-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-(--noir-muted) bg-(--noir-surface)">
                    {getInitial()}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-(--noir-card) border border-(--noir-border-md) p-3 rounded-2xl shadow-xl hover:bg-(--noir-surface) transition-all active:scale-95 disabled:opacity-70"
              >
                {uploading ? (
                  <Loader2
                    size={20}
                    className="animate-spin text-(--noir-white)"
                  />
                ) : (
                  <Upload size={20} className="text-(--noir-white)" />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />

            <p className="text-(--noir-muted) text-sm mt-4">
              Click the icon to change your avatar
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-(--noir-muted) mb-2 font-medium">
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-(--noir-surface) border border-(--noir-border-md) rounded-2xl px-5 py-3.5 text-lg focus:outline-none focus:border-(--noir-white)/40 transition-colors"
              placeholder="Enter your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-(--noir-muted) mb-2 font-medium">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="w-full bg-(--noir-surface) border border-(--noir-border-md) rounded-3xl px-5 py-4 resize-y min-h-[120px] focus:outline-none focus:border-(--noir-white)/40 transition-colors"
              placeholder="Write a short bio about yourself..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-6 border-t border-(--noir-border) flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-4 rounded-2xl border border-(--noir-border-md) hover:bg-(--noir-surface) transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 active:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
