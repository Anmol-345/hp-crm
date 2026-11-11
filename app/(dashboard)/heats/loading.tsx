import React from "react";

export default function HeatsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric / Compliance Banner Skeleton */}
      <div className="rounded-xl bg-[#101B60] p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-white/10" />
          <div className="space-y-1">
            <div className="h-3 w-36 rounded bg-white/20" />
            <div className="h-4 w-64 rounded bg-white/15" />
          </div>
        </div>
        <div className="h-8 w-40 rounded-lg bg-white/10 hidden sm:block" />
      </div>

      {/* Main Title Strip Skeleton */}
      <div className="bg-card rounded-xl border border-border p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted/60" />
            <div className="h-4 w-24 rounded bg-muted/60" />
          </div>
          <div className="h-7 w-64 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-40 rounded-lg bg-muted/60" />
          <div className="h-9 w-32 rounded-lg bg-muted/40" />
          <div className="h-9 w-24 rounded-lg bg-muted/40" />
        </div>
      </div>

      {/* 8 Cols Grid & 4 Cols Keypad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table skeleton */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-lg bg-muted" />
            <div className="h-8 w-24 rounded-lg bg-muted/50" />
            <div className="h-8 w-24 rounded-lg bg-muted/50" />
          </div>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/30" />
            ))}
          </div>
        </div>

        {/* Touch Keypad skeleton */}
        <div className="lg:col-span-4 bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-14 rounded-lg bg-muted/40" />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-muted/30" />
            ))}
          </div>
          <div className="h-10 rounded-lg bg-muted/50" />
        </div>
      </div>
    </div>
  );
}

