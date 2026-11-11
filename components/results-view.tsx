"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Result, Event } from "@/lib/data/types";
import { publishEventResults } from "@/lib/data/results";
import { PodiumCard } from "./podium-card";
import { PodiumPhotoCard } from "./podium-photo-card";
import { ResultsTable } from "./results-table";
import { Trophy, Plus, Check, Filter, Loader2, Camera, Sparkles } from "lucide-react";
import { savePodiumPhotoForEvent } from "@/lib/data/photos";

interface ResultsViewProps {
  initialResults: Result[];
  events: Event[];
}

export function ResultsView({ initialResults, events }: ResultsViewProps) {
  const [results, setResults] = useState<Result[]>(initialResults);
  const [selectedEventNo, setSelectedEventNo] = useState<number | "All">("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for new result entry
  const [formEventNo, setFormEventNo] = useState(1);
  const [pos1Bib, setPos1Bib] = useState("");
  const [pos1Name, setPos1Name] = useState("");
  const [pos1Unit, setPos1Unit] = useState("Mumbai Refinery");
  const [pos1Perf, setPos1Perf] = useState("");

  const [pos2Bib, setPos2Bib] = useState("");
  const [pos2Name, setPos2Name] = useState("");
  const [pos2Unit, setPos2Unit] = useState("South Central Zone");
  const [pos2Perf, setPos2Perf] = useState("");

  const [pos3Bib, setPos3Bib] = useState("");
  const [pos3Name, setPos3Name] = useState("");
  const [pos3Unit, setPos3Unit] = useState("Visakh Refinery");
  const [pos3Perf, setPos3Perf] = useState("");

  const [formPodiumPhotoUrl, setFormPodiumPhotoUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const targetEvent = events.find((e) => e.eventNo === formEventNo);
  const perfUnit = targetEvent?.unit || "sec";

  // Unique event numbers that have published results
  const eventNumbersWithResults = Array.from(
    new Set(results.map((r) => r.eventNo))
  );

  const filteredEventNumbers =
    selectedEventNo === "All"
      ? eventNumbersWithResults
      : eventNumbersWithResults.filter((no) => no === selectedEventNo);

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pos1Bib || !pos1Name || !pos1Perf) return;

    setIsPublishing(true);

    const payload: Array<{
      position: 1 | 2 | 3;
      bibNo?: number;
      athleteName: string;
      unitName?: string;
      performance: number;
    }> = [
      {
        position: 1,
        bibNo: parseInt(pos1Bib, 10) || undefined,
        athleteName: pos1Name,
        unitName: pos1Unit,
        performance: parseFloat(pos1Perf) || 0,
      },
    ];

    if (pos2Bib && pos2Perf) {
      payload.push({
        position: 2,
        bibNo: parseInt(pos2Bib, 10) || undefined,
        athleteName: pos2Name || "Athlete",
        unitName: pos2Unit,
        performance: parseFloat(pos2Perf) || 0,
      });
    }

    if (pos3Bib && pos3Perf) {
      payload.push({
        position: 3,
        bibNo: parseInt(pos3Bib, 10) || undefined,
        athleteName: pos3Name || "Athlete",
        unitName: pos3Unit,
        performance: parseFloat(pos3Perf) || 0,
      });
    }

    // Call Supabase RPC to save results and auto-create cash cards
    await publishEventResults(formEventNo, payload);

    const newEntries: Result[] = [
      {
        id: `res-${formEventNo}-1-${Date.now()}`,
        eventNo: formEventNo,
        position: "I",
        bib: pos1Bib,
        athleteName: pos1Name,
        unit: pos1Unit,
        performance: parseFloat(pos1Perf) || 0,
        performanceDisplay: `${pos1Perf} ${perfUnit}`,
        points: 5,
      },
      ...(pos2Bib
        ? [
            {
              id: `res-${formEventNo}-2-${Date.now()}`,
              eventNo: formEventNo,
              position: "II" as const,
              bib: pos2Bib,
              athleteName: pos2Name || "Athlete",
              unit: pos2Unit,
              performance: parseFloat(pos2Perf) || 0,
              performanceDisplay: `${pos2Perf} ${perfUnit}`,
              points: 3,
            },
          ]
        : []),
      ...(pos3Bib
        ? [
            {
              id: `res-${formEventNo}-3-${Date.now()}`,
              eventNo: formEventNo,
              position: "III" as const,
              bib: pos3Bib,
              athleteName: pos3Name || "Athlete",
              unit: pos3Unit,
              performance: parseFloat(pos3Perf) || 0,
              performanceDisplay: `${pos3Perf} ${perfUnit}`,
              points: 1,
            },
          ]
        : []),
    ];

    // If a podium photo was provided, save it
    if (formPodiumPhotoUrl) {
      await savePodiumPhotoForEvent(
        formEventNo,
        targetEvent?.name || `Event ${formEventNo}`,
        formPodiumPhotoUrl,
        `Official Top 3 Podium: 🥇 ${pos1Name}${pos2Name ? `, 🥈 ${pos2Name}` : ""}${pos3Name ? `, 🥉 ${pos3Name}` : ""}`,
        [pos1Name, pos2Name, pos3Name].filter(Boolean)
      );
    }

    // Remove any previous results for this event and append new ones
    setResults((prev) => [
      ...prev.filter((r) => r.eventNo !== formEventNo),
      ...newEntries,
    ]);

    setIsPublishing(false);
    setFormPodiumPhotoUrl("");
    setShowAddForm(false);
    setSelectedEventNo(formEventNo);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Filter Event:
          </label>
          <select
            value={selectedEventNo}
            onChange={(e) =>
              setSelectedEventNo(
                e.target.value === "All" ? "All" : parseInt(e.target.value, 10)
              )
            }
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:border-hp-navy focus:outline-none"
          >
            <option value="All">All Published Results</option>
            {eventNumbersWithResults.map((no) => {
              const ev = events.find((e) => e.eventNo === no);
              return (
                <option key={no} value={no}>
                  Event #{no}: {ev?.name || `Event ${no}`} ({ev?.category})
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-hp-navy text-white px-3.5 py-2 text-xs font-semibold hover:bg-hp-navy-dark transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          <span>Record New Event Result</span>
        </button>
      </div>

      {/* Record New Result Form Modal / Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleSaveResults}
          className="rounded-xl border border-hp-navy/40 bg-card p-5 shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white">
                Record Official Podium Result Sheet
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter top 3 positions with BIB, names, units, and verified times/distances
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Select Event
              </label>
              <select
                value={formEventNo}
                onChange={(e) => setFormEventNo(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium"
              >
                {events.map((e) => (
                  <option key={e.eventNo} value={e.eventNo}>
                    #{e.eventNo}: {e.name} — {e.category} ({e.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Position I (Winner) */}
          <div className="rounded-lg border border-hp-gold/40 bg-hp-gold/5 p-3 space-y-2">
            <span className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1">
              🥇 Position I · Winner (5 Points / ₹5,000)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                placeholder="BIB # (e.g. 424)"
                value={pos1Bib}
                onChange={(e) => setPos1Bib(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono"
                required
              />
              <input
                type="text"
                placeholder="Athlete Name"
                value={pos1Name}
                onChange={(e) => setPos1Name(e.target.value)}
                className="rounded border border-border bg-background p-2"
                required
              />
              <select
                value={pos1Unit}
                onChange={(e) => setPos1Unit(e.target.value)}
                className="rounded border border-border bg-background p-2"
              >
                <option value="Mumbai Refinery">Mumbai Refinery</option>
                <option value="South Central Zone">South Central Zone</option>
                <option value="Visakh Refinery">Visakh Refinery</option>
                <option value="Petroleum House">Petroleum House</option>
                <option value="East Zone">East Zone</option>
                <option value="North West Zone">North West Zone</option>
                <option value="Hindustan Bhawan">Hindustan Bhawan</option>
              </select>
              <input
                type="text"
                placeholder={`Performance (${perfUnit})`}
                value={pos1Perf}
                onChange={(e) => setPos1Perf(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono tabular-nums"
                required
              />
            </div>
          </div>

          {/* Position II (Runner-up) */}
          <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-3 space-y-2">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
              🥈 Position II · Runner-up (3 Points / ₹4,000)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                placeholder="BIB #"
                value={pos2Bib}
                onChange={(e) => setPos2Bib(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono"
              />
              <input
                type="text"
                placeholder="Athlete Name"
                value={pos2Name}
                onChange={(e) => setPos2Name(e.target.value)}
                className="rounded border border-border bg-background p-2"
              />
              <select
                value={pos2Unit}
                onChange={(e) => setPos2Unit(e.target.value)}
                className="rounded border border-border bg-background p-2"
              >
                <option value="Mumbai Refinery">Mumbai Refinery</option>
                <option value="South Central Zone">South Central Zone</option>
                <option value="Visakh Refinery">Visakh Refinery</option>
                <option value="Petroleum House">Petroleum House</option>
                <option value="East Zone">East Zone</option>
                <option value="North West Zone">North West Zone</option>
                <option value="Hindustan Bhawan">Hindustan Bhawan</option>
              </select>
              <input
                type="text"
                placeholder={`Performance (${perfUnit})`}
                value={pos2Perf}
                onChange={(e) => setPos2Perf(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Position III (1st Runner-up) */}
          <div className="rounded-lg border border-amber-800/30 bg-amber-900/5 p-3 space-y-2">
            <span className="font-bold text-xs text-amber-900 dark:text-amber-400 flex items-center gap-1">
              🥉 Position III · 1st Runner-up (1 Point / ₹3,000)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                placeholder="BIB #"
                value={pos3Bib}
                onChange={(e) => setPos3Bib(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono"
              />
              <input
                type="text"
                placeholder="Athlete Name"
                value={pos3Name}
                onChange={(e) => setPos3Name(e.target.value)}
                className="rounded border border-border bg-background p-2"
              />
              <select
                value={pos3Unit}
                onChange={(e) => setPos3Unit(e.target.value)}
                className="rounded border border-border bg-background p-2"
              >
                <option value="Mumbai Refinery">Mumbai Refinery</option>
                <option value="South Central Zone">South Central Zone</option>
                <option value="Visakh Refinery">Visakh Refinery</option>
                <option value="Petroleum House">Petroleum House</option>
                <option value="East Zone">East Zone</option>
                <option value="North West Zone">North West Zone</option>
                <option value="Hindustan Bhawan">Hindustan Bhawan</option>
              </select>
              <input
                type="text"
                placeholder={`Performance (${perfUnit})`}
                value={pos3Perf}
                onChange={(e) => setPos3Perf(e.target.value)}
                className="rounded border border-border bg-background p-2 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Optional Podium Ceremony Photo */}
          <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <Camera className="size-3.5 text-hp-navy dark:text-primary" />
                Optional: Top 3 Victory Ceremony Photo
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">URL or leave blank to upload later</span>
            </div>
            <input
              type="url"
              placeholder="Paste photo URL (or leave blank to upload file after publishing)"
              value={formPodiumPhotoUrl}
              onChange={(e) => setFormPodiumPhotoUrl(e.target.value)}
              className="w-full rounded border border-border bg-background p-2 text-xs focus:border-hp-navy focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-hp-red text-white px-4 py-2 text-xs font-semibold hover:bg-red-700 disabled:opacity-60"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Publishing & Generating Cash Cards...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Publish Official Results</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Published Events Results List */}
      <div className="space-y-10">
        {filteredEventNumbers.map((no) => {
          const event = events.find((e) => e.eventNo === no);
          const eventResults = results.filter((r) => r.eventNo === no);

          const pos1 = eventResults.find((r) => r.position === "I");
          const pos2 = eventResults.find((r) => r.position === "II");
          const pos3 = eventResults.find((r) => r.position === "III");

          return (
            <div
              key={no}
              className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm space-y-6"
            >
              {/* Event Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-hp-navy text-white px-2 py-0.5 text-xs font-mono font-bold">
                      Event #{no}
                    </span>
                    <h2 className="font-heading font-extrabold text-lg md:text-xl text-hp-ink dark:text-white">
                      {event?.name || `Event ${no}`}
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event?.category} · {event?.day}
                    {event?.notes && ` (${event.notes})`}
                  </p>
                </div>

                <Link
                  href={`/events/${no}`}
                  className="text-xs font-semibold text-hp-navy dark:text-primary hover:underline self-start sm:self-auto"
                >
                  Event Detail & Cash Cards →
                </Link>
              </div>

              {/* Top 3 Victory Ceremony Photo */}
              <PodiumPhotoCard
                eventNo={no}
                eventName={event?.name || `Event ${no}`}
                pos1Name={pos1?.athleteName}
                pos2Name={pos2?.athleteName}
                pos3Name={pos3?.athleteName}
              />

              {/* Podium Display (3 cards) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Runner-up (Position II) */}
                {pos2 && (
                  <PodiumCard
                    position="II"
                    athleteName={pos2.athleteName}
                    bib={pos2.bib}
                    unit={pos2.unit}
                    performance={pos2.performance}
                    performanceUnit={event?.unit || "sec"}
                    eventName={event?.name}
                    className="md:order-1"
                  />
                )}

                {/* Winner (Position I - Center & Elevated) */}
                {pos1 && (
                  <PodiumCard
                    position="I"
                    athleteName={pos1.athleteName}
                    bib={pos1.bib}
                    unit={pos1.unit}
                    performance={pos1.performance}
                    performanceUnit={event?.unit || "sec"}
                    eventName={event?.name}
                    className="md:order-2 border-2 border-hp-gold shadow-md md:-translate-y-2"
                  />
                )}

                {/* 1st Runner-up (Position III) */}
                {pos3 && (
                  <PodiumCard
                    position="III"
                    athleteName={pos3.athleteName}
                    bib={pos3.bib}
                    unit={pos3.unit}
                    performance={pos3.performance}
                    performanceUnit={event?.unit || "sec"}
                    eventName={event?.name}
                    className="md:order-3"
                  />
                )}
              </div>

              {/* Full Results Table */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Complete Standing
                </h4>
                <ResultsTable results={eventResults} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsView;

