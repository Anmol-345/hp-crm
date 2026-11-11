import { mockAthletes } from "./mock-data";
import { Athlete, Gender, AgeCategory } from "./types";
import { getSupabase } from "@/lib/supabase/db";

function mapGender(g: string | null): Gender {
  if (g === "female") return "Women";
  if (g === "girl") return "Girls";
  if (g === "boy") return "Boys";
  return "Men";
}

function mapAgeCategory(notes: string | null): AgeCategory {
  if (!notes) return "General";
  const n = notes.toLowerCase();
  if (n.includes("spouse")) return "Below 45 (Spouse)";
  if (n.includes("45 to below 55") || n.includes("45-55")) return "45 to below 55";
  if (n.includes("55 and above") || n.includes("55+")) return "55 and above";
  if (n.includes("girl") || n.includes("below 12")) return "Girls (9 Below 12 Yrs)";
  if (n.includes("below 40")) return "Below 40";
  if (n.includes("below 45")) return "Below 45";
  return "General";
}

export async function getAthletes(): Promise<Athlete[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("athletes")
      .select("*, units(name)")
      .order("bib_no", { ascending: true, nullsFirst: false });

    if (error || !data || data.length === 0) {
      return [...mockAthletes];
    }

    return data.map((a: any) => ({
      bib: a.bib_no ? String(a.bib_no) : "N/A",
      name: a.full_name,
      unit: a.units?.name || "HPCL",
      gender: mapGender(a.gender),
      ageCategory: mapAgeCategory(a.notes),
      email: undefined,
      phone: undefined,
    }));
  } catch {
    return [...mockAthletes];
  }
}

export async function getAthleteByBib(bib: string): Promise<Athlete | null> {
  try {
    const bibNum = parseInt(bib, 10);
    const supabase = await getSupabase();
    const query = supabase
      .from("athletes")
      .select("*, units(name)");

    const { data, error } = isNaN(bibNum)
      ? await query.ilike("full_name", `%${bib}%`).limit(1).maybeSingle()
      : await query.eq("bib_no", bibNum).maybeSingle();

    if (error || !data) {
      const mock = mockAthletes.find((a) => a.bib === bib);
      return mock ? { ...mock } : null;
    }

    const a: any = data;
    return {
      bib: a.bib_no ? String(a.bib_no) : "N/A",
      name: a.full_name,
      unit: a.units?.name || "HPCL",
      gender: mapGender(a.gender),
      ageCategory: mapAgeCategory(a.notes),
      email: undefined,
      phone: undefined,
    };
  } catch {
    const mock = mockAthletes.find((a) => a.bib === bib);
    return mock ? { ...mock } : null;
  }
}

export async function searchAthletes(query: string): Promise<Athlete[]> {
  const athletes = await getAthletes();
  const q = query.toLowerCase();
  return athletes.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.bib.toLowerCase().includes(q) ||
      a.unit.toLowerCase().includes(q)
  );
}
