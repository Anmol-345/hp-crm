import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-muted" />
          <div className="h-4 w-96 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-lg bg-muted" />
          <div className="h-9 w-36 rounded-lg bg-muted" />
        </div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="size-10 rounded-full bg-muted" />
              <div className="h-4 w-12 rounded bg-muted/50" />
            </div>
            <div className="h-7 w-20 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted/60" />
          </div>
        ))}
      </div>

      {/* Chart + List skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted/40" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="h-5 w-36 rounded bg-muted" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

