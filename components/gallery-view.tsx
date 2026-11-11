"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Plus,
  Filter,
  Search,
  X,
  Maximize2,
  Trash2,
  Download,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  User,
  Check,
  Loader2,
  Tag,
} from "lucide-react";
import { EventPhoto, PhotoCategory, DayOption, Event } from "@/lib/data/types";
import {
  getEventPhotos,
  addEventPhoto,
  deleteEventPhoto,
} from "@/lib/data/photos";
import { cn } from "@/lib/utils";

interface GalleryViewProps {
  initialPhotos: EventPhoto[];
  events: Event[];
}

const CATEGORIES: Array<"All" | PhotoCategory> = [
  "All",
  "Podium & Top 3",
  "Track & Sprints",
  "Field Events",
  "Ceremonies",
];

const PRESET_GALLERY_PHOTOS = [
  {
    title: "100m Sprint Final Flashpoint",
    category: "Track & Sprints" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    caption: "Sprinters charging past the 80m mark towards the finish line tape.",
  },
  {
    title: "Men's 100m Official Victory Podium",
    category: "Podium & Top 3" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80",
    caption: "Gold, Silver, and Bronze medal winners on the podium.",
  },
  {
    title: "4x100m Relay Baton Handover",
    category: "Track & Sprints" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
    caption: "Precision blind handover inside the 20-meter changeover box.",
  },
  {
    title: "Men's Long Jump Sand Explosion",
    category: "Field Events" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    caption: "Landing into the sand pit during Men's Long Jump finals.",
  },
  {
    title: "Shot Put Maximum Extension",
    category: "Field Events" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    caption: "Heavy metal release during Men's Shot Put session 2.",
  },
  {
    title: "Opening March Past & Flame Salute",
    category: "Ceremonies" as PhotoCategory,
    url: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
    caption: "10 unit contingents saluting the HP sports flame at Chembur.",
  },
];

export function GalleryView({ initialPhotos, events }: GalleryViewProps) {
  const [photos, setPhotos] = useState<EventPhoto[]>(initialPhotos);
  const [activeCategory, setActiveCategory] = useState<"All" | PhotoCategory>("All");
  const [selectedDay, setSelectedDay] = useState<"All" | DayOption>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Lightbox Modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Upload Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<PhotoCategory>("Track & Sprints");
  const [newEventNo, setNewEventNo] = useState<number | "">("");
  const [newPhotographer, setNewPhotographer] = useState("HP Media Cell");
  const [newTagged, setNewTagged] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from client storage to reflect any newly saved Top 3 photos
  useEffect(() => {
    getEventPhotos().then((items) => {
      setPhotos(items);
    });
  }, []);

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) {
      return false;
    }
    if (selectedDay !== "All" && p.day !== selectedDay) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.eventName && p.eventName.toLowerCase().includes(q)) ||
        (p.photographer && p.photographer.toLowerCase().includes(q)) ||
        p.taggedAthletes?.some((a) => a.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewUrl(reader.result);
        setFormError(null);
      }
    };
    reader.onerror = () => {
      setFormError("Error reading image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      setFormError("Photo Title and an Image URL/File are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const targetEvent = events.find((ev) => ev.eventNo === Number(newEventNo));
      const taggedList = newTagged
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await addEventPhoto({
        title: newTitle.trim(),
        caption: newCaption.trim() || undefined,
        url: newUrl,
        category: newCategory,
        eventNo: newEventNo ? Number(newEventNo) : undefined,
        eventName: targetEvent?.name,
        day: targetEvent?.day || "28 Feb 2025",
        photographer: newPhotographer.trim() || "HP Media Cell",
        taggedAthletes: taggedList,
        isPodiumPhoto: newCategory === "Podium & Top 3",
      });

      setPhotos((prev) => [created, ...prev]);
      setIsUploadOpen(false);

      // Reset form
      setNewTitle("");
      setNewCaption("");
      setNewUrl("");
      setNewEventNo("");
      setNewTagged("");
    } catch (err: any) {
      setFormError(err?.message || "Failed to add photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this photo from the media gallery?")) {
      await deleteEventPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      if (lightboxIndex !== null) setLightboxIndex(null);
    }
  };

  const handleDownload = (photo: EventPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `${photo.title.replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    link.click();
  };

  // Lightbox navigation
  const currentLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (lightboxIndex === 0) {
      setLightboxIndex(filteredPhotos.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < filteredPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER & ACTIONS ────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Championship Media</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Event Photography</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground tracking-tight flex items-center gap-2.5">
            <Camera className="size-7 text-hp-navy dark:text-primary" />
            Official Meet Photo Gallery
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            High-resolution action photography, victory ceremonies, and track &amp; field moments · Chembur Sports Complex
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Trophy className="size-3.5 text-amber-500" />
            <span>Go to Results &amp; Podiums</span>
          </Link>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Upload Event Photo</span>
          </button>
        </div>
      </div>

      {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Captured Photos
          </span>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-hp-navy dark:text-primary mt-0.5">
            {photos.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Top 3 Victory Podiums
          </span>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-amber-600 dark:text-amber-400 mt-0.5">
            {photos.filter((p) => p.isPodiumPhoto || p.category === "Podium & Top 3").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Track &amp; Sprints
          </span>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-emerald-600 dark:text-emerald-400 mt-0.5">
            {photos.filter((p) => p.category === "Track & Sprints").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Field &amp; Ceremonies
          </span>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-slate-700 dark:text-slate-300 mt-0.5">
            {photos.filter((p) => p.category === "Field Events" || p.category === "Ceremonies").length}
          </p>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ─────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 md:p-4 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? photos.length
                : photos.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-hp-navy text-white shadow-xs font-bold"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat === "Podium & Top 3" && <Trophy className="size-3 text-amber-400" />}
                <span>{cat}</span>
                <span
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-0.2",
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Day Selector & Search Input */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:border-hp-navy focus:outline-none"
          >
            <option value="All">All Meet Days</option>
            <option value="28 Feb 2025">Day 1 (28 Feb)</option>
            <option value="1 Mar 2025">Day 2 (1 Mar)</option>
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search photo, event, athlete..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PHOTO GRID ──────────────────────────────────────────────────── */}
      {filteredPhotos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card space-y-3">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
            <Camera className="size-6" />
          </div>
          <h3 className="font-bold text-base text-foreground">No photos found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No media matching your selected category and search query. Try switching filters or upload a new photo.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setSelectedDay("All");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => {
            const isPodium = photo.isPodiumPhoto || photo.category === "Podium & Top 3";
            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer hover:border-hp-navy/50"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md shadow-xs flex items-center gap-1",
                        isPodium
                          ? "bg-amber-500/90 text-white"
                          : "bg-black/70 text-white"
                      )}
                    >
                      {isPodium && <Trophy className="size-3 text-white" />}
                      {photo.category}
                    </span>

                    {photo.eventNo && (
                      <span className="rounded-full bg-hp-navy/90 text-white px-2 py-0.5 text-[10px] font-bold backdrop-blur-md shadow-xs">
                        Event #{photo.eventNo}
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay with Action Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="size-9 rounded-full bg-white/95 text-hp-navy flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="size-4" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDownload(photo, e)}
                      className="size-9 rounded-full bg-white/95 text-foreground hover:text-hp-navy flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      title="Download Photo"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(photo.id, e)}
                      className="size-9 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      title="Delete Photo"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-hp-navy dark:group-hover:text-primary transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    {photo.caption && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    )}
                  </div>

                  {/* Tagged Athletes or Footer Metadata */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">
                      {photo.taggedAthletes && photo.taggedAthletes.length > 0 ? (
                        <span className="font-medium text-foreground">
                          {photo.taggedAthletes.slice(0, 2).join(", ")}
                          {photo.taggedAthletes.length > 2 && " +more"}
                        </span>
                      ) : (
                        photo.photographer || "HP Media Cell"
                      )}
                    </span>
                    <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
                      {photo.day || "28 Feb 2025"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIGHTBOX / SLIDESHOW MODAL ──────────────────────────────────── */}
      {currentLightboxPhoto && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 md:p-6 backdrop-blur-md animate-in fade-in select-none"
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all"
            title="Previous Photo"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all"
            title="Next Photo"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Center Stage Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-2xl bg-black/80 border border-white/15 overflow-hidden shadow-2xl"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-black/50 text-white">
              <div className="flex items-center gap-2 truncate">
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {currentLightboxPhoto.category}
                </span>
                {currentLightboxPhoto.eventNo && (
                  <span className="text-xs text-white/70 font-mono">
                    Event #{currentLightboxPhoto.eventNo}
                  </span>
                )}
                <span className="text-sm font-bold text-white truncate ml-1">
                  {currentLightboxPhoto.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/50 font-mono mr-2">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload(currentLightboxPhoto)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Download Photo"
                >
                  <Download className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(currentLightboxPhoto.id, e)}
                  className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* High-res Photo */}
            <div className="relative flex-1 flex items-center justify-center p-2 bg-black min-h-[350px] max-h-[68vh] overflow-hidden">
              <img
                src={currentLightboxPhoto.url}
                alt={currentLightboxPhoto.title}
                className="max-h-[68vh] w-auto max-w-full object-contain shadow-2xl rounded"
              />
            </div>

            {/* Bottom Details Footer */}
            <div className="p-4 bg-black/70 border-t border-white/10 text-white space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs font-semibold text-amber-300">
                  {currentLightboxPhoto.caption || currentLightboxPhoto.title}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-white/60">
                  <span>Photo: {currentLightboxPhoto.photographer}</span>
                  <span>·</span>
                  <span>{currentLightboxPhoto.day || "28 Feb 2025"}</span>
                </div>
              </div>

              {currentLightboxPhoto.taggedAthletes &&
                currentLightboxPhoto.taggedAthletes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                      Tagged:
                    </span>
                    {currentLightboxPhoto.taggedAthletes.map((ath, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90"
                      >
                        {ath}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD NEW PHOTO ─────────────────────────────────────── */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-lg bg-hp-navy/10 flex items-center justify-center text-hp-navy dark:text-primary">
                  <Camera className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Upload Event Photo to Gallery
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Add action photography, ceremonies, or podium moments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreatePhoto} className="p-5 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
                  {formError}
                </div>
              )}

              {/* Photo Upload or Preview */}
              {newUrl ? (
                <div className="relative rounded-xl border border-border overflow-hidden aspect-video bg-black/5 flex items-center justify-center">
                  <img src={newUrl} alt="Preview" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewUrl("")}
                    className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-border hover:border-hp-navy/60 p-6 flex flex-col items-center justify-center gap-2 bg-muted/10 cursor-pointer transition-colors text-center"
                >
                  <div className="size-10 rounded-full bg-hp-navy/10 flex items-center justify-center text-hp-navy dark:text-primary">
                    <Upload className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Click to upload photo from your computer
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      JPG, PNG, WebP up to 10MB
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

              {/* Or Direct URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Or enter hosted image URL:</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/championship-photo.jpg"
                  value={newUrl.startsWith("data:") ? "(Uploaded local image)" : newUrl}
                  disabled={newUrl.startsWith("data:")}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" />
                  Or pick a sample photo from championship presets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_GALLERY_PHOTOS.slice(0, 3).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewUrl(p.url);
                        setNewTitle(p.title);
                        setNewCategory(p.category);
                        setNewCaption(p.caption);
                        setFormError(null);
                      }}
                      className="group relative rounded-lg border border-border p-1.5 text-left hover:border-hp-navy hover:bg-muted/30 transition-all text-[11px]"
                    >
                      <div className="aspect-video w-full rounded overflow-hidden mb-1 bg-muted">
                        <img
                          src={p.url}
                          alt={p.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="font-semibold text-foreground line-clamp-1 block text-[10px]">
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Photo Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Men's 100m Final Sprint Finish"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>

              {/* Category & Event Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PhotoCategory)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  >
                    <option value="Track & Sprints">Track &amp; Sprints</option>
                    <option value="Podium & Top 3">Podium &amp; Top 3</option>
                    <option value="Field Events">Field Events</option>
                    <option value="Ceremonies">Ceremonies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Link to Event (Optional)
                  </label>
                  <select
                    value={newEventNo}
                    onChange={(e) => setNewEventNo(e.target.value ? Number(e.target.value) : "")}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  >
                    <option value="">No specific event</option>
                    {events.map((ev) => (
                      <option key={ev.eventNo} value={ev.eventNo}>
                        Event #{ev.eventNo}: {ev.name} ({ev.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Write a brief description or note on this photo..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                />
              </div>

              {/* Photographer & Tagged Athletes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Photographer Credit
                  </label>
                  <input
                    type="text"
                    value={newPhotographer}
                    onChange={(e) => setNewPhotographer(e.target.value)}
                    placeholder="e.g. S. K. Raman"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Tagged Athletes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTagged}
                    onChange={(e) => setNewTagged(e.target.value)}
                    placeholder="e.g. Amit Sharma, Rajesh Kumar"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newUrl || !newTitle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Adding to Gallery...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>Add to Gallery</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryView;

