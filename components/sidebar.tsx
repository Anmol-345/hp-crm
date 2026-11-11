"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Timer,
  Trophy,
  CreditCard,
  Users,
  Building2,
  BarChart3,
  CheckCircle2,
  Moon,
  Sun,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Radio,
  Camera,
  Award,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Heats (Official Record)", href: "/heats", icon: Timer },
  { name: "Results Entry", href: "/results", icon: Trophy },
  { name: "Cash Cards (Format 3)", href: "/cash-cards", icon: CreditCard, badge: "Format 3" },
  { name: "Athletes & Profiles", href: "/athletes", icon: Users },
  { name: "Units / Zones", href: "/units", icon: Building2 },
  { name: "Sports Records", href: "/records", icon: Award, badge: "MR" },
  { name: "Event Gallery", href: "/gallery", icon: Camera },
  { name: "Data Quality", href: "/data-quality", icon: CheckCircle2, badge: "Audit" },
  { name: "Reports & Medals", href: "/reports", icon: BarChart3 },
];

export function Sidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email: string }>({
    name: "Track Marshal",
    role: "official",
    email: "official@hpcl.in",
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
              name: profile?.full_name || "Official Track Adjudicator",
              role: profile?.role || "official",
              email: user.email || "official@hpcl.in",
            });
          });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#101B60] text-white transition-all duration-200 border-r border-[#1F2E8C]/80 shadow-[0_1px_8px_rgba(0,0,0,0.25)]",
          // Mobile state
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          // Desktop collapsed state
          isCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        {/* Top Header with HP Logo & Title */}
        <div className="flex flex-col bg-[#141F63]/80 border-b border-[#1F2E8C]/60">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden"
              onClick={onMobileClose}
            >
              <div className="relative size-10 shrink-0 rounded-full bg-white p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <Image
                  src="/hp-logo.png"
                  alt="HP Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-base tracking-tight font-[family-name:var(--font-space-grotesk)] text-white">
                    HP Sports Meet CRM
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BBC3FF]">
                    19th All India Meet 2024-25
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="rounded p-1 text-slate-300 hover:bg-[#1F2E8C] lg:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {!isCollapsed && (
            <div className="px-4 py-1.5 bg-[#0C1445]/60 border-t border-[#1F2E8C]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BBC3FF]/80">
                Championship Management
              </span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all relative group",
                  isActive
                    ? "bg-[#1F2E8C] text-[#FFFFFF] shadow-sm font-bold border-l-3 border-[#E4202B]"
                    : "text-[#BBC3FF] hover:bg-[#1F2E8C]/50 hover:text-white"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("size-4.5 shrink-0", isActive ? "text-[#FFFFFF]" : "text-[#BBC3FF]")} />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-[#E4202B] text-white"
                        : "bg-[#1F2E8C] text-[#BBC3FF]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card & System Sync Status */}
        <div className="border-t border-[#1F2E8C]/80 p-3 space-y-2 bg-[#0C1445]/80">
          {!isCollapsed && (
            <div className="rounded-lg bg-[#141F63] p-2.5 space-y-1.5 border border-[#1F2E8C]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="size-6 rounded-full bg-[#E4202B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {currentUser.role === "admin" ? "AD" : "OF"}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-[#BBC3FF] uppercase font-semibold">
                      {currentUser.role === "admin" ? "Meet Administrator" : "Official Track Adjudicator"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded p-1 text-slate-300 hover:text-red-400 hover:bg-[#1F2E8C] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400 font-semibold border-t border-[#1F2E8C]/40">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Track System Synced · Live</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 rounded-lg p-1.5 text-xs font-medium text-slate-200 hover:bg-[#1F2E8C] transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-300" />
              )}
              {!isCollapsed && (
                <span className="text-[11px]">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              )}
            </button>

            {/* Collapse toggle (Desktop only) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex rounded-lg p-1.5 text-slate-300 hover:bg-[#1F2E8C] transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
