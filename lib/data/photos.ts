import { EventPhoto, PhotoCategory, DayOption } from "./types";

export const MOCK_PODIUM_PHOTOS_BY_EVENT: Record<number, Omit<EventPhoto, "id" | "createdAt">> = {
  1: {
    title: "100m Men (Below 45) Victory Ceremony",
    caption: "Top 3 Podium: 🥇 Amit Sharma (MR), 🥈 Rajesh Kumar (SCZ), 🥉 Sunil Verma (VR)",
    url: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80",
    eventNo: 1,
    eventName: "100 Mtrs Men (Below 45)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: ["Amit Sharma", "Rajesh Kumar", "Sunil Verma"],
    isPodiumPhoto: true,
  },
  2: {
    title: "200m Men (Below 45) Victory Ceremony",
    caption: "Top 3 Podium: 🥇 Mannem Sivanageswara (MR), 🥈 Abhinav Singh (MR), 🥉 Pushparaj (SCZ)",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    eventNo: 2,
    eventName: "200 Mtrs Men (Below 45)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: ["Mannem Sivanageswara", "Abhinav Singh", "Pushparaj"],
    isPodiumPhoto: true,
  },
  8: {
    title: "400m Men (45–55) Veteran Victory Ceremony",
    caption: "Top 3 Podium: 🥇 Narayana Moolya (SCZ), 🥈 Rajesh K Shetty (SCZ), 🥉 Das Biswanath (EZ)",
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    eventNo: 8,
    eventName: "400 Mtrs Men (45 to below 55)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "S. K. Raman",
    taggedAthletes: ["Narayana Moolya", "Rajesh K Shetty", "Das Biswanath"],
    isPodiumPhoto: true,
  },
  18: {
    title: "Men's Javelin Throw Official Victory Podium",
    caption: "Top 3 Podium: 🥇 Khuntia P.A. Asitkanta (PH), 🥈 Potluri Durga Prasad (VR), 🥉 Ramath Mallikarjuna Naik (NWZ)",
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    eventNo: 18,
    eventName: "Javelin Men (Below 45)",
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "A. Sengupta",
    taggedAthletes: ["Khuntia P.A. Asitkanta", "Potluri Durga Prasad", "Ramath Mallikarjuna Naik"],
    isPodiumPhoto: true,
  },
  48: {
    title: "Women's Javelin Throw Victory Podium",
    caption: "Top 3 Podium: 🥇 J Jnapika (VR) and podium finalists celebrating medals",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    eventNo: 48,
    eventName: "Javelin Women (Below 40)",
    category: "Podium & Top 3",
    day: "1 Mar 2025",
    photographer: "P. Deshmukh",
    taggedAthletes: ["J Jnapika"],
    isPodiumPhoto: true,
  },
};

export const INITIAL_EVENT_PHOTOS: EventPhoto[] = [
  {
    id: "photo-podium-2",
    ...MOCK_PODIUM_PHOTOS_BY_EVENT[2],
    createdAt: "2025-02-28T11:30:00Z",
  },
  {
    id: "photo-podium-8",
    ...MOCK_PODIUM_PHOTOS_BY_EVENT[8],
    createdAt: "2025-02-28T16:00:00Z",
  },
  {
    id: "photo-podium-18",
    ...MOCK_PODIUM_PHOTOS_BY_EVENT[18],
    createdAt: "2025-02-28T17:15:00Z",
  },
  {
    id: "photo-podium-48",
    ...MOCK_PODIUM_PHOTOS_BY_EVENT[48],
    createdAt: "2025-03-01T11:45:00Z",
  },
  {
    id: "photo-podium-1",
    ...MOCK_PODIUM_PHOTOS_BY_EVENT[1],
    createdAt: "2025-02-28T10:45:00Z",
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
 * Get podium photo for a specific event (with guaranteed mock fallback)
 */
export async function getPodiumPhotoForEvent(
  eventNo: number,
  fallbackEventName?: string,
  pos1Name?: string,
  pos2Name?: string,
  pos3Name?: string
): Promise<EventPhoto> {
  const allPhotos = await getEventPhotos();
  const found = allPhotos.find(
    (p) => p.eventNo === eventNo && p.isPodiumPhoto
  );
  if (found) return found;

  // Check preset mock data by event number
  if (MOCK_PODIUM_PHOTOS_BY_EVENT[eventNo]) {
    return {
      id: `photo-podium-${eventNo}`,
      ...MOCK_PODIUM_PHOTOS_BY_EVENT[eventNo],
      createdAt: new Date().toISOString(),
    };
  }

  // Fallback mock image
  const defaultImages = [
    "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
  ];
  const chosenUrl = defaultImages[eventNo % defaultImages.length];

  const captionWinners = [
    pos1Name ? `🥇 1st: ${pos1Name}` : "",
    pos2Name ? `🥈 2nd: ${pos2Name}` : "",
    pos3Name ? `🥉 3rd: ${pos3Name}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    id: `photo-podium-auto-${eventNo}`,
    title: `Top 3 Victory Ceremony — Event #${eventNo}`,
    caption: captionWinners || `Official Victory Podium for ${fallbackEventName || `Event ${eventNo}`}`,
    url: chosenUrl,
    eventNo,
    eventName: fallbackEventName || `Event ${eventNo}`,
    category: "Podium & Top 3",
    day: "28 Feb 2025",
    photographer: "Official HP Media Cell",
    taggedAthletes: [pos1Name, pos2Name, pos3Name].filter(Boolean) as string[],
    createdAt: new Date().toISOString(),
    isPodiumPhoto: true,
  };
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
