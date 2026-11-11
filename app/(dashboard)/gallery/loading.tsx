import React from "react";

export default function GalleryLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-3 w-80 bg-muted rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 bg-muted rounded-lg" />
          <div className="h-9 w-36 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted/50 border border-border rounded-xl p-3.5 space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="h-14 bg-muted/40 border border-border rounded-xl" />

      {/* Grid of photo cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden space-y-3">
            <div className="aspect-[4/3] bg-muted/60" />
            <div className="p-3.5 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded pt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
