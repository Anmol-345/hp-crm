"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export type DayFilter = "All" | "28 Feb 2025" | "1 Mar 2025";

interface DayContextType {
  selectedDay: DayFilter;
  setSelectedDay: (day: DayFilter) => void;
}

const DayContext = createContext<DayContextType>({
  selectedDay: "All",
  setSelectedDay: () => {},
});

export function DayProvider({ children }: { children: React.ReactNode }) {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("All");

  return (
    <DayContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  return useContext(DayContext);
}

interface DaySwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export function DaySwitcher({ className, size = "md" }: DaySwitcherProps) {
  const { selectedDay, setSelectedDay } = useDay();

  const days: { label: string; value: DayFilter; subtitle: string }[] = [
    { label: "All Days", value: "All", subtitle: "Full Meet" },
    { label: "28 Feb 2025", value: "28 Feb 2025", subtitle: "Day 1" },
    { label: "1 Mar 2025", value: "1 Mar 2025", subtitle: "Final Day" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-muted/60 p-1 text-xs shadow-2xs whitespace-nowrap shrink-0",
        className
      )}
    >
      <div className="hidden md:flex items-center gap-1 px-1.5 text-muted-foreground font-medium mr-0.5 whitespace-nowrap shrink-0">
        <Calendar className="size-3.5 text-hp-navy dark:text-primary shrink-0" />
        <span>Meet Day:</span>
      </div>
      <div className="flex items-center gap-1 flex-nowrap shrink-0">
        {days.map((day) => {
          const isSelected = selectedDay === day.value;
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => setSelectedDay(day.value)}
              className={cn(
                "rounded-md font-semibold transition-all flex items-center gap-1 whitespace-nowrap shrink-0",
                size === "sm" ? "text-[11px] py-0.5 px-2" : "text-xs px-2.5 py-1",
                isSelected
                  ? "bg-hp-navy text-white shadow-xs dark:bg-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              )}
            >
              <span>{day.label}</span>
              {day.value === "1 Mar 2025" && (
                <span
                  className={cn(
                    "text-[9px] rounded px-1 py-0.2 uppercase font-bold whitespace-nowrap",
                    isSelected
                      ? "bg-hp-red text-white"
                      : "bg-hp-red/15 text-hp-red dark:bg-hp-red/25"
                  )}
                >
                  Finals
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DaySwitcher;

