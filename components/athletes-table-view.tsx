"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Athlete } from "@/lib/data/types";
import { UnitBadge } from "./unit-badge";
import { Search, ArrowRight, X } from "lucide-react";

interface AthletesTableViewProps {
  initialAthletes: Athlete[];
}

export function AthletesTableView({ initialAthletes }: AthletesTableViewProps) {
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");

  const units = Array.from(new Set(initialAthletes.map((a) => a.unit)));

  const filtered = initialAthletes.filter((athlete) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        athlete.name.toLowerCase().includes(q) ||
        athlete.bib.includes(q) ||
        athlete.unit.toLowerCase().includes(q) ||
        athlete.ageCategory.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedUnit !== "All" && athlete.unit !== selectedUnit) {
      return false;
    }

    if (selectedGender !== "All" && athlete.gender !== selectedGender) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border bg-card p-3 md:p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by BIB number (e.g. 424), athlete name, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none"
          >
            <option value="All">All Units / Refineries</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:border-hp-navy focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Girls">Girls</option>
          </select>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3.5 w-20 text-center">BIB No</th>
              <th className="py-3 px-3.5">Athlete Name</th>
              <th className="py-3 px-3.5">Unit / Zone</th>
              <th className="py-3 px-3.5">Gender</th>
              <th className="py-3 px-3.5">Age Category</th>
              <th className="py-3 px-3.5 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((athlete) => (
              <tr
                key={athlete.bib}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3 px-3.5 text-center font-mono font-bold text-hp-navy dark:text-primary tabular-nums">
                  #{athlete.bib}
                </td>
                <td className="py-3 px-3.5">
                  <Link
                    href={`/athletes/${athlete.bib}`}
                    className="font-bold text-hp-ink dark:text-white hover:text-hp-red transition-colors text-xs"
                  >
                    {athlete.name}
                  </Link>
                </td>
                <td className="py-3 px-3.5">
                  <UnitBadge name={athlete.unit} />
                </td>
                <td className="py-3 px-3.5 text-muted-foreground">
                  {athlete.gender}
                </td>
                <td className="py-3 px-3.5 font-medium">
                  {athlete.ageCategory}
                </td>
                <td className="py-3 px-3.5 text-right">
                  <Link
                    href={`/athletes/${athlete.bib}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-hp-navy dark:text-primary hover:bg-hp-navy hover:text-white transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No athletes found matching &quot;{search}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

export default AthletesTableView;

