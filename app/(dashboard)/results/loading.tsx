import React from "react";

export default function ResultsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-60 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>

      {/* Action Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="h-9 w-48 rounded-lg bg-muted/40" />
        <div className="h-9 w-52 rounded-lg bg-muted/60" />
      </div>

      {/* Podium Cards Skeleton (3 Cards) */}
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 h-44 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 rounded-full bg-muted/50" />
              <div className="h-4 w-12 rounded bg-muted/40" />
            </div>
            <div className="space-y-1">
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted/50" />
            </div>
            <div className="h-6 w-20 rounded bg-muted/60" />
          </div>
          <div className="rounded-xl border-2 border-amber-300/40 bg-card p-4 space-y-3 h-44 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 rounded-full bg-amber-200/50" />
              <div className="h-4 w-12 rounded bg-muted/40" />
            </div>
            <div className="space-y-1">
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted/50" />
            </div>
            <div className="h-6 w-20 rounded bg-muted/60" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 h-44 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 rounded-full bg-muted/50" />
              <div className="h-4 w-12 rounded bg-muted/40" />
            </div>
            <div className="space-y-1">
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted/50" />
            </div>
            <div className="h-6 w-20 rounded bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Results Table Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="h-4 w-32 rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

