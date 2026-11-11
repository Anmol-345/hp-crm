import React from "react";

export default function AthletesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-52 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>

      {/* Search & Filters Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="h-10 flex-1 rounded-lg bg-muted/40" />
        <div className="flex gap-2">
          <div className="h-10 w-44 rounded-lg bg-muted/40" />
          <div className="h-10 w-32 rounded-lg bg-muted/40" />
        </div>
      </div>

      {/* Athletes Table Skeleton */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 gap-4">
            <div className="size-8 rounded-lg bg-muted/60" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-44 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted/50" />
            </div>
            <div className="h-6 w-32 rounded-full bg-muted/40" />
            <div className="h-4 w-16 rounded bg-muted/50" />
            <div className="h-4 w-28 rounded bg-muted/50 hidden sm:block" />
            <div className="h-7 w-20 rounded-lg bg-muted/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

