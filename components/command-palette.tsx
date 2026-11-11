"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Users,
  Trophy,
  Flame,
  CreditCard,
  Building2,
  BarChart3,
  X,
  ArrowRight,
  Camera,
  Award,
} from "lucide-react";
import { mockEvents, mockAthletes, mockUnits } from "@/lib/data/mock-data";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Trophy, category: "Navigation" },
    { name: "Events Register", href: "/events", icon: Calendar, category: "Navigation" },
    { name: "Athletes Directory", href: "/athletes", icon: Users, category: "Navigation" },
    { name: "Official Heats Sheet", href: "/heats", icon: Flame, category: "Navigation" },
    { name: "Published Results", href: "/results", icon: Trophy, category: "Navigation" },
    { name: "Cash Card Sheet (Format 3)", href: "/cash-cards", icon: CreditCard, category: "Navigation" },
    { name: "Units & Zones Medal Tally", href: "/units", icon: Building2, category: "Navigation" },
    { name: "Event Photo Gallery", href: "/gallery", icon: Camera, category: "Navigation" },
    { name: "Sports Records & NMR", href: "/records", icon: Award, category: "Navigation" },
    { name: "Disbursement Reports", href: "/reports", icon: BarChart3, category: "Navigation" },
  ].filter((item) => item.name.toLowerCase().includes(q));

  const filteredEvents = mockEvents
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        String(e.eventNo).includes(q)
    )
    .slice(0, 4);

  const filteredAthletes = mockAthletes
    .filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.bib.includes(q) ||
        a.unit.toLowerCase().includes(q)
    )
    .slice(0, 4);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-hp-ink/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="relative border-b border-border p-3.5 flex items-center gap-3">
          <Search className="size-5 text-hp-navy dark:text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search events, athletes, BIBs, units, or jump to page... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/50 text-xs">
          {/* Navigation Pages */}
          {navigationItems.length > 0 && (
            <div className="py-2">
              <span className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Pages & Registers
              </span>
              <div className="mt-1 space-y-0.5">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-hp-navy hover:text-white group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="size-4 text-hp-navy group-hover:text-white" />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {filteredEvents.length > 0 && (
            <div className="py-2">
              <span className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Events
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredEvents.map((event) => (
                  <button
                    key={event.eventNo}
                    onClick={() => handleSelect(`/events/${event.eventNo}`)}
                    className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-hp-navy hover:text-white group transition-colors"
                  >
                    <div>
                      <span className="font-semibold">
                        Event #{event.eventNo}: {event.name}
                      </span>
                      <span className="ml-2 text-[11px] text-muted-foreground group-hover:text-white/80">
                        {event.category} · {event.day}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold rounded px-1.5 py-0.5 bg-muted text-muted-foreground group-hover:bg-white/20 group-hover:text-white">
                      {event.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Athletes */}
          {filteredAthletes.length > 0 && (
            <div className="py-2">
              <span className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Athletes
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredAthletes.map((athlete) => (
                  <button
                    key={athlete.bib}
                    onClick={() => handleSelect(`/athletes/${athlete.bib}`)}
                    className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-hp-navy hover:text-white group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-hp-navy dark:text-primary group-hover:text-white">
                        #{athlete.bib}
                      </span>
                      <span className="font-semibold">{athlete.name}</span>
                      <span className="text-muted-foreground group-hover:text-white/80 text-[11px]">
                        ({athlete.unit})
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground group-hover:text-white/80">
                      {athlete.gender} · {athlete.ageCategory}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {navigationItems.length === 0 &&
            filteredEvents.length === 0 &&
            filteredAthletes.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No matching results for &quot;{query}&quot;
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{" "}
              Select
            </span>
          </div>
          <span>HPCL Sports Meet CRM</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;

