"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Trophy,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Edit2,
  Trash2,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  Zap,
} from "lucide-react";
import { SportsRecord, RecordStatus, Event, Result } from "@/lib/data/types";
import {
  getSportsRecords,
  addSportsRecord,
  updateSportsRecord,
  deleteSportsRecord,
  ratifyNewRecord,
} from "@/lib/data/records";
import { cn } from "@/lib/utils";

interface RecordsViewProps {
  initialRecords: SportsRecord[];
  events: Event[];
  results?: Result[];
}

export function RecordsView({ initialRecords, events, results = [] }: RecordsViewProps) {
  const [records, setRecords] = useState<SportsRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<"All" | "track" | "field" | "broken">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SportsRecord | null>(null);

  // Ratify Modal state
  const [ratifyingRecord, setRatifyingRecord] = useState<SportsRecord | null>(null);
  const [ratifyAthlete, setRatifyAthlete] = useState("");
  const [ratifyPerf, setRatifyPerf] = useState("");
  const [ratifyNotes, setRatifyNotes] = useState("");

  // Form Fields
  const [formEventNo, setFormEventNo] = useState(1);
  const [formEventName, setFormEventName] = useState("100m Run");
  const [formCategory, setFormCategory] = useState("Men (Below 45 Yrs)");
  const [formEventType, setFormEventType] = useState<"track" | "field">("track");
  const [formHolder, setFormHolder] = useState("");
  const [formBib, setFormBib] = useState("");
  const [formUnit, setFormUnit] = useState("Mumbai Refinery");
  const [formPerformance, setFormPerformance] = useState("");
  const [formUnitMetric, setFormUnitMetric] = useState<"sec" | "m">("sec");
  const [formYearSet, setFormYearSet] = useState(2024);
  const [formEdition, setFormEdition] = useState("18th All India Meet (2023)");
  const [formLocation, setFormLocation] = useState("Chembur Sports Complex, Mumbai");
  const [formStatus, setFormStatus] = useState<RecordStatus>("Standing");
  const [formBonusEligible, setFormBonusEligible] = useState(true);
  const [formNotes, setFormNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    getSportsRecords().then((recs) => setRecords(recs));
  }, []);

  // Sync event details when eventNo changes in form
  const handleEventNoChange = (no: number) => {
    setFormEventNo(no);
    const ev = events.find((e) => e.eventNo === no);
    if (ev) {
      setFormEventName(ev.name);
      setFormCategory(ev.category);
      setFormEventType(ev.type);
      setFormUnitMetric(ev.unit);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    handleEventNoChange(events[0]?.eventNo || 1);
    setFormHolder("");
    setFormBib("");
    setFormUnit("Mumbai Refinery");
    setFormPerformance("");
    setFormYearSet(2024);
    setFormEdition("18th All India Meet (2023)");
    setFormLocation("Chembur Sports Complex, Mumbai");
    setFormStatus("Standing");
    setFormBonusEligible(true);
    setFormNotes("");
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (rec: SportsRecord) => {
    setEditingRecord(rec);
    setFormEventNo(rec.eventNo);
    setFormEventName(rec.eventName);
    setFormCategory(rec.category);
    setFormEventType(rec.eventType);
    setFormHolder(rec.recordHolder);
    setFormBib(rec.bib || "");
    setFormUnit(rec.unit);
    setFormPerformance(String(rec.performance));
    setFormUnitMetric(rec.unitMetric);
    setFormYearSet(rec.yearSet);
    setFormEdition(rec.edition);
    setFormLocation(rec.location || "");
    setFormStatus(rec.status);
    setFormBonusEligible(rec.cashBonusEligible);
    setFormNotes(rec.notes || "");
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHolder.trim() || !formPerformance.trim()) {
      setFormError("Record Holder Name and Performance Value are required.");
      return;
    }

    const perfNum = parseFloat(formPerformance);
    if (isNaN(perfNum) || perfNum <= 0) {
      setFormError("Please enter a valid positive numeric performance.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const perfDisplay = `${perfNum.toFixed(2)} ${formUnitMetric}`;

    try {
      if (editingRecord) {
        // Update existing record
        const updated = await updateSportsRecord(editingRecord.id, {
          eventNo: formEventNo,
          eventName: formEventName,
          category: formCategory,
          eventType: formEventType,
          recordHolder: formHolder.trim(),
          bib: formBib.trim() || undefined,
          unit: formUnit,
          performance: perfNum,
          performanceDisplay: perfDisplay,
          unitMetric: formUnitMetric,
          yearSet: formYearSet,
          edition: formEdition,
          location: formLocation,
          status: formStatus,
          cashBonusEligible: formBonusEligible,
          notes: formNotes.trim() || undefined,
        });

        if (updated) {
          setRecords((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
        }
      } else {
        // Add new record
        const created = await addSportsRecord({
          eventNo: formEventNo,
          eventName: formEventName,
          category: formCategory,
          eventType: formEventType,
          recordHolder: formHolder.trim(),
          bib: formBib.trim() || undefined,
          unit: formUnit,
          performance: perfNum,
          performanceDisplay: perfDisplay,
          unitMetric: formUnitMetric,
          yearSet: formYearSet,
          edition: formEdition,
          location: formLocation,
          status: formStatus,
          cashBonusEligible: formBonusEligible,
          notes: formNotes.trim() || undefined,
        });

        setRecords((prev) => [created, ...prev]);
      }

      setIsFormModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || "Failed to save record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this official meet record?")) {
      await deleteSportsRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleOpenRatify = (rec: SportsRecord) => {
    setRatifyingRecord(rec);
    // Find current meet winner if available
    const curResult = results.find(
      (r) => r.eventNo === rec.eventNo && r.position === "I"
    );
    setRatifyAthlete(curResult ? `${curResult.athleteName} (${curResult.unit})` : "");
    setRatifyPerf(curResult ? String(curResult.performance) : "");
    setRatifyNotes(`Ratified as New Meet Record (NMR) in 19th All India Meet 2024-25.`);
  };

  const handleConfirmRatify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratifyingRecord || !ratifyAthlete || !ratifyPerf) return;

    setIsSubmitting(true);
    const updated = await ratifyNewRecord(
      ratifyingRecord.id,
      ratifyAthlete,
      parseFloat(ratifyPerf) || ratifyingRecord.performance,
      ratifyNotes
    );

    if (updated) {
      setRecords((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    }
    setIsSubmitting(false);
    setRatifyingRecord(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Event No",
      "Event Name",
      "Category",
      "Discipline",
      "Record Performance",
      "Record Holder",
      "BIB",
      "Unit Delegation",
      "Year Set",
      "Meet Edition",
      "Status",
      "Cash Incentive Eligible",
    ];

    const rows = records.map((r) => [
      r.eventNo,
      `"${r.eventName}"`,
      `"${r.category}"`,
      r.eventType,
      `"${r.performanceDisplay}"`,
      `"${r.recordHolder}"`,
      r.bib || "N/A",
      `"${r.unit}"`,
      r.yearSet,
      `"${r.edition}"`,
      r.status,
      r.cashBonusEligible ? "Yes (₹10,000)" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `HPCL_Meet_Records_Register_${Date.now()}.csv`;
    link.click();
  };

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    if (activeTab === "track" && rec.eventType !== "track") return false;
    if (activeTab === "field" && rec.eventType !== "field") return false;
    if (activeTab === "broken" && rec.status !== "Broken this Meet") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.eventName.toLowerCase().includes(q) ||
        rec.recordHolder.toLowerCase().includes(q) ||
        rec.unit.toLowerCase().includes(q) ||
        rec.category.toLowerCase().includes(q) ||
        rec.performanceDisplay.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const standingCount = records.filter((r) => r.status === "Standing").length;
  const brokenCount = records.filter((r) => r.status === "Broken this Meet").length;
  const totalIncentives = brokenCount * 10000;

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER & ACTIONS ────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Technical Directorate</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Championship Records Register</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground tracking-tight flex items-center gap-2.5">
            <Award className="size-7 text-hp-navy dark:text-primary" />
            Sports Meet Records (MR) Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official Meet Records (MR), historical benchmarks, and New Meet Record (NMR) ratifications · 19th All India Meet 2024-25
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export Records Book (CSV)</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Register New Record</span>
          </button>
        </div>
      </div>

      {/* ── METRIC STATS CARDS ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tracked Records</span>
            <Award className="size-4 text-hp-navy dark:text-primary" />
          </div>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-hp-navy dark:text-primary">
            {records.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Official Meet Benchmarks</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Standing Records</span>
            <ShieldCheck className="size-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-emerald-600 dark:text-emerald-400">
            {standingCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Unbeaten historical marks</p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Broken this Meet (NMR)</span>
            <Sparkles className="size-4 text-amber-500 animate-pulse" />
          </div>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-amber-700 dark:text-amber-400">
            {brokenCount}
          </p>
          <p className="text-[11px] text-amber-600/90 dark:text-amber-400/90 mt-0.5">New Meet Records in 2024-25</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">NMR Cash Incentives</span>
            <Trophy className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
            ₹{totalIncentives.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">₹10,000 per record broken</p>
        </div>
      </div>

      {/* ── FILTER TABS & SEARCH BAR ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 md:p-4 shadow-xs">
        {/* Discipline Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "All", label: "All Records", count: records.length },
            { id: "track", label: "Track & Sprints", count: records.filter((r) => r.eventType === "track").length },
            { id: "field", label: "Field Events", count: records.filter((r) => r.eventType === "field").length },
            { id: "broken", label: "⭐ Broken (NMR)", count: brokenCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-hp-navy text-white shadow-xs font-bold"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-0.2",
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search record, athlete, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-8.5 pr-3 py-1.5 text-xs focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── RECORDS TABLE / REGISTER ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Official Meet Record</th>
                <th className="py-3 px-4">Record Holder</th>
                <th className="py-3 px-4">Unit Delegation</th>
                <th className="py-3 px-4">Year &amp; Meet Edition</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    No sports records matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isBroken = rec.status === "Broken this Meet";
                  const isPending = rec.status === "Pending Ratification";

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Event Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-hp-navy/10 text-hp-navy dark:text-primary font-mono font-bold px-1.5 py-0.5 text-[10px]">
                            #{rec.eventNo}
                          </span>
                          <div>
                            <span className="font-bold text-foreground text-sm block">
                              {rec.eventName}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {rec.category} · {rec.eventType === "track" ? "Track" : "Field"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Performance Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold font-mono text-base text-hp-navy dark:text-primary tracking-tight">
                            {rec.performanceDisplay}
                          </span>
                          {rec.cashBonusEligible && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <Trophy className="size-3" />
                              ₹10,000 NMR Bonus
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Record Holder Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {rec.bib && (
                              <span className="rounded bg-muted px-1 text-[10px] font-mono font-bold text-muted-foreground">
                                #{rec.bib}
                              </span>
                            )}
                            <span className="font-bold text-foreground">
                              {rec.recordHolder}
                            </span>
                          </div>
                          {isBroken && rec.brokenByAthlete && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold block">
                              Broken by: {rec.brokenByAthlete}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Unit Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                          <Building2 className="size-3 text-muted-foreground" />
                          {rec.unit}
                        </span>
                      </td>

                      {/* Year & Edition */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground text-xs block">
                            {rec.yearSet}
                          </span>
                          <span className="text-[11px] truncate block max-w-xs">
                            {rec.edition}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isBroken ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            <Sparkles className="size-3 text-amber-600" />
                            New Record (NMR)
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                            Pending Ratification
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-semibold">
                            Standing Record
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isBroken && (
                            <button
                              type="button"
                              onClick={() => handleOpenRatify(rec)}
                              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-semibold transition-colors flex items-center gap-1"
                              title="Ratify New Meet Record"
                            >
                              <Sparkles className="size-3" />
                              Ratify NMR
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(rec)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteRecord(rec.id, e)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: REGISTER / EDIT RECORD ───────────────────────────────── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-lg bg-hp-navy/10 flex items-center justify-center text-hp-navy dark:text-primary">
                  <Award className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    {editingRecord ? "Edit Official Meet Record" : "Register Official Meet Record"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Championship benchmark database &amp; cash bonus specification
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRecord} className="p-5 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
                  {formError}
                </div>
              )}

              {/* Event Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Select Event *
                </label>
                <select
                  value={formEventNo}
                  onChange={(e) => handleEventNoChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                >
                  {events.map((ev) => (
                    <option key={ev.eventNo} value={ev.eventNo}>
                      Event #{ev.eventNo}: {ev.name} ({ev.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Record Performance & Metric */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Record Performance *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 10.82"
                    value={formPerformance}
                    onChange={(e) => setFormPerformance(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono tabular-nums focus:border-hp-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Performance Unit
                  </label>
                  <select
                    value={formUnitMetric}
                    onChange={(e) => setFormUnitMetric(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  >
                    <option value="sec">Seconds (sec)</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
              </div>

              {/* Athlete Holder & BIB */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Record Holder Athlete *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh P. Kamble"
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    BIB (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="102"
                    value={formBib}
                    onChange={(e) => setFormBib(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:border-hp-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Unit Delegation */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Representing Unit / Zone *
                </label>
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                >
                  <option value="Mumbai Refinery">Mumbai Refinery</option>
                  <option value="South Central Zone">South Central Zone</option>
                  <option value="Visakh Refinery">Visakh Refinery</option>
                  <option value="Petroleum House">Petroleum House</option>
                  <option value="East Zone">East Zone</option>
                  <option value="North Zone">North Zone</option>
                  <option value="West Zone">West Zone</option>
                  <option value="North West Zone">North West Zone</option>
                  <option value="Hindustan Bhawan">Hindustan Bhawan</option>
                </select>
              </div>

              {/* Year & Edition */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Year Set
                  </label>
                  <input
                    type="number"
                    value={formYearSet}
                    onChange={(e) => setFormYearSet(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:border-hp-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RecordStatus)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  >
                    <option value="Standing">Standing Record</option>
                    <option value="Broken this Meet">Broken this Meet (NMR)</option>
                    <option value="Pending Ratification">Pending Ratification</option>
                  </select>
                </div>
              </div>

              {/* Edition Name & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Meet Edition
                  </label>
                  <input
                    type="text"
                    value={formEdition}
                    onChange={(e) => setFormEdition(e.target.value)}
                    placeholder="e.g. 15th All India Meet (2018)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Chembur Complex, Mumbai"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Cash Bonus Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formBonusEligible}
                  onChange={(e) => setFormBonusEligible(e.target.checked)}
                  className="rounded border-border text-hp-navy focus:ring-hp-navy size-4"
                />
                <span className="text-xs font-medium text-foreground">
                  Eligible for Special Cash Incentive Bonus (₹10,000 for breaking record)
                </span>
              </label>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Official Technical Notes / Wind Gauge
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Wind reading +0.4 m/s. Electronic photo-finish verified."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-hp-navy hover:bg-[#141F63] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving Record...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>{editingRecord ? "Save Changes" : "Register Record"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RATIFY NEW MEET RECORD (NMR) ─────────────────────────── */}
      {ratifyingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Ratify New Meet Record (NMR)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Event #{ratifyingRecord.eventNo}: {ratifyingRecord.eventName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRatifyingRecord(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRatify} className="space-y-4">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Standing Mark To Beat
                </span>
                <p className="text-lg font-bold font-mono text-amber-900 dark:text-amber-200">
                  {ratifyingRecord.performanceDisplay} ({ratifyingRecord.recordHolder} · {ratifyingRecord.yearSet})
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Record-Breaking Athlete *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Narayana Moolya (South Central Zone)"
                  value={ratifyAthlete}
                  onChange={(e) => setRatifyAthlete(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  New Performance Clocked ({ratifyingRecord.unitMetric}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 60.80"
                  value={ratifyPerf}
                  onChange={(e) => setRatifyPerf(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono tabular-nums focus:border-hp-navy focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Technical Ratification Notes
                </label>
                <textarea
                  rows={2}
                  value={ratifyNotes}
                  onChange={(e) => setRatifyNotes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-hp-navy focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRatifyingRecord(null)}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !ratifyAthlete || !ratifyPerf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>Authorize &amp; Ratify NMR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordsView;

