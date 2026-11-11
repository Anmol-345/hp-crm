import { mockEvents } from "./mock-data";
import { Event, Gender, AgeCategory, DayOption } from "./types";
import { getSupabase } from "@/lib/supabase/db";

function mapGender(g: string | null): Gender {
  if (g === "female") return "Women";
  if (g === "girl") return "Girls";
  if (g === "boy") return "Boys";
  return "Men";
}

function mapAgeCategory(category: string, isSpouse: boolean | null): AgeCategory {
  if (isSpouse || category.toLowerCase().includes("spouse")) return "Below 45 (Spouse)";
  if (category.includes("45 to below 55") || category.includes("45-55")) return "45 to below 55";
  if (category.includes("55 and above") || category.includes("55+")) return "55 and above";
  if (category.includes("Girls") || category.includes("Below 12")) return "Girls (9 Below 12 Yrs)";
  if (category.includes("Below 40")) return "Below 40";
  if (category.includes("Below 45")) return "Below 45";
  return "General";
}

function mapDay(dateStr: string | null): DayOption {
  if (dateStr === "2025-02-28") return "28 Feb 2025";
  if (dateStr === "2025-03-01") return "1 Mar 2025";
  return "TBD";
}

export async function getEvents(): Promise<Event[]> {
  try {
    const supabase = await getSupabase();
    const { data: eventsData, error } = await supabase
      .from("events")
      .select(`
        *,
        results(count),
        heats(count)
      `)
      .order("event_no", { ascending: true });

    if (error || !eventsData || eventsData.length === 0) {
      return [...mockEvents];
    }

    return eventsData.map((e: any) => {
      const resultsCount = e.results?.[0]?.count ?? 0;
      const heatsCount = e.heats?.[0]?.count ?? 0;
      const status: Event["status"] = resultsCount > 0 ? "Completed" : heatsCount > 0 ? "In Progress" : "Scheduled";

      return {
        eventNo: e.event_no,
        name: e.name,
        category: e.category,
        gender: mapGender(e.gender),
        ageCategory: mapAgeCategory(e.category, e.is_spouse),
        type: e.metric === "distance_m" ? "field" : "track",
        unit: e.metric === "distance_m" ? "m" : "sec",
        day: mapDay(e.event_date),
        time: e.scheduled_time ? e.scheduled_time.slice(0, 5) : undefined,
        participantCount: e.participants_count ?? undefined,
        isCashCardEvent: e.event_no >= 1 && e.event_no <= 12,
        status,
        notes: e.meet_record ? `Meet record: ${e.meet_record}` : undefined,
      };
    });
  } catch {
    return [...mockEvents];
  }
}

export async function getEventByNo(eventNo: number): Promise<Event | null> {
  try {
    const supabase = await getSupabase();
    const { data: e, error } = await supabase
      .from("events")
      .select(`
        *,
        results(count),
        heats(count)
      `)
      .eq("event_no", eventNo)
      .single();

    if (error || !e) {
      const mock = mockEvents.find((ev) => ev.eventNo === eventNo);
      return mock ? { ...mock } : null;
    }

    const resultsCount = (e as any).results?.[0]?.count ?? 0;
    const heatsCount = (e as any).heats?.[0]?.count ?? 0;
    const status: Event["status"] = resultsCount > 0 ? "Completed" : heatsCount > 0 ? "In Progress" : "Scheduled";

    return {
      eventNo: e.event_no,
      name: e.name,
      category: e.category,
      gender: mapGender(e.gender),
      ageCategory: mapAgeCategory(e.category, e.is_spouse),
      type: e.metric === "distance_m" ? "field" : "track",
      unit: e.metric === "distance_m" ? "m" : "sec",
      day: mapDay(e.event_date),
      time: e.scheduled_time ? e.scheduled_time.slice(0, 5) : undefined,
      participantCount: e.participants_count ?? undefined,
      isCashCardEvent: e.event_no >= 1 && e.event_no <= 12,
      status,
      notes: e.meet_record ? `Meet record: ${e.meet_record}` : undefined,
    };
  } catch {
    const mock = mockEvents.find((ev) => ev.eventNo === eventNo);
    return mock ? { ...mock } : null;
  }
}

export async function updateEventStatus(
  eventNo: number,
  status: Event["status"]
): Promise<Event | null> {
  // Event status is derived from results/heats in the database,
  // but we return the event with the requested status for UI compatibility
  const ev = await getEventByNo(eventNo);
  if (!ev) return null;
  return { ...ev, status };
}
