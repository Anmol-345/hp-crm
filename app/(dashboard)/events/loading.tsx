import React from "react";

export default function EventsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="h-10 flex-1 rounded-lg bg-muted/40" />
          <div className="flex gap-2 flex-wrap">
            <div className="h-10 w-28 rounded-lg bg-muted/40" />
            <div className="h-10 w-28 rounded-lg bg-muted/40" />
            <div className="h-10 w-28 rounded-lg bg-muted/40" />
            <div className="h-10 w-28 rounded-lg bg-muted/40" />
          </div>
        </div>
      </div>

      {/* Events Table Skeleton */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-3.5 bg-muted/30 border-b border-border flex justify-between">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted/60" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 gap-4">
              <div className="size-8 rounded-lg bg-muted/60 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-36 rounded bg-muted/50" />
              </div>
              <div className="h-4 w-20 rounded bg-muted/60 hidden sm:block" />
              <div className="h-6 w-24 rounded-full bg-muted/50" />
              <div className="h-8 w-16 rounded-lg bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

