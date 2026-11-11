"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventFilterState {
  search: string;
  day: string;
  gender: string;
  type: string;
  status: string;
}

interface EventFilterBarProps {
  filters: EventFilterState;
  onChange: (filters: EventFilterState) => void;
  className?: string;
  showStatusFilter?: boolean;
}

export function EventFilterBar({
  filters,
  onChange,
  className,
  showStatusFilter = true,
}: EventFilterBarProps) {
  const updateFilter = (key: keyof EventFilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onChange({
      search: "",
      day: "All",
      gender: "All",
      type: "All",
      status: "All",
    });
  };

  const isFiltered =
    filters.search !== "" ||
    filters.day !== "All" ||
    filters.gender !== "All" ||
    filters.type !== "All" ||
    filters.status !== "All";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 md:p-4 shadow-sm space-y-3",
        className
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search event name, #no, or category..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy dark:focus:border-primary"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:flex-wrap">
          {/* Day filter */}
          <select
            value={filters.day}
            onChange={(e) => updateFilter("day", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
          >
            <option value="All">All Days</option>
            <option value="28 Feb 2025">28 Feb 2025</option>
            <option value="1 Mar 2025">1 Mar 2025</option>
          </select>

          {/* Gender */}
          <select
            value={filters.gender}
            onChange={(e) => updateFilter("gender", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Girls">Girls</option>
          </select>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
          >
            <option value="All">All Types</option>
            <option value="track">Track (Races)</option>
            <option value="field">Field (Throws)</option>
          </select>

          {/* Status */}
          {showStatusFilter && (
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          )}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-hp-red hover:bg-hp-red/10 transition-colors"
            >
              <X className="size-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventFilterBar;

