import { mockPublishedResults } from "./mock-data";
import { Result, Position } from "./types";
import { getSupabase } from "@/lib/supabase/db";

const positionMap: Record<number, Position> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
};

const pointsMap: Record<number, number> = {
  1: 5,
  2: 3,
  3: 1,
};

export async function getResults(): Promise<Result[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("results")
      .select(`
        id,
        event_no,
        position,
        performance,
        result_date,
        events (
          name,
          metric
        ),
        athletes (
          id,
          bib_no,
          full_name,
          units (name)
        )
      `)
      .order("event_no", { ascending: true })
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockPublishedResults];
    }

    return data.map((r: any) => {
      const pos = r.position ?? 1;
      const perf = r.performance !== null ? Number(r.performance) : 0;
      const metric = r.events?.metric === "distance_m" ? "m" : "s";
      const bib = r.athletes?.bib_no ? String(r.athletes.bib_no) : "—";

      return {
        id: r.id,
        eventNo: r.event_no ?? 0,
        position: positionMap[pos] || "I",
        bib,
        athleteName: r.athletes?.full_name || "Official Athlete",
        unit: r.athletes?.units?.name || "HPCL",
        performance: perf,
        performanceDisplay: `${perf.toFixed(2)}${metric}`,
        points: pointsMap[pos] || 0,
        notes: undefined,
      };
    });
  } catch {
    return [...mockPublishedResults];
  }
}

export async function getResultsByEvent(eventNo: number): Promise<Result[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("results")
      .select(`
        id,
        event_no,
        position,
        performance,
        result_date,
        events (
          name,
          metric
        ),
        athletes (
          id,
          bib_no,
          full_name,
          units (name)
        )
      `)
      .eq("event_no", eventNo)
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPublishedResults
        .filter((r) => r.eventNo === eventNo)
        .map((r) => ({ ...r }));
    }

    return data.map((r: any) => {
      const pos = r.position ?? 1;
      const perf = r.performance !== null ? Number(r.performance) : 0;
      const metric = r.events?.metric === "distance_m" ? "m" : "s";
      const bib = r.athletes?.bib_no ? String(r.athletes.bib_no) : "—";

      return {
        id: r.id,
        eventNo: r.event_no ?? eventNo,
        position: positionMap[pos] || "I",
        bib,
        athleteName: r.athletes?.full_name || "Official Athlete",
        unit: r.athletes?.units?.name || "HPCL",
        performance: perf,
        performanceDisplay: `${perf.toFixed(2)}${metric}`,
        points: pointsMap[pos] || 0,
        notes: undefined,
      };
    });
  } catch {
    return mockPublishedResults
      .filter((r) => r.eventNo === eventNo)
      .map((r) => ({ ...r }));
  }
}

export async function publishEventResults(
  eventNo: number,
  entries: Array<{
    position: 1 | 2 | 3;
    athleteId?: string;
    bibNo?: number;
    athleteName: string;
    unitName?: string;
    performance: number;
  }>
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await getSupabase();

    for (const entry of entries) {
      let athleteId = entry.athleteId;

      // If no athleteId, find or create athlete
      if (!athleteId) {
        if (entry.bibNo) {
          const { data: existing } = await supabase
            .from("athletes")
            .select("id")
            .eq("bib_no", entry.bibNo)
            .maybeSingle();
          if (existing) athleteId = existing.id;
        }

        if (!athleteId) {
          // Resolve unit
          let unitId: string | null = null;
          if (entry.unitName) {
            const { data: unitData } = await supabase
              .from("units")
              .select("id")
              .ilike("name", `%${entry.unitName}%`)
              .maybeSingle();
            if (unitData) unitId = unitData.id;
          }

          const { data: newAthlete, error: athleteErr } = await supabase
            .from("athletes")
            .insert({
              full_name: entry.athleteName,
              bib_no: entry.bibNo || null,
              unit_id: unitId,
            })
            .select("id")
            .single();

          if (!athleteErr && newAthlete) {
            athleteId = newAthlete.id;
          }
        }
      }

      // Upsert result
      await supabase.from("results").upsert(
        {
          event_no: eventNo,
          position: entry.position,
          athlete_id: athleteId,
          performance: entry.performance,
          result_date: new Date().toISOString().split("T")[0],
        },
        { onConflict: "event_no,position" }
      );
    }

    // Call stored procedure to auto-generate cash cards for cash card events (events 1-12)
    if (eventNo >= 1 && eventNo <= 12) {
      const { error: rpcError } = await supabase.rpc("publish_results", {
        p_event_no: eventNo,
      });
      if (rpcError) {
        console.warn("RPC publish_results notice:", rpcError.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to publish results" };
  }
}
