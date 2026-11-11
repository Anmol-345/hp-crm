import React from "react";

export default function RecordsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-muted rounded" />
          <div className="h-8 w-72 bg-muted rounded" />
          <div className="h-3 w-96 bg-muted rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 bg-muted rounded-lg" />
          <div className="h-9 w-40 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/40 border border-border rounded-xl p-3.5 space-y-2">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Filter ribbon skeleton */}
      <div className="h-14 bg-muted/30 border border-border rounded-xl" />

      {/* Table skeleton */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-12 bg-muted/40 border-b border-border" />
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-10 bg-muted rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-36 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="h-5 w-20 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

