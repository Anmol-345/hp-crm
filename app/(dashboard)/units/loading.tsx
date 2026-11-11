import React from "react";

export default function UnitsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>

      {/* Chart Section Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1">
          <div className="h-5 w-64 rounded bg-muted" />
          <div className="h-3 w-80 rounded bg-muted/60" />
        </div>
        <div className="h-64 rounded-lg bg-muted/30" />
      </div>

      {/* Standings Table Skeleton */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden p-4 space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-muted/50" />
              <div className="h-4 w-36 rounded bg-muted" />
            </div>
            <div className="flex gap-6">
              <div className="h-4 w-10 rounded bg-muted/50" />
              <div className="h-4 w-10 rounded bg-muted/50" />
              <div className="h-4 w-10 rounded bg-muted/50" />
              <div className="h-4 w-12 rounded bg-muted font-bold" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

