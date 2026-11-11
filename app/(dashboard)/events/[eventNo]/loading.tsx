import React from "react";

export default function EventDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-32 rounded bg-muted" />

      {/* Event Header Banner Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted/60" />
              <div className="h-5 w-24 rounded bg-muted/60" />
            </div>
            <div className="h-8 w-72 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted/50" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="h-16 w-28 rounded-lg bg-muted/30" />
            <div className="h-16 w-28 rounded-lg bg-muted/30" />
            <div className="h-16 w-28 rounded-lg bg-muted/30" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 pt-3 gap-4">
        <div className="h-8 w-44 rounded bg-muted/50" />
        <div className="h-8 w-44 rounded bg-muted/30" />
        <div className="h-8 w-44 rounded bg-muted/30" />
      </div>

      {/* Content Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="h-5 w-36 rounded bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  );
}

