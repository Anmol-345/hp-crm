import { SportsRecord, RecordStatus } from "./types";

export const INITIAL_SPORTS_RECORDS: SportsRecord[] = [
  {
    id: "rec-1",
    eventNo: 1,
    eventName: "100m Run",
    category: "Men (Below 45 Yrs)",
    eventType: "track",
    recordHolder: "Suresh P. Kamble",
    bib: "102",
    unit: "Mumbai Refinery",
    performance: 10.82,
    performanceDisplay: "10.82 sec",
    unitMetric: "sec",
    yearSet: 2018,
    edition: "15th All India Meet (2018)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
    notes: "Wind reading: +0.4 m/s. All-time championship sprint benchmark.",
  },
  {
    id: "rec-2",
    eventNo: 2,
    eventName: "200m Run",
    category: "Men (Below 45 Yrs)",
    eventType: "track",
    recordHolder: "Vikramjit Singh",
    bib: "305",
    unit: "North Zone",
    performance: 22.40,
    performanceDisplay: "22.40 sec",
    unitMetric: "sec",
    yearSet: 2019,
    edition: "16th All India Meet (2019)",
    location: "Visakhapatnam Stadium",
    status: "Standing",
    cashBonusEligible: true,
    notes: "Championship curve record.",
  },
  {
    id: "rec-3",
    eventNo: 3,
    eventName: "400m Run",
    category: "Men (Below 45 Yrs)",
    eventType: "track",
    recordHolder: "Anil K. Verma",
    bib: "214",
    unit: "South Central Zone",
    performance: 50.15,
    performanceDisplay: "50.15 sec",
    unitMetric: "sec",
    yearSet: 2017,
    edition: "14th All India Meet (2017)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
    notes: "Sub-51 second barrier broken.",
  },
  {
    id: "rec-4",
    eventNo: 4,
    eventName: "800m Run",
    category: "Men (Below 45 Yrs)",
    eventType: "track",
    recordHolder: "Deepak S. Rawat",
    bib: "419",
    unit: "Mumbai Refinery",
    performance: 118.40,
    performanceDisplay: "1:58.40 min",
    unitMetric: "sec",
    yearSet: 2016,
    edition: "13th All India Meet (2016)",
    location: "Kolkata Sports Arena",
    status: "Standing",
    cashBonusEligible: true,
  },
  {
    id: "rec-5",
    eventNo: 5,
    eventName: "1500m Run",
    category: "Men (Below 45 Yrs)",
    eventType: "track",
    recordHolder: "Harpreet Singh",
    bib: "508",
    unit: "North Zone",
    performance: 252.30,
    performanceDisplay: "4:12.30 min",
    unitMetric: "sec",
    yearSet: 2015,
    edition: "12th All India Meet (2015)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
  },
  {
    id: "rec-6",
    eventNo: 6,
    eventName: "100m Run",
    category: "Men (45 to below 55 Yrs)",
    eventType: "track",
    recordHolder: "Pradeep Joshi",
    bib: "189",
    unit: "West Zone",
    performance: 12.10,
    performanceDisplay: "12.10 sec",
    unitMetric: "sec",
    yearSet: 2022,
    edition: "17th All India Meet (2022)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
  },
  {
    id: "rec-8",
    eventNo: 8,
    eventName: "400m Run",
    category: "Men (45 to below 55 Yrs)",
    eventType: "track",
    recordHolder: "Narayana Moolya",
    bib: "798",
    unit: "South Central Zone",
    performance: 60.80,
    performanceDisplay: "60.80 sec",
    unitMetric: "sec",
    yearSet: 2025,
    edition: "19th All India Meet (2024-25)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Broken this Meet",
    brokenByAthlete: "Narayana Moolya (SCZ)",
    brokenPerformance: 60.80,
    cashBonusEligible: true,
    notes: "New Meet Record (NMR) clocked on Day 1. Previous record 62.40s by K. Nair (2019).",
  },
  {
    id: "rec-9",
    eventNo: 9,
    eventName: "Shot Put",
    category: "Men (Below 45 Yrs)",
    eventType: "field",
    recordHolder: "Balwinder Singh",
    bib: "612",
    unit: "North Zone",
    performance: 14.85,
    performanceDisplay: "14.85 m",
    unitMetric: "m",
    yearSet: 2018,
    edition: "15th All India Meet (2018)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
    notes: "7.26kg senior iron sphere.",
  },
  {
    id: "rec-11",
    eventNo: 11,
    eventName: "High Jump",
    category: "Men (Below 45 Yrs)",
    eventType: "field",
    recordHolder: "Manoj Tiwari",
    bib: "341",
    unit: "East Zone",
    performance: 1.88,
    performanceDisplay: "1.88 m",
    unitMetric: "m",
    yearSet: 2017,
    edition: "14th All India Meet (2017)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
  },
  {
    id: "rec-12",
    eventNo: 12,
    eventName: "Long Jump",
    category: "Men (Below 45 Yrs)",
    eventType: "field",
    recordHolder: "Ramesh Kulkarni",
    bib: "411",
    unit: "Mumbai Refinery",
    performance: 6.94,
    performanceDisplay: "6.94 m",
    unitMetric: "m",
    yearSet: 2019,
    edition: "16th All India Meet (2019)",
    location: "Visakhapatnam Stadium",
    status: "Standing",
    cashBonusEligible: true,
    notes: "Board takeoff at legal wind +0.2 m/s.",
  },
  {
    id: "rec-13",
    eventNo: 13,
    eventName: "Triple Jump",
    category: "Men (Below 45 Yrs)",
    eventType: "field",
    recordHolder: "Siddharth Rao",
    bib: "277",
    unit: "South Central Zone",
    performance: 14.22,
    performanceDisplay: "14.22 m",
    unitMetric: "m",
    yearSet: 2018,
    edition: "15th All India Meet (2018)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
  },
  {
    id: "rec-15",
    eventNo: 15,
    eventName: "4x100m Relay",
    category: "Men (Open Championship)",
    eventType: "track",
    recordHolder: "Mumbai Refinery Relay Team",
    bib: "MR-A",
    unit: "Mumbai Refinery",
    performance: 43.10,
    performanceDisplay: "43.10 sec",
    unitMetric: "sec",
    yearSet: 2019,
    edition: "16th All India Meet (2019)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
    notes: "Suresh P., Amit S., Abhinav S., Rohan M.",
  },
  {
    id: "rec-18",
    eventNo: 18,
    eventName: "Javelin Throw",
    category: "Men (Below 45 Yrs)",
    eventType: "field",
    recordHolder: "Khuntia P.A. Asitkanta",
    bib: "642",
    unit: "Petroleum House",
    performance: 41.20,
    performanceDisplay: "41.20 m",
    unitMetric: "m",
    yearSet: 2023,
    edition: "18th All India Meet (2023)",
    location: "Bengaluru SAI Complex",
    status: "Standing",
    cashBonusEligible: true,
    notes: "800g competition javelin.",
  },
  {
    id: "rec-48",
    eventNo: 48,
    eventName: "Javelin Throw",
    category: "Women (Below 40 Yrs)",
    eventType: "field",
    recordHolder: "Sunita G. Patil",
    bib: "812",
    unit: "West Zone",
    performance: 28.65,
    performanceDisplay: "28.65 m",
    unitMetric: "m",
    yearSet: 2021,
    edition: "16th All India Meet (2021)",
    location: "Chembur Sports Complex, Mumbai",
    status: "Standing",
    cashBonusEligible: true,
    notes: "600g women's javelin.",
  },
];

const LOCAL_STORAGE_RECORDS_KEY = "hpcl_sports_records_v1";

/**
 * Get all sports records (merges initial records with user updates)
 */
export async function getSportsRecords(): Promise<SportsRecord[]> {
  if (typeof window === "undefined") {
    return INITIAL_SPORTS_RECORDS;
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    if (!raw) return INITIAL_SPORTS_RECORDS;
    const userRecords: SportsRecord[] = JSON.parse(raw);

    const userIds = new Set(userRecords.map((r) => r.id));
    const merged = [
      ...userRecords,
      ...INITIAL_SPORTS_RECORDS.filter((r) => !userIds.has(r.id)),
    ];
    return merged.sort((a, b) => a.eventNo - b.eventNo);
  } catch (err) {
    console.error("Error reading sports records from localStorage:", err);
    return INITIAL_SPORTS_RECORDS;
  }
}

/**
 * Add a new official meet record
 */
export async function addSportsRecord(
  record: Omit<SportsRecord, "id" | "updatedAt">
): Promise<SportsRecord> {
  const newRecord: SportsRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = await getSportsRecords();
      const updated = [newRecord, ...existing];
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error adding sports record to localStorage:", err);
    }
  }

  return newRecord;
}

/**
 * Update an existing sports record
 */
export async function updateSportsRecord(
  id: string,
  updates: Partial<SportsRecord>
): Promise<SportsRecord | null> {
  if (typeof window === "undefined") return null;

  try {
    const existing = await getSportsRecords();
    let updatedRecord: SportsRecord | null = null;

    const nextRecords = existing.map((r) => {
      if (r.id === id) {
        updatedRecord = {
          ...r,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updatedRecord;
      }
      return r;
    });

    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(nextRecords));
    return updatedRecord;
  } catch (err) {
    console.error("Error updating sports record:", err);
    return null;
  }
}

/**
 * Ratify a new meet record (NMR) broken in the current meet
 */
export async function ratifyNewRecord(
  recordId: string,
  brokenByAthlete: string,
  newPerformance: number,
  notes?: string
): Promise<SportsRecord | null> {
  return updateSportsRecord(recordId, {
    status: "Broken this Meet",
    brokenByAthlete,
    brokenPerformance: newPerformance,
    notes: notes || `Ratified as New Meet Record (NMR) in 19th All India Meet 2024-25.`,
    cashBonusEligible: true,
  });
}

/**
 * Delete a record
 */
export async function deleteSportsRecord(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const existing = await getSportsRecords();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error("Error deleting sports record:", err);
    return false;
  }
}
