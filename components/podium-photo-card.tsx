"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Check,
  Sparkles,
  Maximize2,
  Trash2,
  Loader2,
  Trophy,
} from "lucide-react";
import { EventPhoto } from "@/lib/data/types";
import {
  getPodiumPhotoForEvent,
  savePodiumPhotoForEvent,
  deleteEventPhoto,
} from "@/lib/data/photos";

interface PodiumPhotoCardProps {
  eventNo: number;
  eventName: string;
  pos1Name?: string;
  pos2Name?: string;
  pos3Name?: string;
  onPhotoUpdated?: (photo: EventPhoto | null) => void;
}

const PRESET_PODIUM_PHOTOS = [
  {
    name: "Victory Podium & Medals",
    url: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80",
    description: "Athletes on podium celebrating with gold, silver, and bronze",
  },
  {
    name: "Championship Medals Ceremony",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    description: "Official award presentation with gold medals & championship trophy",
  },
  {
    name: "Track Sprint Finish Moments",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    description: "Sprinters crossing the finish line tape in photo-finish excitement",
  },
];

export function PodiumPhotoCard({
  eventNo,
  eventName,
  pos1Name,
  pos2Name,
  pos3Name,
  onPhotoUpdated,
}: PodiumPhotoCardProps) {
  const [photo, setPhoto] = useState<EventPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Modal Form State
  const [photoUrl, setPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    getPodiumPhotoForEvent(eventNo).then((p) => {
      if (mounted) {
        setPhoto(p);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [eventNo]);

  const defaultCaption = [
    pos1Name ? `🥇 1st: ${pos1Name}` : "",
    pos2Name ? `🥈 2nd: ${pos2Name}` : "",
    pos3Name ? `🥉 3rd: ${pos3Name}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const handleOpenModal = () => {
    setPhotoUrl(photo?.url || "");
    setCaption(photo?.caption || defaultCaption);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result);
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      setUploadError("Please provide an image URL or upload a file.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const tagged = [pos1Name, pos2Name, pos3Name].filter(Boolean) as string[];
      const saved = await savePodiumPhotoForEvent(
        eventNo,
        eventName,
        photoUrl,
        caption || defaultCaption,
        tagged
      );

      setPhoto(saved);
      setIsModalOpen(false);
      if (onPhotoUpdated) onPhotoUpdated(saved);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to save podium photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photo) return;
    if (confirm("Are you sure you want to remove the podium ceremony photo for this event?")) {
      await deleteEventPhoto(photo.id);
      setPhoto(null);
      setIsLightboxOpen(false);
      if (onPhotoUpdated) onPhotoUpdated(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-3 rounded-xl bg-muted/20 animate-pulse text-xs text-muted-foreground">
        Checking podium media records...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── PHOTO PRESENT ──────────────────────────────────────────────── */}
      {photo ? (
        <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-primary/5 to-transparent p-3 md:p-4 transition-all hover:border-amber-500/50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail with overlay buttons */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full sm:w-44 h-32 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border shadow-xs group-hover:shadow-md transition-all"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="p-1.5 rounded-full bg-white/90 text-hp-navy shadow-sm">
                  <Maximize2 className="size-4" />
                </span>
              </div>
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider backdrop-blur-xs">
                Official Podium Photo
              </span>
            </div>

            {/* Photo info and controls */}
            <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  <Trophy className="size-3 text-amber-600" />
                  Top 3 Victory Ceremony
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Event #{eventNo} Record
                </span>
              </div>

              <h4 className="text-sm font-bold text-foreground truncate">
                {photo.title}
              </h4>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {photo.caption}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-hp-navy dark:text-primary hover:underline"
                >
                  <Maximize2 className="size-3.5" />
                  View Full Size
                </button>
                <span className="text-border">·</span>
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Camera className="size-3.5" />
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── PHOTO NOT ADDED YET (BANNER & ADD BUTTON) ──────────────────── */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/15 p-3.5 px-4 text-center sm:text-left hover:border-hp-navy/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <Camera className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Top 3 Victory Podium Photo
              </p>
              <p className="text-[11px] text-muted-foreground">
                Attach official award ceremony photo of 1st, 2nd &amp; 3rd place winners
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-semibold transition-all shadow-xs shrink-0"
          >
            <Upload className="size-3.5" />
            <span>Add Top 3 Photo</span>
          </button>
        </div>
      )}

      {/* ── MODAL: UPLOAD / ATTACH PODIUM PHOTO ────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Camera className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Top 3 Victory Ceremony Photo
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Event #{eventNo}: {eventName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSavePhoto} className="p-5 space-y-4 overflow-y-auto">
              {uploadError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
                  {uploadError}
                </div>
              )}

              {/* Image Preview Box */}
              {photoUrl ? (
                <div className="relative rounded-xl border border-border overflow-hidden aspect-video bg-black/5 flex items-center justify-center">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl("")}
                    className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition-colors"
                    title="Remove preview"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                /* Upload Drop Zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-border hover:border-hp-navy/60 p-6 flex flex-col items-center justify-center gap-2 bg-muted/10 cursor-pointer transition-colors text-center"
                >
                  <div className="size-10 rounded-full bg-hp-navy/10 flex items-center justify-center text-hp-navy">
                    <Upload className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Click to upload podium photo from your device
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      PNG, JPG, or WebP up to 10MB
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Or Paste Direct Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Or enter public image URL:</span>
                  <span className="text-[10px] text-muted-foreground">Hosted / Cloud Link</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/podium-photo.jpg"
                  value={photoUrl.startsWith("data:") ? "(Uploaded local file)" : photoUrl}
                  disabled={photoUrl.startsWith("data:")}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" />
                  Quick sample podium presets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PODIUM_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(p.url);
                        setUploadError(null);
                      }}
                      className="group relative rounded-lg border border-border p-1.5 text-left hover:border-hp-navy hover:bg-muted/30 transition-all text-[11px]"
                    >
                      <div className="aspect-video w-full rounded overflow-hidden mb-1 bg-muted">
                        <img
                          src={p.url}
                          alt={p.name}
                          className="size-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="font-semibold text-foreground line-clamp-1 block text-[10px]">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Podium Caption &amp; Tagged Athletes
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. 🥇 1st: Amit Sharma, 🥈 2nd: Rajesh Kumar, 🥉 3rd: Sunil Verma"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !photoUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>Save Podium Photo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX / FULLSCREEN VIEWER ────────────────────────────────── */}
      {isLightboxOpen && photo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            {/* Top Close Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Event #{eventNo} Official Podium Ceremony
                </span>
                <h3 className="text-base font-bold text-white truncate">
                  {photo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* High-res Image */}
            <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={photo.url}
                alt={photo.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption under image */}
            <div className="w-full pt-3 text-center sm:text-left text-white/90 text-xs">
              <p className="font-semibold text-amber-300">{photo.caption}</p>
              <p className="text-[11px] text-white/60 mt-0.5">
                Photographed by {photo.photographer} · Chembur Sports Complex · 19th All India Sports Meet
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PodiumPhotoCard;
