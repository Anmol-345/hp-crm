export type DayOption = "28 Feb 2025" | "1 Mar 2025" | "TBD";

export type Gender = "Men" | "Women" | "Girls" | "Boys";

export type AgeCategory =
  | "Below 45"
  | "45 to below 55"
  | "55 and above"
  | "Below 40"
  | "Below 45 (Spouse)"
  | "Girls (9 Below 12 Yrs)"
  | "General";

export type EventType = "track" | "field";

export type PerformanceUnit = "sec" | "m";

export type Position = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";

export type PositionLabel = "Winner" | "Runner-up" | "1st Runner-up";

export interface Event {
  eventNo: number;
  name: string;
  category: string;
  gender: Gender;
  ageCategory: AgeCategory;
  type: EventType;
  unit: PerformanceUnit;
  day: DayOption;
  time?: string;
  participantCount?: number;
  isCashCardEvent: boolean;
  status: "Scheduled" | "In Progress" | "Completed";
  notes?: string;
}

export interface Athlete {
  bib: string;
  name: string;
  unit: string;
  gender: Gender;
  ageCategory: AgeCategory;
  email?: string;
  phone?: string;
}

export interface HeatEntry {
  id?: string;
  bib: string;
  athleteName: string;
  unit: string;
  performance?: number;
  performanceDisplay?: string;
  rank?: number;
  overallRank?: number;
  remarks?: string;
  needsVerification?: boolean;
}

export interface Heat {
  heatNumber: number;
  eventNo: number;
  time?: string;
  status: "Scheduled" | "Completed" | "Needs Verification";
  entries: HeatEntry[];
}

export interface Result {
  id: string;
  eventNo: number;
  position: Position;
  bib: string;
  athleteName: string;
  unit: string;
  performance: number;
  performanceDisplay: string;
  points?: number;
  notes?: string;
}

export interface CashCard {
  serialNo: number; // 1 to 36
  eventNo: number;  // 1 to 12
  eventName: string;
  category: string;
  position: "I" | "II" | "III";
  positionLabel: PositionLabel;
  bib: string;
  athleteName: string;
  unit: string;
  prizeAmount: number; // 5000, 4000, 3000
  status: "Signed" | "Pending";
  dateSigned?: string;
  signatureDataUrl?: string;
  signedBy?: string;
  notes?: string;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  totalMedals: number;
  totalPoints: number;
  athleteCount: number;
  zone: string;
}

export type PhotoCategory =
  | "Podium & Top 3"
  | "Track & Sprints"
  | "Field Events"
  | "Ceremonies";

export interface EventPhoto {
  id: string;
  title: string;
  caption?: string;
  url: string;
  eventNo?: number;
  eventName?: string;
  category: PhotoCategory;
  day?: DayOption;
  photographer?: string;
  taggedAthletes?: string[];
  createdAt: string;
  isPodiumPhoto?: boolean;
}


