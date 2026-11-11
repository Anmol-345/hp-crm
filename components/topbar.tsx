"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  CreditCard,
  Shield,
  Radio,
  LogOut,
  UserCheck,
  Flame,
  Printer,
} from "lucide-react";
import { DaySwitcher } from "./day-switcher";
import { CommandPalette } from "./command-palette";
import { useRealtimeStatus } from "./realtime-listener";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMobileMenuClick: () => void;
  isCollapsed: boolean;
}

export function Topbar({ onMobileMenuClick, isCollapsed }: TopbarProps) {
  const router = useRouter();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isConnected, lastUpdated } = useRealtimeStatus();
  const [currentUser, setCurrentUser] = useState<{ email?: string; role?: string; name?: string }>({
    email: "official@hpcl.in",
    role: "official",
    name: "Track Marshal",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            setCurrentUser({
              email: user.email,
              role: profile?.role || "official",
              name: profile?.full_name || user.email?.split("@")[0] || "Track Official",
            });
          });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowUserMenu(false);
    router.push("/login");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-xs transition-all duration-200",
          isCollapsed ? "lg:pl-24" : "lg:pl-76"
        )}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileMenuClick}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Quick Search trigger (Cmd+K) */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-hp-navy/60 hover:text-foreground transition-all shadow-2xs"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search meet records...</span>
            <span className="sm:hidden">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Location / Session Tag */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground border-l border-border pl-4">
            <span className="size-2 rounded-full bg-[#E4202B] animate-ping" />
            <span className="font-semibold text-foreground">Chembur Sports Complex</span>
            <span>·</span>
            <span>Day 1 Session 2 Live</span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Sync Pill */}
          <div
            className={cn(
              "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all",
              isConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
            )}
            title={lastUpdated ? `Last synchronized at ${lastUpdated}` : "Realtime sync active"}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              )}
            />
            <span className="flex items-center gap-1">
              <Radio className="size-3" />
              <span>{isConnected ? "Live Sync Active" : "Sync Standby"}</span>
            </span>
          </div>

          {/* Day switcher component */}
          <DaySwitcher size="sm" />

          {/* Format 3 Quick Button */}
          <Link
            href="/cash-cards"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-hp-red/30 bg-hp-red/10 px-3 py-1.5 text-xs font-semibold text-hp-red hover:bg-hp-red hover:text-white transition-colors"
          >
            <CreditCard className="size-3.5" />
            <span>Format 3 Sheet</span>
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full border border-border p-1 hover:ring-2 hover:ring-hp-navy/20 transition-all"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-[#1F2E8C] text-xs font-bold text-white uppercase">
                {currentUser.role === "admin" ? "AD" : currentUser.role === "official" ? "OF" : "HP"}
              </div>
            </button>

            {showUserMenu && (
              <div
                onMouseLeave={() => setShowUserMenu(false)}
                className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in-50 zoom-in-95 text-xs z-50"
              >
                <div className="border-b border-border px-2 py-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-hp-ink dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <span className="rounded bg-hp-navy/10 px-1.5 py-0.5 text-[9px] font-bold text-hp-navy dark:text-primary uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted font-medium"
                  >
                    <Shield className="size-3.5 text-hp-navy dark:text-primary" />
                    <span>Meet Dashboard</span>
                  </Link>
                  <Link
                    href="/heats"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted font-medium"
                  >
                    <Flame className="size-3.5 text-hp-red" />
                    <span>Heats (Official Record)</span>
                  </Link>
                  <Link
                    href="/data-quality"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted font-medium"
                  >
                    <UserCheck className="size-3.5 text-amber-600" />
                    <span>Data Quality Review</span>
                  </Link>
                  <Link
                    href="/cash-cards"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted font-medium"
                  >
                    <CreditCard className="size-3.5 text-hp-red" />
                    <span>Cash Cards (Format 3)</span>
                  </Link>
                </div>
                <div className="border-t border-border pt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-hp-red hover:bg-hp-red/10 font-medium"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}

export default Topbar;
