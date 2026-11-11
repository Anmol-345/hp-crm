"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Save,
  X,
  FileCheck2,
  Filter,
  Sparkles,
  HelpCircle,
  Clock,
  UserCheck,
  Loader2,
} from "lucide-react";
import { VerificationEntry, resolveHeatEntry } from "@/lib/data/heats";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { UnitBadge } from "@/components/unit-badge";

interface DataQualityViewProps {
  initialEntries: VerificationEntry[];
}

export function DataQualityView({ initialEntries }: DataQualityViewProps) {
  const [entries, setEntries] = useState<VerificationEntry[]>(initialEntries);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    bibNo: string;
    athleteName: string;
    performance: string;
    rankRemark: string;
  }>({
    bibNo: "",
    athleteName: "",
    performance: "",
    rankRemark: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const pendingEntries = entries.filter((e) => !resolvedIds.has(e.id));
  const resolvedCount = resolvedIds.size;

  const eventOptions = Array.from(
    new Set(entries.map((e) => `${e.eventNo} - ${e.eventName}`))
  );

  const filteredEntries = pendingEntries.filter((e) => {
    if (selectedEvent === "all") return true;
    return `${e.eventNo} - ${e.eventName}` === selectedEvent;
  });

  const startEdit = (entry: VerificationEntry) => {
    setEditingId(entry.id);
    setEditForm({
      bibNo: entry.bibNo !== null ? String(entry.bibNo) : "",
      athleteName: entry.athleteName,
      performance: entry.performance !== null ? String(entry.performance) : "",
      rankRemark: entry.rankRemark || "",
    });
  };

  const handleSave = async (entryId: string) => {
    setIsSaving(true);
    setSavingId(entryId);
    const bibNum = editForm.bibNo.trim() ? parseInt(editForm.bibNo, 10) : null;
    const perfNum = editForm.performance.trim() ? parseFloat(editForm.performance) : null;

    const ok = await resolveHeatEntry(entryId, {
      bib_no: isNaN(bibNum as number) ? null : bibNum,
      performance: isNaN(perfNum as number) ? null : perfNum,
      rank_remark: editForm.rankRemark.trim() || null,
      needs_verification: false,
    });

    if (ok) {
      setResolvedIds((prev) => new Set([...prev, entryId]));
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? {
                ...e,
                bibNo: isNaN(bibNum as number) ? null : bibNum,
                performance: isNaN(perfNum as number) ? null : perfNum,
                rankRemark: editForm.rankRemark.trim() || null,
                needsVerification: false,
              }
            : e
        )
      );
      setEditingId(null);
    }
    setIsSaving(false);
    setSavingId(null);
  };

  const handleQuickVerify = async (entry: VerificationEntry) => {
    setIsSaving(true);
    setSavingId(entry.id);
    const ok = await resolveHeatEntry(entry.id, {
      needs_verification: false,
    });
    if (ok) {
      setResolvedIds((prev) => new Set([...prev, entry.id]));
    }
    setIsSaving(false);
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality & Register Verification"
        description="Review and reconcile ambiguous handwriting, missing BIBs, and provisional track times from the physical Official Record Sheets."
      />

      {/* Audit Banner */}
      <div className="rounded-xl border border-amber-300/60 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-hp-ink dark:text-white">
                Paper Register Discrepancies ({pendingEntries.length} pending)
              </h2>
              <p className="text-xs text-muted-foreground">
                These heat records contain handwritten notes, unclear BIB numbers, or times flagged for marshals&apos; verification.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="size-3.5" />
              {resolvedCount} Resolved in this session
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Filter by Event:</span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs focus:border-hp-navy focus:outline-none"
          >
            <option value="all">All Events ({pendingEntries.length})</option>
            {eventOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredEntries.length}</span> records
        </div>
      </div>

      {/* Verification List */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
            <FileCheck2 className="size-6" />
          </div>
          <h2 className="mt-3 text-base font-semibold">All Records Verified!</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            No pending verification items found. All paper register entries have been reconciled into official records.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const isEditing = editingId === entry.id;

            return (
              <div
                key={entry.id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-hp-navy/40"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
                  {/* Left: Event & Athlete Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-sm bg-hp-navy px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Event {entry.eventNo}
                      </span>
                      <span className="text-xs font-semibold text-hp-ink dark:text-white">
                        {entry.eventName}
                      </span>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Heat {entry.heatNo}
                      </span>
                      <StatusBadge status="Needs Verification" />
                    </div>

                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground">BIB No.</label>
                          <input
                            type="number"
                            value={editForm.bibNo}
                            onChange={(e) => setEditForm({ ...editForm, bibNo: e.target.value })}
                            placeholder="e.g. 101"
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground">Athlete Name</label>
                          <input
                            type="text"
                            value={editForm.athleteName}
                            onChange={(e) => setEditForm({ ...editForm, athleteName: e.target.value })}
                            placeholder="Full name"
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground">Performance (sec)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.performance}
                            onChange={(e) => setEditForm({ ...editForm, performance: e.target.value })}
                            placeholder="12.45"
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground">Rank / Remark</label>
                          <input
                            type="text"
                            value={editForm.rankRemark}
                            onChange={(e) => setEditForm({ ...editForm, rankRemark: e.target.value })}
                            placeholder="Rank or note"
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className="text-muted-foreground">BIB:</span>
                          <span className="rounded bg-hp-mist px-2 py-0.5 font-mono text-hp-ink dark:bg-muted dark:text-white">
                            {entry.bibNo !== null ? `#${entry.bibNo}` : "Missing / Unclear"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Athlete:</span>
                          <span className="font-semibold text-hp-ink dark:text-white">
                            {entry.athleteName}
                          </span>
                        </div>
                        <UnitBadge name={entry.unitName} />
                        {entry.performance !== null && (
                          <div className="flex items-center gap-1">
                            <Clock className="size-3 text-muted-foreground" />
                            <span className="font-mono font-medium">
                              {entry.performance.toFixed(2)}s
                            </span>
                          </div>
                        )}
                        {entry.rankRemark && (
                          <span className="italic text-muted-foreground text-[11px]">
                            &ldquo;{entry.rankRemark}&rdquo;
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(entry.id)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-2xs"
                        >
                          {savingId === entry.id ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="size-3.5" />
                              <span>Save & Verify</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                        >
                          <X className="size-3.5" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(entry)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <Edit3 className="size-3.5 text-hp-navy" />
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleQuickVerify(entry)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-hp-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-hp-navy-dark disabled:opacity-60 transition-all shadow-2xs"
                        >
                          {savingId === entry.id ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="size-3.5" />
                              <span>Confirm Valid</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

