import { EventPhoto, PhotoCategory, DayOption } from "./types";

export const INITIAL_EVENT_PHOTOS: EventPhoto[] = [
  {
    id: "photo-podium-1",
    title: "Men's 100m Final Victory Ceremony",
    caption: "Top 3 Podium: 🥇 Amit Sharma (MR), 🥈 Rajesh Kumar (SCZ), 🥉 Sunil Verma (VR)",
    url: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80",
    eventNo: 1,
    eventName: "100 Mtrs Men (Below 45)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: ["Amit Sharma", "Rajesh Kumar", "Sunil Verma"],
    createdAt: "2025-02-28T10:45:00Z",
    isPodiumPhoto: true,
  },
  {
    id: "photo-podium-2",
    title: "Women's 100m Medal Presentation",
    caption: "Top 3 Podium: 🥇 Priya Nair (SZ), 🥈 Neha Patil (WZ), 🥉 Kavita Das (EZ)",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    eventNo: 2,
    eventName: "100 Mtrs Women (Below 40)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: ["Priya Nair", "Neha Patil", "Kavita Das"],
    createdAt: "2025-02-28T11:15:00Z",
    isPodiumPhoto: true,
  },
  {
    id: "photo-track-1",
    title: "100m Sprint Heats Explosion from Blocks",
    caption: "Heat 1 sprinters powering down the home straight at Chembur Sports Complex.",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    eventNo: 1,
    eventName: "100 Mtrs Men (Below 45)",
    category: "Track & Sprints",
    day: "28 Feb 2025",
    photographer: "S. K. Raman",
    taggedAthletes: ["Amit Sharma", "Rohan Mehta"],
    createdAt: "2025-02-28T09:20:00Z",
  },
  {
    id: "photo-track-2",
    title: "Starting Gun Ready — Men's 200m Heats",
    caption: "Lanes 2 through 6 in 'Set' position ahead of the starter pistol.",
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    eventNo: 3,
    eventName: "200 Mtrs Men (Below 45)",
    category: "Track & Sprints",
    day: "28 Feb 2025",
    photographer: "P. Deshmukh",
    taggedAthletes: ["Vikram Singh", "Deepak Joshi"],
    createdAt: "2025-02-28T14:10:00Z",
  },
  {
    id: "photo-track-3",
    title: "4x100m Relay Dramatic Baton Exchange",
    caption: "Clean third-leg baton handoff between Mumbai Refinery sprinters.",
    url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
    eventNo: 15,
    eventName: "4x100 Mtrs Relay Men",
    category: "Track & Sprints",
    day: "1 Mar 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: ["Amit Sharma", "Rajesh Kumar", "Sanjay Rao"],
    createdAt: "2025-03-01T16:30:00Z",
  },
  {
    id: "photo-field-1",
    title: "Men's Long Jump Mid-Air Extension",
    caption: "Athlete flying past the 6.20m board mark into the sand pit.",
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    eventNo: 8,
    eventName: "Long Jump Men (Below 45)",
    category: "Field Events",
    day: "28 Feb 2025",
    photographer: "A. Sengupta",
    taggedAthletes: ["Ramesh Kulkarni"],
    createdAt: "2025-02-28T15:40:00Z",
  },
  {
    id: "photo-field-2",
    title: "Shot Put Maximum Effort Release",
    caption: "7.26kg iron sphere release in Men's Shot Put finals.",
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    eventNo: 9,
    eventName: "Shot Put Men (Below 45)",
    category: "Field Events",
    day: "28 Feb 2025",
    photographer: "S. K. Raman",
    taggedAthletes: ["Balwinder Singh"],
    createdAt: "2025-02-28T16:15:00Z",
  },
  {
    id: "photo-field-3",
    title: "High Jump Bar Clearance at 1.80m",
    caption: "Fosbury flop clearance in the Men's Veteran High Jump.",
    url: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80",
    eventNo: 11,
    eventName: "High Jump Men (Below 45)",
    category: "Field Events",
    day: "1 Mar 2025",
    photographer: "P. Deshmukh",
    taggedAthletes: ["Manoj Tiwari"],
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "photo-ceremony-1",
    title: "Championship Inaugural Torch & March Past",
    caption: "March past salute of the 10 participating corporate unit delegations.",
    url: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
    category: "Ceremonies",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    createdAt: "2025-02-28T08:00:00Z",
  },
];

const LOCAL_STORAGE_KEY = "hpcl_event_photos_v1";

/**
 * Get all event photos (merges initial photos with local user-uploaded photos)
 */
export async function getEventPhotos(): Promise<EventPhoto[]> {
  if (typeof window === "undefined") {
    return INITIAL_EVENT_PHOTOS;
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_EVENT_PHOTOS;
    const userPhotos: EventPhoto[] = JSON.parse(raw);
    
    // Merge: user photos take precedence or prepend
    const userIds = new Set(userPhotos.map((p) => p.id));
    const merged = [
      ...userPhotos,
      ...INITIAL_EVENT_PHOTOS.filter((p) => !userIds.has(p.id)),
    ];
    return merged;
  } catch (err) {
    console.error("Error reading photos from localStorage:", err);
    return INITIAL_EVENT_PHOTOS;
  }
}

/**
 * Get podium photo for a specific event
 */
export async function getPodiumPhotoForEvent(eventNo: number): Promise<EventPhoto | null> {
  const allPhotos = await getEventPhotos();
  const found = allPhotos.find(
    (p) => p.eventNo === eventNo && p.isPodiumPhoto
  );
  return found || null;
}

/**
 * Save or update a Top 3 podium photo for an event
 */
export async function savePodiumPhotoForEvent(
  eventNo: number,
  eventName: string,
  photoUrl: string,
  caption?: string,
  taggedAthletes?: string[]
): Promise<EventPhoto> {
  const newPhoto: EventPhoto = {
    id: `podium-event-${eventNo}-${Date.now()}`,
    title: `Top 3 Victory Podium — Event #${eventNo}`,
    caption: caption || `Official Top 3 Podium Ceremony for ${eventName}`,
    url: photoUrl,
    eventNo,
    eventName,
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Meet Track Marshal / Admin",
    taggedAthletes: taggedAthletes || [],
    createdAt: new Date().toISOString(),
    isPodiumPhoto: true,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = await getEventPhotos();
      // Filter out previous podium photo for this event if exists
      const filtered = existing.filter(
        (p) => !(p.eventNo === eventNo && p.isPodiumPhoto)
      );
      const updated = [newPhoto, ...filtered];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving podium photo to localStorage:", err);
    }
  }

  return newPhoto;
}

/**
 * Add a new photo to the event media gallery
 */
export async function addEventPhoto(
  photo: Omit<EventPhoto, "id" | "createdAt">
): Promise<EventPhoto> {
  const newPhoto: EventPhoto = {
    ...photo,
    id: `photo-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = await getEventPhotos();
      const updated = [newPhoto, ...existing];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error adding photo to localStorage:", err);
    }
  }

  return newPhoto;
}

/**
 * Delete a photo from gallery
 */
export async function deleteEventPhoto(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const existing = await getEventPhotos();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error("Error deleting photo:", err);
    return false;
  }
}
