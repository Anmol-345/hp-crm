import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* Top Welcome Banner Skeleton */}
      <div className="rounded-2xl bg-gradient-to-r from-[#101B60] via-[#001375] to-[#1F2E8C] p-7 lg:p-10 shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex gap-2">
              <div className="h-6 w-36 rounded-full bg-white/20" />
              <div className="h-6 w-48 rounded-full bg-white/10" />
            </div>
            <div className="h-8 w-96 max-w-full rounded bg-white/20" />
            <div className="h-4 w-80 max-w-full rounded bg-white/15" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 rounded-lg bg-white/20" />
            <div className="h-10 w-36 rounded-lg bg-white/15" />
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-28 rounded bg-muted" />
              <div className="size-9 rounded-lg bg-muted/60" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-24 rounded bg-muted" />
              <div className="h-3 w-36 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Standings (8 cols) & Schedule/Disbursement (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Standings Card */}
        <div className="xl:col-span-8 bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="space-y-1">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted/60" />
            </div>
            <div className="h-4 w-24 rounded bg-muted/50" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-muted" />
                  <div className="h-4 w-36 rounded bg-muted" />
                </div>
                <div className="flex gap-6">
                  <div className="h-4 w-8 rounded bg-muted/60" />
                  <div className="h-4 w-8 rounded bg-muted/60" />
                  <div className="h-4 w-8 rounded bg-muted/60" />
                  <div className="h-4 w-12 rounded bg-muted font-bold" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Schedule / Financial Card */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="flex justify-center py-4">
              <div className="size-36 rounded-full bg-muted/40" />
            </div>
            <div className="space-y-2">
              <div className="h-10 rounded-xl bg-muted/40" />
              <div className="h-10 rounded-xl bg-muted/40" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
            <div className="h-5 w-36 rounded bg-muted" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/30" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

