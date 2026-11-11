"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface RealtimeContextType {
  isConnected: boolean;
  lastUpdated: string | null;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  lastUpdated: null,
});

export function useRealtimeStatus() {
  return useContext(RealtimeContext);
}

export function RealtimeListener({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const handleUpdate = () => {
      setLastUpdated(new Date().toLocaleTimeString());
      router.refresh();
    };

    const channel = supabase
      .channel("crm-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "results" },
        handleUpdate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cash_cards" },
        handleUpdate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "heat_entries" },
        handleUpdate
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <RealtimeContext.Provider value={{ isConnected, lastUpdated }}>
      {children}
    </RealtimeContext.Provider>
  );
}

