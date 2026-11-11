import React from "react";
import { getEventPhotos } from "@/lib/data/photos";
import { getEvents } from "@/lib/data/events";
import { GalleryView } from "@/components/gallery-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Event Photo Gallery | HP Sports Meet CRM",
  description: "Official photography archive and victory ceremonies for HPCL 19th All India Annual Sports Meet 2024-25",
};

export default async function GalleryPage() {
  const [photos, events] = await Promise.all([
    getEventPhotos(),
    getEvents(),
  ]);

  return <GalleryView initialPhotos={photos} events={events} />;
}
