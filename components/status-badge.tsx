import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type Status =
  | "Pending"
  | "Signed"
  | "Completed"
  | "In Progress"
  | "Scheduled"
  | "Needs Verification";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  Pending: "border border-hp-red text-hp-red bg-transparent",
  Signed: "bg-hp-navy text-white",
  Completed: "bg-hp-navy text-white",
  "In Progress": "bg-amber-500 text-white",
  Scheduled: "bg-muted text-muted-foreground",
  "Needs Verification": "bg-amber-100 text-amber-800",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {status === "Needs Verification" && (
        <AlertTriangle className="size-3" />
      )}
      {status}
    </span>
  );
}

export default StatusBadge;
