import React from "react";

export default function AthleteProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 rounded bg-muted" />

      {/* Profile Header Hero Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-2xl bg-muted/60 shrink-0" />
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="h-5 w-16 rounded bg-muted/50" />
            </div>
            <div className="h-8 w-56 rounded bg-muted font-bold" />
            <div className="h-3 w-40 rounded bg-muted/50" />
          </div>
        </div>
        <div className="h-16 w-44 rounded-xl bg-muted/30" />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="h-5 w-44 rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-16 rounded-lg bg-muted/30" />
            <div className="h-16 rounded-lg bg-muted/30" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="h-5 w-44 rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-16 rounded-lg bg-muted/30" />
            <div className="h-16 rounded-lg bg-muted/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

