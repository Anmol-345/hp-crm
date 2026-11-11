import React from "react";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 6,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 space-y-4 animate-pulse",
        className
      )}
    >
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted/60" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className={cn(
                  "h-4 rounded bg-muted/50",
                  c === 0 ? "w-12" : c === 1 ? "w-48 flex-1" : "w-24"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;

