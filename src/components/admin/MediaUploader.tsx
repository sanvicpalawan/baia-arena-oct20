"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Video, CheckCircle2, Loader2 } from "lucide-react";

interface MediaUploaderProps {
  passkey: string;
  onUploadComplete: (url: string, type: "image" | "video") => void;
  acceptType?: "all" | "image" | "video";
  label?: string;
}

export function MediaUploader({ passkey, onUploadComplete, acceptType = "all", label = "Upload Image or Video from Device" }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("passkey", passkey);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setPreviewUrl(data.url);
        onUploadComplete(data.url, isVideo ? "video" : "image");
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      setError("Network or server error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const acceptMime =
    acceptType === "image"
      ? "image/*"
      : acceptType === "video"
      ? "video/*"
      : "image/*,video/*";

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#12232E] uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#12232E]/20 hover:border-[#C87D55] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/60 hover:bg-white flex flex-col items-center justify-center gap-2 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMime}
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex items-center gap-2 text-xs text-[#C87D55] py-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading from your device...</span>
          </div>
        ) : previewUrl ? (
          <div className="flex items-center gap-2 text-xs text-emerald-700 py-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Uploaded Successfully: {previewUrl}</span>
            <span className="text-[10px] text-[#4F6D7A]">(Click to replace)</span>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-full bg-[#12232E]/5 group-hover:bg-[#C87D55]/10 text-[#C87D55] transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#12232E]">
              <span className="font-semibold text-[#C87D55]">Click to choose file</span> from your phone or computer
            </div>
            <p className="text-[10px] text-[#4F6D7A]">
              JPG, PNG, WEBP, MP4, MOV up to 50MB
            </p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
