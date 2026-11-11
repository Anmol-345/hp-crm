"use client";

import React, { useState, Suspense } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DayProvider } from "./day-switcher";
import { RealtimeListener } from "./realtime-listener";
import { RouteProgressBar } from "./route-progress-bar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <RealtimeListener>
      <DayProvider>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <div className="min-h-screen bg-surface text-foreground flex flex-col">
          {/* Collapsible Navy Sidebar */}
          <Sidebar
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />

          {/* Top bar */}
          <Topbar
            onMobileMenuClick={() => setIsMobileOpen(true)}
            isCollapsed={isCollapsed}
          />

          {/* Main Content Area */}
          <main
            className={cn(
              "flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200",
              isCollapsed ? "lg:pl-20" : "lg:pl-72"
            )}
          >
            <div className="mx-auto max-w-[1720px] w-full">{children}</div>
          </main>
        </div>
      </DayProvider>
    </RealtimeListener>
  );
}

export default AppShell;
