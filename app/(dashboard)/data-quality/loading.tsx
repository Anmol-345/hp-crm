import React from "react";

export default function DataQualityLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="h-7 w-72 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>

      {/* Discrepancy Alert Banner Skeleton */}
      <div className="rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-400/20" />
          <div className="space-y-1">
            <div className="h-4 w-60 rounded bg-muted" />
            <div className="h-3 w-80 rounded bg-muted/60" />
          </div>
        </div>
        <div className="h-7 w-36 rounded-full bg-emerald-100 dark:bg-emerald-950/50" />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
        <div className="h-7 w-48 rounded bg-muted/40" />
        <div className="h-4 w-28 rounded bg-muted/40" />
      </div>

      {/* Verification Card List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-36 rounded bg-muted/60" />
                <div className="h-4 w-14 rounded bg-muted/60" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-lg bg-muted/40" />
                <div className="h-8 w-28 rounded-lg bg-muted/60" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-muted/40" />
              <div className="h-4 w-36 rounded bg-muted/40" />
              <div className="h-4 w-20 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

