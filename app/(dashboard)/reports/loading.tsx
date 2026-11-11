import React from "react";

export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Action Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1">
          <div className="h-5 w-60 rounded bg-muted" />
          <div className="h-3 w-80 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-lg bg-muted/40" />
          <div className="h-8 w-28 rounded-lg bg-muted/60" />
        </div>
      </div>

      {/* 4 High-level KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="h-3 w-28 rounded bg-muted/50" />
            <div className="h-8 w-24 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted/40" />
          </div>
        ))}
      </div>

      {/* 2-Column Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="h-5 w-44 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted/30" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="h-5 w-52 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted/30" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="h-4 w-48 rounded bg-muted" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

