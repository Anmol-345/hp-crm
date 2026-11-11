import { mockUnits } from "./mock-data";
import { Unit } from "./types";
import { getSupabase } from "@/lib/supabase/db";

function getUnitCode(name: string): string {
  if (name.includes("Mumbai")) return "MR";
  if (name.includes("Visakh")) return "VR";
  if (name.includes("South Central")) return "SCZ";
  if (name.includes("North West")) return "NWZ";
  if (name.includes("East")) return "EZ";
  if (name.includes("Petroleum")) return "PH";
  if (name.includes("Marketing")) return "MHQ";
  return name.split(" ").map(w => w[0]).join("").toUpperCase();
}

function getUnitZone(name: string, kind?: string | null): string {
  if (kind === "refinery") return "Refinery";
  if (kind === "zone") return "Zone";
  if (kind === "office") return "Corporate Office";
  if (name.includes("Mumbai") || name.includes("Petroleum")) return "West / HQ";
  if (name.includes("Visakh") || name.includes("South Central")) return "South";
  if (name.includes("East")) return "East";
  return "General";
}

export async function getUnits(): Promise<Unit[]> {
  try {
    const supabase = await getSupabase();
    
    // Fetch units and medal_table view
    const [{ data: unitsData, error: unitsError }, { data: medalsData }, { data: athleteCounts }] = await Promise.all([
      supabase.from("units").select("*").order("name"),
      supabase.from("medal_table").select("*"),
      supabase.from("athletes").select("unit_id"),
    ]);

    if (unitsError || !unitsData || unitsData.length === 0) {
      return [...mockUnits];
    }

    // Compute athlete counts per unit
    const countsByUnitId: Record<string, number> = {};
    if (athleteCounts) {
      for (const a of athleteCounts) {
        if (a.unit_id) {
          countsByUnitId[a.unit_id] = (countsByUnitId[a.unit_id] || 0) + 1;
        }
      }
    }

    // Map medal counts by unit name
    const medalsByName: Record<string, { gold: number; silver: number; bronze: number; total: number; points: number }> = {};
    if (medalsData) {
      for (const m of medalsData) {
        if (m.unit) {
          medalsByName[m.unit] = {
            gold: m.gold ?? 0,
            silver: m.silver ?? 0,
            bronze: m.bronze ?? 0,
            total: m.total_medals ?? ((m.gold ?? 0) + (m.silver ?? 0) + (m.bronze ?? 0)),
            points: m.total_points ?? ((m.gold ?? 0) * 5 + (m.silver ?? 0) * 3 + (m.bronze ?? 0) * 1),
          };
        }
      }
    }

    const units: Unit[] = unitsData.map((u: any) => {
      const medal = medalsByName[u.name] || { gold: 0, silver: 0, bronze: 0, total: 0, points: 0 };
      return {
        id: u.id,
        name: u.name,
        code: getUnitCode(u.name),
        gold: medal.gold,
        silver: medal.silver,
        bronze: medal.bronze,
        totalMedals: medal.total,
        totalPoints: medal.points,
        athleteCount: countsByUnitId[u.id] || 0,
        zone: getUnitZone(u.name, u.kind),
      };
    });

    // Sort by points / gold descending
    return units.sort((a, b) => b.totalPoints - a.totalPoints || b.gold - a.gold);
  } catch {
    return [...mockUnits];
  }
}

export async function getUnitById(id: string): Promise<Unit | null> {
  const units = await getUnits();
  const unit = units.find((u) => u.id === id || u.code.toLowerCase() === id.toLowerCase() || u.name.toLowerCase() === id.toLowerCase());
  return unit ? { ...unit } : null;
}
