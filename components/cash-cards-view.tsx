"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CashCard } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";
import { updateCashCardStatus } from "@/lib/data/cash-cards";
import {
  CreditCard,
  Printer,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  X,
  FileSpreadsheet,
  Wallet,
  ShieldCheck,
  Award,
  Eraser,
  Eye,
  Check,
  ChevronDown,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CashCardsViewProps {
  initialCards: CashCard[];
}

export function CashCardsView({ initialCards }: CashCardsViewProps) {
  const [cards, setCards] = useState<CashCard[]>(initialCards);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Signed" | "Pending">("All");
  const [selectedEventNo, setSelectedEventNo] = useState<string>("All");

  // Modals
  const [activeSigningCard, setActiveSigningCard] = useState<CashCard | null>(null);
  const [viewingSignatureCard, setViewingSignatureCard] = useState<CashCard | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signature Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [checklist, setChecklist] = useState({
    idVerified: true,
    bibConfirmed: true,
    resultVerified: true,
  });

  // Financial statistics
  const totalCards = cards.length;
  const signedCards = cards.filter((c) => c.status === "Signed").length;
  const pendingCards = totalCards - signedCards;
  const totalBudget = cards.reduce((sum, c) => sum + c.prizeAmount, 0) || 144000;
  const disbursedAmount = cards
    .filter((c) => c.status === "Signed")
    .reduce((sum, c) => sum + c.prizeAmount, 0);
  const pendingAmount = totalBudget - disbursedAmount;

  // Filter options
  const uniqueEvents = Array.from(new Set(cards.map((c) => c.eventNo))).sort((a, b) => a - b);

  const filteredCards = cards.filter((card) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        card.athleteName.toLowerCase().includes(q) ||
        card.bib.includes(q) ||
        card.unit.toLowerCase().includes(q) ||
        card.eventName.toLowerCase().includes(q) ||
        String(card.serialNo).includes(q);
      if (!match) return false;
    }

    if (selectedStatus !== "All" && card.status !== selectedStatus) {
      return false;
    }

    if (selectedEventNo !== "All" && card.eventNo !== parseInt(selectedEventNo, 10)) {
      return false;
    }

    return true;
  });

  // Canvas Drawing Handlers
  useEffect(() => {
    if (activeSigningCard && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#101B60";
      }
      setHasDrawn(false);
    }
  }, [activeSigningCard]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  const handleConfirmSignature = async () => {
    if (!activeSigningCard) return;
    setIsSubmitting(true);

    let dataUrl: string | undefined = undefined;
    if (canvasRef.current && hasDrawn) {
      dataUrl = canvasRef.current.toDataURL("image/png");
    }

    const updated = await updateCashCardStatus(activeSigningCard.serialNo, "Signed", dataUrl);

    if (updated) {
      setCards((prev) =>
        prev.map((c) => (c.serialNo === activeSigningCard.serialNo ? updated : c))
      );
    } else {
      setCards((prev) =>
        prev.map((c) =>
          c.serialNo === activeSigningCard.serialNo
            ? {
                ...c,
                status: "Signed",
                dateSigned: new Date().toISOString().split("T")[0],
                signatureDataUrl: dataUrl,
              }
            : c
        )
      );
    }

    setIsSubmitting(false);
    setActiveSigningCard(null);
  };

  const exportToCSV = () => {
    const headers = [
      "Serial No",
      "Event No",
      "Event Name",
      "Position",
      "BIB No",
      "Athlete Name",
      "Unit / Zone",
      "Prize Amount (INR)",
      "Status",
      "Date Signed",
    ];

    const rows = filteredCards.map((c) => [
      c.serialNo,
      c.eventNo,
      `"${c.eventName} (${c.category})"`,
      c.positionLabel,
      c.bib,
      `"${c.athleteName}"`,
      `"${c.unit}"`,
      c.prizeAmount,
      c.status,
      c.dateSigned || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HPCL_Format_3_Cash_Cards_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Control Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Corporate Finance</span>
            <span>/</span>
            <span>Sports Meet 2024-25</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Format 3 Control Register</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground tracking-tight">
            Format 3: Cash Card Control Sheet
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official prize disbursement register &amp; digital signature archive · All India Meet 2024-25
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPrintPreview(!showPrintPreview)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="size-4 text-[#1F2E8C]" />
            <span>{showPrintPreview ? "Hide Paper Register" : "Print Format 3 Paper Register"}</span>
          </button>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="size-4 text-emerald-600" />
            <span>Export Audit Sheet (CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary Total Metric Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Cards */}
        <div className="bg-card p-4 rounded-xl shadow-xs border border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Cards Issued
            </span>
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground mt-1">
              {totalCards} <span className="text-xs font-normal text-muted-foreground">Cards</span>
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Approved across 12 Cash Card Events
            </span>
          </div>
          <div className="size-11 rounded-xl bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary shrink-0">
            <CreditCard className="size-5" />
          </div>
        </div>

        {/* Metric 2: Total Budget */}
        <div className="bg-card p-4 rounded-xl shadow-xs border border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Disbursement Budget
            </span>
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#001375] dark:text-primary mt-1">
              {formatCurrency(totalBudget)}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Treasury Allocation ID: HP-TR-25
            </span>
          </div>
          <div className="size-11 rounded-xl bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary shrink-0">
            <Wallet className="size-5" />
          </div>
        </div>

        {/* Metric 3: Paid & Signed */}
        <div className="bg-card p-4 rounded-xl shadow-xs border border-border flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Paid &amp; Signed
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(disbursedAmount)}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {signedCards} Cards Cleared ({Math.round((signedCards / (totalCards || 1)) * 100)}%)
            </span>
          </div>
          <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        {/* Metric 4: Pending Signatures */}
        <div className="bg-card p-4 rounded-xl shadow-xs border border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pending Signatures
            </span>
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#E4202B] mt-1">
              {formatCurrency(pendingAmount)}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {pendingCards} Cards Awaiting Ground Signature
            </span>
          </div>
          <div className="size-11 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#E4202B] shrink-0">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Official Paper Format 3 Print Preview Container (Toggled via button) */}
      {showPrintPreview && (
        <div className="bg-card p-6 lg:p-8 rounded-xl shadow-lg border-2 border-border space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-lg bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary">
                <Printer className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Hindustan Petroleum Corporation Limited
                </h2>
                <p className="text-xs text-muted-foreground">
                  Official Register Form No. 3 (Sports Welfare Directorate) · Chembur 2024-25
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#1F2E8C] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#141F63]"
              >
                Execute System Print
              </button>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="px-3 py-2 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-border"
              >
                Close View
              </button>
            </div>
          </div>

          <div className="text-center py-2 bg-[#F4F2FF] dark:bg-muted/40 rounded-lg">
            <h3 className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] uppercase tracking-wider text-foreground">
              PRIZE MONEY / CASH CARD CONTROL REGISTER
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
              Rule 14-B of All India Annual Corporate Sports Regulations
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
            <div><strong>Place of Event:</strong> HPCL Sports Complex, Chembur</div>
            <div><strong>Disbursement Officer:</strong> R. Sharma (ID: 44091)</div>
            <div><strong>Audit Officer:</strong> S. Venkatesh (Internal Audit)</div>
          </div>

          {/* Printable Layout Table */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted text-muted-foreground text-[10px] uppercase font-bold">
                  <th className="p-2 border border-border text-center">S.No</th>
                  <th className="p-2 border border-border">Event</th>
                  <th className="p-2 border border-border">Pos</th>
                  <th className="p-2 border border-border">BIB</th>
                  <th className="p-2 border border-border">Athlete Name</th>
                  <th className="p-2 border border-border">Unit / Zone</th>
                  <th className="p-2 border border-border text-right">Amount</th>
                  <th className="p-2 border border-border text-center">Signature Status</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.serialNo} className="hover:bg-muted/20">
                    <td className="p-2 border border-border text-center font-mono font-bold">
                      {String(c.serialNo).padStart(3, "0")}
                    </td>
                    <td className="p-2 border border-border">{c.eventName}</td>
                    <td className="p-2 border border-border font-bold">{c.position}</td>
                    <td className="p-2 border border-border font-mono">#{c.bib}</td>
                    <td className="p-2 border border-border font-semibold">{c.athleteName}</td>
                    <td className="p-2 border border-border text-muted-foreground">{c.unit}</td>
                    <td className="p-2 border border-border text-right font-mono font-bold">
                      {formatCurrency(c.prizeAmount)}
                    </td>
                    <td className="p-2 border border-border text-center">
                      {c.status === "Signed" ? (
                        <span className="text-emerald-600 font-bold text-[10px]">✓ Signed</span>
                      ) : (
                        <span className="text-muted-foreground italic text-[10px]">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Strip & Quick Status Selector */}
      <div className="bg-card rounded-xl p-3.5 shadow-xs border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedStatus("All")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0",
              selectedStatus === "All"
                ? "bg-[#1F2E8C] text-white shadow-2xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            All 36 Rows ({cards.length})
          </button>
          <button
            onClick={() => setSelectedStatus("Signed")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 flex items-center gap-1.5",
              selectedStatus === "Signed"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Signed Only ({signedCards})</span>
          </button>
          <button
            onClick={() => setSelectedStatus("Pending")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 flex items-center gap-1.5",
              selectedStatus === "Pending"
                ? "bg-[#E4202B] text-white shadow-2xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-3.5" />
            <span>Pending Signatures ({pendingCards})</span>
          </button>
        </div>

        {/* Search & Event Dropdown */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by name, BIB, unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:border-[#1F2E8C] focus:outline-none"
            />
          </div>

          {/* Event Dropdown */}
          <select
            value={selectedEventNo}
            onChange={(e) => setSelectedEventNo(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:border-[#1F2E8C] focus:outline-none"
          >
            <option value="All">All 12 Events</option>
            {uniqueEvents.map((no) => (
              <option key={no} value={no}>
                Event #{no}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High Density Format 3 Table */}
      <div className="bg-card rounded-xl shadow-xs border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F2FF] dark:bg-muted text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16 text-center">S.No</th>
                <th className="py-3 px-4 min-w-[210px]">Event Specification</th>
                <th className="py-3 px-4 min-w-[160px]">Podium Rank</th>
                <th className="py-3 px-4 min-w-[220px]">Athlete &amp; Identification</th>
                <th className="py-3 px-4 min-w-[170px]">Unit / Zone</th>
                <th className="py-3 px-4 text-right min-w-[110px]">Prize Value</th>
                <th className="py-3 px-4 min-w-[180px]">Disbursement Status</th>
                <th className="py-3 px-4 text-center min-w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredCards.map((card) => {
                const isSigned = card.status === "Signed";
                const isWinner = card.position === "I";
                const isRunnerUp = card.position === "II";

                return (
                  <tr key={card.serialNo} className="hover:bg-muted/30 transition-colors">
                    {/* S.No */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#001375] dark:text-primary">
                      {String(card.serialNo).padStart(3, "0")}
                    </td>

                    {/* Event Specification */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground leading-tight">
                          Event {String(card.eventNo).padStart(2, "0")}: {card.eventName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {card.category}
                        </span>
                      </div>
                    </td>

                    {/* Podium Rank */}
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          isWinner
                            ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                            : isRunnerUp
                            ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-400"
                        )}
                      >
                        <Award className="size-3" />
                        <span>{card.positionLabel}</span>
                      </span>
                    </td>

                    {/* Athlete & Identification */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                          #{card.bib}
                        </span>
                        <span className="font-bold text-foreground">{card.athleteName}</span>
                      </div>
                    </td>

                    {/* Unit / Zone */}
                    <td className="py-3 px-4 text-muted-foreground">{card.unit}</td>

                    {/* Prize Value */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {formatCurrency(card.prizeAmount)}
                    </td>

                    {/* Disbursement Status */}
                    <td className="py-3 px-4">
                      {isSigned ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="size-3" />
                            Paid &amp; Signed
                          </span>
                          {card.signatureDataUrl && (
                            <button
                              type="button"
                              onClick={() => setViewingSignatureCard(card)}
                              className="size-6 rounded border border-border bg-white dark:bg-card p-0.5 overflow-hidden hover:ring-2 hover:ring-[#1F2E8C] transition-all"
                              title="Click to view full signature"
                            >
                              <img
                                src={card.signatureDataUrl}
                                alt="Signature"
                                className="size-full object-contain"
                              />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 text-[10px] font-bold">
                          <Clock className="size-3" />
                          Pending Signature
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      {isSigned ? (
                        <button
                          type="button"
                          onClick={() => setViewingSignatureCard(card)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Eye className="size-3.5" />
                          <span>View Sign</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveSigningCard(card)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-2xs"
                        >
                          <CreditCard className="size-3.5" />
                          <span>Sign Card</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-muted/20 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredCards.length}</strong> of{" "}
            <strong>{cards.length}</strong> Format 3 rows
          </span>
          <span className="font-semibold text-foreground">
            Total Disbursed: {formatCurrency(disbursedAmount)} / {formatCurrency(totalBudget)}
          </span>
        </div>
      </div>

      {/* INTERACTIVE DIGITAL SIGNATURE MODAL */}
      {activeSigningCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#E4202B] uppercase tracking-wider">
                  Official Format 3 Adjudication
                </span>
                <h3 className="font-bold text-base font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Cash Card Signature Sheet · Serial #{String(activeSigningCard.serialNo).padStart(3, "0")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSigningCard(null)}
                className="p-1 rounded text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Athlete & Prize Information Card */}
            <div className="p-3.5 rounded-xl bg-[#F4F2FF] dark:bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#1F2E8C] text-white font-mono font-bold text-xs">
                      #{activeSigningCard.bib}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {activeSigningCard.athleteName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeSigningCard.unit} · {activeSigningCard.eventName} ({activeSigningCard.category})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Prize Money
                  </span>
                  <span className="text-xl font-bold font-mono text-[#001375] dark:text-primary">
                    {formatCurrency(activeSigningCard.prizeAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.idVerified}
                  onChange={(e) => setChecklist({ ...checklist, idVerified: e.target.checked })}
                  className="rounded border-border text-[#1F2E8C]"
                />
                <span>Photo ID Verified</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.bibConfirmed}
                  onChange={(e) => setChecklist({ ...checklist, bibConfirmed: e.target.checked })}
                  className="rounded border-border text-[#1F2E8C]"
                />
                <span>BIB Match Confirmed</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.resultVerified}
                  onChange={(e) => setChecklist({ ...checklist, resultVerified: e.target.checked })}
                  className="rounded border-border text-[#1F2E8C]"
                />
                <span>Podium Standing OK</span>
              </label>
            </div>

            {/* Signature Canvas Pad */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Athlete&apos;s Digital Signature (Touch / Mouse):
                </span>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <Eraser className="size-3" />
                  <span>Clear Pad</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-[#1F2E8C]/40 rounded-xl bg-white overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={150}
                  className="w-full h-36 touch-none cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 pointer-events-none">
                    Sign inside this box using touch or mouse
                  </div>
                )}
              </div>
            </div>

            {/* Statutory Confirmation */}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              I hereby acknowledge receipt of the specified prize value under Hindustan Petroleum
              Corporation Limited Sports Regulations (Format 3).
            </p>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setActiveSigningCard(null)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignature}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading Signature to Storage...</span>
                  </>
                ) : (
                  <span>Confirm & Save Card</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE VIEWER MODAL */}
      {viewingSignatureCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Verified Format 3 Record
                </span>
                <h3 className="font-bold text-base font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Signature Record #{String(viewingSignatureCard.serialNo).padStart(3, "0")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingSignatureCard(null)}
                className="p-1 rounded text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Athlete:</span>
                <span className="font-bold text-foreground">{viewingSignatureCard.athleteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-semibold">{viewingSignatureCard.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prize Amount:</span>
                <span className="font-bold font-mono text-[#001375] dark:text-primary">
                  {formatCurrency(viewingSignatureCard.prizeAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Signed:</span>
                <span className="font-mono text-muted-foreground">{viewingSignatureCard.dateSigned || "Official Meet"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-white flex items-center justify-center min-h-[120px]">
              {viewingSignatureCard.signatureDataUrl ? (
                <img
                  src={viewingSignatureCard.signatureDataUrl}
                  alt="Athlete Signature"
                  className="max-h-24 max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Digital Signature on Paper File
                </span>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingSignatureCard(null)}
                className="px-4 py-2 bg-muted hover:bg-border text-foreground text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CashCardsView;
