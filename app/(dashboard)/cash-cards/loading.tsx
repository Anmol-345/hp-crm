import React from "react";

export default function CashCardsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title & Actions Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3.5 w-48 rounded bg-muted/50" />
          <div className="h-7 w-72 rounded bg-muted" />
          <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-44 rounded-lg bg-muted/50" />
          <div className="h-9 w-40 rounded-lg bg-muted/50" />
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-border space-y-2">
            <div className="h-3 w-28 rounded bg-muted/60" />
            <div className="h-7 w-24 rounded bg-muted" />
            <div className="h-3 w-36 rounded bg-muted/40" />
          </div>
        ))}
      </div>

      {/* Filter and Table Skeleton */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between">
          <div className="h-9 w-64 rounded-lg bg-muted/40" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-muted/40" />
            <div className="h-8 w-20 rounded-lg bg-muted/40" />
            <div className="h-8 w-20 rounded-lg bg-muted/40" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 gap-4">
              <div className="h-4 w-8 rounded bg-muted/50" />
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-5 w-24 rounded-full bg-muted/40" />
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-4 w-28 rounded bg-muted/60" />
              <div className="h-4 w-16 rounded bg-muted font-bold" />
              <div className="h-6 w-20 rounded-full bg-muted/50" />
              <div className="h-7 w-16 rounded-lg bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

