import { mockHeats } from "./mock-data";
import { Heat, HeatEntry } from "./types";
import { getSupabase } from "@/lib/supabase/db";

export async function getHeats(): Promise<Heat[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("heats")
      .select(`
        id,
        event_no,
        heat_no,
        heat_entries (
          id,
          bib_no,
          performance,
          rank_remark,
          needs_verification,
          athletes (
            id,
            bib_no,
            full_name,
            units (name)
          )
        )
      `)
      .order("event_no", { ascending: true })
      .order("heat_no", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockHeats];
    }

    return data.map((h: any) => {
      const rawEntries = h.heat_entries || [];
      const entries: HeatEntry[] = rawEntries.map((e: any) => {
        const perf = e.performance !== null ? Number(e.performance) : undefined;
        let rank: number | undefined;
        if (e.rank_remark) {
          const m = e.rank_remark.match(/\b([1-8])\b/);
          if (m) rank = parseInt(m[1], 10);
        }

        const bib = e.bib_no !== null && e.bib_no !== undefined
          ? String(e.bib_no)
          : e.athletes?.bib_no
          ? String(e.athletes.bib_no)
          : "—";

        return {
          id: e.id,
          bib,
          athleteName: e.athletes?.full_name || "Athlete",
          unit: e.athletes?.units?.name || "HPCL",
          performance: perf,
          performanceDisplay: perf !== undefined ? `${perf.toFixed(2)}s` : undefined,
          rank,
          remarks: e.rank_remark || undefined,
          needsVerification: Boolean(e.needs_verification),
        };
      });

      const hasVerification = entries.some((entry) => entry.needsVerification);
      const isCompleted = entries.length > 0 && entries.every((entry) => entry.performance !== undefined);
      const status: Heat["status"] = hasVerification
        ? "Needs Verification"
        : isCompleted
        ? "Completed"
        : "Scheduled";

      return {
        heatNumber: h.heat_no,
        eventNo: h.event_no ?? 0,
        status,
        entries,
      };
    });
  } catch {
    return [...mockHeats];
  }
}

export async function getHeatsByEvent(eventNo: number): Promise<Heat[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("heats")
      .select(`
        id,
        event_no,
        heat_no,
        heat_entries (
          id,
          bib_no,
          performance,
          rank_remark,
          needs_verification,
          athletes (
            id,
            bib_no,
            full_name,
            units (name)
          )
        )
      `)
      .eq("event_no", eventNo)
      .order("heat_no", { ascending: true });

    if (error || !data || data.length === 0) {
      return mockHeats
        .filter((h) => h.eventNo === eventNo)
        .map((h) => ({ ...h, entries: [...h.entries] }));
    }

    return data.map((h: any) => {
      const rawEntries = h.heat_entries || [];
      const entries: HeatEntry[] = rawEntries.map((e: any) => {
        const perf = e.performance !== null ? Number(e.performance) : undefined;
        let rank: number | undefined;
        if (e.rank_remark) {
          const m = e.rank_remark.match(/\b([1-8])\b/);
          if (m) rank = parseInt(m[1], 10);
        }

        const bib = e.bib_no !== null && e.bib_no !== undefined
          ? String(e.bib_no)
          : e.athletes?.bib_no
          ? String(e.athletes.bib_no)
          : "—";

        return {
          id: e.id,
          bib,
          athleteName: e.athletes?.full_name || "Athlete",
          unit: e.athletes?.units?.name || "HPCL",
          performance: perf,
          performanceDisplay: perf !== undefined ? `${perf.toFixed(2)}s` : undefined,
          rank,
          remarks: e.rank_remark || undefined,
          needsVerification: Boolean(e.needs_verification),
        };
      });

      const hasVerification = entries.some((entry) => entry.needsVerification);
      const isCompleted = entries.length > 0 && entries.every((entry) => entry.performance !== undefined);
      const status: Heat["status"] = hasVerification
        ? "Needs Verification"
        : isCompleted
        ? "Completed"
        : "Scheduled";

      return {
        heatNumber: h.heat_no,
        eventNo: h.event_no ?? eventNo,
        status,
        entries,
      };
    });
  } catch {
    return mockHeats
      .filter((h) => h.eventNo === eventNo)
      .map((h) => ({ ...h, entries: [...h.entries] }));
  }
}

export interface VerificationEntry {
  id: string;
  eventNo: number;
  eventName: string;
  heatNo: number;
  bibNo: number | null;
  athleteId: string | null;
  athleteName: string;
  unitName: string;
  performance: number | null;
  rankRemark: string | null;
  needsVerification: boolean;
}

export async function getVerificationQueue(): Promise<VerificationEntry[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("heat_entries")
      .select(`
        id,
        bib_no,
        performance,
        rank_remark,
        needs_verification,
        athlete_id,
        athletes (
          full_name,
          units (name)
        ),
        heats (
          heat_no,
          event_no,
          events (name)
        )
      `)
      .eq("needs_verification", true);

    if (error || !data) return [];

    return data.map((e: any) => ({
      id: e.id,
      eventNo: e.heats?.event_no ?? 0,
      eventName: e.heats?.events?.name || "Official Event",
      heatNo: e.heats?.heat_no ?? 1,
      bibNo: e.bib_no,
      athleteId: e.athlete_id,
      athleteName: e.athletes?.full_name || "Unverified Name",
      unitName: e.athletes?.units?.name || "Unassigned",
      performance: e.performance !== null ? Number(e.performance) : null,
      rankRemark: e.rank_remark,
      needsVerification: Boolean(e.needs_verification),
    }));
  } catch {
    return [];
  }
}

export async function resolveHeatEntry(
  entryId: string,
  updates: {
    bib_no?: number | null;
    athlete_name?: string;
    performance?: number | null;
    rank_remark?: string | null;
    needs_verification?: boolean;
  }
): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    
    // If athlete name is updated, update athlete record or heat entry
    const patch: any = {
      needs_verification: updates.needs_verification ?? false,
    };
    if (updates.bib_no !== undefined) patch.bib_no = updates.bib_no;
    if (updates.performance !== undefined) patch.performance = updates.performance;
    if (updates.rank_remark !== undefined) patch.rank_remark = updates.rank_remark;

    const { error } = await supabase
      .from("heat_entries")
      .update(patch)
      .eq("id", entryId);

    return !error;
  } catch {
    return false;
  }
}
